# Server 工作狀態

2026-10-27：本機開發版 Server 已實作，使用者已授權開發版數學。

已完成：HTTP 契約、初始化／Spin／FG／JP／查詢、整數錢包、版本檢查、持久化原回應、防重扣／重派、程序鎖、斷尾恢復、開發規則設定、啟動腳本與 client 自動連線／特殊操作入口。

驗證：Go 單元與真實 HTTP 故障測試、client→Go 50 局及重啟重送、parser fuzz、client SDK 型別／測試及 Creator 建置。詳見 VERIFICATION.md。

尚未完成：正式數學／RTP 核定、正式認證與外部錢包、跨主機儲存、日誌封存遷移、完整 FG／JP 美術演出、Cocos 瀏覽器與手機實際操作驗收。不得宣稱正式營運版完成。
