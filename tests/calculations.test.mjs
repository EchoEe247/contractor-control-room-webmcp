import test from 'node:test'
import assert from 'node:assert/strict'
import {deriveProject,simulateProject,identifyRisks} from '../calculations.js'

const base={projectName:'Test Remodel',contractValue:82000,budgetedCost:57400,actualCost:34800,remainingLabor:12200,remainingMaterials:8100,remainingOther:2300,cashOnHand:18300,minimumCash:10000,outstandingAr:14500,nextPayment:18000,nextPaymentDays:12,finishDate:'2026-10-18'}

test('derives projected cost and margin',()=>{const d=deriveProject(base);assert.equal(d.projectedFinalCost,57400);assert.equal(Math.round(d.projectedMargin*10)/10,30);assert.equal(d.budgetVariance,0)})

test('scenario is non-destructive and applies overruns to derived copy',()=>{const s=simulateProject(base,{laborOverrunPct:15,materialIncrease:4200,paymentDelayDays:14,finishDelayDays:16});assert.equal(base.remainingLabor,12200);assert.equal(s.remainingLabor,14030);assert.equal(s.remainingMaterials,12300);assert.equal(s.nextPaymentDays,26);assert.equal(s.finishDate,'2026-11-03');assert.ok(s.projectedMargin<30)})

test('risk engine flags low margin and cash exposure',()=>{const risky={...base,contractValue:62000,cashOnHand:3000,nextPaymentDays:30};const {risks}=identifyRisks(risky);assert.ok(risks.some(r=>r.type==='margin'));assert.ok(risks.some(r=>r.type==='cash'));assert.ok(risks.some(r=>r.type==='payment_timing'))})
