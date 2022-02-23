import '@logseq/libs'
import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'

import App from './pages/App'
import parseMarkdownTable from './utils/parseRawInputByMarkdownIt'
// import { multipleTables, empty, longTables, onlyText, tableWithTextBeforeAndAfter } from './utils/testExample'
import { longTables } from './utils/testExample'
import './index.css'

const logseq = window.logseq
const logseqEditor = logseq.Editor
const logseqApp = logseq.App

const isInBrower = process.env.REACT_APP_ENV === 'browser'
const bootEditor = (input, blockId) => {
  console.log('[faiz:] === Raw Input: \n', input)
  let tables = parseMarkdownTable(input)
  console.log('[faiz:] === markdownIt parse res', tables)
  renderApp(input, tables, blockId)
}
if (isInBrower) {
  bootEditor(longTables, 111)
} else {
  logseq.ready().then(() => {
    // padding-left: var(--ls-left-sidebar-width);
    logseq.provideStyle(`
      iframe#logseq-markdown-table.lsp-iframe-sandbox {
        z-index: 10;
      }
    `)
    console.log('[faiz:] === markdown-table-editor-plugin loaded')
    const commandCallback = (e) => {
      console.log('[faiz:] === woz-markdown-table-editor', e)
      logseqEditor.getBlock(e.uuid).then(block => {
        console.log('[faiz:] === block', block)
        const { format, content } = block
        // only support markdown
        if (format !== 'markdown') return logseqApp.showMsg('woz-markdown-table-editor only support markdown', 'warning')

        bootEditor(content, e.uuid)

        // for empty block
        // todo: fix
        // if (content === '') return renderApp(DEFAULT_TABLE, [], e.uuid)

        // const tables = parseMarkdownTable(content)
        // if (tables?.length > 0) {
        //   // const [startLine, endLine] = tables[0]
        //   // const firstTable = content.split('\n').slice(startLine, endLine).join('\n')
        //   // console.log('[faiz:] === firstTable', content, firstTable, startLine, endLine)
        //   // return renderApp(firstTable, e.uuid)
        //   return renderApp(content, tables, e.uuid)
        // }

        // const renderHtml = md.render(content)
        // if (renderHtml.startsWith('<table>') && (renderHtml.endsWith('</table>') || renderHtml.endsWith('</table>\n'))) {
        //   return renderApp(content || DEFAULT_TABLE, e.uuid)
        // }
        // format to table error
        // window.logseq.App.showMsg('Sorry, block content format to markdown table error', 'warning')
        // console.log('[faiz:] === block content format to markdown table error')
      })
    }
    logseqEditor.registerBlockContextMenuItem('markdown-table-editor', commandCallback)
    logseqEditor.registerSlashCommand('markdown-table-editor', commandCallback)

    logseq.on('ui:visible:changed', (e) => {
      if (!e.visible) {
        ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      }
    });
  })
}

function renderApp(content, tables, blockId) {
  ReactDOM.render(
    <React.StrictMode>
      <App content={content} tables={tables} blockId={blockId} />
    </React.StrictMode>,
    document.getElementById('root')
  )
  if (!isInBrower) logseq.showMainUI()
}
