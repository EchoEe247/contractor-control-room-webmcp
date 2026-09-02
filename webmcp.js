export const WEBMCP_TOOL_NAMES=[['get_project_state','read'],['configure_project','write'],['record_job_costs','write'],['simulate_scenario','write'],['identify_risks','read'],['apply_scenario','write'],['clear_scenario','write']]

function result(text,data){return {content:[{type:'text',text}],structuredContent:data}}

export async function registerWebMCPTools(actions){
  if(!document.modelContext?.registerTool)return false
  const tools=[
    {
      name:'get_project_state',
      title:'Get project state',
      description:'Read the contractor project baseline and any active what-if scenario from the live page.',
      inputSchema:{type:'object',properties:{},additionalProperties:false},
      annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute:async()=>{const data=actions.getState();return result('Returned the current contractor project state.',data)}
    },
    {
      name:'configure_project',
      title:'Configure project',
      description:'Update live project assumptions such as contract value, costs, cash, receivables, payment timing, or finish date. Only provided fields are changed.',
      inputSchema:{type:'object',properties:{contractValue:{type:'number',minimum:0},budgetedCost:{type:'number',minimum:0},actualCost:{type:'number',minimum:0},remainingLabor:{type:'number',minimum:0},remainingMaterials:{type:'number',minimum:0},remainingOther:{type:'number',minimum:0},cashOnHand:{type:'number'},minimumCash:{type:'number'},outstandingAr:{type:'number',minimum:0},nextPayment:{type:'number',minimum:0},nextPaymentDays:{type:'number',minimum:0},finishDate:{type:'string',description:'ISO date YYYY-MM-DD'}},additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute:async input=>result('Updated the live project and refreshed the dashboard.',actions.configureProject(input))
    },
    {
      name:'record_job_costs',
      title:'Record job costs',
      description:'Record a real cost against the live project and reduce the matching remaining-cost bucket when applicable.',
      inputSchema:{type:'object',properties:{amount:{type:'number',exclusiveMinimum:0},category:{type:'string',enum:['labor','materials','other']},note:{type:'string',maxLength:160}},required:['amount','category'],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute:async input=>result('Recorded the job cost in the live project.',actions.recordJobCosts(input))
    },
    {
      name:'simulate_scenario',
      title:'Simulate project scenario',
      description:'Create a non-destructive what-if scenario for overruns, added costs, payment delay, or schedule delay. Baseline state remains unchanged until apply_scenario is called.',
      inputSchema:{type:'object',properties:{laborOverrunPct:{type:'number',minimum:-100,maximum:500},materialIncrease:{type:'number',minimum:-1000000,maximum:1000000},otherIncrease:{type:'number',minimum:-1000000,maximum:1000000},paymentDelayDays:{type:'number',minimum:-365,maximum:365},finishDelayDays:{type:'number',minimum:-365,maximum:365}},additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute:async input=>result('Created a scenario and updated the comparison view without changing the baseline.',actions.simulate(input))
    },
    {
      name:'identify_risks',
      title:'Identify project risks',
      description:'Analyze the active scenario when present, otherwise the live baseline, for budget, margin, cash, receivables, and payment-timing risks.',
      inputSchema:{type:'object',properties:{},additionalProperties:false},
      annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute:async()=>{const data=actions.risks();return result(`Identified ${data.risks.length} project risk signal(s).`,data)}
    },
    {
      name:'apply_scenario',
      title:'Apply scenario',
      description:'Commit the active what-if scenario assumptions to the live project. Use only after the user wants the scenario adopted.',
      inputSchema:{type:'object',properties:{},additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute:async()=>result('Applied the active scenario to the live project.',actions.applyScenario())
    },
    {
      name:'clear_scenario',
      title:'Clear scenario',
      description:'Discard the active what-if scenario and restore the comparison view to the unchanged baseline.',
      inputSchema:{type:'object',properties:{},additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute:async()=>result('Cleared the active scenario.',actions.clearScenario('Agent'))
    }
  ]
  for(const tool of tools)await document.modelContext.registerTool(tool)
  return true
}
