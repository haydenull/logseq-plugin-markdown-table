import { Editor, Range, Point, Element, Transforms, Node } from 'slate'

const withTable = (editor) => {
  const { deleteBackward, deleteForward, insertBreak, insertFragment } = editor

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

  editor.insertFragment = (fragment) => {
    const inTable = Editor.above(editor, {
      match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-cell',
    })

    if (inTable) {
      // In a table, we need to strip the attributes of the node,
      // and just keep the text. Otherwise pasting doesn't work properly
      const text = fragment.map(node => Node.string(node))
      Transforms.insertText(editor, text)
    } else {
      // If we're not in a table, use the default behavior
      insertFragment(fragment)
    }
  }

  return editor;
}


export default withTable;
