# GoldenHen 轉輪場景

先在相鄰 GoldenHen_Server 執行 `start-local.ps1`。在 Cocos Creator 3.8.8 開啟 GoldenHen_Client 專案，雙擊 `assets/Game/Scenes/GoldenHenMain.scene`，按預覽。啟動先顯示美術預覽盤面，接著自動取得 Go Server 的餘額與狀態；不在 client 構造遊戲結果或金額。

## 規格對應

來源：`規格書/GoldenHen_AI規格書.xlsx` 的畫面配置與美術說明。

- 設計解析度 1280×720，橫向 SHOW_ALL；紅金主色、玉綠襯色，立體中式美術。
- `ReelArea_990x430` 為包含裝飾框的 Board 根節點。內部五欄各有 171×304 的遮罩，每欄三格，格距 101。規格未另列內框邊距，這些內部尺寸是本次排版選擇，可在產生器調整。
- 背景、轉輪框、符號圖層分離；符號上方有第四個循環緩衝格，滾動時由遮罩裁切。
- 六款 AI 預覽符號：15 公雞、16 玉佩、17 銀元寶、18 鞭炮、14 金幣、1 福字 Wild。金色變體 10–13 尚未繪製；19–24 暫以 A/K/Q/J/10/9 文字顯示。未知 ID 以數字顯示。
- 頂部 Jackpot、底部餘額/贏分與連線/快停/旋轉按鈕為場景配套。GoldenHenGameControls 新增切換押注、FG 開始／下一局及 JP 18 格選擇；這些是開發介面，完整特殊玩法美術演出尚未完成。

## 連接共用模組

Canvas 的 `AISlotDriver` 已綁定五軸與按鈕，`autoConnect=true`。預設 endpoint 是 `http://127.0.0.1:8080/api/v1/game/command`，可在 Inspector 修改。連線失敗會顯示原因，server 啟動後可按「連線」重試。Go 已限制 CORS 為本機來源；請用 localhost 的 Creator 預覽。

旋轉、快停與最終盤面採用既有共用模組。`GoldenHenReelSkin` 在載入時建立圖集 SpriteFrame，套入預覽盤面；收到有效 server 結果後由 driver 接管。沒有在 client 新增 RNG 或派彩。

共用特殊遊戲介面的狀態更新方法為 `updateState`，避免與 Cocos `Component.update(dt)` 衝突。面板事件名稱仍是 `slot-special-update`。

## 重建與檢查

```powershell
npm run scene:build
npm run check:cocos
npm test
```

`scene:build` 會重建場景與圖片匯入設定，保留既有 UUID；手動調整場景後不要直接執行，除非要覆蓋那些調整。`check:cocos` 需要 Creator 已產生的 SDK 宣告檔。

Creator 建置選用 Web Desktop、起始場景 GoldenHenMain；CLI 設定在 `tools/goldenhen-web-build.json`。目前實際建置在隔離副本 `outputs/goldenhen-scene/creator-check` 驗證，避免干擾正在使用的編輯器。

`outputs/goldenhen-scene/GoldenHen_layout_preview.png` 是依場景節點與原始 AI 圖製作的離線排版預覽，**不是 Creator 執行截圖**。可用 `tools/render-goldenhen-layout.cjs` 重建；需可載入的 `sharp`，或用 `SLOT_SHARP_ROOT` 指定包含 sharp 的 Node 套件根目錄。此工具只產出驗收示意圖，不修改美術資產。

原始 AI 資產、尺寸與生成提示詞見 `assets/Game/Art/AI/README.md`。
