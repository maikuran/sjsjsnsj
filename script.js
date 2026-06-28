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
        {name:"砂時計",base:1,count:0},
        {name:"時計",base:5,count:0},
        {name:"振り子",base:20,count:0},
        {name:"塔時計",base:100,count:0},
        {name:"時計職人",base:500,count:0},
        {name:"時間研究所",base:2500,count:0},
        {name:"時空機関",base:10000,count:0},
        {name:"タイムマシン",base:50000,count:0},
        {name:"時間工場",base:250000,count:0},
        {name:"時間都市",base:1000000,count:0},
        {name:"時間惑星",base:5000000,count:0},
        {name:"時間銀河",base:25000000,count:0},
        {name:"宇宙時計",base:100000000,count:0},
        {name:"時間神殿",base:500000000,count:0},
        {name:"時空神",base:2500000000,count:0},
        {name:"永遠",base:10000000000,count:0},
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
        tps+=item.base*item.count;
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

        let cost=Math.floor(item.base*Math.pow(1.15,item.count));

        div.innerHTML=
        "<b>"+item.name+"</b><br>"+
        "Lv:"+item.count+"<br>"+
        "+"+item.base+"/秒<br>"+
        "Cost:"+formatTime(cost);

        div.onclick=()=>{

            if(game.time>=cost){

                game.time-=cost;

                item.count++;

                updateUI();

            }

        };

    });

}

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

function load(){

    let s=localStorage.getItem("clockclicker");

    if(!s)return;

    Object.assign(game,JSON.parse(s));

    updateUI();

}

document.getElementById("saveBtn").onclick=save;

document.getElementById("loadBtn").onclick=load;

document.getElementById("exportBtn").onclick=()=>{

    prompt(
        "コピーしてください",
        btoa(JSON.stringify(game))
    );

};

document.getElementById("importBtn").onclick=()=>{

    let s=prompt("貼り付け");

    if(!s)return;

    Object.assign(game,JSON.parse(atob(s)));

    updateUI();

};

document.getElementById("resetBtn").onclick=()=>{

    if(confirm("削除しますか？")){

        localStorage.removeItem("clockclicker");

        location.reload();

    }

};

load();

updateUI();
        background:#8e44ad;
}

.upgrade:hover{
    background:#732d91;
}

#prestigeButton{
    background:#ff9800;
    font-weight:bold;
}

#prestigeButton:hover{
    background:#fb8c00;
}

#prestigeInfo p{
    margin-bottom:12px;
}

#itemList{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:10px;
}

.item{
    background:#333;
    border:2px solid #555;
    border-radius:10px;
    padding:10px;
    min-height:110px;
    cursor:pointer;
    transition:.2s;
    font-size:14px;
}

.item:hover{
    background:#404040;
    border-color:#7CFFB2;
    transform:translateY(-2px);
}

.item b{
    color:#ffd54f;
}

footer{
    margin-top:30px;
    padding:15px;
    text-align:center;
    color:#999;
    border-top:2px solid #333;
}

/* スクロールバー */

::-webkit-scrollbar{
    width:10px;
}

::-webkit-scrollbar-track{
    background:#222;
}

::-webkit-scrollbar-thumb{
    background:#555;
    border-radius:6px;
}

::-webkit-scrollbar-thumb:hover{
    background:#777;
}

/* スマホ対応 */

@media(max-width:1000px){

    #game{
        grid-template-columns:1fr;
    }

    #left,
    #center,
    #right{
        width:100%;
    }

    #timeDisplay{
        font-size:26px;
    }

    #clockButton{
        height:60px;
        font-size:20px;
    }

    #itemList{
        grid-template-columns:1fr;
    }

}

