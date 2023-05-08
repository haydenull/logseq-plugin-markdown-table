import { useSlate } from 'slate-react'
import { InsertRowAboveOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, InsertRowRightOutlined, DeleteRowOutlined, DeleteColumnOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

import { TableUtil } from '../utils/table'

const ToolBar = () => {
  const editor = useSlate()

  const table = new TableUtil(editor)

  const handleButtonClick = (e, action) => {
    e.preventDefault()
    table.edit(action)
  }

  return (
    <div className="mb-2 space-x-2 bg-white inline-flex px-3 py-1 rounded-md shadow-sm">
      <Tooltip title="insert row above" arrowPointAtCenter placement="topLeft">
        <InsertRowAboveOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'insert-row-above')} />
      </Tooltip>
      <Tooltip title="insert row below" arrowPointAtCenter placement="topLeft">
        <InsertRowBelowOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'insert-row-below')} />
      </Tooltip>
      <Tooltip title="delete row" arrowPointAtCenter placement="topLeft">
        <DeleteRowOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'delete-row')} />
      </Tooltip>

      <div className="border-l border-gray-300"></div>

      <Tooltip title="insert column before" arrowPointAtCenter placement="topLeft">
        <InsertRowLeftOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'insert-column-above')} />
      </Tooltip>
      <Tooltip title="insert column after" arrowPointAtCenter placement="topLeft">
        <InsertRowRightOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'insert-column-below')} />
      </Tooltip>
      <Tooltip title="delete column" arrowPointAtCenter placement="topLeft">
        <DeleteColumnOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'delete-column')} />
      </Tooltip>

    </div>
  )
}

export default ToolBar
