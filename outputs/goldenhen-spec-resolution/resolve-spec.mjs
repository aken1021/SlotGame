import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import path from 'node:path';

const runtimeRequire = createRequire('C:/Users/kenduan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {FileBlob, SpreadsheetFile} = await import(pathToFileURL(runtimeRequire.resolve('@oai/artifact-tool')).href);
const root = 'E:/AI collection/AI_Slot';
const out = path.join(root, 'outputs/goldenhen-spec-resolution');
const source = path.join(root, '規格書/GoldenHen_AI規格書.xlsx');
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(source));
if (process.argv.includes('--inspect')) {
  console.log((await wb.inspect({kind:'sheet',include:'id,name',maxChars:2500})).ndjson);
  const b = await wb.render({sheetName:'待決事項',range:'A3:H7',scale:1,format:'png'});
  await fs.writeFile(path.join(out,'before.png'),new Uint8Array(await b.arrayBuffer()));
  console.log('before.png saved');
  process.exit(0);
}

const changes=[];
const rows=new Map();
function set(sheet,cell,value){
  const s=wb.worksheets.getItem(sheet);
  const before=s.getRange(cell).values[0][0];
  if (before===value) return;
  s.getRange(cell).values=[[value]];
  changes.push({sheet,cell,before,after:value});
  const r=Number(cell.match(/\d+/)[0]);
  if(!rows.has(sheet))rows.set(sheet,new Set());
  rows.get(sheet).add(r);
}
const proposed='開發版提案（非正式核定）';
const eng='已定作法（尚未實作驗證）';
const math='已填設計路徑；RTP 待驗證';

set('總覽','A1','GoldenHen（金雞報喜）— AI 規格書・作法補齊版');
set('總覽','A2','本版補入待決項目的工程作法與可配置開發提案。工程已定方案不代表程式已完成；玩法提案不是 GoldenHen 原版規則。正式數學及 96.8% RTP 尚未驗證。測試資料保留原始內容，已知矛盾另列作法，不將歷史假資料當作結算答案。');
set('總覽','B7','Client 讀取 bet_list.total_bet；開發提案採 total_bet=line_bet×50（非 50 條 payline），ExtraBet 停用。正式數學仍依 Q-01/Q-02 核定。');
set('總覽','C7',proposed);
set('總覽','B10','理論 RTP 目標 96.8%；以獨立、固定版本的數學配置與完整 paid-spin→FG/JP 回合驗證。不可用短期補獎湊 RTP。Q-01 已填設計與驗證作法，但正式 paytable/權重、波動與 RTP 結果尚未完成。');
set('總覽','C10','作法已填；正式數學待驗證');

set('狀態圖例','A2','本版新增狀態：已定作法＝可依已授權工程選擇實作，尚未測試；開發版提案＝供獨立開發採用的候選玩法，非原版/正式核定；RTP 待驗證＝已有設計路徑但無合格數學結果。保留原狀態作來源歷史說明。');
set('狀態圖例','B9','正式數學尚缺有效資料或驗證結果；可填設計作法/開發提案，不得將未驗證模型宣稱為正式規則。');
set('狀態圖例','C9','可建引擎與提案；未驗證不得標記 96.8% 已達成');
set('狀態圖例','C10','可填明確開發提案；標示非原版核定');
set('狀態圖例','C11','本機工程依已授權 Go/錢包方案；正式平台另適配');
set('狀態圖例','B12','資產格式可依本版開發規格製作；原版外觀需參考圖及驗收。');
set('狀態圖例','C12','可依美術風格簡單繪製；原版相似度未驗證');

set('待決事項','A1','待決事項與處理作法');
set('待決事項','A2','D 欄已填具體作法；H 欄區分工程已定、開發版提案與仍需驗證。玩法提案不自動成為原版規則；正式平台、原版資產與 96.8% 數學驗證未完成，不標示已解決。相關規則與案例同步補充。');
set('待決事項','D3','處理作法／開發版提案');
set('待決事項','H3','處理狀態');
const decisions={
  5:['將 paytable、每軸取樣/輪帶、state 轉換、FG/JP 機率與封頂寫入版本化 math.json。先固定 Q-02～10 的候選規則，再離線計算/模擬、調整候選權重，另用獨立樣本驗證完整回合 RTP 與波動。目標 96.8%，不能單憑目標反推唯一模型；不用 G63 測試賠率，不按玩家盈虧動態補獎。正式權重/賠率尚未生成，這項只完成方法設計。',math],
  6:['開發提案：每個 symbol 只取最長連續 ≥3 輪，一個 symbol/盤面一筆 bingo；ways 為各輪有效數量乘積。win=odds[連數]×line_bet×ways，multiplier 預設 1；所有乘法檢查溢位。整數倍率不取整；若允許有理數倍率，各筆最終派彩採整數向下取整。max_win_multiple 為配置必填，未提供不得啟動隨機遊戲，不自行猜上限；封頂需納入 RTP 模型。',proposed],
  7:['開發提案：Wild 替代 ID10～24，不替代 Scatter；Wild 自身不另付獎。各目標 symbol 可共用 Wild，各自形成一筆最長連線；但一條路徑必須至少含一格該目標自然圖騰，純 Wild 路徑不對所有 symbol 重複派彩。ways=Π(自然數+Wild數)−Π(Wild數)，只在相同最長連續範圍計算；扣除純 Wild 路徑，bingo.pos 標記參與的可視格。',proposed],
  8:['開發提案：一般/黃金不混連。Server 先以基礎 symbol 取樣，再依觸發時鎖定的 state 做 18→13、17→12、16→11、15→10 轉換，轉換後計獎、回傳盤面與 bingo；禁止 client 另改結算結果。每個 state 都需獨立驗證 RTP；視覺假輪帶不得當取樣權重。',proposed],
  9:['開發提案：由第1輪起連續 K 輪各至少一個自然 Scatter，K=3/4/5 才觸發；同輪多顆只算一輪，Wild 不替代。Scatter 不另派彩，可與普通 ways 同局成立；初始 FG 4/6/8 局（Q-06）。win_special_symbols 只標真正 ID2 的可視格，不能把 Wild 標成 Scatter。',proposed],
  10:['開發提案：主遊戲3/4/5輪 Scatter 給4/6/8局；FG 同條件加2/3/4局，整段最多獲授100局（含初始）。remaining=原remaining−1+實際可加局數；total 只增加實際加局數，永不倒退。達上限後不加局也不播加局動畫。FG 結果可出高分、Wild、Scatter，不出低分；具體權重依 Q-01 待驗證。fake_wheels 僅控制視覺。',proposed],
  12:['開發提案：1信用點=10000原始單位；bet_list 線注原始值=[70000,50000,30000,20000,15000,10000,5000,3000,2000,1000,500,200,100]，總注=線注×50，依總注降冪。五筆 gold_sym.value=[0,250,1000,3000,10000]；第0筆為保留，sym=[14,14]，其後 sym=[18,13]/[17,12]/[16,11]/[15,10]。門檻須嚴格遞增，未達第1門檻 state=1；非法配置拒絕啟動，FG/JP 鎖定觸發押注與 state。',proposed],
  13:['開發提案：壓暗表示未取得該 JP 資格，server 不可派發。state1 不觸發；state2 只 MINI；state3 MINI/MINOR；state4 加 MAJOR；state5 加 GRAND。取樣只在已開放集合中進行；不得先開出未開放獎再由 client 隱藏。',proposed],
  14:['開發提案：state1 無 JP；state2 觸發後直接 END 給 MINI，不建立18蛋互動；state3～5進18蛋。低押注的精確定義依 Q-07 state，不另比對顯示字串。四級 JP 用固定倍數模擬：GRAND 1000×、MAJOR 100×、MINOR 20×、MINI 5×觸發總押注；均為配置，不是原版/累積獎池值，需納入 Q-01 RTP 驗證。',proposed],
  15:['開發提案：Main/FG 每局完成結果後，若可視區含 Wild 且 state≥2，每局只判定一次 JP；p_jp[state,mode] 及 eligible-tier 權重為 math.json 必填，依 Q-01 離線設計。state2直接 MINI；其餘在進場固定18蛋內容並保存，點選只揭露，任一合格等級首次集滿3個即結束。只抽已開放等級，不因點選或目前盈虧換內容。不得預先指定一個與實際首次集滿不同的得獎等級；整個板面演算法/分布需驗證。',proposed],
  17:['本機作法：Go HTTP JSON /api/v1/game/command；正規命令 START_GAME/SPIN/NEXT_FEVER/CHECK_CMD。請求含 player_id、request_id、action、expected_version、payload；回應沿用 cmd_data.data adapter，帶 round_id、state_version、balance。相同玩家/遊戲/request_id 同參數回存原結果，異參數409；狀態過期409、餘額不足422。正式平台的認證、錢包與傳輸另做 adapter，未整合不宣稱相容。', '本機作法已定；正式平台未整合'],
  18:['開發作法：Cocos 3.8.8、1280×720、SHOW_ALL，依既有美術風格簡繪。Symbol PNG RGBA 採尺寸欄2×輸出再縮回，pivot=(0.5,0.5)、四周保留8%安全區；轉輪中按格等比 fit，Wild/Scatter 表演覆層可越框。Coin 用24幀/24fps循環；其他動畫先用 tween/序列與語意完成事件，不要求 Spine；以 Symbol清單 frame 名建 asset manifest。原版畫面相似度仍需參考圖及美術驗收。','開發作法已填；原版外觀未驗收'],
  19:['已確定 Go server。採 net/http+JSON、database/sql+SQLite 本機持久化，單一服務可用 go run ./cmd/server，預設127.0.0.1:8080。設定包含DB路徑、初始餘額、math版本；SQLite driver及最低Go版在建置時固定並記錄。Server 依 client 契約實作，不等待另份 server 設計。尚未寫程式/實測，正式平台不在本機範圍。',eng],
  20:['保留D01～D12歷史原文，不用它們當正式結算期望。另建版本化 normalized fixtures：修正D07 Wild/Scatter標記、FG總次數倒退、投注單位排序、JP缺欄與累計。人工可推導盤面獨立算 expected，再測Go輸出；覆蓋末局加局+JP、重送、異參數同ID、已提交但回應遺失、重啟恢復。下方案例已填測試方法；fixture實體與驗證結果仍待實作。','作法已填；測試尚未執行']
};
for(const [row,[method,status]] of Object.entries(decisions)){
  set('待決事項',`D${row}`,method);set('待決事項',`H${row}`,status);
}
set('待決事項','E9','D07-1 第2輪可視[17,1,19]是Wild，標記卻當成Scatter；不能證明前三輪各有自然Scatter。保留為歷史異常，正式fixture依Q-05重建。');
set('待決事項','C10','初始局數、加局與上限、正式FG結果取樣；與視覺fake_wheels分開定義。');
set('待決事項','C19','Go server、本機部署與啟動、client資料契約和正式平台邊界。');

// Synchronize directly dependent rules. Preserve observations in source columns.
set('規則表','H5','本遊戲 ExtraBet 停用（BET-004）；開發提案total_bet=line_bet×50，取樣/派彩仍依Q-01驗證。');
set('規則表','K5','介面已確認；換算採開發提案');
set('規則表','H6','最小單位1/10000信用點；整數派彩不取整，有理數倍率於各筆最終向下取整；顯示2位四捨五入不回寫帳本。封頂配置必填，依Q-02。');
set('規則表','H11','開發提案：win=odds×line_bet×有效ways（multiplier=1）；一symbol最長一筆；純Wild路徑扣除見WILD-001。正式數學未驗證。');
set('規則表','K11',proposed);
set('規則表','E12','開發提案：每個symbol僅支付由第1輪起最長連續N≥3的一筆bingo，不重複支付其3/4/5輪子段；歷史重複資料不作答案。');
set('規則表','H12','完整公式/取整/封頂見Q-02；正式數學未驗證。');set('規則表','K12',proposed);
set('規則表','H14',decisions[7][0]);set('規則表','K14',proposed);
set('規則表','H16',decisions[8][0]);set('規則表','K16',proposed);
set('規則表','H17',decisions[12][0]);set('規則表','K17',proposed);
set('規則表','H18',decisions[13][0]);set('規則表','K18',proposed);
set('規則表','H20',decisions[9][0]);set('規則表','K20',proposed);
set('規則表','H23',decisions[10][0]);set('規則表','K23',proposed);
set('規則表','H25','fake_wheels 是視覺資料，不決定加局機率；正式結果可含Scatter，權重配置及驗證見Q-01/Q-06。');set('規則表','K25',proposed);
set('規則表','E27','total_win_amount=同段特殊遊戲鏈已完成獎金，含JP→FG之前的JP與FG中已完成JP，不含尚未進行的末局JP。FG看板直接顯示當時total_win_amount；末局JP完成後total_win_amount再加本次JP，回Main顯示最終總獎。每局增量只透過this_win_amount入帳一次。');
set('規則表','H27','依D12累計統一「特殊遊戲鏈」語意；顯示/帳務驗證需新增末局JP與JP→FG自洽fixture，尚未執行。');
set('規則表','H29',decisions[15][0]);set('規則表','K29',proposed);
set('規則表','H30',decisions[14][0]);set('規則表','K30',proposed);
set('規則表','H31','開發提案固定18蛋，進場持久化；PROCESS本次派彩=0，sg_map6=0，第三個同級END才填本次獎金並入帳。已開index新請求409，重送原ID回原結果。');set('規則表','K31',proposed);
set('規則表','H32','END必帶sg_map1/2（最後選取）、3（得獎）、4（已開=-1的揭示板）、6（JP獎金）；this_win_amount=本次JP新增派彩，balance為提交後值。');
set('規則表','H34','開發提案：固定倍數模擬，不使用真實累積池；按觸發總注計算GRAND1000x/MAJOR100x/MINOR20x/MINI5x並鎖定本次session金額。');set('規則表','K34',proposed);
set('規則表','H40','主遊戲扣款及本局增量獎在同交易提交；client報獎只改顯示，不再入帳。FG/JP待各動作合法完成再入帳，遵WAL-005。');
set('規則表','H43','開發作法：僅可視index1～3的Wild各發一次SendCoin；比較總押注先轉成顯示信用點（原始值/10000）；快停/跳過不重複加幣。');
set('規則表','H44','開發演出分級：無獎0；正獎<1x為1、[1,5)為2、[5,10)為3、[10,25)為4、[25,50)為5、[50,100)為6、≥100為7；使用total_bet為基準，與StartGame.WinType一致，不改派彩金額。');
set('規則表','H47','初始1000.00信用點=10000000原始單位，可設定；本機player_id對應錢包，僅loopback開發環境，正式身分由adapter替換。');
set('規則表','H48','信用點代碼TEST、currencyRatio=0.0001、decimalPlaces=2。Go int64，JSON number限制絕對值≤9007199254740991，超限拒絕；顯示四捨五入不更改帳本。');
set('規則表','H49','餘額不足422 INSUFFICIENT_BALANCE；非法押注422 INVALID_BET；非法狀態/版本409。失敗不產生回合/扣派；client收到拒絕須恢復server餘額。');
set('規則表','H51','JP PROCESS增量0，END/直接MINI才派JP獎。total_win_amount僅為鏈累計，禁止再入帳。回應快取、帳本、結果與狀態同交易提交。');
set('規則表','H52','採request_id（UUID字串）+player_id+game_id唯一鍵；保存action+規範化payload摘要，異參數同ID回409 IDEMPOTENCY_CONFLICT。expected_version作新動作順序檢查；既有成功ID先回快取，不因重送版本舊而拒絕。');
set('規則表','H53','SQLite持久化players/wallet_ledger/rounds/game_states/request_results；database/sql交易同時保存。單玩家有序操作、DB唯一鍵與state_version保護；先提交後回應。重啟測試包含提交後尚未送回應。');

set('封包契約','A2','本機新client採HTTP POST /api/v1/game/command與START_GAME/SPIN/NEXT_FEVER/CHECK_CMD。請求player_id/request_id/action/expected_version/payload；payload以line_bet為正規名稱，legacy bet_value/BetValue由adapter轉換、衝突拒絕。回應cmd_data.data保存既有欄位；本機schema gh-dev-v1。原公司傳輸/認證未整合。');
set('封包契約','E7','本機開發方案以總押注降冪；所有金額為整數原始單位，具體配置見Q-07，不直接使用D02小數。');
set('封包契約','E11','五筆嚴格遞增、索引0保留；開發提案值見Q-07。');
set('封包契約','H11',proposed);
set('封包契約','C16','payload.line_bet（正規）；bet_value/BetValue僅legacy adapter別名');
set('封包契約','D16','int（安全整數）');
set('封包契約','E16','下注須命中server配置，不信任client傳total_bet；多個別名並存而值不同則拒絕。');
set('封包契約','E17','BetLines=1；balance不可作帳務來源；client dev_mode不授權強制結果；其他legacy欄位由adapter明列，不影響正式domain權限。');
set('封包契約','D22','金額int；win_type int；serial_id string');
set('封包契約','E22','金額為安全整數原始單位；serial_id為round/action識別，不作金額；回應另外帶round_id及state_version。');
set('封包契約','E37','JP恢復物件：0～17對應已開獎項0～3，-1表示未開；不可傳未開真實內容。與END sg_map4不同schema。');
set('封包契約','E41','JP END揭示int[18]：已開為-1、未開為原固定內容；與RECOVERY sg_map0的-1含義分開解析。');
set('封包契約','E43','本次JP獎金：開發提案PROCESS=0；END/直接MINI=實際JP獎，與this_win_amount一致。不得因重送再派。');
set('封包契約','C45','player_id、request_id、action、expected_version、payload');
set('封包契約','D45','string/string/string/int/object');
set('封包契約','E45','新動作檢查expected_version；已成功request_id先查原回應。與round_id/state_version一起持久化；作法見WAL-006。');
set('封包契約','H45',eng);
set('封包契約','E47','本機錯誤碼/round_id/state_version依Q-11與WAL規則實作；正式平台透過adapter整合，未宣稱完成。');

set('執行環境','B10',decisions[19][0]);set('執行環境','C10','使用者指定Go；本版工程方案');set('執行環境','D10',eng);
set('執行環境','B11','Go+SQLite本機模擬錢包；WAL-001～008已補型別、請求去重與重啟作法。正式平台仍需adapter，未驗證。');
set('美術風格','C10','開發資產依Q-12：2×輸出、pivot中心、8%安全區、等比fit；正式原版外觀未驗收。');
set('UI圖素','A2','開發版依Q-12採RGBA PNG、tween/序列動畫；Coin24幀24fps。資產manifest需列frame/尺寸/用途。無原版參考圖時不宣稱重現。');
set('黃金圖騰','A2','開發提案：gold_sym.value=[0,250,1000,3000,10000]原始線注單位；第0筆保留。state預設1，從i=1～4找線注達到的最大i後設1+i；非法/非嚴格升冪配置拒絕。詳細配置見Q-07，非原版核定。');
set('聚寶盆金幣','A17','開發作法：表格門檻採顯示信用點；原始total_bet除10000後比較，或將門檻精確轉成整數。只累加可視格Wild，每格每次停輪一次，不影響JP機率。');
set('FG免費旋轉','A2','FG-001～007及封包契約定義流程；次數與取樣另見Q-06開發提案，不是原版正式數學。');
set('FG免費旋轉','B4','開發提案：前三輪起連續≥3輪各有自然Scatter才觸發；3/4/5輪給4/6/8局，不受Wild替代；以server狀態與標記回傳。');
set('FG免費旋轉','C4',proposed);
set('FG免費旋轉','B6','fake_wheels只作視覺；開發提案正式結果可含高分、Wild、Scatter，不含低分；依鎖定state轉換後結算。權重仍需Q-01驗證。');set('FG免費旋轉','C6',proposed);
set('FG免費旋轉','B8','開發提案：FG連續3/4/5輪自然Scatter加2/3/4局，整段授予最多100局；只增加實際獲授次數，remaining>0回PROCESS，總次數不倒退。');set('FG免費旋轉','C8',proposed);
set('FG免費旋轉','B9','total_win_amount統一為同段特殊遊戲鏈累計，含JP→FG之前與FG中已完成JP；不是單純FG自身派彩。');
set('FG免費旋轉','B11','看板使用當時鏈累計total_win_amount；包含先JP後FG及中途JP，不含尚未進行的末局JP。末局JP後再顯示最終鏈總獎。');
set('JP砸金蛋','A2','開發提案：18蛋6欄×3列，index依欄由上到下。state1不觸發；state2直接MINI；state3～5固定板面點選揭露，首次同級3個END、2個預告；10秒自動選。僅能開出解鎖級別，獎金固定倍數模擬見Q-08～10。');

// Keep historical JSON byte-for-byte; correct the declared use and test expectations.
set('測試資料','A2','歷史原始JSON保留不改，Dxx-n對應原序列。可驗部分parser/動畫，不作新server數學或計數正確性的答案。已知異常：D02單位排序/缺欄、D07-1 Wild標Scatter、D07-END總數倒退、JP缺金額、部分累計不自洽。依Q-14另建normalized fixtures，保留來源與修正說明。');
set('驗收案例','A2','案例描述與執行結果分離：本表均未代表測試已通過。Dxx是歷史流程樣本，不當正確結算答案。開發玩法依Q-02～10提案；正式數學與96.8%另驗證。新增normalized fixture需保留獨立預期值及來源。');
set('驗收案例','D10','固定單一symbol的3/4/5連盤面，paytable採獨立fixture；數學配置版本必填。');
set('驗收案例','E10','開發提案：每symbol僅一筆最長連線；不再支付較短子段，win依Q-02。');set('驗收案例','G10','作法已填；待執行');
set('驗收案例','D11','固定每輪自然數/ Wild數；至少涵蓋2×1×1=2 ways與純Wild路徑扣除。');set('驗收案例','E11','普通ways=各輪有效數量乘積；Wild情況扣除純Wild路徑，使用Q-03公式。');set('驗收案例','G11','作法已填；待執行');
set('驗收案例','E14','前提門檻嚴格遞增；線注等於第2門檻且未達第3門檻，state=3；非法配置拒絕。');
set('驗收案例','E16','開發提案：前3輪自然Scatter成立才觸發；缺首輪/中斷不觸發，同輪多顆只算1輪；Wild不替代。');set('驗收案例','G16','開發提案；待執行');
set('驗收案例','D18','依Q-14重建自洽序列；不可直接把D07-7錯誤金額當答案。');
set('驗收案例','D19','normalized fixture：總數4→6後保持6至END；原D07-END=4屬歷史錯誤。');
set('驗收案例','D20','normalized fixture：末局END同時帶盤面，剩餘0、總數含加局且不倒退。');
set('驗收案例','D21','Q-06正式結果允許集合+每state轉換表；fake_wheels另測視覺。');set('驗收案例','G21','作法已填；權重待驗證');
set('驗收案例','D23','新增兩組自洽fixture：中途JP→FG、末局JP；另驗JP→FG累計。');set('驗收案例','E23','看板為特殊遊戲鏈當時總獎；末局未完成JP先不計，JP完成才加入，帳務不重加累計。');
set('驗收案例','D25','開發提案state2觸發JP，server直接END，帶this_win_amount/sg_map6/balance。');set('驗收案例','G25','開發提案；待執行');
set('驗收案例','D26','normalized JP fixture：PROCESS有index/tier/this_win_amount=0/sg_map6=0，固定板面可重啟恢復。');
set('驗收案例','D27','normalized JP第三枚同色END，含最後index/tier、得獎、揭示板、sg_map6與入帳後balance。');
set('驗收案例','D32','新增FG END帶JP的完整序列，含JP END增量與最終鏈累計。');
set('驗收案例','D34','新增原剩1局加2局並觸發JP：PROCESS剩2局、總數+2；JP結束恢復2局。');
set('驗收案例','E43','基準B0為主遊戲SPIN前：最終餘額=B0−total_bet+主遊戲增量獎+所有FG增量獎+各JP獎；每筆只入帳一次，total_win_amount不再入帳。');
set('驗收案例','G43','公式已補；待執行');

// Preserve existing formatting, only expand affected row heights for the added text.
const lastCols={'總覽':'C','狀態圖例':'C','待決事項':'H','規則表':'K','封包契約':'H','執行環境':'D','美術風格':'C','UI圖素':'B','黃金圖騰':'E','聚寶盆金幣':'C','FG免費旋轉':'C','JP砸金蛋':'F','測試資料':'E','驗收案例':'G'};
for(const [name,nums] of rows){
 const s=wb.worksheets.getItem(name);
 for(const r of nums){
  if(r===1||r===3)continue;
  const range=s.getRange(`A${r}:${lastCols[name]}${r}`);
  range.format.wrapText=true;
  range.format.verticalAlignment='top';
  // Estimate based on the existing column width: long decision rows need room.
  let h=42;
  if(name==='待決事項'&&r>=5) h=180;
  else if(name==='規則表'&&r>=5) h=150;
  else if(name==='執行環境')h=110;
  else if(name==='封包契約'&&r>=5)h=85;
  else if(r===2)h=78;
  else h=85;
  range.format.rowHeight=h;
 }
}
wb.recalculate();
console.log((await wb.inspect({kind:'region',sheetId:'待決事項',range:'G12:H20',maxChars:2200,tableMaxRows:9,tableMaxCols:2})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!',options:{useRegex:true,maxResults:20},summary:'final error scan'})).ndjson);
for(const [name,range,label] of [
 ['待決事項','A3:H7','decisions-math'],['待決事項','A12:H15','decisions-jp'],['待決事項','A17:H20','decisions-engineering'],
 ['規則表','H47:K53','rules-wallet'],['驗收案例','C41:G45','tests-wallet'],['總覽','A7:C10','overview']
]){
 const b=await wb.render({sheetName:name,range,scale:1,format:'png'});
 await fs.writeFile(path.join(out,`${label}.png`),new Uint8Array(await b.arrayBuffer()));
}
await fs.writeFile(path.join(out,'changes.json'),JSON.stringify(changes,null,2));
const output=path.join(out,'GoldenHen_AI規格書_作法補齊.xlsx');
await (await SpreadsheetFile.exportXlsx(wb)).save(output);
console.log(JSON.stringify({output,changedCells:changes.length,changedSheets:rows.size}));
