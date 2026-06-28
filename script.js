// ==========================
// Clock Clicker
// ==========================

const game = {
    time: 0,
    totalEarned: 0,
    clicks: 0,
    clickPower: 1,
    tps: 0,
    prestige: 0,
    energy: 0,

    upgrades: [
        {level:0,cost:20},
        {level:0,cost:100},
        {level:0,cost:500}
    ],

    items:[
        {name:"砂時計",generate:1,price:5,count:0},
        {name:"時計",generate:2,price:45,count:0},
        {name:"振り子",generate:9,price:380,count:0},
        {name:"塔時計",generate:44,price:2000,count:0},
        {name:"時計職人",generate:200,price:9500,count:0},
        {name:"時間研究所",generate:950,price:65000,count:0},
        {name:"時空機関",generate:6600,price:306600,count:0},
        {name:"タイムマシン",generate:20000,price:1220000,count:0},
        {name:"時間工場",generate:90000,price:10090000,count:0},
        {name:"時間都市",generate:340000,price:77340000,count:0},
        {name:"時間惑星",generate:1100000,price:211200000,count:0},
        {name:"時間銀河",generate:45000000,price:1945000000,count:0},
        {name:"宇宙時計",generate:100000000,price:32100000000,count:0},
        {name:"時間神殿",generate:390000000,price:232100000000,count:0},
        {name:"時空神",generate:900000000,price:152100000000,count:0},
        {name:"永遠",generate:11000000000,price:9652100000000,count:0},
    ]
};

//============================

const SECOND=1;
const MINUTE=60;
const HOUR=3600;
const DAY=86400;
const YEAR=31536000;
const HYEAR=YEAR*100;
const KYEAR=YEAR*1000;
const MYEAR=YEAR*10000;
const GA=YEAR*1000000000;

//============================

function formatTime(sec){

    sec=Math.floor(sec);

    let g=Math.floor(sec/GA);
    sec%=GA;

    let ma=Math.floor(sec/MYEAR);
    sec%=MYEAR;

    let ky=Math.floor(sec/KYEAR);
    sec%=KYEAR;

    let hy=Math.floor(sec/HYEAR);
    sec%=HYEAR;

    let a=Math.floor(sec/YEAR);
    sec%=YEAR;

    let d=Math.floor(sec/DAY);
    sec%=DAY;

    let h=Math.floor(sec/HOUR);
    sec%=HOUR;

    let m=Math.floor(sec/MINUTE);
    sec%=MINUTE;

    let s=sec;

    let text="";

    if(g) text+=g+"ga ";
    if(ma) text+=ma+"ma ";
    if(ky) text+=ky+"kya ";
    if(hy) text+=hy+"hya ";
    if(a) text+=a+"a ";
    if(d) text+=d+"d ";
    if(h) text+=h+"h ";
    if(m) text+=m+"m ";
    text+=s+"s";

    return text;

}

//============================

function updateTPS(){

    let tps=0;

    game.items.forEach(item=>{
        tps+=item.generate*item.count;
    });

    tps*=1+game.upgrades[1].level*0.5;

    game.tps=tps;

}

//============================

function updateUI(){

    updateTPS();

    document.getElementById("timeDisplay").textContent=
        formatTime(game.time);

    document.getElementById("perSecond").textContent=
        "+"+game.tps.toFixed(1)+" / 秒";

    document.getElementById("statClicks").textContent=
        game.clicks;

    document.getElementById("statEarned").textContent=
        formatTime(game.totalEarned);

    document.getElementById("statTPS").textContent=
        game.tps.toFixed(1);

    document.getElementById("statPrestige").textContent=
        game.prestige;

    let gain=Math.floor(Math.sqrt(game.totalEarned/1000000));

    document.getElementById("prestigeGain").textContent=
        "獲得:"+gain;

    game.items.forEach((item,i)=>{
    let div=document.getElementById("item"+i);
    
    div.onclick=()=>{
        let cost=Math.floor(item.price*Math.pow(1.15,item.count));  // ← クリック時に計算
        
        div.innerHTML=
        "<b>"+item.name+"</b><br>"+
        "Lv:"+item.count+"<br>"+
        "+"+item.generate+"/秒<br>"+
        "Cost:"+formatTime(cost);

        if(game.time>=cost){
            game.time-=cost;
            item.count++;
            updateUI();
        }
    };
});

//============================

document.getElementById("clockButton").onclick=()=>{

    let gain=game.clickPower;

    gain*=1+game.upgrades[0].level;

    gain*=1+game.energy*0.1;

    game.time+=gain;

    game.totalEarned+=gain;

    game.clicks++;

    updateUI();

};

//============================

document.getElementById("upgrade1").onclick=()=>{

    let u=game.upgrades[0];

    let cost=20*(u.level+1);

    if(game.time>=cost){

        game.time-=cost;

        u.level++;

        updateUI();

    }

};

document.getElementById("upgrade2").onclick=()=>{

    let u=game.upgrades[1];

    let cost=100*(u.level+1);

    if(game.time>=cost){

        game.time-=cost;

        u.level++;

        updateUI();

    }

};

document.getElementById("upgrade3").onclick=()=>{

    let u=game.upgrades[2];

    let cost=500*(u.level+1);

    if(game.time>=cost){

        game.time-=cost;

        u.level++;

        game.clickPower++;

        updateUI();

    }

};

//============================

document.getElementById("prestigeButton").onclick=()=>{

    let gain=Math.floor(Math.sqrt(game.totalEarned/1000000));

    if(gain<=0)return;

    game.energy+=gain;

    game.prestige++;

    game.time=0;
    game.totalEarned=0;
    game.clicks=0;
    game.clickPower=1;

    game.upgrades.forEach(u=>u.level=0);

    game.items.forEach(i=>i.count=0);

    updateUI();

};

//============================

setInterval(()=>{

    game.time+=game.tps;

    game.totalEarned+=game.tps;

    updateUI();

},1000);

//============================

function save(){

    localStorage.setItem(
        "clockclicker",
        JSON.stringify(game)
    );

}



document.getElementById("saveBtn").onclick=save;

document.getElementById("loadBtn").onclick=load;

document.getElementById("exportBtn").onclick=()=>{

    prompt(
        "コピーしてください",
        btoa(JSON.stringify(game))
    );

};




document.getElementById("resetBtn").onclick=()=>{

    if(confirm("削除しますか？")){

        localStorage.removeItem("clockclicker");

        location.reload();

    }

};

load();

updateUI();


// セーブデータ互換化ヘルパー
function normalizeGameData(data){
    if(!data) return data;

    // 数値化するトップレベルキー
    ["time","totalEarned","clicks","clickPower","tps","prestige","energy"].forEach(k=>{
        if(data[k] !== undefined) data[k] = Number(data[k]);
    });

    // items を整形（古い base を price/generate に移す）
    if(Array.isArray(data.items)){
        data.items = data.items.map((it, idx) => {
            it = it || {};
            // 優先順: generate, price, base, 既存 game 配列の値
            const baseVal = it.base ?? it.price ?? it.generate ?? (game.items[idx] && (game.items[idx].generate ?? game.items[idx].price)) ?? 0;
            const generate = Number(it.generate ?? it.base ?? it.price ?? baseVal);
            const price = Number(it.price ?? it.base ?? it.generate ?? baseVal);
            const count = Number(it.count ?? 0);
            return {
                name: it.name ?? (game.items[idx] && game.items[idx].name) ?? ("item"+idx),
                generate: isFinite(generate) ? generate : 0,
                price: isFinite(price) ? price : 0,
                count: isFinite(count) ? count : 0
            };
        });
    }

    // upgrades の数値化（安全策）
    if(Array.isArray(data.upgrades)){
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

// load() の置き換え
function load(){
    let s = localStorage.getItem("clockclicker");
    if(!s) return;

    try {
        const parsed = JSON.parse(s);
        const norm = normalizeGameData(parsed);
        // top-level を上書き（安全のため items/upgrades は norm があれば置換）
        Object.assign(game, norm);
        if(norm.items) game.items = norm.items;
        if(norm.upgrades) game.upgrades = norm.upgrades;
        updateUI();
    } catch(e){
        console.error("load failed:", e);
    }
}

// import ボタンハンドラの置き換え
document.getElementById("importBtn").onclick = ()=>{
    let s = prompt("貼り付け");
    if(!s) return;
    try{
        const parsed = JSON.parse(atob(s));
        const norm = normalizeGameData(parsed);
        Object.assign(game, norm);
        if(norm.items) game.items = norm.items;
        if(norm.upgrades) game.upgrades = norm.upgrades;
        updateUI();
    }catch(e){
        console.error("import failed:", e);
        alert("読み込みに失敗しました。入力が正しいか確認してください。");
    }
};  
