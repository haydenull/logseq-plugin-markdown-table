import { useState, useMemo, useCallback } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import withTables from '../utils/withTable.js'
import ToolBar from '../components/ToolBar'

import './App.css'

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

const SlateEditor = () => {
  const [value, setValue] = useState([
    // {
    //   type: 'paragaph',
    //   children: [{ text: 'First line of text in Slate JS. ' }],
    // },
    {
      type: 'table',
      children: [
        {
          type: 'table-row',
          children: [
            {
              type: 'table-cell',
              children: [
                {
                  text: 'title1',
                }
              ]
            },
            {
              type: 'table-cell',
              children: [
                {
                  text: 'title2',
                }
              ]
            },
          ]
        },
        {
          type: 'table-row',
          children: [
            {
              type: 'table-cell',
              children: [
                {
                  text: 'content1',
                }
              ]
            },
            {
              type: 'table-cell',
              children: [
                {
                  text: 'content2',
                }
              ]
            },
          ]
        },
      ]
    }
  ])

  const editor = useMemo(() => withTables(withReact(createEditor())), [])
  const renderElement = useCallback(props => <Element {...props} />, [])

  return (
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
  )
}

export default SlateEditor