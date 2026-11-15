# 怪物彈珠 Wordle

純前端網站：HTML + CSS + JavaScript + JSON，可直接部署至 GitHub Pages。

## 已實作功能
- 每日挑戰、無限模式
- 每局最多 8 次猜測
- 七項角色比對：屬性、種族、戰型、擊種類型、稀有度、推出年份、獲取方式
- 同一角色以單一 ID 計算；不同型態不會成為不同答案
- 每日進度使用 localStorage 保存（限同一瀏覽器）
- 不顯示角色圖片、不含管理介面、不使用資料庫或後端

## 比對規則
- 屬性、戰型、稀有度、獲取方式：相同綠色，不同灰色
- 種族：完全相同綠色、部分重疊黃色、沒有重疊灰色
- 擊種類型：完全相同綠色；反射/貫通基礎類型相同但聚能狀態不同為黃色；反射與貫通不同為灰色
- 推出年份：相同綠色；猜測角色年份早於答案顯示 ↑，晚於答案顯示 ↓

## 角色資料
編輯 `data/monsters.json`，每筆資料需包含：
- `id`：唯一識別碼
- `name`：角色名稱
- `aliases`：搜尋別名陣列
- `attribute`：火、水、木、光、闇
- `race`：種族陣列
- `class`：平衡型、力量型、速度型、砲擊型
- `hitType`：反射、反射聚能、貫通、貫通聚能
- `rarity`：正整數
- `releaseYear`：台版最初推出年份，只填整數
- `obtainMethod`：限定角色、普通角色、掉落角色
- `active`：`true` 納入遊戲角色池；`false` 不納入
- `isDemo`：示範資料標記，不影響遊戲邏輯

內附少量虛構示範資料，均為 `isDemo: true`，請勿當成真實角色資料。正式公開前請自行替換並核對台版資料。所有正式角色資料都要符合上述欄位與允許值。

## 本機測試
在專案根目錄執行：
`python -m http.server 8000`
瀏覽 `http://localhost:8000`。
不要直接用 `file://` 開啟，因為網站會使用 ES Modules 和 fetch 讀取 JSON。

## GitHub Pages 部署
1. 在 GitHub 建立新的 Repository。
2. 解壓縮 ZIP，將 `monster-strike-wordle` 資料夾內的所有檔案與資料夾上傳到 Repository 根目錄（不要只上傳外層資料夾）。
3. 確認 `index.html` 位於 Repository 根目錄。
4. 進入 Repository 的 Settings → Pages。
5. 在 Build and deployment 的 Source 選 `Deploy from a branch`。
6. Branch 選 `main`，資料夾選 `/(root)`，按 Save。
7. 等待部署完成，在 Pages 頁面按 Visit site 開啟網站。

## 注意事項
- GitHub Pages 是靜態網站託管，角色 JSON 與每日答案可被訪客透過瀏覽器檢視，無法防止查看答案。
- localStorage 不會跨瀏覽器或跨裝置同步。
- 若未來需要排行榜、帳號或雲端同步，再評估後端與資料庫。
