# Go server 與測試知識

查核日期：2026-10-22。以下將來源事實與本案設計分開。它是可更新的專案知識，不是模型訓練，也不表示任何程式或測試已完成。

## 1. 交易與結算

官方依據：Go 的 sql.Tx 將多個資料庫操作組成交易；交易中應使用 Tx 的方法，避免混用交易外的 DB 操作。
來源：[Executing transactions](https://go.dev/doc/database/execute-transactions)。

本案採用：一次動作的扣款、增量派彩、round/event、特殊遊戲狀態、去重回應一起提交。交易失敗不發出成功結果。Context、Commit 錯誤與回應中斷分開處理；client 未收到成功不代表可以再次抽獎，應先查詢持久化請求結果。

Go 實作使用 BeginTx/Commit/Rollback 管理邊界，不在連線池任意 Exec BEGIN。若選用 driver 支援的 immediate 模式，要按該 driver 官方介面設定並驗證，不把 SQLite SQL 建議直接混入 sql.Tx。

## 2. 本機 SQLite 的能力與限制

官方依據：SQLite WAL 可讓讀者與寫者並行，但同時只有一個 writer；WAL 仍可能有 SQLITE_BUSY。IMMEDIATE 交易在開始時嘗試取得寫入能力，也可能因其他 writer 而失敗。
來源：[WAL](https://www.sqlite.org/wal.html)、[Transactions](https://www.sqlite.org/lang_transaction.html)。

本案設計候選：本機單服務使用 SQLite；縮短寫交易、同玩家有序操作，以資料庫唯一鍵與版本檢查作持久化約束。Busy 設有限等待/重試，不循環重抽已提交的回合。啟用 WAL 不代表已解決去重或併發。正式 driver、版本及連線設定待實作時選定；不能只用進程 mutex 宣稱跨程序安全。

## 3. 重送去重

官方實例：Stripe 說明使用相同 idempotency key 讓失聯後重試不重複執行操作，API v1 可回傳保存的初次回應。
來源：[Idempotent requests](https://docs.stripe.com/api/idempotent_requests)。這只是工程模式參考，不是要求接 Stripe，也不照搬其錯誤保存或保留期限。

本案採用：唯一鍵綁 player、game、request ID，另保存 canonical action payload 的摘要。同 key 同 payload 回傳已提交的原回應；同 key 異 payload 拒絕。摘要排除每次會變的傳輸時間戳，但保留影響動作的參數。請求未提交或提交結果未知時，以資料庫結果辨識；保留期限要覆蓋未完成回合及支援的重試窗口。

## 4. RNG 與可重現測試

官方依據：crypto/rand.Int 提供 [0,max) 均勻整數，max 必須大於 0。
來源：[crypto/rand](https://pkg.go.dev/crypto/rand)。

本案採用：domain engine 注入自己的 RNG 介面，例如 Intn(n)；一般 server 使用 crypto/rand 的 adapter，fixture/模擬使用獨立可重現來源，不修改全域 crypto/rand.Reader。權重累計採安全整數與溢位檢查；不能用任意亂數直接取餘數當作已證明無偏。

已提交結果不得因重送重抽。尚未提交動作也不能依抽到的獎金決定是否重試或捨棄抽樣。對 RNG 使用、結果保存及失敗行為設可觀察測試。

## 5. Go 測試

官方依據：Go fuzzing 支援 seed corpus，目標應快速、確定且不跨呼叫共享可變狀態；race detector 只能發現實際執行路徑上的競爭。
來源：[Fuzzing](https://go.dev/doc/security/fuzz/)、[Race detector](https://go.dev/doc/articles/race_detector)。

本案採用：
- 手工可推導的盤面/派彩 fixture 測純引擎，不由同一計算函式產生 expected。
- Fuzz 測 parser、權重/座標邊界、非法動作、整數溢位與結算不變量；有界執行，例如 go test -fuzz=FuzzParseCommand -fuzztime=20s，實際目標須存在。
- 同玩家同 key 併發與同 key 不同 payload，檢查只提交一次；race 通過仍不能代替帳務斷言。
- 持久化測試包含重啟與「已提交、回應尚未送出」的故障點。
- go test -race 的平台/編譯器需求另行查驗；不可用時記錄限制，不能說已通過。

## 6. Cocos 3.8 生命週期

官方依據：移除事件的 off 參數需與 on 的 type、callback、target 配對。
來源：[Event listening and emitting](https://docs.cocos.com/creator/3.8/manual/en/engine/event/event-emit.html)。

本案採用：場景重入/FG-JP 切換時驗證每個 listener 只執行一次，動畫 callback 及網路回應也要處理離場/過期情況。官方 EventTarget 的結論不自動代表舊專案自訂 Delegate API 相同，須分開驗證。

## 7. 96.8% RTP 的解讀與設計

官方依據：實際 RTP 是 wins/turnover，與理論 RTP 比較時需考慮樣本量與波動；公開 RTS 7 也將 RNG 映射、規則與機率的一致性列為驗證重點。
來源：[RTP calculation](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/how-to-calculate-return-to-player-rtp)、[Random outcomes](https://www.gamblingcommission.gov.uk/guidance/regulatory-returns-guidance/rts-7-generation-of-random-outcomes)。這裡只作技術設計參考，不聲稱本案適用英國營運規範或已通過認證。

本案推導：96.8% 是目標，不能唯一反推出 paytable、輪帶、FG/JP 機率與波動。不能按玩家目前輸贏動態補獎來把短期比率湊到目標。

可執行的數學開發路徑：
1. 固定已選玩法與各押注 state 的規則，定義 paid-spin 起點到所有後續 FG/JP 結束的完整回合。
2. 總派彩包含該回合所有子遊戲，投注只計實際扣款；中間累計欄位不再次加總。按 state 分別評估，不能只看混合投注玩家的整體結果。
3. 先對小模型窮舉/計算期望，再對較大模型做離線模擬；固定候選模型、另用驗證樣本評估，記錄局數、規則版本、標準誤/適用區間與稀有 JP 覆蓋。
4. 需要 FG retrigger 時檢查回合可終止與期望局數；若可無限加局，不能把被測試預算截斷的路徑當成自然結束。
5. Progressive JP 若納入，分開說明獎池狀態、分攤與監測方式；不要用固定 JP 範例假裝已驗證累積獎池 RTP。
6. 候選權重/派彩需經離線設計和驗證後固定版本；未取得玩法選擇或明確 demo 數學授權前，只建可配置引擎與候選方案，不將設計提議覆寫成正式規格。

## 使用與更新

使用前確認實際 Go、SQLite driver 與 Cocos patch 版本。遇到公開文件與現有程式不同，保留差異而不自動改規格。新增知識需有直接來源、日期及它改變的工程決策；不堆積無關文件，不從其他遊戲搬來專屬機率或私有數學。
