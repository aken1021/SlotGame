package slot

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"net"
	"net/http"
	"net/url"
	"strings"
)

// Local development only: loopback clients and loopback browser origins.
func (v *Service) Handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		host, _, e := net.SplitHostPort(r.RemoteAddr)
		if e != nil || !net.ParseIP(host).IsLoopback() {
			writeError(w, reject(403, "LOCAL_ONLY", "Loopback clients only"))
			return
		}
		requestHost := r.Host
		if h, _, e := net.SplitHostPort(requestHost); e == nil {
			requestHost = h
		}
		if !loopbackName(requestHost) {
			writeError(w, reject(403, "INVALID_HOST", "Use localhost or loopback IP"))
			return
		}
		if origin := r.Header.Get("Origin"); origin != "" {
			u, e := url.Parse(origin)
			if e != nil || u.User != nil || u.RawQuery != "" || u.Fragment != "" || u.Path != "" || (u.Scheme != "http" && u.Scheme != "https") || !loopbackName(u.Hostname()) {
				writeError(w, reject(403, "ORIGIN_DENIED", "Only local preview origins allowed"))
				return
			}
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		if r.URL.Path == "/healthz" && r.Method == http.MethodGet {
			mode := "unconfigured"
			if v.Config.Math != nil {
				mode = v.Config.Math.Mode
			}
			_ = json.NewEncoder(w).Encode(map[string]any{"ok": true, "schema": Schema, "gameId": v.Config.GameID, "mathMode": mode})
			return
		}
		if r.URL.Path != "/api/v1/game/command" {
			writeError(w, reject(404, "NOT_FOUND", "Unknown route"))
			return
		}
		if r.Method != http.MethodPost {
			w.Header().Set("Allow", "POST, OPTIONS")
			writeError(w, reject(405, "METHOD_NOT_ALLOWED", "Use POST"))
			return
		}
		if !strings.EqualFold(strings.TrimSpace(strings.Split(r.Header.Get("Content-Type"), ";")[0]), "application/json") {
			writeError(w, reject(415, "CONTENT_TYPE", "Expected application/json"))
			return
		}
		body, e := io.ReadAll(http.MaxBytesReader(w, r.Body, 64*1024))
		if e != nil {
			writeError(w, reject(413, "BODY_TOO_LARGE", "Request body exceeds limit"))
			return
		}
		var cmd Command
		if e = strictJSON(body, &cmd); e != nil {
			writeError(w, reject(400, "INVALID_JSON", e.Error()))
			return
		}
		result, e := v.Execute(cmd)
		if e != nil {
			writeError(w, e)
			return
		}
		_, _ = w.Write(result)
	})
}
func loopbackName(host string) bool {
	if strings.EqualFold(host, "localhost") {
		return true
	}
	ip := net.ParseIP(host)
	return ip != nil && ip.IsLoopback()
}
func writeError(w http.ResponseWriter, err error) {
	var api *APIError
	if !errors.As(err, &api) {
		log.Printf("request failed: %v", err)
		api = &APIError{500, "INTERNAL_ERROR", "Server could not confirm the outcome; replay the same request ID"}
	}
	w.WriteHeader(api.Status)
	_ = json.NewEncoder(w).Encode(map[string]any{"schema": Schema, "error": map[string]string{"code": api.Code, "message": api.Message}})
}
