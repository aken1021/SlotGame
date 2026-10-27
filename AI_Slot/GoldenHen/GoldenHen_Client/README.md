# AI Slot client 共用模組

本目錄提供 Cocos Creator 3.8.8 的 TypeScript 共用核心、H5 場景橋接元件，以及 GoldenHen 轉輪主場景與 AI 美術。核心不依賴 `cc` 或其他遊戲原始碼，也不計算派彩與結果機率。2026-10-27 已接通相鄰 GoldenHen_Server 的本機 Go 開發版；完整特殊玩法美術演出仍待後續完成。

先在相鄰 `GoldenHen_Server` 執行 `./start-local.ps1`，再在 Creator 開啟 `assets/Game/Scenes/GoldenHenMain.scene`。場景現在會自動連線，成功取得餘額後即可 Spin；有切換押注與 FG／JP 開發操作入口。場景為 1280×720、5×3 轉輪。詳細方式見 [場景說明](docs/GoldenHen-scene.md)。

## 驗證與示範

需要 Node.js 20+；TypeScript 已固定為 5.5.4。

```powershell
npm ci
npm test
npm run demo
```

本機已有依賴時可直接執行後兩個命令。`demo` 使用明確的腳本 fixture，展示狀態流程，不是隨機遊戲或實際 Go server。HTTP 整合測試會在 127.0.0.1 隨機連接埠啟動 Node 測試伺服器，驗證連線與重送；它不會寫入 `server/`。

## 模組與責任

- `assets/scripts/common/model.ts`：快照、盤面、金額、投注與特殊遊戲的共同型別。
- `protocol.ts`：執行期驗證；拒絕不安全金額、錯誤座標、缺少盤面及過期/不對應回應。
- `network.ts`、`storage.ts`：HTTP、逾時重試與持久化 pending request。送出前保存，只有驗證回應後才清除；重送保留同 ID。
- `host.ts`：主流程、操作鎖、押注、恢復、離場清理，server 快照是金額唯一來源。
- `presentation.ts`：轉輪視覺回收、逐輪停止、快停、跳過報獎；演出結束仍顯示 server 最終盤面。
- `special.ts`：特殊遊戲註冊與進出，ID 與遊戲專屬資料由遊戲層提供。
- `autospin.ts`：有限次自動旋轉，鎖定手動輸入；遇到特殊遊戲、餘額不足或失聯即停止。
- `events.ts`：型別化事件、一次訂閱與清理 scope；畫面 listener 拋錯不會觸發第二次帳務請求。
- `resources.ts`：資產載入去重與釋放、音效/背景音樂介面。
- `cocos/`：可掛節點的 driver、轉輪欄及特殊遊戲面板；支援 Sprite 圖示、循環緩衝格及 Label fallback。

## 契約與 Go server

請讀 `docs/protocol.md`。本模組採 `gh-client-v1` 正規契約，每次成功回應提供完整快照，方便遺失回應與重新載入後恢復。

GoldenHen 原始 `wheel_blocks`、`game_state`、`sg_map` 可在 Go 回應 adapter 或 client 自訂 decode 函式中轉成這個快照；本模組不將不同階段的數字鍵混成通用規則。尚未宣稱與原公司平台或規格中歷史假資料直接相容。

## 接入 Cocos 3.8.8

1. 在 Creator 開啟此目錄或將 `assets/scripts/common` 納入遊戲專案，讓編輯器生成 `.meta`、`temp/tsconfig.cocos.json`。不要手工複製別款遊戲的 UUID。
2. 可直接開啟已建立的 GoldenHenMain，或自行建立場景與遮罩。每軸掛 `AISlotReelColumn`，由上至下綁入 `cells`、`symbolSprites` 與上方緩衝格；GoldenHen 是 5 軸，每軸 3 格。
3. 主節點掛 `AISlotDriver`，綁入 columns、Spin/Skip 按鈕、餘額/贏分/狀態 Label，設定 endpoint、playerId、gameId。
4. 每種特殊遊戲使用獨立 `AISlotSpecialPanel`，設定 server ID 並綁入 driver.specialPanels。從遊戲腳本訂閱面板的 `slot-special-enter/update/exit` 做客製演出；按開始/下一局呼叫 driver.nextSpecial(null)，點選玩法傳入遊戲契約的 data。
5. driver 發出 `slot-settled`、`slot-award-start/finish`、`slot-error`。切換場景會移除按鈕事件並停止演出與網路；未確認請求保留在按玩家/遊戲區分的 localStorage 中。
6. H5 runtime 需提供 fetch、AbortController、crypto.randomUUID、BigInt；其他平台可注入 Transport、PendingStore、newId，先完成平台實測再宣稱支援。

`npm test` 編譯引擎獨立核心，並檢查場景結構與資產。`npm run check:cocos` 使用真正 Creator SDK 通過型別檢查，GoldenHenMain 已在隔離副本完成 Creator 3.8.8 Web Desktop 建置。`npm run test:go` 已完成真實 Go 的 50 局與重啟重送整合；畫面操作與裝置 H5 仍未驗收。

## 演出擴充

ReelView 的 stopReel 與 AwardView.show 必須響應 AbortSignal。skip 只取消演出，不取消/重新產生結算。遊戲層可在這些 port 接入 Sprite、Spine、動畫及音效；若實際演出拋錯，host 進入 faulted 並要求恢復，不重送一個新下注。

快照事件 `snapshot` 表示已收到並接受 server 狀態；UI 餘額建議在 `settled` 更新。不要把 `totalWin` 或 `lastWin` 再加到餘額，client 直接使用 server.balance。
