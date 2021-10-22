import '@logseq/libs'
import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import './index.css'
import App from './pages/App'

const logseq = window.logseq
const logseqEditor = logseq.Editor
const logseqApp = logseq.App

logseq.ready().then(() => {
  // padding-left: var(--ls-left-sidebar-width);
  logseq.provideStyle(`
    iframe#hayden_markdown_table.lsp-iframe-sandbox {
      z-index: 10;
    }
  `)
  console.log('[faiz:] === markdown-table-editor-plugin loaded')
  logseqEditor.registerBlockContextMenuItem('woz-markdown-table-editor', (e) => {
    console.log('[faiz:] === woz-markdown-table-editor', e)
    logseqEditor.getBlock(e.uuid).then(block => {
      console.log('[faiz:] === block', block)
      const { format, content } = block
      if (format !== 'markdown') return logseqApp.showMsg('woz-markdown-table-editor only support markdown')
      renderApp(content, e.uuid)
      logseq.showMainUI()
    })
  })
})

const renderApp = (initialTableContent, blockId) => {
  ReactDOM.render(
    <React.StrictMode>
      <App initialTableContent={initialTableContent} blockId={blockId} />
    </React.StrictMode>,
    document.getElementById('root')
  )
}


// debug
// renderApp()