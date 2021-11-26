import { useState } from 'react'

import TableEditor from '../components/TableEditor'
import './App.css'

const logseq = window.logseq
const logseqApp = logseq.App
const logseqEditor = logseq.Editor

const App = ({ content, tables, blockId }) => {

  const firstTableStr = getTablesStr(content, tables)[0]

  const onSave = () => {
    if (!blockId) return logseqApp.showMsg('uuid error')
    // console.log('[faiz:] === onClickConfirm', blockId, value)
    // const markdownContent = slateValueToString(value[0])
    // logseqEditor.updateBlock(blockId, markdownContent)
    //   .then(() => {
    //     logseqApp.showMsg('markdown table overwrite success')
    //     logseq.hideMainUI()
    //   })
    //   .catch(err => {
    //     logseqApp.showMsg('markdown table overwrite error', 'warning')
    //     console.log('[faiz:] === onClickConfirm error', err)
    //   })
  }

  return (
    <div>
      <TableEditor content={firstTableStr} />
    </div>
  )
}

const getTablesStr = (str, tables = []) => {
  const strToArr = str.split('\n')
  let strArrByTable = []

  tables.forEach((table, index, arr) => {
    const [startLine, endLine] = table

    // todo: To be optimized
    if (index === 0) {
      if (startLine === 0) {
        strArrByTable.push({
          str: strToArr.slice(startLine, endLine).join('\n'),
          type: 'table',
        })
      } else {
        strArrByTable.push({
          str: strToArr.slice(0, startLine).join('\n'),
          type: 'notTable',
        })
        strArrByTable.push({
          str: strToArr.slice(startLine, endLine).join('\n'),
          type: 'table',
        })
      }
    } else {
      const preEndLine = arr[index - 1][1]
      if (startLine === preEndLine) {
        strArrByTable.push({
          str: strToArr.slice(startLine, endLine).join('\n'),
          type: 'table',
        })
      } else {
        strArrByTable.push({
          str: strToArr.slice(preEndLine, startLine).join('\n'),
          type: 'notTable',
        })
        strArrByTable.push({
          str: strToArr.slice(startLine, endLine).join('\n'),
          type: 'table',
        })
      }
    }

  })

  const [/*lastTableStartLine*/, lastTableEndLine] = tables[tables.length - 1]
  if (strToArr.length - 1 > lastTableEndLine) {
    strArrByTable.push({
      str: strToArr.slice(lastTableEndLine),
      type: 'notTable'
    })
  }

  return strArrByTable
}
export default App