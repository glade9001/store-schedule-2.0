/**
 * 門市排班神器 2.0 - 全域共用設定檔
 * 包含：Firebase 初始化、全域變數、共用工具函式
 */

// 1. Firebase 連線設定 (請務必替換為你專屬的金鑰)
const firebaseConfig = {
    apiKey: "你的_API_KEY",
    authDomain: "你的_PROJECT_ID.firebaseapp.com",
    projectId: "你的_PROJECT_ID",
    storageBucket: "你的_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "你的_SENDER_ID",
    appId: "你的_APP_ID"
};

// 初始化 Firebase (防止重複初始化)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 定義資料庫引用與設定
window.db = firebase.firestore();
window.db.settings({ experimentalForceLongPolling: true });

// 2. 全域共用變數
// 儲存從資料庫抓下來的設定與排班資料，讓 index.html 與 schedule.html 都能存取
window.appConfig = { 
    stores: [], 
    shifts: ["排休", "指休"], 
    shiftHours: { "排休": 0, "指休": 0 } 
};

window.appData = { 
    employees: [],      // 當前門市員工名單
    records: [],        // 當前週次的排班紀錄
    allStoresRecords: [] // 所有門市的排班紀錄 (用於跨店支援比對)
};

// 標準週日期名稱
window.dayNames = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

// 3. 共用工具函式庫

/**
 * 取得「下週」的年份與週數格式 (例如: 2024-W12)
 * 用途：系統預設顯示下一週的班表
 */
window.getNextWeekString = function() {
    let d = new Date();
    d.setDate(d.getDate() + 7);
    let yr = d.getFullYear();
    let first = new Date(yr, 0, 1);
    let w = Math.ceil((((d - first) / 86400000) + first.getDay() + 1) / 7);
    return `${yr}-W${w < 10 ? '0' + w : w}`;
};

/**
 * 根據週數字串 (2024-W12) 換算出該週「週一到週日」的實際日期
 * 返回範例：["3/18", "3/19", "3/20", "3/21", "3/22", "3/23", "3/24"]
 */
window.getWeekDates = function(wStr) {
    if (!wStr) return [];
    let p = wStr.split('-W');
    let yr = parseInt(p[0]);
    let wk = parseInt(p[1]);
    let d = new Date(yr, 0, 1);
    let day = d.getDay();
    d.setDate(d.getDate() + (wk - 1) * 7);
    // 調整到週一
    let offset = day <= 4 ? 1 - day : 8 - day;
    d.setDate(d.getDate() + offset);
    
    let res = [];
    for (let i = 0; i < 7; i++) {
        res.push((d.getMonth() + 1) + '/' + d.getDate());
        d.setDate(d.getDate() + 1);
    }
    return res;
};

/**
 * 共用 Loading 訊息
 */
window.showLoading = function(text) {
    const loader = document.getElementById('loadingOverlay');
    const label = document.getElementById('loadingText');
    if (loader && label) {
        label.innerText = text;
        loader.style.display = 'flex';
    }
};

window.hideLoading = function() {
    const loader = document.getElementById('loadingOverlay');
    if (loader) loader.style.display = 'none';
};

/**
 * 共用 Modal 關閉功能
 */
window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
};

console.log("✅ config.js 載入成功，Firebase 準備就緒。");
