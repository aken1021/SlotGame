# GoldenHen Go Server

Go 1.25+，僅使用標準函式庫，無 npm、SQLite、CGo 或其他遊戲專案執行依賴。提供本機模擬錢包、243 ways、FG、JP 與 `gh-client-v1` HTTP 契約。

## 啟動及 Spin

在此目錄執行：

```powershell
.\start-local.ps1
```

腳本先編譯，再啟動 `http://127.0.0.1:8080`，使用已授權的 `config/development.json` 與 `data/development-v1.journal`。保持視窗執行，Ctrl+C 停止。可直接執行 `bin/goldenhen.exe`；完整等價命令為：

```powershell
go build -o bin/goldenhen.exe ./cmd/goldenhen
.\bin\goldenhen.exe -config config/development.json -data data/development-v1.journal -allow-development-math
```

在 Cocos Creator 3.8.8 開啟相鄰 `GoldenHen_Client` 專案，執行 `assets/Game/Scenes/GoldenHenMain.scene`。場景現在會自動連線；成功後餘額出現，旋轉按鈕開放。若先開 client 再啟動 server，按「連線」重試。左下新增切換押注；FG 按「開始／下一次免費旋轉」，JP 按開始後選未開金蛋。這些是開發操作介面，尚未做完整特殊遊戲美術演出。

初始測試餘額為 100000000 原始單位，畫面顯示 10000.00；投注對應 0.50、2.50、5.00。押注是成對配置，不從未核定的 max_lines 推導正式規則。本機 player_id 預設 `local-player`。

健康檢查：`GET /healthz`。命令：`POST /api/v1/game/command`，JSON 契約見 `../GoldenHen_Client/docs/protocol.md`。

## 工程行為

- 新 SPIN 原子提交扣款、盤面、派彩、遊戲進度、回合 ID、遞增版本及原回應。FG／JP 不再扣款；餘額是 server 的整數權威值。
- 相同玩家與 request_id、內容相同：回第一次成功的原回應。內容包含 expected_version；已成功的舊請求先走去重，再查版本。相同 ID 不同內容回 409。
- START_GAME 恢復目前狀態，不清除 FG／JP、不重新給餘額。版本不會因重啟歸零。CHECK_CMD 的 payload 為 `{ "request_id": "原請求ID" }`，回 `original_response`；查詢本身不結算。
- 每個 journal frame 包含完整玩家狀態、before/debit/credit、請求摘要與原回應，以 SHA-256 驗證，寫入後 `File.Sync` 才回成功。單一程序 mutex 序列化交易；OS 檔案鎖阻擋第二個 writer，程序退出自動釋放。
- 開機只截除末端不完整 frame；完整 frame 校驗失敗則拒絕啟動。寫入或 Sync 失敗後停止接受操作，避免結果不確定時繼續下注；重啟後以同 ID 恢復。
- 這是本機單服務 append-only 日誌，不是 SQLite，也不宣稱具備跨主機交易或正式平台錢包能力。日誌與去重紀錄不自動刪除，長時間使用需另做受控封存；資料要備份。
- journal 綁定整份設定的摘要；修改設定後應使用新的 data 路徑，或實作明確遷移，不會默默改掉既有未完成回合的規則。
- 僅綁定 loopback，限制 Host 與 CORS 為本機來源，限制 POST JSON 大小與 timeout。player_id 只是本機識別，沒有正式帳號認證；不提供外網部署模式。

## 規則版本與未完成範圍

`development.json` 是使用者於 2026-10-27 授權 AI 建立的獨立開發版設定，規則見 `MATH.md`。沒有宣稱達成 96.8% RTP、正式黃金門檻或正式機率。`config/local.json` 的 math 為 null，僅供契約與錢包初始化，SPIN 明確回 `MATH_NOT_CONFIGURED`。

正式數學需提供／核定完整模型並驗證；不能把 mode 改成 approved 就視為取得數學認證。其他平台需另接認證與錢包 adapter。歷史 G63 測試 JSON 沒有作為正式派彩輸入。

## 驗證

```powershell
go test ./... -count=1
go vet ./...
go test ./internal/slot -run '^$' -fuzz FuzzCommand -fuzztime=10s -parallel=2
```

編譯 server 後，在相鄰 client 執行 `npm run test:go`，會啟動獨立 Go 程序與臨時錢包，跑 50 局、丟失回應、同 ID 重送與重啟恢復。測試完成會停止程序並刪除自己的臨時資料，不碰日常錢包。
