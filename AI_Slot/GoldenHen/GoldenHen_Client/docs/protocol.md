# gh-client-v1 本機共用契約

唯一 TypeScript 型別來源為 `assets/scripts/common/model.ts`，執行期限制由 `protocol.ts` 驗證。Go server 已在相鄰 GoldenHen_Server 依下列 JSON 名稱實作，並通過真實 client 核心整合；不是舊平台協定相容宣告。

## 請求

HTTP POST `/api/v1/game/command`，Content-Type 為 application/json：

```json
{
  "schema": "gh-client-v1",
  "game_id": "GoldenHen",
  "player_id": "local-player",
  "request_id": "由client產生並持久化的唯一字串",
  "action": "SPIN",
  "expected_version": 12,
  "payload": {"line_bet": 100}
}
```

- START_GAME：payload 為空物件，取得完整狀態，不能藉此清掉特殊遊戲或 pending 回合。
- SPIN：payload.line_bet 為 server 提供的投注選項，不傳 client 自算獎金或餘額。
- NEXT_FEVER：payload 為 `{sg_id, data}`。data 可為 null 或遊戲專屬動作物件；例如選蛋可用 `{"1":7}`，但共用核心不決定獎項。
- CHECK_CMD：payload 為 `{request_id:"原請求ID"}`，Go 回 `{schema,request_id,original_response}`；此查詢不經 decodeEnvelope，專供診斷。client 核心仍以重送原請求恢復，再 START_GAME 刷新快照。

Server 先以玩家/遊戲/request_id 查持久化結果；同內容已成功則回原結果，即使 expected_version 已舊也不重做。新請求才檢查版本、下注與狀態。同 ID 不同內容拒絕；不能把 client 的 player_id 當成正式身分驗證。本機用途外另接 authentication adapter。

## 成功回應

外層為 `{schema:"gh-client-v1", request_id, cmd_data:{data:Snapshot}}`。Snapshot 使用 camelCase 屬性，需全部提供，不能以舊版片段封包替代。

- version：非負安全整數；新 SPIN/NEXT_FEVER 成功必須大於該請求 expected_version。START_GAME 不減版；不能在重啟時歸零。
- roundId：字串或 null。
- balance、lastWin、totalWin：非負安全整數最小單位。1 信用點 = 10000 原始單位。balance 是權威餘額；totalWin 是展示累計，不能再次入帳。
- layout：`{reels,rows,bufferTop,bufferBottom}`；GoldenHen 可用 `{reels:5,rows:3,bufferTop:1,bufferBottom:1}`。上限 32 軸、64 可視列，兩側緩衝各最多64。
- board：依軸排列的二維 symbol ID 陣列，包含緩衝，各軸長度必須與 layout 一致。
- fakeStrips：每軸一條非空 symbol ID 陣列，只供轉動顯示，不是正式抽樣輪帶。
- bets：非空 `{lineBet,totalBet}[]`，都是正整數；lineBet 唯一。selectedLineBet 必須是其中一個選項。
- wins：`{symbolId,amount,positions:boolean[reels][rows]}[]`；空陣列合法。client 不從 wins 重新計算派彩。
- winType：非負整數，遊戲決定各等級演出。
- special：null 或 `{id,stage,remaining,total,picks,data}`。stage 為 init/process/recovery；remaining/total 同時為 null 或非負整數，剩餘不可大於總數；picks 為 null 或已揭露獎項陣列（未開=-1）；data 為遊戲可公開資料。

特殊遊戲結束時 special 轉 null，或直接回下一個特殊遊戲的完整 state。id=0 為合法 ID；不能用 `if(id)` 判斷有無特殊遊戲。禁止提前把未開蛋內容放在公開快照。

## 錯誤與恢復

- API 的 definitive 4xx 契約：該請求未套用帳務/遊戲狀態。400、401、403、409、422 不自動重試，client 清除該 pending，操作保持 faulted，需重新連線刷新狀態。
- HTTP 408、429、5xx、斷線、逾時、無效 JSON、無法解析的成功封包：結果可能不確定，不能換新 ID。最多依設定重試；耗盡則保留 pending，下次 connect 先重送原 ID，再 START_GAME 刷新。
- 同一請求可能已提交但尚未送回應。Go 端必須保存最初結果與 request_id；否則 client 無法單方面保證不重扣。
- Snapshot 驗證失敗、缺特殊遊戲 handler、演出出錯，client 均鎖住新動作；不要將錯誤當作輸局自動繼續。
- 本機 localStorage 只保存 pending command，不能恢復成可信餘額。START_GAME 始終向 server 確認現況。

HTTP 自動重試政策、schema、版本及金額型別要與 Go 端一起測試。這套契約刻意不直接將歷史 G63 fixtures 當作正確回應。
