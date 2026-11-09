import assert from 'node:assert/strict'
import test from 'node:test'
import { copyTextToClipboard } from './copyTextToClipboard.ts'

test('copies the requested text to the clipboard', async () => {
  let copiedText = ''

  const copied = await copyTextToClipboard('S-P001-001', async (text) => {
    copiedText = text
  })

  assert.equal(copied, true)
  assert.equal(copiedText, 'S-P001-001')
})

test('returns false when clipboard access fails', async () => {
  const copied = await copyTextToClipboard('S-P001-001', async () => {
    throw new Error('Clipboard unavailable')
  })

  assert.equal(copied, false)
})
