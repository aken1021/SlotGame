package slot

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"strconv"
)

type MathConfig struct {
	Version    string  `json:"version"`
	Mode       string  `json:"mode"`
	MainStrips [][]int `json:"mainStrips"`
	FGStrips   [][]int `json:"fgStrips"`
	// Five entries are payouts for 1..5 consecutive reels, in line-bet multiples.
	Paytable       map[string][]int64 `json:"paytable"`
	GoldThresholds []int64            `json:"goldThresholds"`
	InitialFG      int                `json:"initialFG"`
	RetriggerFG    int                `json:"retriggerFG"`
	MaxFG          int                `json:"maxFG"`
	JPPerMillion   int                `json:"jpPerMillion"`
	JPMultipliers  []int64            `json:"jpMultipliers"`
}
type Config struct {
	GameID         string      `json:"gameId"`
	InitialBalance int64       `json:"initialBalance"`
	Bets           []Bet       `json:"bets"`
	Math           *MathConfig `json:"math"`
}

func LoadConfig(file string) (Config, error) {
	b, err := os.ReadFile(file)
	if err != nil {
		return Config{}, err
	}
	var c Config
	if err = strictJSON(b, &c); err != nil {
		return c, err
	}
	return c, c.Validate()
}
func knownSymbol(id int) bool { return id == 1 || id == 2 || id >= 10 && id <= 24 }
func validateStrips(strips [][]int) error {
	if len(strips) != 5 {
		return fmt.Errorf("need five sampling strips")
	}
	for _, strip := range strips {
		if len(strip) < 5 || len(strip) > 100000 {
			return fmt.Errorf("strip length must be 5..100000")
		}
		for _, id := range strip {
			if !knownSymbol(id) {
				return fmt.Errorf("unknown symbol %d", id)
			}
		}
	}
	return nil
}
func (c *Config) Validate() error {
	if c.GameID != "GoldenHen" || c.InitialBalance < 1 || c.InitialBalance > MaxAmount || len(c.Bets) < 1 || len(c.Bets) > 100 {
		return fmt.Errorf("invalid game/wallet/bets")
	}
	seen := map[int64]bool{}
	for _, b := range c.Bets {
		if b.LineBet <= 0 || b.TotalBet <= 0 || b.LineBet > MaxAmount || b.TotalBet > MaxAmount || seen[b.LineBet] {
			return fmt.Errorf("invalid or duplicate bet")
		}
		seen[b.LineBet] = true
	}
	sort.Slice(c.Bets, func(i, j int) bool { return c.Bets[i].TotalBet > c.Bets[j].TotalBet })
	if c.Math == nil {
		return nil
	}
	m := c.Math
	if m.Version == "" || (m.Mode != "development" && m.Mode != "approved") {
		return fmt.Errorf("math version and mode required")
	}
	if err := validateStrips(m.MainStrips); err != nil {
		return err
	}
	if err := validateStrips(m.FGStrips); err != nil {
		return err
	}
	if len(m.Paytable) == 0 || len(m.GoldThresholds) != 4 || len(m.JPMultipliers) != 4 {
		return fmt.Errorf("incomplete math config")
	}
	var previous int64
	for _, n := range m.GoldThresholds {
		if n <= previous || n > MaxAmount {
			return fmt.Errorf("gold thresholds must be strictly increasing positive amounts")
		}
		previous = n
	}
	for id, odds := range m.Paytable {
		n, err := strconv.Atoi(id)
		if err != nil || n < 10 || n > 24 || len(odds) != 5 || odds[0] != 0 || odds[1] != 0 {
			return fmt.Errorf("ways paytable requires 3+ reels, no pure Wild/Scatter payout")
		}
		for _, p := range odds {
			if p < 0 || p > 1000000 {
				return fmt.Errorf("invalid payout multiple")
			}
		}
	}
	if m.InitialFG < 1 || m.MaxFG < m.InitialFG || m.MaxFG > 1000 || m.RetriggerFG < 0 || m.RetriggerFG > m.MaxFG || m.JPPerMillion < 0 || m.JPPerMillion > 1000000 {
		return fmt.Errorf("invalid FG/JP limits")
	}
	for _, p := range m.JPMultipliers {
		if p <= 0 || p > 1000000 {
			return fmt.Errorf("invalid jackpot multiplier")
		}
	}
	// All possible wins per action must fit JS safe integers before any RNG is used.
	for _, b := range c.Bets {
		var worst int64
		for _, odds := range m.Paytable {
			max := int64(0)
			for _, p := range odds {
				if p > max {
					max = p
				}
			}
			n, e := checkedMul(max, 243)
			if e != nil {
				return e
			}
			n, e = checkedMul(n, b.LineBet)
			if e != nil {
				return e
			}
			worst, e = checkedAdd(worst, n)
			if e != nil {
				return e
			}
		}
		for _, p := range m.JPMultipliers {
			if _, e := checkedMul(p, b.TotalBet); e != nil {
				return e
			}
		}
		if worst > MaxAmount/2 {
			return fmt.Errorf("maximum payout too large")
		}
	}
	return nil
}
func (c Config) Fingerprint() string {
	b, _ := json.Marshal(c)
	h := sha256.Sum256(b)
	return hex.EncodeToString(h[:])
}
