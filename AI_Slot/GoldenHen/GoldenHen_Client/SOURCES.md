# 來源與邊界

2026-10-27 更新：已完成本專案新寫的 Go Server 與真實 client 核心整合；新增 GoldenHenGameControls、Server 錯誤訊息顯示及自動連線。38 項 client 測試、真實 Creator SDK 型別與 Creator Web 建置通過。下列 2026-10-22「Go 尚未接通」與「編輯器尚未執行」為歷史狀態，現已由 Server/VERIFICATION.md 的驗證結果取代。數學採使用者另行授權的開發設定，未以歷史 fixtures 作正式賠率。

日期：2026-10-22。程式為本專案新寫，未複製舊遊戲的共用模組、場景或資產。

- `規格書/GoldenHen_AI規格書.xlsx` 及作法補齊版：參考盤面緩衝、server權威結算、特殊遊戲與恢復需求。client核心不選擇未核定的數學提案。
- [Cocos 3.8 事件文件](https://docs.cocos.com/creator/3.8/manual/en/engine/event/event-emit.html)：on/off 與 callback/target 配對的生命週期設計。
- [Cocos 3.8 decorators](https://docs.cocos.com/creator/3.8/manual/en/scripting/decorator.html)：Cocos bridge使用元件與屬性綁定；patch版本3.8.8的實際編輯器驗證仍未執行。
- [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict.html)：使用strict，另加exactOptionalPropertyTypes及noUncheckedIndexedAccess。
- 本次 npm registry DNS 失敗，使用既有 `E:\Igaming\Slot_Client_MoneyGong\node_modules\typescript` 的5.5.4工具包作離線編譯器，連同其授權檔複製到本機node_modules；只作工具鏈，原路徑不在程式/測試執行依賴中。package.json固定5.5.4。
- 查看的舊 creator.d.ts 是 legacy cc namespace，不符合3.8 import-from-cc，因此沒有拿它冒充3.8 SDK型別。

HTTP測試的Node伺服器是專用fixture，不實作正式遊戲數學或真正錢包。通過此測試不表示Go或公司平台已接通。
