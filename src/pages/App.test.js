import { render, screen } from '@testing-library/react'

import App from './App'
import parseMarkdownTable from '../utils/parseRawInputByMarkdownIt'
import { empty, onlyText, onlyOneTable, tableWithTextBefore, tableWithTextBeforeAndAfter, multipleTables, longTables } from '../utils/testExample'

test('render table with empty input', () => {

  const tables = parseMarkdownTable(empty)

  render(<App content={empty} tables={tables} blockId={111} />)

  const tableEles = screen.getAllByRole('table')
  expect(tableEles.length).toBe(1)

  // const linkElement = screen.getByText(/learn react/i)
  // expect(linkElement).toBeInTheDocument()
})