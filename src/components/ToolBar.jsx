import { useSlate } from 'slate-react'
import { InsertRowAboveOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, InsertRowRightOutlined, DeleteRowOutlined, DeleteColumnOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

import { TableUtil } from '../utils/table'

const ToolBar = () => {
  const { t } = useTranslation()
  const editor = useSlate()

  const table = new TableUtil(editor)

  const handleButtonClick = (e, action) => {
    e.preventDefault()
    table.edit(action)
  }

  return (
    <div className="mb-2 space-x-2 bg-white inline-flex px-3 py-1 rounded-md shadow-sm">
      <Tooltip title={t('insert row above')} arrowPointAtCenter placement="topLeft">
        <InsertRowAboveOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'insert-row-above')} />
      </Tooltip>
      <Tooltip title={t('insert row below')} arrowPointAtCenter placement="topLeft">
        <InsertRowBelowOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'insert-row-below')} />
      </Tooltip>
      <Tooltip title={t('delete row')} arrowPointAtCenter placement="topLeft">
        <DeleteRowOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'delete-row')} />
      </Tooltip>

      <div className="border-l border-gray-300"></div>

      <Tooltip title={t('insert column before')} arrowPointAtCenter placement="topLeft">
        <InsertRowLeftOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'insert-column-above')} />
      </Tooltip>
      <Tooltip title={t('insert column after')} arrowPointAtCenter placement="topLeft">
        <InsertRowRightOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'insert-column-below')} />
      </Tooltip>
      <Tooltip title={t('delete column')} arrowPointAtCenter placement="topLeft">
        <DeleteColumnOutlined className="text-xl cursor-pointer hover:opacity-70" onMouseDown={e => handleButtonClick(e, 'delete-column')} />
      </Tooltip>

    </div>
  )
}

export default ToolBar
