---
name: slot-fullstack-builder
description: 根據遊戲規格實作老虎機 server 與 client，包含規格釐清、數學設定、封包契約、本機整合與測試；適用 AI_Slot 的新遊戲及後續功能修改。
---

# 規格驅動的老虎機開發代理

以可執行且可驗證的 server/client 為成果。預設由同一代理完整處理，不要求使用者手動在不同角色間轉述。

## 開始與續作

1. 讀取專案指引、原始規格及既有 `games/<id>/TASKS.md`。新案可執行 `python tools/slot_project.py init <id>`；此命令只開案，不生成遊戲。
2. 將需求記錄到 `requirements.json`；每條有穩定 ID、原文位置、規則與驗收條件。把輸入衝突及未提供資料記錄到 `GAPS.md`，不要用其他遊戲的數值填補。
3. 判斷 standalone 或 framework-compatible。優先沿用本案已選語言與版本；尚無選擇時先找適合的來源，做最小可逆選擇並留下理由。
4. 使用來源前讀 [參考索引](references/reference-map.md)。按本次機制選最少必要範例，不整批複製專案、技能或知識庫。記錄檔案、版本與實際用途至 `SOURCES.md`。

`requirements.json` 根物件包含 `game_id`、原始來源描述陣列 `spec_sources`、需求陣列 `requirements`。每條需求使用非空字串 `id`、`source`、`rule`、`acceptance`、`status`；status 限 `confirmed`、`assumption`、`blocked`、`demo`。可另外加實作與測試關聯欄位。`python tools/slot_project.py check <id>` 只驗證這份開案資料，不能當遊戲驗收。

## 從規格到實作

- 依 [實作準則](references/implementation.md) 整理盤面、結算、特殊遊戲狀態、恢復流程及 server/client 邊界。
- Go server、本機交易、亂數、重送與驗證工作，讀 [Go 與測試知識](references/go-server-research.md)。這份參考保存官方來源及本案工程選擇；使用當下再確認實際 Go/driver 版本，不將公開範例當作遊戲專屬規則。
- 先定義唯一契約來源（依技術採 schema、型別或 IDL），說清楚金額單位、座標、欄位、錯誤與重試語意；正式 server 與 client 都用它。既有平台需做封包 adapter，不能把自訂 JSON 宣稱為平台相容。
- 先完成最小的垂直流程：啟動、取得狀態、押注、server 結算、client 顯示、恢復。再逐項加入規格功能，不以假回應替代真正 server。
- 分離純數學引擎、狀態/帳務、傳輸層與演出層。Client 缺美術時可先使用明確標示的佔位資產；不能聲稱演出已達正式規格。
- 缺關鍵資料時提出具體問題，繼續不受影響的實作。可配置測試機制但不得自行啟用虛構數學模型。使用者明確允許 demo 後，才建立分離的 demo 設定與測試 RNG。
- 原始規格、已決策規則、程式行為衝突時保留來源並釐清；只阻擋受影響功能。不要以「自主」為由猜出正式結果。

## 驗證與交付

依 [驗證準則](references/verification.md) 執行適用測試。每條需求關聯實作檔與測試；特殊遊戲與故障恢復必須驗證狀態與金額。

更新 `TASKS.md` 與 `VERIFICATION.md`：實際執行命令、結果、失敗及未執行項、下一步。工具不可用時保留可重現步驟，明示阻礙，不假造通過。

最終交付需有啟動命令、環境變數範例、server/client 契約、可執行程式與驗證紀錄。公開部署與真實錢包操作依本次使用者授權範圍執行。本機 demo、平台接通、正式數學驗證分開報告，不能互相代替。

## 知識更新

遇到工程知識缺口時主動查官方文件，不將可查得的 API、交易、引擎或測試設計反覆交回使用者決定。把查詢日期、直接來源、適用版本與採用理由保存到相關 reference；區分官方事實、本案推導與待核定玩法。公開規則可用來提出可選設計，不可冒充 GoldenHen 原始數學。既有測試 JSON 先驗證語意，再決定可用於 parser、演出或結算測試的範圍。
