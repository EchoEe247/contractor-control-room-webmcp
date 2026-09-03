export function money(value){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value)||0)}
export function pct(value){return `${(Number(value)||0).toFixed(1)}%`}
export function daysBetween(a,b){return Math.round((new Date(b)-new Date(a))/86400000)}
export function addDays(dateString,days){const d=new Date(`${dateString}T00:00:00Z`);d.setUTCDate(d.getUTCDate()+Number(days||0));return d.toISOString().slice(0,10)}
export function roundMoney(value){return Math.round((Number(value)+Number.EPSILON)*100)/100}

export function deriveProject(state){
  const projectedFinalCost=roundMoney(Number(state.actualCost)+Number(state.remainingLabor)+Number(state.remainingMaterials)+Number(state.remainingOther))
  const projectedProfit=roundMoney(Number(state.contractValue)-projectedFinalCost)
  const projectedMargin=state.contractValue?projectedProfit/Number(state.contractValue)*100:0
  const budgetVariance=roundMoney(projectedFinalCost-Number(state.budgetedCost))
  const cashBeforeNextPayment=roundMoney(Number(state.cashOnHand)-Number(state.remainingLabor)*0.5-Number(state.remainingMaterials)*0.35-Number(state.remainingOther)*0.25)
  const projectedCashAfterNextPayment=roundMoney(cashBeforeNextPayment+Number(state.nextPayment))
  const cashGap=roundMoney(Math.min(cashBeforeNextPayment,projectedCashAfterNextPayment)-Number(state.minimumCash))
  const riskLevel=projectedMargin<15||cashGap<0?'high':projectedMargin<25||budgetVariance>0?'review':'good'
  return {...state,projectedFinalCost,projectedProfit,projectedMargin,budgetVariance,cashBeforeNextPayment,projectedCashAfterNextPayment,cashGap,riskLevel}
}

export function simulateProject(base,input={}){
  const laborPct=Number(input.laborOverrunPct||0)/100
  const materialIncrease=Number(input.materialIncrease||0)
  const otherIncrease=Number(input.otherIncrease||0)
  const paymentDelayDays=Number(input.paymentDelayDays||0)
  const finishDelayDays=Number(input.finishDelayDays||0)
  return deriveProject({
    ...base,
    remainingLabor:roundMoney(Number(base.remainingLabor)*(1+laborPct)),
    remainingMaterials:roundMoney(Number(base.remainingMaterials)+materialIncrease),
    remainingOther:roundMoney(Number(base.remainingOther)+otherIncrease),
    nextPaymentDays:Number(base.nextPaymentDays)+paymentDelayDays,
    finishDate:addDays(base.finishDate,finishDelayDays)
  })
}

export function identifyRisks(state){
  const d=deriveProject(state)
  const risks=[]
  if(d.budgetVariance>0) risks.push({type:'budget',severity:d.budgetVariance>10000?'high':'medium',message:`Projected final cost is ${money(d.budgetVariance)} over budget.`})
  if(d.projectedMargin<15) risks.push({type:'margin',severity:'high',message:`Projected margin is ${pct(d.projectedMargin)}, below a 15% danger threshold.`})
  else if(d.projectedMargin<25) risks.push({type:'margin',severity:'medium',message:`Projected margin is ${pct(d.projectedMargin)} and deserves review.`})
  if(d.cashGap<0) risks.push({type:'cash',severity:'high',message:`Projected cash falls ${money(Math.abs(d.cashGap))} below the configured minimum.`})
  if(Number(d.outstandingAr)>Number(d.contractValue)*0.15) risks.push({type:'receivables',severity:'medium',message:`Outstanding receivables are ${pct(Number(d.outstandingAr)/Number(d.contractValue)*100)} of contract value.`})
  if(Number(d.nextPaymentDays)>21) risks.push({type:'payment_timing',severity:'medium',message:`Next customer payment is ${d.nextPaymentDays} days away, increasing near-term cash exposure.`})
  if(!risks.length) risks.push({type:'general',severity:'low',message:'No configured risk threshold is currently breached.'})
  return {project:d,risks}
}
