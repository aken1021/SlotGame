package main

import (
	"context"
	"flag"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"goldenhen/internal/slot"
)

func main() {
	if e := run(); e != nil {
		log.Fatal(e)
	}
}
func run() error {
	address := flag.String("addr", "127.0.0.1:8080", "loopback listen address")
	config := flag.String("config", "config/local.json", "game configuration")
	data := flag.String("data", "data/goldenhen.journal", "persistent local transaction journal")
	allowDevelopment := flag.Bool("allow-development-math", false, "explicitly enable non-production math")
	flag.Parse()
	host, _, e := net.SplitHostPort(*address)
	if e != nil {
		return e
	}
	ip := net.ParseIP(host)
	if ip == nil || !ip.IsLoopback() {
		return &net.AddrError{Err: "bind to a literal loopback address", Addr: *address}
	}
	cfg, e := slot.LoadConfig(*config)
	if e != nil {
		return e
	}
	if cfg.Math != nil && cfg.Math.Mode == "development" && !*allowDevelopment {
		return &net.AddrError{Err: "development math requires -allow-development-math", Addr: *config}
	}
	store, e := slot.OpenStore(*data, cfg.Fingerprint())
	if e != nil {
		return e
	}
	defer store.Close()
	service := &slot.Service{Config: cfg, Store: store, RNG: slot.CryptoRNG{}}
	server := &http.Server{Addr: *address, Handler: service.Handler(), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 15 * time.Second, IdleTimeout: 60 * time.Second, MaxHeaderBytes: 16 * 1024}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	done := make(chan struct{})
	go func() {
		select {
		case <-ctx.Done():
			shutdown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			_ = server.Shutdown(shutdown)
		case <-done:
		}
	}()
	defer close(done)
	mode := "unconfigured (SPIN disabled)"
	if cfg.Math != nil {
		mode = cfg.Math.Mode + " / " + cfg.Math.Version
	}
	listener, e := net.Listen("tcp", *address)
	if e != nil {
		return e
	}
	log.Printf("GoldenHen local wallet listening on http://%s; math=%s; data=%s", listener.Addr(), mode, *data)
	e = server.Serve(listener)
	if e == http.ErrServerClosed {
		return nil
	}
	if e != nil && strings.Contains(e.Error(), "Only one usage") {
		log.Print("port already in use; stop the previous server or choose -addr")
	}
	return e
}
