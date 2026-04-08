// 1. Firebase 連線設定 (已替換為你的金鑰)
const firebaseConfig = {
    apiKey: "AIzaSyAmVwq-Wny1KMRGNSdOnBEJ_A-3HmTO-hM",
    authDomain: "store-schedule-3b056.firebaseapp.com",
    projectId: "store-schedule-3b056",
    storageBucket: "store-schedule-3b056.firebasestorage.app",
    messagingSenderId: "296522693619",
    appId: "1:296522693619:web:f90ec5d666c7a4a5943086"
};

// 如果還沒初始化過，就初始化 Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
window.db = firebase.firestore();
window.db.settings({ experimentalForceLongPolling: true });

// 2. 全域共用變數
let appConfig = { stores: [], shifts: ["排休", "指休"], shiftHours: {} };
let appData = { employees: [], records: [], allStoresRecords: [], allStoresEmployees: {}, currentWeekLogs: [] };
const dayNames = ['週一','週二','週三','週四','週五','週六','週日'];

// 3. 共用工具函式：取得下週字串
function getNextWeekString() {
    let d = new Date(); d.setDate(d.getDate() + 7);
    let yr = d.getFullYear(); let first = new Date(yr, 0, 1);
    let w = Math.ceil((((d - first) / 86400000) + first.getDay() + 1) / 7);
    return `${yr}-W${w < 10 ? '0'+w : w}`;
}

// 4. 共用工具函式：取得該週所有日期
function getWeekDates(wStr) {
    let p = wStr.split('-W'); let yr = parseInt(p[0]); let wk = parseInt(p[1]);
    let d = new Date(yr, 0, 1); let day = d.getDay();
    d.setDate(d.getDate() + (wk - 1) * 7);
    let offset = day <= 4 ? 1 - day : 8 - day;
    d.setDate(d.getDate() + offset);
    let res = [];
    for(let i=0; i<7; i++) { res.push((d.getMonth()+1)+'/'+d.getDate()); d.setDate(d.getDate()+1); }
    return res;
}
