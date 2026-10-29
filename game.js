const majorCards = [
 {id:"chariot",name:"戦車",roman:"VII",symbol:"♜",type:"大アルカナ",cost:2,atk:4,hp:4,meaning:"意志・前進・勝利",desc:"意志を持って前進する象徴。ゲームでは攻撃的なユニットとして表現。",kind:"unit"},
 {id:"empress",name:"女帝",roman:"III",symbol:"♛",type:"大アルカナ",cost:3,atk:2,hp:7,meaning:"豊穣・成長・養育",desc:"豊かさや成長の象徴。ゲームでは耐久力に優れたユニットとして表現。",kind:"unit"},
 {id:"hermit",name:"隠者",roman:"IX",symbol:"☼",type:"大アルカナ",cost:2,atk:2,hp:5,meaning:"内省・探求・導き",desc:"静かな探求と内省の象徴。ゲームではカードを引く能力を持つユニットとして表現。",kind:"unit",effect:"draw"}
];
const minorCards = [
 {id:"wand",name:"ワンドのエース",symbol:"♨",type:"小アルカナ・ワンド",cost:1,meaning:"創造力・始まり",desc:"火の元素と結びつけられることが多く、創造力や新しい始まりを表す。",kind:"spell",effect:"boost"},
 {id:"wand2",name:"ワンドの2",symbol:"♨",type:"小アルカナ・ワンド",cost:1,meaning:"計画・展望",desc:"先を見据えて計画するイメージ。ゲームでは次の攻撃を支援する。",kind:"spell",effect:"boost"},
 {id:"cup",name:"カップのエース",symbol:"♧",type:"小アルカナ・カップ",cost:1,meaning:"感情・受容・始まり",desc:"水の元素と結びつけられることが多く、感情や心の開放を表す。",kind:"spell",effect:"heal"},
 {id:"cup2",name:"カップの2",symbol:"♧",type:"小アルカナ・カップ",cost:2,meaning:"結びつき・相互理解",desc:"関係性や協力のイメージ。ゲームでは味方の耐久力を回復する。",kind:"spell",effect:"heal"},
 {id:"sword",name:"ソードのエース",symbol:"⚔",type:"小アルカナ・ソード",cost:1,meaning:"明晰さ・決断",desc:"風の元素と結びつけられることが多く、思考や決断を表す。",kind:"spell",effect:"damage"},
 {id:"sword2",name:"ソードの2",symbol:"⚔",type:"小アルカナ・ソード",cost:2,meaning:"迷い・均衡",desc:"二つの選択肢の間で均衡を保つイメージ。ゲームではCPUにダメージを与える。",kind:"spell",effect:"damage"},
 {id:"pentacle",name:"ペンタクルのエース",symbol:"✧",type:"小アルカナ・ペンタクル",cost:1,meaning:"現実的な機会・資源",desc:"地の元素と結びつけられることが多く、具体的な機会や資源を表す。",kind:"spell",effect:"resource"},
 {id:"pentacle2",name:"ペンタクルの2",symbol:"✧",type:"小アルカナ・ペンタクル",cost:2,meaning:"調整・柔軟性",desc:"複数の事柄を調整するイメージ。ゲームでは資源を増やす。",kind:"spell",effect:"resource"},
 {id:"wand3",name:"ワンドの3",symbol:"♨",type:"小アルカナ・ワンド",cost:2,meaning:"展開・前進",desc:"計画が広がり、先へ進むイメージ。味方を強化する。",kind:"spell",effect:"boost"},
 {id:"cup3",name:"カップの3",symbol:"♧",type:"小アルカナ・カップ",cost:2,meaning:"祝福・仲間との喜び",desc:"共有する喜びや協力のイメージ。プレイヤーを回復する。",kind:"spell",effect:"heal"},
 {id:"sword3",name:"ソードの3",symbol:"⚔",type:"小アルカナ・ソード",cost:2,meaning:"悲しみ・痛みの認識",desc:"心の痛みを表すカードとして知られる。ゲームでは直接ダメージを与える。",kind:"spell",effect:"damage"},
 {id:"pentacle3",name:"ペンタクルの3",symbol:"✧",type:"小アルカナ・ペンタクル",cost:2,meaning:"協力・技術・共同作業",desc:"技術を持ち寄る協力のイメージ。資源を増やす。",kind:"spell",effect:"resource"}
];
let state;
const $ = id => document.getElementById(id);
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function log(text){const p=document.createElement("p");p.textContent=text;$("log").prepend(p)}
function init(){
 state={playerHp:20,cpuHp:20,mana:1,maxMana:1,turn:1,hand:[],playerBoard:[],cpuBoard:[],selected:null,selectedBoard:null,over:false,deck:shuffle([...majorCards,...minorCards])};
 $("log").innerHTML="";
 draw(5); render(); log("対戦開始。カードを選択して行動しよう。");
}
function draw(n=1){for(let i=0;i<n;i++){if(state.deck.length)state.hand.push(state.deck.pop())}}
function cardHtml(c,area,index){
 const isUnit=c.kind==="unit";
 return `<button class="card ${isUnit?"major":""} ${state.selected===c.id&&state.selectedBoard===area?"selected":""}" data-area="${area}" data-index="${index}">
 <span class="cost">${c.cost}</span><span class="symbol">${c.symbol}</span><span class="name">${c.name}</span><span class="type">${c.type}</span>
 ${isUnit?`<span class="statsline">攻 ${c.atk} / 耐久 ${c.hp}</span>`:`<span class="statsline">支援カード</span>`}
 <span class="desc">${c.meaning}</span></button>`;
}
function render(){
 $("playerHp").textContent=state.playerHp;$("cpuHp").textContent=state.cpuHp;
 $("mana").textContent=`${state.mana}/${state.maxMana}`;$("turn").textContent=state.turn;
 $("hand").innerHTML=state.hand.map((c,i)=>cardHtml(c,"hand",i)).join("");
 $("playerBoard").innerHTML=state.playerBoard.map((c,i)=>cardHtml(c,"player",i)).join("");
 $("cpuBoard").innerHTML=state.cpuBoard.map((c,i)=>cardHtml(c,"cpu",i)).join("");
 const selectedCard=getSelected();
 $("attack").disabled=state.over||!(state.selectedBoard==="player"&&selectedCard);
 $("useSpell").disabled=state.over||!(state.selectedBoard==="hand"&&selectedCard&&selectedCard.kind==="spell");
 $("learn").disabled=state.over||!selectedCard;
 $("endTurn").disabled=state.over;
 document.querySelectorAll(".card").forEach(el=>el.addEventListener("click",()=>selectCard(el.dataset.area,Number(el.dataset.index))));
}
function getSelected(){
 if(!state.selected)return null;
 const arr=state.selectedBoard==="hand"?state.hand:state.selectedBoard==="player"?state.playerBoard:state.cpuBoard;
 return arr.find(c=>c.id===state.selected)||null;
}
function selectCard(area,index){
 const arr=area==="hand"?state.hand:area==="player"?state.playerBoard:state.cpuBoard;
 const c=arr[index];if(!c||area==="cpu")return;
 state.selected=c.id;state.selectedBoard=area;
 $("message").textContent=`${c.name}を選択中。${c.meaning}`;
 render();
}
function say(t){$("message").textContent=t;log(t)}
function summon(){
 const c=getSelected();if(!c||state.selectedBoard!=="hand"||c.kind!=="unit")return;
 if(state.mana<c.cost){say("資源が足りない。");return}
 state.mana-=c.cost;state.hand=state.hand.filter(x=>x.id!==c.id);
 state.playerBoard.push({...c,currentHp:c.hp,attacked:false});
 state.selected=null;state.selectedBoard=null;say(`${c.name}を召喚した。`);render();
}
function useSpell(){
 const c=getSelected();if(!c||state.selectedBoard!=="hand"||c.kind!=="spell")return;
 if(state.mana<c.cost){say("資源が足りない。");return}
 state.mana-=c.cost;state.hand=state.hand.filter(x=>x.id!==c.id);
 const unit=state.playerBoard[0];
 if(c.effect==="boost"){if(unit){unit.atk+=2;say(`${c.name}を使用。${unit.name}の攻撃力が2上がった。`)}else{state.cpuHp-=2;say(`${c.name}を使用。味方がいないため、CPUに2ダメージ。`)}}
 if(c.effect==="heal"){state.playerHp=Math.min(20,state.playerHp+4);if(unit)unit.currentHp=Math.min(unit.hp,unit.currentHp+2);say(`${c.name}を使用。ライフを4回復した。`)}
 if(c.effect==="damage"){state.cpuHp-=3;say(`${c.name}を使用。CPUに3ダメージ。`)}
 if(c.effect==="resource"){state.mana=Math.min(state.maxMana+1,state.mana+2);say(`${c.name}を使用。資源を2得た。`)}
 if(unit&&unit.effect==="draw"&&c.effect==="boost"){draw(1);say("隠者の洞察：カードを1枚引いた。")}
 state.selected=null;state.selectedBoard=null;checkWin();render();
}
function attack(){
 const c=getSelected();if(!c||state.selectedBoard!=="player")return;
 if(c.attacked){say("このユニットはすでに攻撃した。");return}
 state.cpuHp-=c.atk;c.attacked=true;say(`${c.name}がCPUに${c.atk}ダメージを与えた。`);
 checkWin();render();
}
function learn(){
 const c=getSelected();if(!c)return;
 say(`${c.name}（${c.type}）／意味：${c.meaning}。${c.desc} ※ゲーム効果は本作独自の表現です。`);
}
function checkWin(){
 if(state.cpuHp<=0){state.cpuHp=0;state.over=true;say("勝利！ CPUのライフを0にした。")}
 if(state.playerHp<=0){state.playerHp=0;state.over=true;say("敗北。あなたのライフが0になった。")}
}
function endTurn(){
 if(state.over)return;
 state.cpuBoard.forEach(c=>c.attacked=false);
 // Simple CPU turn: attacks with all units and occasionally damages player.
 for(const c of state.cpuBoard){state.playerHp-=c.atk}
 if(Math.random()<.65){state.playerHp-=2;log("CPUが支援効果を使い、あなたに2ダメージ。")}
 checkWin();if(state.over){render();return}
 state.turn++;state.maxMana=Math.min(8,state.maxMana+1);state.mana=state.maxMana;
 state.playerBoard.forEach(c=>c.attacked=false);
 draw(1);
 // CPU gains a unit every other turn, within a small cap.
 if(state.turn%2===0&&state.cpuBoard.length<3){
  const choices=majorCards.filter(c=>!state.cpuBoard.some(x=>x.id===c.id));
  if(choices.length){const c=choices[Math.floor(Math.random()*choices.length)];state.cpuBoard.push({...c,currentHp:c.hp,attacked:false});log(`CPUが${c.name}を召喚した。`)}
 }
 $("cpuHint").textContent="CPUは簡易AIで行動します。";
 say("あなたのターン。資源が回復し、カードを1枚引いた。");render();
}
document.addEventListener("click",e=>{
 const btn=e.target.closest("button");if(!btn)return;
 if(btn.id==="summon")summon();
 if(btn.id==="attack")attack();
 if(btn.id==="useSpell")useSpell();
 if(btn.id==="learn")learn();
 if(btn.id==="endTurn")endTurn();
 if(btn.id==="restart")init();
});
init();
