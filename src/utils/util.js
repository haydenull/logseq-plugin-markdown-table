import { DEFAULT_TABLE } from './contants'

export const stringToSlateValue = (str = '') => {
  str = str || DEFAULT_TABLE
  // 将 [:br] 转为换行符
  const _arr = str.trim().split('\n').filter(Boolean).map(_str => _str.replaceAll('[:br]', '\n'))
  const contentArr = [_arr[0]].concat(_arr.slice(2))
  const res = contentArr.map(rowStr => {
    const rowArr = rowStr.trim().split('|')
    return rowArr.slice(1, rowArr.length - 1).map(cell => cell.trim())
  })
  return createTableNode(res)
}

export const slateValueToString = (slateVal) => {
  // Calculate the maximum width for each column
  const columnWidths = slateVal.children[0].children.map((_, colIndex) => {
    return Math.max(...slateVal.children.map(row =>
      row.children[colIndex].children[0].text?.replaceAll('\n', '[:br]').length || 0
    ));
  });

  let rowStrs = Array.from(slateVal.children, (row) => {
    const cells = Array.from(row.children, (cell, index) => {
      const cellText = cell.children[0].text?.replaceAll('\n', '[:br]') || '';
      return cellText.padEnd(columnWidths[index]);
    }).join(' | ');
    return `| ${cells} |`;
  });

  // Create the separator row
  const separatorRow = `| ${columnWidths.map(width => '-'.repeat(width)).join(' | ')} |`;
  rowStrs.splice(1, 0, separatorRow);

  return rowStrs.join('\n');
}

export const createTableNode = (rows) => {
  return {
    type: "table",
    children: [createHeaderRow(rows[0])].concat(rows.slice(1).map(createRow))
  };
}

const createRow = (rowCells) => {
  return {
    type: "table-row",
    children: rowCells.map(createTableCell)
  }
}

const createHeaderRow = (rowCells) => {
  return {
    type: "table-row",
    children: rowCells.map(createHeaderCell)
  }
}

const createHeaderCell = (cellText) => {
  return {
    type: "table-header",
    children: [{ text: cellText }]
  }
}

const createTableCell = (cellText) => {
  return {
    type: "table-cell",
    children: [{ text: cellText }]
  }
}