package slot

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sync"
	"testing"
)

type fixedRNG struct {
	value int
	calls int
	fail  bool
}

func (r *fixedRNG) Intn(n int) (int, error) {
	r.calls++
	if r.fail {
		return 0, fmt.Errorf("entropy unavailable")
	}
	return r.value % n, nil
}
func testConfig(t *testing.T) Config {
	t.Helper()
	c, e := LoadConfig("../../config/development.json")
	if e != nil {
		t.Fatal(e)
	}
	return c
}
func command(action, id string, version int64, payload string) Command {
	return Command{Schema, "GoldenHen", "test-player", id, action, &version, json.RawMessage(payload)}
}
func openTest(t *testing.T, c Config, path string, r RNG) *Service {
	t.Helper()
	s, e := OpenStore(path, c.Fingerprint())
	if e != nil {
		t.Fatal(e)
	}
	return &Service{c, s, r}
}
func decode(t *testing.T, b []byte) Snapshot {
	t.Helper()
	var v Envelope
	if e := json.Unmarshal(b, &v); e != nil {
		t.Fatal(e)
	}
	return v.CmdData.Data
}
func execute(t *testing.T, s *Service, c Command) Snapshot {
	t.Helper()
	b, e := s.Execute(c)
	if e != nil {
		t.Fatal(e)
	}
	return decode(t, b)
}
func code(t *testing.T, e error, want string) {
	t.Helper()
	var api *APIError
	if !errors.As(e, &api) || api.Code != want {
		t.Fatalf("got %v, want %s", e, want)
	}
}

func TestWalletReplayAndRestart(t *testing.T) {
	c := testConfig(t)
	r := &fixedRNG{}
	path := filepath.Join(t.TempDir(), "state.journal")
	s := openTest(t, c, path, r)
	start := execute(t, s, command("START_GAME", "start", 0, `{}`))
	if start.Balance != 100000000 || start.Version != 0 || start.Special != nil {
		t.Fatal(start)
	}
	spin := command("SPIN", "spin", 0, `{"line_bet":100}`)
	b, e := s.Execute(spin)
	if e != nil {
		t.Fatal(e)
	}
	result := decode(t, b)
	if result.Balance != start.Balance-5000+result.LastWin || result.Version != 1 || result.RoundID == nil {
		t.Fatal(result)
	}
	calls := r.calls
	replay, e := s.Execute(spin)
	if e != nil || !bytes.Equal(b, replay) || r.calls != calls {
		t.Fatal("replay changed result or redrew", e)
	}
	if e = s.Store.Close(); e != nil {
		t.Fatal(e)
	}
	s = openTest(t, c, path, r)
	defer s.Store.Close()
	replay, e = s.Execute(spin)
	if e != nil || !bytes.Equal(b, replay) || r.calls != calls {
		t.Fatal("restart replay changed result", e)
	}
	fresh := execute(t, s, command("START_GAME", "fresh", 0, `{}`))
	if fresh.Balance != result.Balance || fresh.Version != 1 {
		t.Fatal(fresh)
	}
	query, e := s.Execute(command("CHECK_CMD", "query", 0, `{"request_id":"spin"}`))
	if e != nil || !bytes.Contains(query, b) {
		t.Fatal("query failed", e)
	}
	_, e = s.Execute(command("SPIN", "spin", 0, `{"line_bet":500}`))
	code(t, e, "REQUEST_ID_REUSED")
	_, e = s.Execute(command("SPIN", "stale", 0, `{"line_bet":100}`))
	code(t, e, "STALE_VERSION")
}
func TestConcurrentSameAndDifferentRequests(t *testing.T) {
	c := testConfig(t)
	s := openTest(t, c, filepath.Join(t.TempDir(), "s"), &fixedRNG{value: 5})
	defer s.Store.Close()
	execute(t, s, command("START_GAME", "start", 0, `{}`))
	var wg sync.WaitGroup
	results := make(chan string, 20)
	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			b, e := s.Execute(command("SPIN", "same", 0, `{"line_bet":100}`))
			if e != nil {
				results <- e.Error()
			} else {
				results <- string(b)
			}
		}()
	}
	wg.Wait()
	close(results)
	first := ""
	for b := range results {
		if first == "" {
			first = b
		}
		if first != b {
			t.Fatal("non-idempotent concurrent response")
		}
	}
	var accepted int
	var mu sync.Mutex
	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			_, e := s.Execute(command("SPIN", fmt.Sprintf("different-%d", i), 1, `{"line_bet":100}`))
			if e == nil {
				mu.Lock()
				accepted++
				mu.Unlock()
			} else {
				code(t, e, "STALE_VERSION")
			}
		}(i)
	}
	wg.Wait()
	if accepted != 1 {
		t.Fatalf("accepted %d", accepted)
	}
}
func TestRejectedRequestsDoNotChangeWallet(t *testing.T) {
	c := testConfig(t)
	c.InitialBalance = 1
	r := &fixedRNG{}
	s := openTest(t, c, filepath.Join(t.TempDir(), "s"), r)
	defer s.Store.Close()
	execute(t, s, command("START_GAME", "start", 0, `{}`))
	_, e := s.Execute(command("SPIN", "poor", 0, `{"line_bet":100}`))
	code(t, e, "INSUFFICIENT_FUNDS")
	if r.calls != 0 {
		t.Fatal("sampled before checking balance")
	}
	_, e = s.Execute(command("SPIN", "bad", 0, `{"line_bet":999}`))
	code(t, e, "INVALID_BET")
	result := execute(t, s, command("START_GAME", "refresh", 0, `{}`))
	if result.Balance != 1 || result.Version != 0 {
		t.Fatal(result)
	}
}
func TestMathUnconfiguredAndRNGFailure(t *testing.T) {
	c := testConfig(t)
	c.Math = nil
	s := openTest(t, c, filepath.Join(t.TempDir(), "s"), &fixedRNG{})
	execute(t, s, command("START_GAME", "start", 0, `{}`))
	_, e := s.Execute(command("SPIN", "spin", 0, `{"line_bet":100}`))
	code(t, e, "MATH_NOT_CONFIGURED")
	s.Store.Close()
	c = testConfig(t)
	r := &fixedRNG{fail: true}
	s = openTest(t, c, filepath.Join(t.TempDir(), "s"), r)
	defer s.Store.Close()
	execute(t, s, command("START_GAME", "start", 0, `{}`))
	_, e = s.Execute(command("SPIN", "spin", 0, `{"line_bet":100}`))
	if e == nil {
		t.Fatal("RNG failure ignored")
	}
	if s.Store.states["GoldenHen\x00test-player"].Snapshot.Version != 0 {
		t.Fatal("failed RNG committed")
	}
}
func TestWaysManualExpected(t *testing.T) {
	c := testConfig(t)
	board := [][]int{{24, 15, 15, 20, 24}, {24, 1, 15, 20, 24}, {24, 15, 20, 21, 24}, {24, 20, 21, 22, 24}, {24, 15, 20, 21, 24}}
	wins, total, e := evaluate(board, 100, &MathConfig{Paytable: map[string][]int64{"15": {0, 0, 3, 8, 20}}})
	if e != nil {
		t.Fatal(e)
	}
	// 2 x 2 x 1 ways, longest chain 3 reels, odds 3, line bet 100.
	if total != 1200 || len(wins) != 1 || wins[0].Positions[3][0] || !wins[0].Positions[1][0] {
		t.Fatal(wins, total)
	}
	for i := range board {
		board[i] = []int{1, 1, 1, 1, 1}
	}
	_, total, e = evaluate(board, 100, c.Math)
	if e != nil || total != 0 {
		t.Fatal("pure Wild paid", e, total)
	}
	board[0] = []int{2, 19, 20, 21, 2}
	if scatters(board) != 0 {
		t.Fatal("buffer triggered FG")
	}
}
func TestGoldAndFGFinalRetrigger(t *testing.T) {
	c := testConfig(t)
	s := c.NewState()
	s.Mode = "fg"
	s.FGInit = true
	s.FGRemaining = 1
	s.FGTotal = 6
	s.GoldState = 5
	s.Snapshot.SelectedLineBet = 1000
	for i := range c.Math.FGStrips {
		c.Math.FGStrips[i] = []int{19, 2, 15, 16, 17}
	}
	c.Math.JPPerMillion = 0
	_, e := c.Apply(&s, command("NEXT_FEVER", "next", 0, `{"sg_id":0,"data":null}`), &fixedRNG{})
	if e != nil {
		t.Fatal(e)
	}
	if s.Mode != "fg" || s.FGRemaining != 2 || s.FGTotal != 8 || s.Snapshot.Special.Stage != "process" || s.Snapshot.Board[0][2] != 10 {
		t.Fatal(s)
	}
	s.FGTotal = c.Math.MaxFG
	s.FGRemaining = 1
	_, e = c.Apply(&s, command("NEXT_FEVER", "end", 1, `{"sg_id":0,"data":null}`), &fixedRNG{})
	if e != nil || s.Mode != "main" || s.Snapshot.Special != nil {
		t.Fatal("last round failed", e, s)
	}
}
func TestJackpotPrivateAndRecovery(t *testing.T) {
	c := testConfig(t)
	c.Math.JPPerMillion = 1000000
	for i := range c.Math.MainStrips {
		c.Math.MainStrips[i] = []int{19, 2, 1, 15, 19}
	}
	path := filepath.Join(t.TempDir(), "s")
	s := openTest(t, c, path, &fixedRNG{})
	execute(t, s, command("START_GAME", "start", 0, `{}`))
	v := execute(t, s, command("SPIN", "spin", 0, `{"line_bet":500}`))
	if v.Special.ID != 1 {
		t.Fatal("JP not first")
	}
	for _, pick := range v.Special.Picks {
		if pick != -1 {
			t.Fatal("secret leaked")
		}
	}
	v = execute(t, s, command("NEXT_FEVER", "init", 1, `{"sg_id":1,"data":null}`))
	v = execute(t, s, command("NEXT_FEVER", "pick0", 2, `{"sg_id":1,"data":{"1":0}}`))
	if v.LastWin != 0 || v.Special.Picks[0] != 3 {
		t.Fatal(v)
	}
	_, e := s.Execute(command("NEXT_FEVER", "duplicate", 3, `{"sg_id":1,"data":{"1":0}}`))
	code(t, e, "ALREADY_PICKED")
	before := v.Balance
	s.Store.Close()
	s = openTest(t, c, path, &fixedRNG{})
	defer s.Store.Close()
	v = execute(t, s, command("START_GAME", "recover", 0, `{}`))
	if v.Special.Picks[0] != 3 || v.Special.Picks[1] != -1 {
		t.Fatal("JP recovery lost")
	}
	execute(t, s, command("NEXT_FEVER", "pick1", 3, `{"sg_id":1,"data":{"1":1}}`))
	v = execute(t, s, command("NEXT_FEVER", "pick2", 4, `{"sg_id":1,"data":{"1":2}}`))
	if v.Balance != before+250000 || v.LastWin != 250000 || v.Special == nil || v.Special.ID != 0 || v.Special.Remaining == nil || *v.Special.Remaining != 6 {
		t.Fatal("JP payout / deferred FG incorrect", v)
	}
	v = execute(t, s, command("NEXT_FEVER", "fginit", 5, `{"sg_id":0,"data":null}`))
	if v.Balance != before+250000 || *v.Special.Remaining != 6 {
		t.Fatal("FG init charged")
	}
}
func TestDirectMiniAndMidFGJackpot(t *testing.T) {
	c := testConfig(t)
	c.Math.JPPerMillion = 1000000
	for i := range c.Math.MainStrips {
		c.Math.MainStrips[i] = []int{19, 19, 1, 15, 19}
	}
	s := c.NewState()
	_, e := c.Apply(&s, command("SPIN", "spin", 0, `{"line_bet":100}`), &fixedRNG{})
	if e != nil || s.Mode != "jp" {
		t.Fatal(e, s)
	}
	before := s.Snapshot.Balance
	_, e = c.Apply(&s, command("NEXT_FEVER", "mini", 1, `{"sg_id":1,"data":null}`), &fixedRNG{})
	if e != nil || s.Mode != "main" || s.Snapshot.Balance != before+50000 {
		t.Fatal("direct mini", e, s)
	}
	s.Mode = "fg"
	s.FGInit = true
	s.FGRemaining = 1
	s.FGTotal = 6
	s.GoldState = 4
	for i := range c.Math.FGStrips {
		c.Math.FGStrips[i] = []int{19, 2, 1, 15, 19}
	}
	_, e = c.Apply(&s, command("NEXT_FEVER", "last", 2, `{"sg_id":0,"data":null}`), &fixedRNG{})
	if e != nil || s.Mode != "jp" || !s.ReturnFG || s.FGRemaining != 2 || s.FGTotal != 8 {
		t.Fatal("final FG retrigger+JP lost", e, s)
	}
}
func TestJournalLockPartialTailCorruptionAndConfig(t *testing.T) {
	c := testConfig(t)
	path := filepath.Join(t.TempDir(), "s")
	s := openTest(t, c, path, &fixedRNG{})
	execute(t, s, command("START_GAME", "start", 0, `{}`))
	if other, e := OpenStore(path, c.Fingerprint()); e == nil {
		other.Close()
		t.Fatal("second process writer allowed")
	}
	s.Store.Close()
	f, e := os.OpenFile(path, os.O_APPEND|os.O_WRONLY, 0600)
	if e != nil {
		t.Fatal(e)
	}
	_, _ = f.Write([]byte{0, 0, 1})
	f.Close()
	s = openTest(t, c, path, &fixedRNG{})
	execute(t, s, command("START_GAME", "recover", 0, `{}`))
	s.Store.Close()
	if other, e := OpenStore(path, "different config"); e == nil {
		other.Close()
		t.Fatal("config mismatch accepted")
	}
	b, e := os.ReadFile(path)
	if e != nil {
		t.Fatal(e)
	}
	b[10] ^= 1
	if e = os.WriteFile(path, b, 0600); e != nil {
		t.Fatal(e)
	}
	if other, e := OpenStore(path, c.Fingerprint()); e == nil {
		other.Close()
		t.Fatal("corruption silently ignored")
	}
}
func TestHTTPAndCommittedResponseLost(t *testing.T) {
	c := testConfig(t)
	s := openTest(t, c, filepath.Join(t.TempDir(), "s"), &fixedRNG{})
	defer s.Store.Close()
	h := s.Handler()
	// Use the real HTTP stack; drop the response after the first committed SPIN.
	lost := false
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/drop" {
			b, _ := io.ReadAll(r.Body)
			var cmd Command
			_ = json.Unmarshal(b, &cmd)
			_, e := s.Execute(cmd)
			if e != nil {
				t.Error(e)
			}
			lost = true
			connection, _, e := w.(http.Hijacker).Hijack()
			if e != nil {
				t.Error(e)
			}
			connection.Close()
			return
		}
		h.ServeHTTP(w, r)
	}))
	defer server.Close()
	post := func(route string, cmd Command) (*http.Response, error) {
		b, _ := json.Marshal(cmd)
		return http.Post(server.URL+route, "application/json", bytes.NewReader(b))
	}
	response, e := post("/api/v1/game/command", command("START_GAME", "start", 0, `{}`))
	if e != nil {
		t.Fatal(e)
	}
	response.Body.Close()
	spin := command("SPIN", "lost", 0, `{"line_bet":100}`)
	_, e = post("/drop", spin)
	if e == nil || !lost {
		t.Fatal("did not drop response")
	}
	response, e = post("/api/v1/game/command", spin)
	if e != nil {
		t.Fatal(e)
	}
	b, _ := io.ReadAll(response.Body)
	response.Body.Close()
	v := decode(t, b)
	if response.StatusCode != 200 || v.Version != 1 || v.Balance != c.InitialBalance-5000+v.LastWin {
		t.Fatal("response lost caused double debit", string(b))
	}
	for _, test := range []struct {
		origin string
		status int
	}{{"http://localhost:7456", 204}, {"https://evil.example", 403}, {"null", 403}} {
		r := httptest.NewRequest("OPTIONS", "http://localhost/api/v1/game/command", nil)
		r.RemoteAddr = "127.0.0.1:1"
		r.Header.Set("Origin", test.origin)
		w := httptest.NewRecorder()
		h.ServeHTTP(w, r)
		if w.Code != test.status {
			t.Fatal(test.origin, w.Code)
		}
	}
}
func TestInvalidJSONAndSafeAmounts(t *testing.T) {
	var c Command
	for _, body := range []string{`{"schema":"a","schema":"b"}`, `{} {}`, `{"unknown":0}`, `{"expected_version":0.5}`, `null`} {
		e := strictJSON([]byte(body), &c)
		if e == nil {
			e = ValidateCommand(c, "GoldenHen")
		}
		if e == nil {
			t.Fatal("accepted", body)
		}
	}
	c2 := testConfig(t)
	c2.Bets[0].LineBet = MaxAmount
	if e := c2.Validate(); e == nil {
		t.Fatal("unsafe paytable accepted")
	}
	if _, e := checkedAdd(MaxAmount, 1); e == nil {
		t.Fatal("overflow")
	}
}
func FuzzCommand(f *testing.F) {
	f.Add([]byte(`{"schema":"gh-client-v1","game_id":"GoldenHen","player_id":"p","request_id":"r","action":"START_GAME","expected_version":0,"payload":{}}`))
	f.Add([]byte(`null`))
	f.Fuzz(func(t *testing.T, b []byte) {
		if len(b) > 65536 {
			return
		}
		var cmd Command
		if strictJSON(b, &cmd) == nil {
			_ = ValidateCommand(cmd, "GoldenHen")
		}
	})
}
