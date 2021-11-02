import { useState, useMemo, useCallback } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Button } from 'antd'

import withTables from '../utils/withTable.js'
import ToolBar from '../components/ToolBar'
import { stringToSlateValue, slateValueToString } from '../utils/util.js'
import { DEFAULT_TABLE } from '../utils/contants'

import './App.css'

const logseq = window.logseq
const logseqApp = logseq.App
const logseqEditor = logseq.Editor

const Element = props => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'table':
      return (<table>
        <tbody {...attributes}>{children}</tbody>
      </table>)
    case 'table-row':
      return <tr {...attributes}>{children}</tr>
    case 'table-cell':
      return <td {...attributes}>{children}</td>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const SlateEditor = ({ initialTableContent = DEFAULT_TABLE, blockId }) => {
  // const [value, setValue] = useState([
  //   // {
  //   //   type: 'paragaph',
  //   //   children: [{ text: 'First line of text in Slate JS. ' }],
  //   // },
    // {
    //   type: 'table',
    //   children: [
    //     {
    //       type: 'table-row',
    //       children: [
    //         {
    //           type: 'table-cell',
    //           children: [
    //             {
    //               text: 'title1',
    //             }
    //           ]
    //         },
    //         {
    //           type: 'table-cell',
    //           children: [
    //             {
    //               text: 'title2',
    //             }
    //           ]
    //         },
    //       ]
    //     },
    //     {
    //       type: 'table-row',
    //       children: [
    //         {
    //           type: 'table-cell',
    //           children: [
    //             {
    //               text: 'content1',
    //             }
    //           ]
    //         },
    //         {
    //           type: 'table-cell',
    //           children: [
    //             {
    //               text: 'content2',
    //             }
    //           ]
    //         },
    //       ]
    //     },
    //   ]
    // }
  // ])
  console.log('[faiz:] === initialTableContent', initialTableContent)
  const [value, setValue] = useState([stringToSlateValue(initialTableContent)])
  console.log('[faiz:] === createTableNode', stringToSlateValue(initialTableContent), initialTableContent)

  const editor = useMemo(() => withTables(withReact(createEditor())), [])
  const renderElement = useCallback(props => <Element {...props} />, [])

  const onClickCancel = () => {
    logseq.hideMainUI()
  }
  const onClickConfirm = () => {
    if (!blockId) return logseqApp.showMsg('uuid error')
    console.log('[faiz:] === onClickConfirm', blockId, value)
    const markdownContent = slateValueToString(value[0])
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

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-screen h-screen absolute" style={{ background: 'rgba(0, 0, 0, .3)', zIndex: -1 }} onClick={onClickCancel}></div>
      <div className="w-2/3 h-1/2">
        <Slate
          editor={editor}
          value={value}
          onChange={setValue}
        >
          <ToolBar />
          <Editable
            placeholder='Write something'
            renderElement={renderElement}
          />
        </Slate>
        <div className="mt-2 flex justify-end">
          <Button className="mr-1 rounded" onClick={onClickCancel}>Cancel</Button>
          <Button className="rounded" type="primary" onClick={onClickConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  )
}

export default SlateEditor