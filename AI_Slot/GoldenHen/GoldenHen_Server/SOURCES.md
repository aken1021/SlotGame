# 來源與工程選擇

2026-10-27。

- `SlotGame/規格書/GoldenHen_AI規格書.xlsx`：盤面 WAY-001、特殊遊戲 FG/JP/SEQ、整數本機錢包 WAL-001～008。
- `SlotGame/規格書/GoldenHen_最新規格複查_20261022.md`：保留正式數學缺口，未將歷史假資料作派彩答案。
- `../GoldenHen_Client/assets/scripts/common/model.ts`、`protocol.ts`、`docs/protocol.md`：既有 gh-client-v1；Go 逐欄 JSON 實作，並以真實 client decoder 整合驗證。
- 2026-10-27 使用者授權開發版規則：僅 `config/development.json`／MATH.md，未變更原規格。
- [Go crypto/rand](https://pkg.go.dev/crypto/rand)：使用標準安全整數亂數，不以浮點數或取餘數選輪帶起點。
- [Go os](https://pkg.go.dev/os)：檔案、Sync、OpenFile；本機完整交易 frame 持久化。這是本案設計，不宣稱檔案日誌具備 SQLite 的所有保證。
- [Go 1.25](https://go.dev/doc/go1.25)：實際工具鏈 go1.25.5 windows/amd64；不依賴外部 SQLite driver。
- [Go fuzzing](https://go.dev/doc/security/fuzz/) 與 [race detector](https://go.dev/doc/articles/race_detector)：有界 parser fuzz 與執行限制分開記錄。
- [Cocos 命令列建置](https://docs.cocos.com/creator/3.8/manual/en/editor/publish/publish-in-command-line.html)：Creator 3.8.8 退出碼 36 代表建置成功。

Server 為新寫的 Go 標準函式庫實作，沒有讀取或引用 E:\Igaming 程式，沒有 SQLite 或其他 Go 模組下載。
