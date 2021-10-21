import { Editor, Range, Point, Element } from 'slate'

const withTable = (editor) => {
  const { deleteBackward, deleteForward, insertBreak } = editor

  editor.deleteBackward = unit => {
    const { selection } = editor;
    if (selection) {
      const [cell] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'table-cell',
      })
      const prevNodePath = Editor.before(editor, selection)

      const [tableNode] = Editor.nodes(editor, {
        at: prevNodePath,
        match: n => !Editor.isEditor(n) && Element.isElement && n.type === 'table-cell'
      })

      if (cell) {
        const [, cellPath] = cell

        const start = Editor.start(editor, cellPath)
        if (Point.equals(selection.anchor, start)) {
          return
        }
      }
      if (!cell && tableNode) {
        return
      }
    }

    deleteBackward(unit)
  }
  editor.deleteForward = unit => {
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'table-cell',
      })

      const prevNodePath = Editor.after(editor, selection)
      const [tableNode] = Editor.nodes(editor, {
        at: prevNodePath,
        match: n => !Editor.isEditor(n) && Element.isElement && n.type === 'table-cell'
      })


      if (cell) {
        const [, cellPath] = cell
        const end = Editor.end(editor, cellPath)

        if (Point.equals(selection.anchor, end)) {
          return
        }
      }
      if (!cell && tableNode) {
        return
      }
    }

    deleteForward(unit)
  }

  editor.insertBreak = () => {
    const { selection } = editor
    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'table',
      })

      if (table) {
        return
      }
    }

    insertBreak()
  }
  return editor;
}


export default withTable;