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
    case 'table-header':
      return <th {...attributes}>{children}</th>
    case 'table-row':
      return <tr {...attributes}>{children}</tr>
    case 'table-cell':
      return <td {...attributes}>{children}</td>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const TableEditor = ({ content = DEFAULT_TABLE, className = '' }, ref) => {
  const [value, setValue] = useState([stringToSlateValue(content)])

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
        if (!ReactEditor.isFocused(editor))
          return

        switch (code) {
          case 'Tab':
            tableUtil.edit('cursor-next')
            break
          case 'ShiftTab':
            tableUtil.edit('cursor-prev')
            break
          case 'ArrowUp':
            tableUtil.edit('cursor-up')
            break
          case 'ArrowDown':
            tableUtil.edit('cursor-down')
            break
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