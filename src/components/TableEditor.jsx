import { useState, useMemo, useCallback, useImperativeHandle, forwardRef } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'

import withTables from '../utils/withTable.js'
import ToolBar from '../components/ToolBar'
import { stringToSlateValue } from '../utils/util.js'
import { TableUtil } from '../utils/table'
import { DEFAULT_TABLE } from '../utils/contants'

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

const TableEditor = ({ content = DEFAULT_TABLE, className = '' }, ref) => {
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
  // console.log('[faiz:] === tableEditor input: \n', content)
  const [value, setValue] = useState([stringToSlateValue(content)])
  // console.log('[faiz:] === tableEditor format to Slate Editor Node: ', stringToSlateValue(content))

  const editor = useMemo(() => withTables(withReact(createEditor())), [])
  const tableUtil = useMemo(() => new TableUtil(editor), [editor])
  const renderElement = useCallback(props => <Element {...props} />, [])

  const onKeyDown = event => {
    // https://docs.slatejs.org/libraries/slate-react#editable
    if (event.key === 'Enter' && event.shiftKey) {
      editor.insertText('\n')
      return false
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      getEditorValue: () => value,
      onKeydown: (code) => {
        const isFocused = ReactEditor.isFocused(editor)
        if (!isFocused) return
        if (code === 'Tab') {
          tableUtil.edit('cursor-next')
        } else if (code === 'ShiftTab') {
          tableUtil.edit('cursor-prev')
        }
      },
    }),
    [value, editor, tableUtil]
  )

  return (
    <div className={className}>
      <Slate
        editor={editor}
        value={value}
        onChange={setValue}
      >
        <ToolBar />
        <Editable
          placeholder='Write something'
          renderElement={renderElement}
          onKeyDown={onKeyDown}
        />
      </Slate>
    </div>
  )
}

export default forwardRef(TableEditor)