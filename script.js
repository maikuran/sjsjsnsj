// ==========================
// Clock Clicker - ゲームロジック
// ==========================

const game = {
    // ゲーム進行状況
    time: 0,
    totalEarned: 0,
    clicks: 0,
    clickPower: 1,
    tps: 0,
    prestige: 0,
    energy: 0,
    lastSessionTime: Date.now(), // オフラインボーナス用

    // アップグレード
    upgrades: [
        { level: 0, cost: 20 },
        { level: 0, cost: 100 },
        { level: 0, cost: 500 }
    ],

    // 購入可能アイテム一覧
    items: [
        { name: "砂時計", generate: 1, price: 5, count: 0 },
        { name: "時計", generate: 2, price: 45, count: 0 },
        { name: "振り子", generate: 9, price: 380, count: 0 },
        { name: "塔時計", generate: 44, price: 2000, count: 0 },
        { name: "時計職人", generate: 200, price: 9500, count: 0 },
        { name: "時間研究所", generate: 950, price: 65000, count: 0 },
        { name: "時空機関", generate: 6600, price: 306600, count: 0 },
        { name: "タイムマシン", generate: 20000, price: 1220000, count: 0 },
        { name: "時間工場", generate: 90000, price: 10090000, count: 0 },
        { name: "時間都市", generate: 340000, price: 77340000, count: 0 },
        { name: "時間惑星", generate: 1100000, price: 211200000, count: 0 },
        { name: "時間銀河", generate: 45000000, price: 1945000000, count: 0 },
        { name: "宇宙時計", generate: 100000000, price: 32100000000, count: 0 },
        { name: "時間神殿", generate: 390000000, price: 232100000000, count: 0 },
        { name: "時空神", generate: 900000000, price: 152100000000, count: 0 },
        { name: "永遠", generate: 11000000000, price: 9652100000000, count: 0 }
    ]
};

// ==========================
// 時間単位の定義
// ==========================

const SECOND = 1;
const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const YEAR = 31536000;
const HYEAR = YEAR * 100;
const KYEAR = YEAR * 1000;
const MYEAR = YEAR * 10000;
const GA = YEAR * 1000000000;

// ==========================
// ユーティリティ関数
// ==========================

/**
 * 秒単位の時間を人間が読める形式にフォーマット
 * @param {number} sec - 秒数
 * @returns {string} フォーマット済み時間文字列
 */
function formatTime(sec) {
    sec = Math.floor(sec);

    const g = Math.floor(sec / GA);
    sec %= GA;

    const ma = Math.floor(sec / MYEAR);
    sec %= MYEAR;

    const ky = Math.floor(sec / KYEAR);
    sec %= KYEAR;

    const hy = Math.floor(sec / HYEAR);
    sec %= HYEAR;

    const a = Math.floor(sec / YEAR);
    sec %= YEAR;

    const d = Math.floor(sec / DAY);
    sec %= DAY;

    const h = Math.floor(sec / HOUR);
    sec %= HOUR;

    const m = Math.floor(sec / MINUTE);
    sec %= MINUTE;

    const s = sec;

    let text = "";

    if (g) text += g + "ga ";
    if (ma) text += ma + "ma ";
    if (ky) text += ky + "kya ";
    if (hy) text += hy + "hya ";
    if (a) text += a + "a ";
    if (d) text += d + "d ";
    if (h) text += h + "h ";
    if (m) text += m + "m ";
    text += s + "s";

    return text;
}

/**
 * TPS（毎秒獲得量）を計算して更新
 */
function updateTPS() {
    let tps = 0;

    game.items.forEach(item => {
        tps += item.generate * item.count;
    });

    // アップグレード2の効果を適用（50%ずつ増加）
    tps *= 1 + game.upgrades[1].level * 0.5;

    game.tps = tps;
}

/**
 * オフラインボーナスを計算・適用
 */
function applyOfflineBonus() {
    const now = Date.now();
    const offlineSeconds = (now - game.lastSessionTime) / 1000;

    // 最大12時間分のボーナスをキャップ
    const maxOfflineSeconds = 12 * 3600;
    const bonusSeconds = Math.min(offlineSeconds, maxOfflineSeconds);

    if (bonusSeconds > 60) { // 1分以上のオフラインで適用
        const bonusTime = game.tps * bonusSeconds;
        game.time += bonusTime;
        game.totalEarned += bonusTime;

        // オフラインボーナス表示
        const bonusFormatted = formatTime(bonusTime);
        const offlineFormatted = formatTime(bonusSeconds);
        alert(`オフラインボーナス!\n${offlineFormatted}の間に\n+${bonusFormatted}を獲得しました！`);

        console.log(`Offline bonus: +${bonusFormatted} (${offlineFormatted} offline)`);
    }

    game.lastSessionTime = now;
}

/**
 * UIを更新（各種数値表示とアイテムボタン）
 */
function updateUI() {
    updateTPS();

    // 時間表示
    document.getElementById("timeDisplay").textContent = formatTime(game.time);

    // 毎秒獲得量表示
    document.getElementById("perSecond").textContent =
        "+" + game.tps.toFixed(1) + " / 秒";

    // 統計情報の表示
    document.getElementById("statClicks").textContent = game.clicks;
    document.getElementById("statEarned").textContent = formatTime(game.totalEarned);
    document.getElementById("statTPS").textContent = game.tps.toFixed(1);
    document.getElementById("statPrestige").textContent = game.prestige;

    // プレステージゲイン計算
    const gain = Math.floor(Math.sqrt(game.totalEarned / 1000000));
    document.getElementById("prestigeGain").textContent = "獲得:" + gain;

    // アイテムボタンの更新
    game.items.forEach((item, i) => {
        const div = document.getElementById("item" + i);

        // ボタンの表示内容を常に更新
        const cost = Math.floor(item.price * Math.pow(1.15, item.count));
        div.innerHTML =
            "<b>" + item.name + "</b><br>" +
            "Lv:" + item.count + "<br>" +
            "+" + item.generate + "/秒<br>" +
            "Cost:" + formatTime(cost);

        // クリックイベントの設定（最初1回だけでOK）
        if (!div.onclick) {
            div.onclick = () => {
                const cost = Math.floor(item.price * Math.pow(1.15, item.count));

                if (game.time >= cost) {
                    game.time -= cost;
                    item.count++;
                    updateUI();
                }
            };
        }
    });
}

// ==========================
// ゲームイベント: ボタンクリック処理
// ==========================

/**
 * メインボタン: クリック時の処理
 */
document.getElementById("clockButton").onclick = () => {
    let gain = game.clickPower;

    // アップグレード1の効果を適用
    gain *= 1 + game.upgrades[0].level;

    // エネルギー効果を適用
    gain *= 1 + game.energy * 0.1;

    game.time += gain;
    game.totalEarned += gain;
    game.clicks++;

    updateUI();
};

/**
 * アップグレード1: クリック力を上げる
 */
document.getElementById("upgrade1").onclick = () => {
    const u = game.upgrades[0];
    const cost = 20 * (u.level + 1);

    if (game.time >= cost) {
        game.time -= cost;
        u.level++;
        updateUI();
    }
};

/**
 * アップグレード2: TPS倍率を上げる
 */
document.getElementById("upgrade2").onclick = () => {
    const u = game.upgrades[1];
    const cost = 100 * (u.level + 1);

    if (game.time >= cost) {
        game.time -= cost;
        u.level++;
        updateUI();
    }
};

/**
 * アップグレード3: クリック力と最大パワーを上げる
 */
document.getElementById("upgrade3").onclick = () => {
    const u = game.upgrades[2];
    const cost = 500 * (u.level + 1);

    if (game.time >= cost) {
        game.time -= cost;
        u.level++;
        game.clickPower++;
        updateUI();
    }
};

/**
 * プレステージボタン: ゲームをリセットしてエネルギーを獲得
 */
document.getElementById("prestigeButton").onclick = () => {
    const gain = Math.floor(Math.sqrt(game.totalEarned / 1000000));

    if (gain <= 0) return;

    game.energy += gain;
    game.prestige++;

    // ゲームをリセット
    game.time = 0;
    game.totalEarned = 0;
    game.clicks = 0;
    game.clickPower = 1;

    game.upgrades.forEach(u => u.level = 0);
    game.items.forEach(i => i.count = 0);

    updateUI();
};

// ==========================
// ゲームループ: 毎秒の自動獲得
// ==========================

setInterval(() => {
    game.time += game.tps;
    game.totalEarned += game.tps;
    updateUI();
}, 1000);

// ==========================
// セーブ・ロード機能
// ==========================

/**
 * ゲームデータをLocalStorageに保存
 */
function save() {
    game.lastSessionTime = Date.now();
    localStorage.setItem("clockclicker", JSON.stringify(game));
}

/**
 * ゲームデータを正規化（互換性対応）
 * @param {object} data - ロードされたゲームデータ
 * @returns {object} 正規化されたゲームデータ
 */
function normalizeGameData(data) {
    if (!data) return data;

    // トップレベルキーを数値化
    ["time", "totalEarned", "clicks", "clickPower", "tps", "prestige", "energy", "lastSessionTime"].forEach(k => {
        if (data[k] !== undefined) data[k] = Number(data[k]);
    });

    // lastSessionTimeが無い場合は現在時刻を設定
    if (!data.lastSessionTime) {
        data.lastSessionTime = Date.now();
    }

    // itemsを整形（古いbaseフォーマットとの互換性対応）
    if (Array.isArray(data.items)) {
        data.items = data.items.map((it, idx) => {
            it = it || {};
            // 優先順: generate, price, base, 既存 game 配列の値
            const baseVal = it.base ?? it.price ?? it.generate ?? (game.items[idx] && (game.items[idx].generate ?? game.items[idx].price)) ?? 0;
            const generate = Number(it.generate ?? it.base ?? it.price ?? baseVal);
            const price = Number(it.price ?? it.base ?? it.generate ?? baseVal);
            const count = Number(it.count ?? 0);
            return {
                name: it.name ?? (game.items[idx] && game.items[idx].name) ?? ("item" + idx),
                generate: isFinite(generate) ? generate : 0,
                price: isFinite(price) ? price : 0,
                count: isFinite(count) ? count : 0
            };
        });
    }

    // upgradesの数値化（安全策）
    if (Array.isArray(data.upgrades)) {
        data.upgrades = data.upgrades.map((u, idx) => {
            u = u || {};
            return {
                level: Number(u.level ?? 0),
                cost: Number(u.cost ?? (game.upgrades[idx] && game.upgrades[idx].cost) ?? 0)
            };
        });
    }

    return data;
}

/**
 * LocalStorageからゲームデータをロード
 */
function load() {
    const s = localStorage.getItem("clockclicker");
    if (!s) return;

    try {
        const parsed = JSON.parse(s);
        const norm = normalizeGameData(parsed);
        // トップレベルを上書き
        Object.assign(game, norm);
        if (norm.items) game.items = norm.items;
        if (norm.upgrades) game.upgrades = norm.upgrades;
        
        // オフラインボーナスを適用
        applyOfflineBonus();
        
        updateUI();
    } catch (e) {
        console.error("load failed:", e);
    }
}

// ==========================
// UI: セーブ・ロード・インポート・リセットボタン
// ==========================

document.getElementById("saveBtn").onclick = save;
document.getElementById("loadBtn").onclick = load;

/**
 * エクスポート: Base64でセーブデータをテキスト化
 */
document.getElementById("exportBtn").onclick = () => {
    game.lastSessionTime = Date.now();
    prompt("コピーしてください", btoa(JSON.stringify(game)));
};

/**
 * インポート: Base64テキストからゲームデータを復元
 */
document.getElementById("importBtn").onclick = () => {
    const s = prompt("貼り付け");
    if (!s) return;
    try {
        const parsed = JSON.parse(atob(s));
        const norm = normalizeGameData(parsed);
        Object.assign(game, norm);
        if (norm.items) game.items = norm.items;
        if (norm.upgrades) game.upgrades = norm.upgrades;
        
        // インポート時もオフラインボーナスを適用
        applyOfflineBonus();
        
        updateUI();
    } catch (e) {
        console.error("import failed:", e);
        alert("読み込みに失敗しました。入力が正しいか確認してください。");
    }
};

/**
 * リセット: ゲームを完全にリセットしてLocalStorageをクリア
 */
document.getElementById("resetBtn").onclick = () => {
    if (confirm("削除しますか？")) {
        localStorage.removeItem("clockclicker");
        location.reload();
    }
};

// ==========================
// 初期化
// ==========================

load();
updateUI();
