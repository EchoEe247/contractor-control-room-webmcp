import test from 'node:test'
import assert from 'node:assert/strict'
import {registerWebMCPTools,WEBMCP_TOOL_NAMES} from '../webmcp.js'

const expectedNames=WEBMCP_TOOL_NAMES.map(([name])=>name)

test('registers the documented WebMCP tool surface with correct read hints',async()=>{
  const registered=[]
  globalThis.document={modelContext:{registerTool:async tool=>registered.push(tool)}}

  try{
    const ok=await registerWebMCPTools({})
    assert.equal(ok,true)
    assert.deepEqual(registered.map(tool=>tool.name),expectedNames)

    const byName=Object.fromEntries(registered.map(tool=>[tool.name,tool]))
    assert.equal(byName.get_project_state.annotations.readOnlyHint,true)
    assert.equal(byName.identify_risks.annotations.readOnlyHint,true)
    for(const name of ['configure_project','record_job_costs','simulate_scenario','apply_scenario','clear_scenario']){
      assert.equal(byName[name].annotations.readOnlyHint,false)
    }
    assert.equal(byName.configure_project.inputSchema.properties.finishDate.pattern,'^[0-9]{4}-[0-9]{2}-[0-9]{2}$')
  }finally{
    delete globalThis.document
  }
})

test('returns false when WebMCP is unavailable',async()=>{
  globalThis.document={}
  try{
    assert.equal(await registerWebMCPTools({}),false)
  }finally{
    delete globalThis.document
  }
})
