import { useRef } from 'react'
import { Button } from 'antd'

import TableEditor from '../components/TableEditor'
import { slateValueToString } from '../utils/util'
import { tableLineReg } from '../utils/contants'
import './App.css'

const logseq = window.logseq
const logseqApp = logseq.App
const logseqEditor = logseq.Editor

const isInBrower = process.env.REACT_APP_ENV === 'browser'

const App = ({ content, tables, blockId }) => {

  const tableEditorMapRef = useRef({})

  const ArrAfterSplitByTable = splitStrByTable(content, tables)
  console.log('[faiz:] === ArrAfterSplitByTable', ArrAfterSplitByTable)

  const setTableEditorRef = (index, dom) => {
    tableEditorMapRef.current = {
      ...tableEditorMapRef.current,
      [index]: dom,
    }
  }

  const onClickConfirm = () => {
    if (!blockId && !isInBrower) return logseqApp.showMsg('uuid error')
    const markdownContent = ArrAfterSplitByTable.map((node, index) => {
      if (node.type === 'table') {
        const slateVal = tableEditorMapRef.current?.[index]?.getEditorValue()?.[0]
        console.log('[faiz:] === slateVal', slateVal)
        return slateValueToString(slateVal)
      }
      return node.str
    }).join('\n')
    if (isInBrower) return console.log('[faiz:] === save content:\n', markdownContent, blockId)

    logseqEditor.updateBlock(blockId, markdownContent)
      .then(() => {
        logseqApp.showMsg('markdown table overwrite success')
        logseq.hideMainUI()
      })
      .catch(err => {
        logseqApp.showMsg('markdown table overwrite error', 'warning')
        console.log('[faiz:] === onClickConfirm error', err)
      })
  }
  const onClickCancel = () => logseq.hideMainUI()

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="w-screen h-screen absolute" style={{ background: 'rgba(0, 0, 0, .3)', zIndex: -1 }} onClick={onClickCancel}></div>
      <div className="w-2/3 overflow-y-auto" style={{ maxHeight: '80%'}}>
        <div className="mt-2 flex flex-col">
          {
            ArrAfterSplitByTable?.map((node, index) => {
              return node?.type === 'table'
              ? <TableEditor content={node?.str} key={index} ref={dom => setTableEditorRef(index, dom)} />
              : <div className="bg-gray-400 text-gray-300 my-3 rounded px-1 py-2" key={index} style={{whiteSpace: 'pre-line'}}>{node.str}</div>
            })
          }
        </div>
      </div>
      <div className="flex w-2/3 flex-row justify-end mt-4">
        <Button className="mr-1 rounded" onClick={onClickCancel}>Cancel</Button>
        <Button className="rounded" type="primary" onClick={onClickConfirm}>Confirm</Button>
      </div>
    </div>
  )
}

const genTable = (arr, startLine, endLine) => {
  return arr
    .slice(startLine, endLine)
    // 暂行逻辑，看是否可以优化： 无空行隔开的两个table，认为是一个 table，且过滤掉不符合 table 语法的内容
    .filter(str => tableLineReg.test(str))
    .join('\n')
}
const splitStrByTable = (str, tables = []) => {
  const strToArr = str.split('\n')
  let strArrByTable = []

  tables.forEach((table, index, arr) => {
    const [startLine, endLine] = table
    const preEndLine = index === 0 ? 0 : arr[index - 1][1]

    if (startLine === preEndLine) {
      strArrByTable.push({
        str: genTable(strToArr, startLine, endLine),
        type: 'table',
      })
    } else {
      strArrByTable.push({
        str: strToArr.slice(preEndLine, startLine).join('\n'),
        type: 'notTable',
      })
      strArrByTable.push({
        // str: strToArr.slice(startLine, endLine).join('\n'),
        str: genTable(strToArr, startLine, endLine),
        type: 'table',
      })
    }

  })

  const [/*lastTableStartLine*/, lastTableEndLine] = tables[tables.length - 1]
  if (strToArr.length - 1 >= lastTableEndLine) {
    strArrByTable.push({
      str: strToArr.slice(lastTableEndLine).join('\n'),
      type: 'notTable'
    })
  }

  return strArrByTable
}
export default App