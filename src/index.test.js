import { render, screen } from '@testing-library/react'
import { bootEditor } from './index'
import { empty, onlyText, onlyOneTable, tableWithTextBefore, tableWithTextBeforeAndAfter, multipleTables, longTables } from './utils/testExample'

test('boot editor: parse empty input string', () => {
  bootEditor(empty, 111)
  const tables = screen.queryAllByRole('table')
  expect(tables).toHaveLength(1)
})