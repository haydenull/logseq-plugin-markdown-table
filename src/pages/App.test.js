import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import App from './App'
import parseMarkdownTable from '../utils/parseRawInputByMarkdownIt'
import { empty, onlyText, onlyOneTable, tableWithTextBefore, tableWithTextBeforeAndAfter, multipleTables, longTables } from '../utils/testExample'

test('render table with empty input', () => {

  const tables = parseMarkdownTable(empty)

  render(<App content={empty} tables={tables} blockId={111} />)

  const tableEles = screen.getAllByRole('table')
  expect(tableEles.length).toBe(1)
  expect(tableEles[0]).toBeInTheDocument()
  
  // const linkElement = screen.getByText(/learn react/i)
  // expect(linkElement).toBeInTheDocument()
})

test('render table with onlyText', () => {
  
  const tables = parseMarkdownTable(onlyText)
  
  render(<App content={onlyText} tables={tables} blockId={111} />)
  
  const textEle = screen.queryByText(/^normal text/)
  expect(textEle).toBeInTheDocument()
  const tableEles = screen.getAllByRole('table')
  expect(tableEles.length).toBe(1)
})

test('render table with onlyOneTable', () => {

  const tables = parseMarkdownTable(onlyOneTable)

  render(<App content={onlyOneTable} tables={tables} blockId={111} />)

  const tableEles = screen.getAllByRole('table')
  expect(tableEles.length).toBe(1)
  expect(tableEles[0]).toBeInTheDocument()
})

test('render table with tableWithTextBefore', () => {

  const tables = parseMarkdownTable(tableWithTextBefore)

  render(<App content={tableWithTextBefore} tables={tables} blockId={111} />)

  const textEle = screen.queryByText(/^foo/)
  expect(textEle).toBeInTheDocument()
  const tableEles = screen.getAllByRole('table')
  expect(tableEles.length).toBe(1)
})

test('render table with tableWithTextBeforeAndAfter', () => {

  const tables = parseMarkdownTable(tableWithTextBeforeAndAfter)

  render(<App content={tableWithTextBeforeAndAfter} tables={tables} blockId={111} />)

  const textBeforeEle = screen.queryByText(/^foo/)
  expect(textBeforeEle).toBeInTheDocument()
  const textAfterEle = screen.queryByText(/^\*\*bold/)
  expect(textAfterEle).toBeInTheDocument()
  const tableEles = screen.getAllByRole('table')
  expect(tableEles.length).toBe(1)
})

test('render table with multipleTables', () => {

  const tables = parseMarkdownTable(multipleTables)

  render(<App content={multipleTables} tables={tables} blockId={111} />)

  const textBeforeEle = screen.queryByText(/^foo/)
  expect(textBeforeEle).toBeInTheDocument()
  const textMiddleEle = screen.queryByText(/^other/)
  expect(textMiddleEle).toBeInTheDocument()
  const textAfterEle = screen.queryByText(/^test/)
  expect(textAfterEle).toBeInTheDocument()
  const tableEles = screen.getAllByRole('table')
  expect(tableEles.length).toBe(2)
})
