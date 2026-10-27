package slot

import (
	"bufio"
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type record struct {
	Format     int             `json:"format"`
	ConfigHash string          `json:"configHash"`
	Key        string          `json:"key"`
	RequestID  string          `json:"requestId"`
	Digest     string          `json:"digest"`
	Action     string          `json:"action"`
	State      State           `json:"state"`
	Response   json.RawMessage `json:"response"`
	Before     int64           `json:"before"`
	Debit      int64           `json:"debit"`
	Credit     int64           `json:"credit"`
	Created    string          `json:"created"`
}
type savedResponse struct {
	Digest string
	Body   []byte
}

// A single writer holds an OS lock for the lifetime of the store. Every frame
// contains state, accounting and the exact replay response in one synced append.
type Store struct {
	mu        sync.Mutex
	file      *os.File
	lock      *os.File
	hash      string
	states    map[string]State
	responses map[string]savedResponse
	poisoned  bool
}

func OpenStore(path, configHash string) (*Store, error) {
	if e := os.MkdirAll(filepath.Dir(path), 0700); e != nil {
		return nil, e
	}
	lock, e := acquireLock(path + ".lock")
	if e != nil {
		return nil, e
	}
	f, e := os.OpenFile(path, os.O_CREATE|os.O_RDWR, 0600)
	if e != nil {
		lock.Close()
		return nil, e
	}
	s := &Store{file: f, lock: lock, hash: configHash, states: map[string]State{}, responses: map[string]savedResponse{}}
	if e = s.recover(); e != nil {
		s.Close()
		return nil, e
	}
	return s, nil
}
func (s *Store) recover() error {
	reader := bufio.NewReader(s.file)
	var offset int64
	for {
		var header [4]byte
		_, e := io.ReadFull(reader, header[:])
		if errors.Is(e, io.EOF) {
			break
		}
		if errors.Is(e, io.ErrUnexpectedEOF) {
			return s.truncateTail(offset)
		}
		if e != nil {
			return e
		}
		n := binary.BigEndian.Uint32(header[:])
		if n == 0 || n > 8*1024*1024 {
			return fmt.Errorf("invalid journal frame at %d", offset)
		}
		b := make([]byte, int(n)+sha256.Size)
		if _, e = io.ReadFull(reader, b); errors.Is(e, io.EOF) || errors.Is(e, io.ErrUnexpectedEOF) {
			return s.truncateTail(offset)
		} else if e != nil {
			return e
		}
		sum := sha256.Sum256(b[:n])
		if !bytes.Equal(sum[:], b[n:]) {
			return fmt.Errorf("journal checksum mismatch at %d; refusing to discard data", offset)
		}
		var rec record
		if e = json.Unmarshal(b[:n], &rec); e != nil {
			return e
		}
		if rec.Format != 1 || rec.ConfigHash != s.hash {
			return fmt.Errorf("journal config/version mismatch; use its original config and data file")
		}
		if rec.State.Snapshot.Balance < 0 || rec.Before < 0 || rec.Debit < 0 || rec.Credit < 0 || rec.Before-rec.Debit+rec.Credit != rec.State.Snapshot.Balance {
			return fmt.Errorf("invalid ledger at %d", offset)
		}
		s.applyRecord(rec)
		offset += int64(4 + len(b))
	}
	_, e := s.file.Seek(offset, io.SeekStart)
	return e
}
func (s *Store) truncateTail(offset int64) error {
	if e := s.file.Truncate(offset); e != nil {
		return e
	}
	if e := s.file.Sync(); e != nil {
		return e
	}
	_, e := s.file.Seek(offset, io.SeekStart)
	return e
}
func (s *Store) applyRecord(rec record) {
	s.states[rec.Key] = rec.State
	s.responses[rec.Key+"\x00"+rec.RequestID] = savedResponse{rec.Digest, append([]byte{}, rec.Response...)}
}
func (s *Store) commit(rec record) error {
	b, e := json.Marshal(rec)
	if e != nil {
		return e
	}
	if len(b) > 8*1024*1024 {
		return fmt.Errorf("journal record too large")
	}
	frame := make([]byte, 4, len(b)+4+sha256.Size)
	binary.BigEndian.PutUint32(frame, uint32(len(b)))
	frame = append(frame, b...)
	sum := sha256.Sum256(b)
	frame = append(frame, sum[:]...)
	n, e := s.file.Write(frame)
	if e == nil && n != len(frame) {
		e = io.ErrShortWrite
	}
	if e == nil {
		e = s.file.Sync()
	}
	if e != nil {
		s.poisoned = true
		return fmt.Errorf("journal outcome uncertain; restart and replay original request: %w", e)
	}
	s.applyRecord(rec)
	return nil
}
func (s *Store) Close() error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.poisoned = true
	e := s.file.Close()
	le := s.lock.Close()
	if e != nil {
		return e
	}
	return le
}

type Service struct {
	Config Config
	Store  *Store
	RNG    RNG
}

func ValidateCommand(cmd Command, game string) error {
	if cmd.Schema != Schema || cmd.GameID != game || cmd.ExpectedVersion == nil || *cmd.ExpectedVersion < 0 || *cmd.ExpectedVersion > MaxAmount {
		return reject(400, "INVALID_COMMAND", "Invalid schema, game or expected_version")
	}
	for _, id := range []string{cmd.PlayerID, cmd.RequestID} {
		if len(id) < 1 || len(id) > 128 {
			return reject(400, "INVALID_ID", "IDs must contain 1..128 ASCII characters")
		}
		for _, ch := range id {
			if !(ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <= '9' || ch == '-' || ch == '_' || ch == '.') {
				return reject(400, "INVALID_ID", "Invalid ID character")
			}
		}
	}
	payload := bytes.TrimSpace(cmd.Payload)
	if len(payload) == 0 || payload[0] != '{' {
		return reject(400, "INVALID_PAYLOAD", "payload must be an object")
	}
	return nil
}
func digestCommand(cmd Command) (string, error) {
	var payload any
	d := json.NewDecoder(bytes.NewReader(cmd.Payload))
	d.UseNumber()
	if e := d.Decode(&payload); e != nil {
		return "", e
	}
	p, e := json.Marshal(payload)
	if e != nil {
		return "", e
	}
	cmd.Payload = p
	b, e := json.Marshal(cmd)
	if e != nil {
		return "", e
	}
	h := sha256.Sum256(b)
	return hex.EncodeToString(h[:]), nil
}
func (v *Service) Execute(cmd Command) ([]byte, error) {
	if e := ValidateCommand(cmd, v.Config.GameID); e != nil {
		return nil, e
	}
	if cmd.Action == "CHECK_CMD" {
		return v.check(cmd)
	}
	digest, e := digestCommand(cmd)
	if e != nil {
		return nil, reject(400, "BAD_PAYLOAD", e.Error())
	}
	s := v.Store
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.poisoned {
		return nil, fmt.Errorf("store unavailable; restart required")
	}
	key := cmd.GameID + "\x00" + cmd.PlayerID
	requestKey := key + "\x00" + cmd.RequestID
	if cached, ok := s.responses[requestKey]; ok {
		if cached.Digest != digest {
			return nil, reject(409, "REQUEST_ID_REUSED", "Request ID belongs to different content")
		}
		return append([]byte{}, cached.Body...), nil
	}
	state, exists := s.states[key]
	if !exists && cmd.Action != "START_GAME" {
		return nil, reject(409, "NOT_INITIALIZED", "Send START_GAME before a mutation")
	}
	if !exists {
		state = v.Config.NewState()
	}
	state = cloneState(state)
	before := state.Snapshot.Balance
	debit, e := v.Config.Apply(&state, cmd, v.RNG)
	if e != nil {
		return nil, e
	}
	response := Envelope{Schema: Schema, RequestID: cmd.RequestID}
	response.CmdData.Data = state.Snapshot
	b, e := json.Marshal(response)
	if e != nil {
		return nil, e
	}
	credit := int64(0)
	if cmd.Action != "START_GAME" {
		credit = state.Snapshot.LastWin
	}
	if !exists {
		before = 0
		credit = state.Snapshot.Balance
	}
	rec := record{1, s.hash, key, cmd.RequestID, digest, cmd.Action, state, b, before, debit, credit, time.Now().UTC().Format(time.RFC3339Nano)}
	if e = s.commit(rec); e != nil {
		return nil, e
	}
	return b, nil
}
func (v *Service) check(cmd Command) ([]byte, error) {
	var p struct {
		RequestID string `json:"request_id"`
	}
	if e := strictJSON(cmd.Payload, &p); e != nil || p.RequestID == "" {
		return nil, reject(400, "BAD_PAYLOAD", "CHECK_CMD requires payload.request_id")
	}
	s := v.Store
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.poisoned {
		return nil, fmt.Errorf("store unavailable")
	}
	saved, ok := s.responses[cmd.GameID+"\x00"+cmd.PlayerID+"\x00"+p.RequestID]
	if !ok {
		return nil, reject(404, "REQUEST_NOT_FOUND", "No committed request")
	}
	// A query wraps the original response; it never settles or changes a version.
	return json.Marshal(map[string]any{"schema": Schema, "request_id": cmd.RequestID, "original_response": json.RawMessage(saved.Body)})
}
