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

const getTablesStr = (str, tables) => {
  const strToArr = str.split('\n')
  return tables.map(sourceMap => {
    const [startLine, endLine] = sourceMap
    return strToArr.slice(startLine, endLine)
  })
}
export default App