# 驗證紀錄

2026-10-27 增補：Go Server 已存在並完成真實 client 核心的 50 局、丟失回應同 ID 重送及重啟重送。client 38 項測試、SDK 型別及 Creator 建置通過。場景改為自動連線，新增開發版投注與特殊遊戲操作。下列 2026-10-22 的「未接 Go」描述已由本次結果取代；瀏覽器畫面操作及正式平台仍未驗收。詳細記錄見相鄰 GoldenHen_Server/VERIFICATION.md。

日期：2026-10-22。環境：Windows、Node.js 24.11.1、npm 11.6.2、TypeScript 5.5.4。

## 已執行

- `npm run build`：通過。strict、exactOptionalPropertyTypes、noUncheckedIndexedAccess；編譯引擎獨立核心並產出 declarations。
- `node --test --test-reporter=dot tests/*.test.cjs`：38 項全部通過，無跳過。本機 HTTP 測試需 sandbox 外的 loopback 權限；沙箱內曾因 EACCES 失敗，外部已實際執行成功。
- `npm run check:cocos`：通過。使用 Creator 3.8.8 真實 SDK，包含 Game 腳本及共用 Cocos 元件；修正特殊面板 update 與 Component.update 衝突，改為 updateState。
- GoldenHenMain 的 246 個物件引用、五軸三格遮罩、腳本 UUID、圖片尺寸與 SpriteFrame meta 均已驗證。
- Creator 3.8.8 Web Desktop CLI：隔離副本最終建置退出碼 **36（成功）**，產出 `outputs/goldenhen-scene/creator-check/build/goldenhen-preview/index.html`。對應官方說明：https://docs.cocos.com/creator/3.8/manual/en/editor/publish/publish-in-command-line.html 。日誌在 outputs/goldenhen-scene/creator-final.stdout.log / stderr.log。
- 已檢視三張 AI 原圖的尺寸/透明度與離線排版預覽；原始 PNG 保存在專案 Art/AI，未程式重繪或去背。
- `npm run demo`：通過，走完 connecting → ready → requesting → stopping → awarding → ready → disposed；餘額採腳本server快照。
- 原始碼/測試掃描：沒有指向 `E:\Igaming` 的執行依賴，也沒有未實作的 throw/TODO 骨架。

測試覆蓋：完整盤面/緩衝與金額驗證、快照不可變、請求關聯及版本、顯示取整、連點防護、押注鎖、特殊遊戲切換、未知feature拒絕、自動旋轉停止與清理、快停及跳過、逾時/中斷/重載後同ID重送、持久化失敗禁止送單、4xx不重試與5xx保留pending、離場後晚到結果、事件清理、資產釋放及音效控制。

真實HTTP案例由Node測試伺服器先提交一筆結果再斷開socket，client以同ID重送並取得原結果；斷言只提交一次。這驗證client與測試契約，不代表Go帳本已存在。

## 限制與後續

- Cocos bridge另提供 `npm run check:cocos-syntax` 作decorator/TypeScript語法轉譯檢查；這不檢查真實 `cc` API型別。
- 已啟動 Creator 建置及生成 scene/meta、綁定畫面。初次建置發現腳本 ID 壓縮格式錯誤，已改為引擎實際註冊的 23 字元格式，最終無 missing-class 訊息。最終建置仍有 GPU cache 權限、壓縮設定採預設值、移除開屏未授權及 worker SIGTERM 診斷，CLI 總結果為成功；未宣稱完全無警告。
- 內嵌瀏覽器拒絕 localhost（ERR_BLOCKED_BY_CLIENT），因此未完成 Creator runtime 畫面操作與裝置 H5 驗收。GoldenHen_layout_preview.png 是離線排版圖，不是引擎截圖。
- 未連線Go server或公司平台。當前`gh-client-v1`為本地共用契約，需要server依此實作或加adapter。
- 未做正式遊戲數學/RTP驗證；client不含RNG或派彩引擎。
- npm registry DNS不可用，採本地既有TypeScript5.5.4離線工具包完成編譯；後續可在正常網路環境用固定依賴安裝。
