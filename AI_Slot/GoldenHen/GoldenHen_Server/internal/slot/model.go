package slot

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
)

const MaxAmount int64 = 9007199254740991
const Schema = "gh-client-v1"

type Command struct {
	Schema          string          `json:"schema"`
	GameID          string          `json:"game_id"`
	PlayerID        string          `json:"player_id"`
	RequestID       string          `json:"request_id"`
	Action          string          `json:"action"`
	ExpectedVersion *int64          `json:"expected_version"`
	Payload         json.RawMessage `json:"payload"`
}
type Bet struct {
	LineBet  int64 `json:"lineBet"`
	TotalBet int64 `json:"totalBet"`
}
type Layout struct {
	Reels        int `json:"reels"`
	Rows         int `json:"rows"`
	BufferTop    int `json:"bufferTop"`
	BufferBottom int `json:"bufferBottom"`
}
type Win struct {
	SymbolID  int      `json:"symbolId"`
	Amount    int64    `json:"amount"`
	Positions [][]bool `json:"positions"`
}
type Special struct {
	ID        int            `json:"id"`
	Stage     string         `json:"stage"`
	Remaining *int           `json:"remaining"`
	Total     *int           `json:"total"`
	Picks     []int          `json:"picks"`
	Data      map[string]any `json:"data"`
}
type Snapshot struct {
	Version         int64    `json:"version"`
	RoundID         *string  `json:"roundId"`
	Balance         int64    `json:"balance"`
	Layout          Layout   `json:"layout"`
	Bets            []Bet    `json:"bets"`
	SelectedLineBet int64    `json:"selectedLineBet"`
	Board           [][]int  `json:"board"`
	FakeStrips      [][]int  `json:"fakeStrips"`
	Wins            []Win    `json:"wins"`
	LastWin         int64    `json:"lastWin"`
	TotalWin        int64    `json:"totalWin"`
	WinType         int      `json:"winType"`
	Special         *Special `json:"special"`
}
type Envelope struct {
	Schema    string `json:"schema"`
	RequestID string `json:"request_id"`
	CmdData   struct {
		Data Snapshot `json:"data"`
	} `json:"cmd_data"`
}

// Private state is journaled, never serialized into the public snapshot.
type State struct {
	Snapshot    Snapshot `json:"snapshot"`
	Mode        string   `json:"mode"`
	FGRemaining int      `json:"fgRemaining"`
	FGTotal     int      `json:"fgTotal"`
	FGInit      bool     `json:"fgInit"`
	JPInit      bool     `json:"jpInit"`
	JPEggs      []int    `json:"jpEggs"`
	Revealed    []int    `json:"revealed"`
	ReturnFG    bool     `json:"returnFG"`
	GoldState   int      `json:"goldState"`
	MathVersion string   `json:"mathVersion"`
}
type APIError struct {
	Status  int
	Code    string
	Message string
}

func (e *APIError) Error() string                   { return e.Message }
func reject(status int, code, message string) error { return &APIError{status, code, message} }
func strictJSON(b []byte, value any) error {
	if err := uniqueKeys(json.NewDecoder(bytes.NewReader(b)), 0); err != nil {
		return err
	}
	d := json.NewDecoder(bytes.NewReader(b))
	d.DisallowUnknownFields()
	if err := d.Decode(value); err != nil {
		return err
	}
	if err := d.Decode(new(any)); !errors.Is(err, io.EOF) {
		return fmt.Errorf("expected exactly one JSON object")
	}
	return nil
}

func uniqueKeys(d *json.Decoder, depth int) error {
	if depth > 32 {
		return fmt.Errorf("JSON nesting too deep")
	}
	token, e := d.Token()
	if e != nil {
		return e
	}
	delimiter, ok := token.(json.Delim)
	if !ok {
		return nil
	}
	switch delimiter {
	case '{':
		seen := map[string]bool{}
		for d.More() {
			t, e := d.Token()
			if e != nil {
				return e
			}
			key, ok := t.(string)
			if !ok || seen[key] {
				return fmt.Errorf("duplicate or invalid JSON key")
			}
			seen[key] = true
			if e = uniqueKeys(d, depth+1); e != nil {
				return e
			}
		}
	case '[':
		for d.More() {
			if e := uniqueKeys(d, depth+1); e != nil {
				return e
			}
		}
	default:
		return fmt.Errorf("unexpected JSON delimiter")
	}
	_, e = d.Token()
	return e
}
func checkedAdd(a, b int64) (int64, error) {
	if a < 0 || b < 0 || a > MaxAmount-b {
		return 0, reject(422, "AMOUNT_LIMIT", "Amount exceeds safe integer limit")
	}
	return a + b, nil
}
func checkedMul(a, b int64) (int64, error) {
	if a < 0 || b < 0 || b > 0 && a > MaxAmount/b {
		return 0, reject(422, "AMOUNT_LIMIT", "Amount exceeds safe integer limit")
	}
	return a * b, nil
}
func cloneState(s State) State {
	b, _ := json.Marshal(s)
	var copy State
	_ = json.Unmarshal(b, &copy)
	return copy
}
