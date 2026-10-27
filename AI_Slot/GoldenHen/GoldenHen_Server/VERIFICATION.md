# 驗證紀錄

日期：2026-10-27（Asia/Taipei）。Windows amd64，Go 1.25.5、CGo=0、Node.js 24.11.1、TypeScript 5.5.4、Creator 3.8.8。

## 已執行

- `gofmt -w cmd internal`、`go build -o bin/goldenhen.exe ./cmd/goldenhen`、`go vet ./...`：通過。
- `go test ./... -count=1`：11 個 Test 函式及 fuzz seed 通過；包含整數計獎手算 fixture、純 Wild／緩衝 Scatter、黃金化、末局加局、JP→FG、FG→JP→FG、直接 MINI、私有獎項不洩漏、餘額不足、過期版本、同 ID 異內容、20 個併發請求、程序鎖、重啟、部分日誌尾端與 checksum 損壞。
- 真實 HTTP：Go 服務提交 SPIN 後關閉 socket；同 ID 重送只回原結果，不重扣。測試需 sandbox 外 loopback 權限；沙箱內 EACCES 不作遊戲失敗。
- `go test ./internal/slot -run '^$' -fuzz FuzzCommand -fuzztime=10s -parallel=2`：通過，155552 次輸入；驗證 parser 不崩潰，拒絕重複 JSON key、未知欄位及非法型別。
- client `node tools/test-go-server.cjs`：真實 Go binary + 真實 FetchTransport／SlotClient／codec／特殊路由；50 次主遊戲、故意丟掉第一次 SPIN 回應、重新啟動同一 journal 並重送第一次 SPIN，全通過。一次紀錄：53 次 HTTP、版本 50、扣款 1250000、入帳 12000、餘額 98762000 = 100000000 − 1250000 + 12000。隨機結果每次不同，此數字不是 RTP 驗收。
- 最終整合紀錄：67 次 HTTP、50 次付費 Spin 與 14 次特殊遊戲動作、版本 64、扣款 1250000、入帳 5310500、餘額 104060500；同樣通過丟失回應與重啟重送。開發服務已在 127.0.0.1:8080 啟動，healthz 為 development；第二個獨立 binary 開啟同一日誌時確實被 OS lock 拒絕。
- client `npm run build`、`npm run check:cocos`：通過，使用真實 Creator SDK；38 項 client 測試通過。
- Creator CLI 在隔離副本載入已綁定的 GoldenHenGameControls 與 autoConnect 場景，Web Desktop 建置退出碼 36（成功）。日誌 `SlotGame/outputs/goldenhen-server/creator.stdout.log`／`creator.stderr.log`。

## 限制

- `go test -race ./...` 無法執行：環境 CGo=0，工具回報 `-race requires cgo`。一般併發測試已通過，但不冒稱 race detector 已通過。
- Creator 建置仍有 GPU cache 權限、預設壓縮設定、移除開屏未授權等診斷；不是零警告建置。最終結果成功，沒有遺失自訂腳本類別。
- client→Go 驗證為無畫面的真實 client 核心整合；Cocos 瀏覽器點擊、實機 H5、美術演出未驗收。過去內嵌瀏覽器拒絕 localhost，沒有把離線排版圖當 runtime 截圖。
- 50 局不保證碰到全部隨機機制；FG／JP 的邊界由可推導的固定 RNG 測試覆蓋。正式數學／RTP、外部錢包與部署未驗證。
- 日誌每次交易 Sync 的耐久性仍受 OS／磁碟能力限制；沒有宣稱斷電測試或跨主機 exactly-once。
