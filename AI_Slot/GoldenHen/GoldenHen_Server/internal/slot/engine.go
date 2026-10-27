package slot

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"math/big"
	"sort"
	"strconv"
)

type RNG interface{ Intn(int) (int, error) }
type CryptoRNG struct{}

func (CryptoRNG) Intn(n int) (int, error) {
	if n <= 0 {
		return 0, fmt.Errorf("invalid RNG bound")
	}
	v, e := rand.Int(rand.Reader, big.NewInt(int64(n)))
	if e != nil {
		return 0, e
	}
	return int(v.Int64()), nil
}
func draw(r RNG, n int) (int, error) {
	v, e := r.Intn(n)
	if e != nil {
		return 0, e
	}
	if v < 0 || v >= n {
		return 0, fmt.Errorf("RNG returned out of bounds")
	}
	return v, nil
}

func (c Config) NewState() State {
	preview := [][]int{{15, 15, 14, 17, 16}, {16, 16, 1, 18, 14}, {14, 14, 15, 16, 17}, {17, 17, 18, 14, 15}, {1, 1, 16, 15, 18}}
	fake := [][]int{{15, 16, 17, 18, 14, 19, 20, 21, 22, 23, 24, 1}, {15, 16, 17, 18, 14, 19, 20, 21, 22, 23, 24, 1}, {15, 16, 17, 18, 14, 19, 20, 21, 22, 23, 24, 1}, {15, 16, 17, 18, 14, 19, 20, 21, 22, 23, 24, 1}, {15, 16, 17, 18, 14, 19, 20, 21, 22, 23, 24, 1}}
	selected := c.Bets[len(c.Bets)-1].LineBet
	version := "unconfigured"
	if c.Math != nil {
		version = c.Math.Version
	}
	return State{Mode: "main", MathVersion: version, GoldState: 1, Snapshot: Snapshot{Balance: c.InitialBalance, Layout: Layout{5, 3, 1, 1}, Bets: c.Bets, SelectedLineBet: selected, Board: preview, FakeStrips: fake, Wins: []Win{}}}
}
func sample(strips [][]int, gold int, r RNG) ([][]int, error) {
	board := make([][]int, 5)
	for i, strip := range strips {
		stop, e := draw(r, len(strip))
		if e != nil {
			return nil, e
		}
		board[i] = make([]int, 5)
		for j := range 5 {
			id := strip[(stop+j)%len(strip)]
			if id >= 15 && id <= 18 && gold >= 20-id {
				id -= 5
			}
			board[i][j] = id
		}
	}
	return board, nil
}

// Each actual symbol receives its longest left-to-right ways result. Wild is
// shared by paying symbols, never substitutes Scatter and has no standalone pay.
func evaluate(board [][]int, bet int64, m *MathConfig) ([]Win, int64, error) {
	ids := []int{}
	for id := range m.Paytable {
		n, _ := strconv.Atoi(id)
		ids = append(ids, n)
	}
	sort.Ints(ids)
	wins := []Win{}
	var total int64
	for _, id := range ids {
		positions := make([][]bool, 5)
		ways := int64(1)
		length := 0
		actual := false
		for reel := range 5 {
			positions[reel] = make([]bool, 3)
		}
		for reel := range 5 {
			count := 0
			localActual := false
			for row := range 3 {
				n := board[reel][row+1]
				if n == id || n == 1 {
					positions[reel][row] = true
					count++
					localActual = localActual || n == id
				}
			}
			if count == 0 {
				break
			}
			ways *= int64(count)
			length++
			actual = actual || localActual
		}
		if length < 3 || !actual {
			continue
		}
		odds := m.Paytable[strconv.Itoa(id)][length-1]
		if odds == 0 {
			continue
		}
		value, e := checkedMul(odds, bet)
		if e != nil {
			return nil, 0, e
		}
		value, e = checkedMul(value, ways)
		if e != nil {
			return nil, 0, e
		}
		total, e = checkedAdd(total, value)
		if e != nil {
			return nil, 0, e
		}
		for reel := length; reel < 5; reel++ {
			positions[reel] = make([]bool, 3)
		}
		wins = append(wins, Win{id, value, positions})
	}
	return wins, total, nil
}
func scatters(board [][]int) int {
	n := 0
	for _, col := range board {
		found := false
		for _, id := range col[1:4] {
			found = found || id == 2
		}
		if !found {
			break
		}
		n++
	}
	return n
}
func hasWild(board [][]int) bool {
	for _, col := range board {
		for _, id := range col[1:4] {
			if id == 1 {
				return true
			}
		}
	}
	return false
}
func intPointer(n int) *int { return &n }
func (s *State) expose() {
	s.Snapshot.Special = nil
	if s.Mode == "fg" {
		stage := "process"
		if !s.FGInit {
			stage = "init"
		}
		s.Snapshot.Special = &Special{0, stage, intPointer(s.FGRemaining), intPointer(s.FGTotal), nil, map[string]any{"mathVersion": s.MathVersion}}
	}
	if s.Mode == "jp" {
		stage := "process"
		if !s.JPInit {
			stage = "init"
		}
		picks := append([]int{}, s.Revealed...)
		s.Snapshot.Special = &Special{1, stage, nil, nil, picks, map[string]any{"goldState": s.GoldState, "mathVersion": s.MathVersion}}
	}
}
func (s *State) pay(amount int64) error {
	balance, e := checkedAdd(s.Snapshot.Balance, amount)
	if e != nil {
		return e
	}
	total, e := checkedAdd(s.Snapshot.TotalWin, amount)
	if e != nil {
		return e
	}
	s.Snapshot.Balance = balance
	s.Snapshot.LastWin = amount
	s.Snapshot.TotalWin = total
	return nil
}
func (s *State) startJP(r RNG) error {
	s.Mode = "jp"
	s.JPInit = false
	s.JPEggs = make([]int, 18)
	s.Revealed = make([]int, 18)
	// Contents are private and fixed at entry; unrevealed values never reach clients.
	for i := range 18 {
		v, e := draw(r, s.GoldState-1)
		if e != nil {
			return e
		}
		s.JPEggs[i] = 3 - v
		s.Revealed[i] = -1
	}
	return nil
}
func (s *State) afterJP() {
	s.JPInit = false
	s.JPEggs = nil
	s.Revealed = nil
	if s.ReturnFG {
		s.Mode = "fg"
	} else {
		s.Mode = "main"
	}
	s.ReturnFG = false
}
func (c Config) Apply(s *State, cmd Command, r RNG) (int64, error) {
	if cmd.Action == "START_GAME" {
		var p map[string]any
		if err := strictJSON(cmd.Payload, &p); err != nil || p == nil || len(p) != 0 {
			return 0, reject(400, "BAD_PAYLOAD", "START_GAME requires an empty object")
		}
		s.expose()
		if s.Snapshot.Special != nil && s.Snapshot.Special.Stage != "init" {
			s.Snapshot.Special.Stage = "recovery"
		}
		return 0, nil
	}
	if cmd.Action != "SPIN" && cmd.Action != "NEXT_FEVER" {
		return 0, reject(400, "UNKNOWN_ACTION", "Unsupported action")
	}
	if *cmd.ExpectedVersion != s.Snapshot.Version {
		return 0, reject(409, "STALE_VERSION", "Reconnect to refresh state")
	}
	if c.Math == nil {
		return 0, reject(422, "MATH_NOT_CONFIGURED", "Approved math configuration or explicit development math is required")
	}
	m := c.Math
	if s.Snapshot.Version >= MaxAmount {
		return 0, reject(422, "VERSION_LIMIT", "State version limit reached")
	}
	// Reserve sufficient safe-integer capacity before sampling; a large result
	// must never become a reason to discard and redraw an otherwise valid spin.
	line := s.Snapshot.SelectedLineBet
	if cmd.Action == "SPIN" {
		var p struct {
			LineBet int64 `json:"line_bet"`
		}
		if e := strictJSON(cmd.Payload, &p); e != nil {
			return 0, reject(400, "BAD_PAYLOAD", e.Error())
		}
		line = p.LineBet
	}
	if c.totalBet(line) > 0 {
		var maximum int64
		for _, odds := range m.Paytable {
			var peak int64
			for _, p := range odds {
				peak = max(peak, p)
			}
			n, e := checkedMul(peak, line)
			if e != nil {
				return 0, e
			}
			n, e = checkedMul(n, 243)
			if e != nil {
				return 0, e
			}
			maximum, e = checkedAdd(maximum, n)
			if e != nil {
				return 0, e
			}
		}
		for _, p := range m.JPMultipliers {
			n, e := checkedMul(p, c.totalBet(line))
			if e != nil {
				return 0, e
			}
			maximum = max(maximum, n)
		}
		if _, e := checkedAdd(s.Snapshot.Balance, maximum); e != nil {
			return 0, e
		}
		if _, e := checkedAdd(s.Snapshot.TotalWin, maximum); e != nil {
			return 0, e
		}
	}
	s.Snapshot.LastWin = 0
	s.Snapshot.Wins = []Win{}
	debit := int64(0)
	if cmd.Action == "SPIN" {
		if s.Mode != "main" {
			return 0, reject(409, "SPECIAL_ACTIVE", "Complete the current special game first")
		}
		var p struct {
			LineBet int64 `json:"line_bet"`
		}
		if e := strictJSON(cmd.Payload, &p); e != nil {
			return 0, reject(400, "BAD_PAYLOAD", e.Error())
		}
		found := false
		for _, b := range c.Bets {
			if b.LineBet == p.LineBet {
				debit = b.TotalBet
				found = true
				break
			}
		}
		if !found {
			return 0, reject(422, "INVALID_BET", "Bet is not offered")
		}
		if s.Snapshot.Balance < debit {
			return 0, reject(422, "INSUFFICIENT_FUNDS", "Insufficient local wallet balance")
		}
		s.Snapshot.Balance -= debit
		s.Snapshot.SelectedLineBet = p.LineBet
		s.Snapshot.TotalWin = 0
		s.GoldState = 1
		for _, n := range m.GoldThresholds {
			if p.LineBet >= n {
				s.GoldState++
			}
		}
		id, err := randomID()
		if err != nil {
			return 0, err
		}
		s.Snapshot.RoundID = &id
		if err := c.spin(s, false, r); err != nil {
			return 0, err
		}
	} else {
		var p struct {
			SGID *int            `json:"sg_id"`
			Data json.RawMessage `json:"data"`
		}
		if e := strictJSON(cmd.Payload, &p); e != nil || p.SGID == nil || len(p.Data) == 0 {
			return 0, reject(400, "BAD_PAYLOAD", "Expected sg_id and data")
		}
		expected := -1
		if s.Mode == "fg" {
			expected = 0
		}
		if s.Mode == "jp" {
			expected = 1
		}
		if expected != *p.SGID {
			return 0, reject(409, "WRONG_SPECIAL", "No matching special game")
		}
		if s.Mode == "fg" {
			if string(p.Data) != "null" {
				return 0, reject(422, "INVALID_ACTION", "FG requires null data")
			}
			if !s.FGInit {
				s.FGInit = true
			} else {
				s.FGRemaining--
				if e := c.spin(s, true, r); e != nil {
					return 0, e
				}
			}
		} else {
			if !s.JPInit {
				if string(p.Data) != "null" {
					return 0, reject(422, "INVALID_ACTION", "Initialize jackpot with null data")
				}
				s.JPInit = true
				if s.GoldState == 2 {
					totalBet := c.totalBet(s.Snapshot.SelectedLineBet)
					value, e := checkedMul(totalBet, m.JPMultipliers[3])
					if e != nil {
						return 0, e
					}
					if e = s.pay(value); e != nil {
						return 0, e
					}
					s.afterJP()
				}
			} else {
				var selection struct {
					Index *int `json:"1"`
				}
				if e := strictJSON(p.Data, &selection); e != nil || selection.Index == nil || *selection.Index < 0 || *selection.Index >= 18 {
					return 0, reject(422, "INVALID_PICK", "Choose an egg index 0..17")
				}
				i := *selection.Index
				if s.Revealed[i] != -1 {
					return 0, reject(422, "ALREADY_PICKED", "Egg already revealed")
				}
				tier := s.JPEggs[i]
				s.Revealed[i] = tier
				count := 0
				for _, t := range s.Revealed {
					if t == tier {
						count++
					}
				}
				if count == 3 {
					value, e := checkedMul(c.totalBet(s.Snapshot.SelectedLineBet), m.JPMultipliers[tier])
					if e != nil {
						return 0, e
					}
					if e = s.pay(value); e != nil {
						return 0, e
					}
					s.afterJP()
				}
			}
		}
	}
	if s.Snapshot.Version >= MaxAmount {
		return 0, reject(422, "VERSION_LIMIT", "State version limit reached")
	}
	s.Snapshot.Version++
	s.Snapshot.WinType = winType(s.Snapshot.LastWin, c.totalBet(s.Snapshot.SelectedLineBet))
	s.expose()
	return debit, nil
}
func (c Config) totalBet(line int64) int64 {
	for _, b := range c.Bets {
		if b.LineBet == line {
			return b.TotalBet
		}
	}
	return 0
}
func winType(win, bet int64) int {
	if win == 0 {
		return 0
	}
	n := 1
	for i, t := range []int64{1, 5, 10, 25, 50, 100} {
		if win/bet >= t {
			n = i + 2
		}
	}
	return n
}
func (c Config) spin(s *State, fg bool, r RNG) error {
	m := c.Math
	strips := m.MainStrips
	if fg {
		strips = m.FGStrips
	}
	board, e := sample(strips, s.GoldState, r)
	if e != nil {
		return e
	}
	wins, value, e := evaluate(board, s.Snapshot.SelectedLineBet, m)
	if e != nil {
		return e
	}
	s.Snapshot.Board = board
	s.Snapshot.Wins = wins
	if e = s.pay(value); e != nil {
		return e
	}
	if scatters(board) >= 3 {
		if fg {
			add := min(m.RetriggerFG, m.MaxFG-s.FGTotal)
			s.FGTotal += add
			s.FGRemaining += add
		} else {
			s.FGRemaining = m.InitialFG
			s.FGTotal = m.InitialFG
			s.FGInit = false
		}
	}
	if fg && s.FGRemaining == 0 {
		s.Mode = "main"
	}
	if !fg && s.FGRemaining > 0 {
		s.Mode = "fg"
	}
	if s.GoldState > 1 && hasWild(board) && m.JPPerMillion > 0 {
		v, e := draw(r, 1000000)
		if e != nil {
			return e
		}
		if v < m.JPPerMillion {
			s.ReturnFG = s.Mode == "fg"
			if e = s.startJP(r); e != nil {
				return e
			}
		}
	}
	return nil
}
func randomID() (string, error) {
	b := make([]byte, 16)
	if _, e := rand.Read(b); e != nil {
		return "", e
	}
	return fmt.Sprintf("%x", b), nil
}
