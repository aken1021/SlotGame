# 本機參考索引

以下於 2026-10-22 實際查看。來源唯讀；文件是導航，不是代替程式查證的規格。

## 入口

- `E:\Igaming\SLOT_PLAYBOOK.md`：SlotModule 分層、事件、主遊戲與特殊遊戲流程、殘留樣本 ID 等陷阱。只適用具備對應框架的專案。
- `E:\Igaming\slot_gen\CocosProjectRoot\slot-gen\README.md`：規格生成 TypeScript 腳本骨架及場景/prefab 工具。文件不等於已驗證的功能，使用前檢查 CLI 原始碼和測試；只在本專案的工作副本執行。
- `E:\Igaming\slot_gen\CocosProjectRoot\llm-wiki\llmwiki`：流程、元件、協定與共用模組知識入口。依需求讀取具體文章後回到原始碼確認。
- `E:\Igaming\rd2_common_document\README.md`：共用模組規範入口。
- `E:\Igaming\.agents\skills`：既有 client 特效、報獎、初始化、假資料等技能；按當前功能讀取，避免將來源的整套指令不加選擇搬入。

## 已查驗的 client 樣本

`E:\Igaming\Slot_Client_MoneyGong`：

- `package.json` 的 `creator.version` 為 `3.8.8`，程式為 TypeScript；這是此樣本的版本，不是所有遊戲共同版本。
- `.gitmodules` 列出 `assets/0_Common`、`Common`、`CommonModule`、`SlotCommon`、`SlotModule`。
- `assets/SlotModule/Host/MainGameFlowExtension.ts`：透過 Delegate 注入流程，`onDestroy` 對應移除訂閱。
- `assets/SlotModule/Network/Application/CmdSender.ts`：client 的啟動、資料控制與請求入口；不是 server 實作。
- `assets/SlotModule/Network/Application/NetworkProtocol.ts`：同時有新舊命令命名，如 `start_game`/`START_GAME`、`spin`/`SPIN`、`next_fever`/`NEXT_FEVER`。只確認命令名稱不能證明完整封包相容，須再追 serializer、controller、response parser。

其他候選：`Slot_Client_FortuneFour`、`Slot_Client_PirateTreasure`、`Slot_Client_GoldenHen`、`Slot_Client_FuXingGaoZhaoTaiChi`。本輪只透過 Playbook 了解用途，尚未逐一查證；不可把文件列舉的機制當成本輪已驗證。

## 取用方式

在 `SOURCES.md` 每項記錄：來源路徑、Git revision（可取得時）、檔案與符號/行號、觀察、採用原因、使用方式（閱讀/改寫/複製/依賴）、版本限制。複製時保留必要授權標示，排除憑證、帳號資料、快取及無關資產。

Standalone：參考其設計並建立本地實作，不偷偷 import 外部磁碟路徑。
Framework-compatible：固定共用模組版本，遊戲客製使用擴充點；不修改來源 submodule。缺模組時先記錄，不在參考目錄自動初始化或更新。

目前尚未確認正式 server 原始碼、錢包協定與數學引擎；不能從名稱含 Server 的 client 控制器推斷已具備 server。取得新來源後更新此索引並記錄查驗範圍。
