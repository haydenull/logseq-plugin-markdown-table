import { createEditor, Editor } from 'slate'
import { withReact } from 'slate-react'

import withTables from './withTable'
import { stringToSlateValue, slateValueToString } from './util'

const TABLE = '|Prodotto|Licenza|\n|--|--|\n|A|MIT|\n|B||\n|C|da definire|'

const createTableEditor = () => {
  const editor = withTables(withReact(createEditor()))
  editor.children = [stringToSlateValue(TABLE)]
  return editor
}

// path of the text leaf in a cell: table / row / cell / text
const cellText = (row, col) => [0, row, col, 0]
const selectCell = (editor, row, col) => {
  editor.selection = Editor.range(editor, cellText(row, col))
}
const moveCursor = (editor, row, col, offset) => {
  const point = { path: cellText(row, col), offset }
  editor.selection = { anchor: point, focus: point }
}

const clipboard = (types) => ({ getData: type => types[type] || '' })
// same encoding slate-react uses in setFragmentData on copy
const copySlateFragment = (editor) => {
  const fragment = window.btoa(encodeURIComponent(JSON.stringify(editor.getFragment())))
  return clipboard({ 'application/x-slate-fragment': fragment, 'text/plain': Editor.string(editor, editor.selection) })
}

const save = editor => slateValueToString(editor.children[0])

test('paste a cell copied from the same table into an empty cell', () => {
  const editor = createTableEditor()
  selectCell(editor, 1, 1)
  const data = copySlateFragment(editor)

  moveCursor(editor, 2, 1, 0)
  editor.insertData(data)

  expect(save(editor)).toBe('|Prodotto|Licenza|\n|--|--|\n|A|MIT|\n|B|MIT|\n|C|da definire|')
})

test('paste a cell copied from the same table over the whole text of a cell', () => {
  const editor = createTableEditor()
  selectCell(editor, 1, 1)
  const data = copySlateFragment(editor)

  selectCell(editor, 3, 1)
  editor.insertData(data)

  expect(save(editor)).toBe('|Prodotto|Licenza|\n|--|--|\n|A|MIT|\n|B||\n|C|MIT|')
})

test('paste a cell copied from the same table in the middle of a cell', () => {
  const editor = createTableEditor()
  selectCell(editor, 1, 1)
  const data = copySlateFragment(editor)

  moveCursor(editor, 3, 1, 2)
  editor.insertData(data)

  expect(save(editor)).toBe('|Prodotto|Licenza|\n|--|--|\n|A|MIT|\n|B||\n|C|daMIT definire|')
})

test('paste multi-line plain text into a cell keeps it in that cell', () => {
  const editor = createTableEditor()
  moveCursor(editor, 2, 1, 0)
  editor.insertData(clipboard({ 'text/plain': 'GPL\r\nv3' }))

  expect(save(editor)).toBe('|Prodotto|Licenza|\n|--|--|\n|A|MIT|\n|B|GPL[:br]v3|\n|C|da definire|')
})

test('paste plain text copied with a trailing line break (triple click)', () => {
  const editor = createTableEditor()
  moveCursor(editor, 2, 1, 0)
  editor.insertData(clipboard({ 'text/plain': 'MIT\n' }))

  expect(save(editor)).toBe('|Prodotto|Licenza|\n|--|--|\n|A|MIT|\n|B|MIT|\n|C|da definire|')
})
