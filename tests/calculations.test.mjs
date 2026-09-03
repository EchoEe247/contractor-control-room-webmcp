import test from 'node:test'
import assert from 'node:assert/strict'
import {addDays,isValidIsoDate,sanitizeProjectState,deriveProject,simulateProject,identifyRisks} from '../calculations.js'

const base={projectName:'Test Remodel',contractValue:82000,budgetedCost:57400,actualCost:34800,remainingLabor:12200,remainingMaterials:8100,remainingOther:2300,cashOnHand:18300,minimumCash:10000,outstandingAr:14500,nextPayment:18000,nextPaymentDays:12,finishDate:'2026-10-18'}

test('derives projected cost and margin',()=>{const d=deriveProject(base);assert.equal(d.projectedFinalCost,57400);assert.equal(Math.round(d.projectedMargin*10)/10,30);assert.equal(d.budgetVariance,0)})

test('scenario is non-destructive and applies overruns to derived copy',()=>{const s=simulateProject(base,{laborOverrunPct:15,materialIncrease:4200,paymentDelayDays:14,finishDelayDays:16});assert.equal(base.remainingLabor,12200);assert.equal(s.remainingLabor,14030);assert.equal(s.remainingMaterials,12300);assert.equal(s.nextPaymentDays,26);assert.equal(s.finishDate,'2026-11-03');assert.ok(s.projectedMargin<30)})

test('scenario adjustments preserve nonnegative live-state invariants',()=>{const s=simulateProject(base,{laborOverrunPct:-100,materialIncrease:-100000,otherIncrease:-100000,paymentDelayDays:-365});assert.equal(s.remainingLabor,0);assert.equal(s.remainingMaterials,0);assert.equal(s.remainingOther,0);assert.equal(s.nextPaymentDays,0);assert.equal(base.remainingLabor,12200);assert.equal(base.remainingMaterials,8100);assert.equal(base.remainingOther,2300);assert.equal(base.nextPaymentDays,12)})

test('repairs invalid persisted project state without discarding valid signed cash',()=>{const saved={...base,contractValue:'99999',actualCost:null,remainingMaterials:-1900,remainingOther:1200,nextPaymentDays:-353,cashOnHand:-500,minimumCash:-250,finishDate:'2026-02-30',projectName:'Recovered Project',unknownField:'drop-me'};const repaired=sanitizeProjectState(saved,base);assert.equal(repaired.projectName,'Recovered Project');assert.equal(repaired.contractValue,82000);assert.equal(repaired.actualCost,34800);assert.equal(repaired.remainingMaterials,8100);assert.equal(repaired.remainingOther,1200);assert.equal(repaired.nextPaymentDays,12);assert.equal(repaired.cashOnHand,-500);assert.equal(repaired.minimumCash,-250);assert.equal(repaired.finishDate,'2026-10-18');assert.equal(Object.prototype.hasOwnProperty.call(repaired,'unknownField'),false)})

test('validates canonical real calendar dates',()=>{assert.equal(isValidIsoDate('2028-02-29'),true);assert.equal(isValidIsoDate('2026-02-30'),false);assert.equal(isValidIsoDate('2026-2-03'),false);assert.equal(isValidIsoDate('not-a-date'),false);assert.equal(isValidIsoDate(20260903),false);assert.equal(addDays('2028-02-29',1),'2028-03-01');assert.throws(()=>addDays('2026-02-30',1),/real YYYY-MM-DD calendar date/)})

test('date-only arithmetic does not drift in UTC+14',()=>{const originalTz=process.env.TZ;process.env.TZ='Pacific/Kiritimati';try{assert.equal(addDays('2026-09-03',0),'2026-09-03');assert.equal(addDays('2026-09-03',1),'2026-09-04');assert.equal(addDays('2026-12-31',1),'2027-01-01')}finally{if(originalTz===undefined)delete process.env.TZ;else process.env.TZ=originalTz}})

test('risk engine flags low margin and cash exposure',()=>{const risky={...base,contractValue:62000,cashOnHand:3000,nextPaymentDays:30};const {risks}=identifyRisks(risky);assert.ok(risks.some(r=>r.type==='margin'));assert.ok(risks.some(r=>r.type==='cash'));assert.ok(risks.some(r=>r.type==='payment_timing'))})
