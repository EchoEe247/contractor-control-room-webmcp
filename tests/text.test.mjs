import test from 'node:test'
import assert from 'node:assert/strict'
import {escapeHtml} from '../text.js'

test('escapes markup-significant characters from agent-controlled text',()=>{
  assert.equal(
    escapeHtml(`<img src=x onerror="boom()"> O'Reilly & Co.`),
    '&lt;img src=x onerror=&quot;boom()&quot;&gt; O&#39;Reilly &amp; Co.'
  )
})

test('normalizes non-string values before escaping',()=>{
  assert.equal(escapeHtml(1250),'1250')
})
