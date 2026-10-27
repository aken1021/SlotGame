# GoldenHen 網路研讀與更新確認

日期：2026-10-22。檢查檔案更新時間：15:50:05（Asia/Taipei）。讀取 18 個分頁；106 筆測試 JSON 均可解析。未修改原始 Excel。

## 本次更新的解讀

- `總覽!B10` 新增目標 RTP **96.8%**。這可作數學設計及驗證目標，尚不構成完整模型。
- `待決事項!C14` 補充低押注直接 MINI，以及四階 JP 金額先模擬。已可據此將 JP 金額做成開發配置；「低」的確切 state/門檻尚未定義。
- Go 已由使用者指定；`待決事項!C19:H19` 和 `執行環境!B10:D10` 的舊待確認標籤不再阻擋本機工程設計。

## 已上網學習並存入技能的內容

技術知識保存在 `.agents/skills/slot-fullstack-builder/references/go-server-research.md`，入口技能已加入讀取指引。

- Go 交易：用 sql.Tx 確保扣派、回合、狀態與回應一起提交，交易內不混用外部 DB 操作。[Go 官方文件](https://go.dev/doc/database/execute-transactions)
- 重送：參考保存請求結果的 idempotency 模式，對本案另定玩家/動作綁定與持久化策略。[Stripe 官方文件](https://docs.stripe.com/api/idempotent_requests)
- SQLite：WAL 仍是單一 writer，不能把開 WAL 當成已解決併發；driver 交易設定需另驗證。[SQLite 官方文件](https://www.sqlite.org/wal.html)
- 亂數：均勻整數來源與測試 RNG 分離，權重抽樣需避免範圍/溢位及偏差。[Go crypto/rand](https://pkg.go.dev/crypto/rand)
- 測試：fixture、fuzz、race、重啟與回應遺失的故障測試分開驗證。[Go fuzzing](https://go.dev/doc/security/fuzz/)、[Go race detector](https://go.dev/doc/articles/race_detector)
- Client：Cocos 3.8 訂閱/取消配對，防止場景切換重複 callback。[Cocos 官方文件](https://docs.cocos.com/creator/3.8/manual/en/engine/event/event-emit.html)
- RTP：理論與實際比率分開，模擬結果須包含波動與樣本量，不能只宣稱跑幾萬局接近 96.8% 就合格。[RTP 技術說明](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/how-to-calculate-return-to-player-rtp)

以上已完成來源研讀與準則整理，尚未進行 Go 實作或執行上述測試。

## 可以自行補齊的內容

Go server 的 HTTP/契約與 adapter、內部狀態機、金額型別、模擬錢包、SQLite 儲存、請求去重、重啟恢復、錯誤碼與測試，可以依官方資料及已授權工程範圍完成，不需要使用者繼續編寫工程說明。

JP 模擬金額依此次規格可建立四級可設定值；不宣稱與正式獎池相同。非結算演出參數已有 AI 決定的授權。

## 不能從網路替本遊戲確定的內容

仍為待決的 Q-01～Q-10 包含正式模型、ways 分筆、Wild/Scatter、一般/黃金混算、FG 次數、解鎖與 JP 開獎。網路可提供設計方法與候選做法，但不能證明 GoldenHen 採哪個選項。

若要先做可玩開發版，可將這些選擇收成一份「AI 提案的 demo 規則配置」，與正式規格分開。在目前活頁簿仍寫「可選方案不是決定」「測試賠率不可使用」的情況下，研讀網路不會自動解除這些限制；可持續建置不受影響的工程部分。

只需釐清少量具體選擇，無須增加長篇敘述：

1. 低押注直接 MINI 的精確範圍：是否為 state=2？state=1 是否完全不觸發 JP？
2. 遊戲專屬數學是否允許 AI 設計 demo 模型？若允許，可由 AI 提案 paytable、抽樣、FG/JP 參數並離線評估 96.8%，不沿用已知錯誤的測試值。
3. 正式外觀是否有必須重現的參考？若沒有，可把資產製作視為新視覺設計，再以畫面驗收。

## 原始測試資料仍存在的問題

本次重新查驗，這些項目尚未修正：

- `測試資料!E68`：D07-1 的第 2 輪可視格 [17,1,19]，中央是 Wild，卻被 win_special_symbols 標記。尚未決定 Wild 替代 Scatter 前，不可當正式觸發範例。
- `測試資料!E73:E75`：加局後總數 6，END 又回 4。
- `測試資料!E7`：D02 仍是升冪小數投注表，與降冪整數契約不同。
- `測試資料!E104`：JP END 仍缺 sg_map["6"]。
- `驗收案例!E43`：整段餘額公式仍未明確扣掉觸發局投注，或界定「觸發前」基準。

後續建立有效配置/fixture 時保留原始樣本，分別標明可測 parser、演出或結算，避免將歷史錯誤變成新 server 行為。
