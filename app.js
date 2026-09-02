import {deriveProject,simulateProject,identifyRisks,money,pct} from './calculations.js'
import {registerWebMCPTools,WEBMCP_TOOL_NAMES} from './webmcp.js'

const STORAGE_KEY='contractor-control-room-v1'
const DEFAULT_STATE={projectName:'Martinez Kitchen Remodel',contractValue:82000,budgetedCost:57400,actualCost:34800,remainingLabor:12200,remainingMaterials:8100,remainingOther:2300,cashOnHand:18300,minimumCash:10000,outstandingAr:14500,nextPayment:18000,nextPaymentDays:12,finishDate:'2026-10-18'}
let state=loadState();let scenario=null;let activity=[]

function loadState(){try{return {...DEFAULT_STATE,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return {...DEFAULT_STATE}}}
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function log(source,message){activity.unshift({source,message,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})});activity=activity.slice(0,12);renderActivity()}
function current(){return deriveProject(state)}
function snapshot(){return {current:current(),scenario}}

function metric(label,value,note=''){return `<div class="metric"><span class="label">${label}</span><strong>${value}</strong>${note?`<small>${note}</small>`:''}</div>`}
function delta(value,format='money'){const cls=value<0?'negative':value>0?'positive':'';const text=format==='pct'?`${value>0?'+':''}${value.toFixed(1)} pts`:`${value>0?'+':''}${money(value)}`;return `<span class="${cls}">${text}</span>`}

function render(){
 const d=current();document.querySelector('#project-name').textContent=state.projectName
 document.querySelector('#metric-grid').innerHTML=[metric('Contract value',money(d.contractValue)),metric('Projected final cost',money(d.projectedFinalCost),`${money(Math.abs(d.budgetVariance))} ${d.budgetVariance>0?'over':'under'} budget`),metric('Projected margin',pct(d.projectedMargin)),metric('Cash before next payment',money(d.cashBeforeNextPayment)),metric('Outstanding AR',money(d.outstandingAr)),metric('Finish date',new Date(`${d.finishDate}T12:00:00`).toLocaleDateString())].join('')
 const badge=document.querySelector('#risk-badge');badge.className=`risk-badge ${d.riskLevel}`;badge.textContent=d.riskLevel==='good'?'On track':d.riskLevel==='high'?'High risk':'Review'
 renderComparison();fillForm()
}
function renderComparison(){const base=current(),s=scenario||base;const rows=[['Final cost',money(base.projectedFinalCost),money(s.projectedFinalCost),delta(s.projectedFinalCost-base.projectedFinalCost)],['Margin',pct(base.projectedMargin),pct(s.projectedMargin),delta(s.projectedMargin-base.projectedMargin,'pct')],['Cash before payment',money(base.cashBeforeNextPayment),money(s.cashBeforeNextPayment),delta(s.cashBeforeNextPayment-base.cashBeforeNextPayment)],['Next payment timing',`${base.nextPaymentDays} days`,`${s.nextPaymentDays} days`,`${s.nextPaymentDays-base.nextPaymentDays>0?'+':''}${s.nextPaymentDays-base.nextPaymentDays} days`],['Finish date',base.finishDate,s.finishDate,s.finishDate===base.finishDate?'—':s.finishDate]];document.querySelector('#comparison-body').innerHTML=rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}
function fillForm(){const f=document.querySelector('#project-form');for(const [k,v] of Object.entries(state)){if(f.elements[k])f.elements[k].value=v}}
function renderActivity(){document.querySelector('#activity-log').innerHTML=activity.length?activity.map(x=>`<li><strong>${x.source}</strong> · ${x.time}<br>${x.message}</li>`).join(''):'<li>No changes yet. Human and agent actions will appear here.</li>'}
function renderToolList(){document.querySelector('#tool-list').innerHTML=WEBMCP_TOOL_NAMES.map(([n,m])=>`<div class="tool"><span>${n}</span><span>${m}</span></div>`).join('')}

const actions={
 getState:()=>snapshot(),
 configureProject:(changes,source='Agent')=>{state={...state,...changes};scenario=null;persist();render();log(source,'Updated live project assumptions.');return current()},
 recordJobCosts:({amount,category='other',note=''},source='Agent')=>{const n=Number(amount);state.actualCost=Number(state.actualCost)+n;if(category==='labor')state.remainingLabor=Math.max(0,Number(state.remainingLabor)-n);if(category==='materials')state.remainingMaterials=Math.max(0,Number(state.remainingMaterials)-n);if(category==='other')state.remainingOther=Math.max(0,Number(state.remainingOther)-n);persist();render();log(source,`Recorded ${money(n)} ${category} cost${note?`: ${note}`:''}.`);return current()},
 simulate:(input,source='Agent')=>{scenario=simulateProject(state,input);render();log(source,'Created a non-destructive project scenario.');return {baseline:current(),scenario}},
 clearScenario:(source='Human')=>{scenario=null;render();log(source,'Cleared scenario and returned to baseline.');return current()},
 applyScenario:(source='Agent')=>{if(!scenario)throw new Error('No active scenario to apply.');const keep={...state};for(const k of ['remainingLabor','remainingMaterials','remainingOther','nextPaymentDays','finishDate'])keep[k]=scenario[k];state=keep;scenario=null;persist();render();log(source,'Applied the active scenario to the live project.');return current()},
 risks:()=>identifyRisks(scenario||state)
}

window.contractorControlRoom=actions

document.querySelector('#project-form').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget),changes={};for(const [k,v] of fd.entries())changes[k]=k==='finishDate'?v:Number(v);actions.configureProject(changes,'Human')})
document.querySelector('#clear-scenario').addEventListener('click',()=>actions.clearScenario('Human'))
document.querySelector('#reset-demo').addEventListener('click',()=>{state={...DEFAULT_STATE};scenario=null;persist();render();log('Human','Reset the demonstration project.')})

render();renderActivity();renderToolList()
registerWebMCPTools(actions).then(ok=>{const el=document.querySelector('#webmcp-status');el.className=`status ${ok?'ready':'unavailable'}`;el.textContent=ok?'WebMCP tools ready':'WebMCP unavailable in this browser'}).catch(err=>{console.error(err);const el=document.querySelector('#webmcp-status');el.className='status unavailable';el.textContent='WebMCP registration failed'})
