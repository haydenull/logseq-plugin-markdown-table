import { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DragOutlined } from '@ant-design/icons'

import TableEditor from '../components/TableEditor'
import { slateValueToString } from '../utils/util'
import { tableLineReg, DEFAULT_TABLE } from '../utils/contants'
import './App.css'
import { useTranslation } from 'react-i18next'

const logseq = window.logseq
const logseqEditor = logseq.Editor

const isInBrowser = process.env.REACT_APP_ENV === 'browser'

const App = ({ content, tables, blockId }) => {
  const { t } = useTranslation()

  const tableEditorMapRef = useRef({})
  const [arrAfterSplitByTable, setArrAfterSplitByTable] = useState([])

  // Draggable state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  const setTableEditorRef = (index, dom) => {
    tableEditorMapRef.current = {
      ...tableEditorMapRef.current,
      [index]: dom,
    }
  }

  const onClickConfirm = useCallback(() => {
    if (!blockId && !isInBrowser) return logseq.UI.showMsg(t('uuid error'))
    const markdownContent = arrAfterSplitByTable.map((node, index) => {
      if (node.type === 'table') {
        const slateVal = tableEditorMapRef.current?.[index]?.getEditorValue()?.[0]
        console.log('[faiz:] === slateVal', slateVal)
        return slateValueToString(slateVal)
      }
      return node.str
    }).join('\n')
    if (isInBrowser) return console.log('[faiz:] === save content:\n', markdownContent, '\nblockId:', blockId)

    logseqEditor.updateBlock(blockId, markdownContent)
      .then(() => {
        logseq.hideMainUI()
        logseq.UI.showMsg(t('markdown table overwrite success'))
      })
      .catch(err => {
        logseq.UI.showMsg(t('markdown table overwrite error'), 'warning')
        console.log('[faiz:] === onClickConfirm error', err)
      })
  }, [blockId, arrAfterSplitByTable, t])
  const onClickCancel = () => logseq.hideMainUI()
  const onClickAdd = () => {
    setArrAfterSplitByTable(_arr => {
      if (_arr.find(node => node.type === 'table')) {
        // spreate table by empty line
        return _arr.concat([
          {
            type: 'notTable',
            str: '',
          },
          { type: 'table', str: DEFAULT_TABLE }
        ])
      }
      return _arr.concat({ type: 'table', str: DEFAULT_TABLE })
    })
  }
  const onKeydown = useCallback(e => {
    if (e.code === 'Escape') {
      e.preventDefault()
      onClickConfirm()
    } else if (e.code === 'Tab' && e.shiftKey === false) {
      e.preventDefault()
      Object.keys(tableEditorMapRef.current).forEach(key => {
        tableEditorMapRef.current?.[key]?.onKeydown('Tab')
      })
    } else if (e.code === 'Tab' && e.shiftKey) {
      e.preventDefault()
      Object.keys(tableEditorMapRef.current).forEach(key => {
        tableEditorMapRef.current?.[key]?.onKeydown('ShiftTab')
      })
    } else if (e.code === 'ArrowUp') {
      e.preventDefault()
      Object.keys(tableEditorMapRef.current).forEach(key => {
        tableEditorMapRef.current?.[key]?.onKeydown('ArrowUp')
      })
    } else if (e.code === 'ArrowDown') {
      e.preventDefault()
      Object.keys(tableEditorMapRef.current).forEach(key => {
        tableEditorMapRef.current?.[key]?.onKeydown('ArrowDown')
      })
    }
  }, [onClickConfirm])

  // Drag handlers
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
    e.preventDefault()
  }, [position])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    const arr = splitStrByTable(content, tables)
    setArrAfterSplitByTable(arr)
    console.log('[faiz:] === arrAfterSplitByTable', arr)
  }, [content, tables])
  useEffect(() => {
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }, [onKeydown])

  // Dragging effect
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="w-screen h-screen absolute" style={{ background: 'rgba(0, 0, 0, .3)', zIndex: -1 }} onClick={onClickCancel}></div>
      <div
        className="w-2/3 flex flex-col bg-white rounded-lg shadow-lg"
        style={{
          maxHeight: '80%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        {/* Draggable Header */}
        <div
          className="flex items-center justify-center py-2 px-4 bg-gray-100 rounded-t-lg border-b border-gray-200"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
        >
          <DragOutlined className="text-gray-500 mr-2" />
          <span className="text-gray-600 text-sm select-none">{t('Drag to move')}</span>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(80vh - 120px)' }}>
          <div className="flex flex-col">
            {
              arrAfterSplitByTable?.map((node, index) => {
                return node?.type === 'table'
                  ? (<TableEditor className="my-2" content={node?.str} key={index} ref={dom => setTableEditorRef(index, dom)} />)
                  : (<div className="bg-gray-400 text-gray-300 my-3 rounded px-1 py-2" key={index} style={{ whiteSpace: 'pre-line' }}>{node.str}</div>)
              })
            }
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-3 border-t border-gray-200">
          <Button ghost className="rounded flex items-center" icon={<PlusOutlined />} onClick={onClickAdd}>{t('Add New Table')}</Button>
          <div className="flex flex-row">
            <Button className="mr-1 rounded" onClick={onClickCancel}>{t('Cancel')}</Button>
            <Button className="rounded" type="primary" onClick={onClickConfirm}>{t('Confirm')}</Button>
          </div>
        </div>
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