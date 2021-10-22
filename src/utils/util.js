export const stringToSlateValue = (str = '') => {
  const _arr = str.trim().split('\n').filter(Boolean)
  const contentArr = [_arr[0]].concat(_arr.slice(2))
  const res = contentArr.map(rowStr => {
    const rowArr = rowStr.trim().split('|')
    return rowArr.slice(1, rowArr.length - 1)
  })
  return createTableNode(res)
}

export const slateValueToString = (slateVal) => {
  let rowStrs = Array.from(slateVal.children, (row) => {
    const cells = Array.from(row.children, (cell) => {
      return cell.children[0].text
    }).join('|')
    return `|${cells}|`
  })
  rowStrs.splice(1, 0, `|${Array.from(slateVal.children[0].children, () => '--').join('|')}|`)
  return rowStrs.join('\n')
}

const createRow = (cellText) => {
  const newRow = Array.from(cellText, (value) => createTableCell(value))
  return {
    type: "table-row",
    children: newRow
  }
}

const createTableCell = (text) => {
  return {
    type: "table-cell",
    children: [{ text }]
  }
}

export const createTableNode = (cellText) => {
  const tableChildren = Array.from(cellText, (value) => createRow(value))
  let tableNode = { type: "table", children: tableChildren }
  return tableNode
}