# 共用模組工作狀態

2026-10-27 更新：相鄰 GoldenHen_Server 已完成本機 Go 開發版；使用者授權獨立開發數學。場景 autoConnect=true，新增押注切換／FG／JP 開發控制；真實 client 核心→Go 已完成 50 局、丟失回應與重啟重送。正式數學與完整特殊遊戲美術仍待驗收。

已建立引擎獨立核心、Cocos H5橋接、型別/執行期契約、測試與接入文件。

目前已交付 client 共用程式及 GoldenHenMain 轉輪場景：AI 背景、紅金綠絨框、六款預覽符號、五軸遮罩與循環緩衝格、基本 HUD/按鈕綁定。已通過真實 SDK 型別檢查、38 項測試及 Creator Web Desktop 建置（退出碼 36）。

下一步：

1. 在 Creator 3.8.8 開啟 assets/Game/Scenes/GoldenHenMain.scene，實際預覽/操作。此次內嵌瀏覽器阻擋 localhost，尚未完成 runtime 畫面驗收；已提供離線排版圖。
2. 已完成 Go server 完整快照、持久化去重與真實 client 整合；後續核定正式數學、外部平台認證及錢包。
3. 在遊戲層註冊FG/JP handler，連接GoldenHen資料與特效；共用層不硬編game ID或sg_map數字鍵語意。
4. 驗證手機 H5、遮罩、快停、跳過、特殊遊戲與重連畫面；補齊金色變體 10–13、低階符號 19–24 美術與動畫音效。

不要將以上未執行項標記為已通過，也不要讓client補算正式派彩。
