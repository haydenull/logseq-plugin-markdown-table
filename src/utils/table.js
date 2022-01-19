import { Transforms, Editor, Range, Element } from "slate"
import { createTableNode } from "./util"
import { get } from 'lodash'

export class TableUtil {
  constructor(editor) {
    this.editor = editor;
  }

  insertTable = (rows, columns) => {
    const [tableNode] = Editor.nodes(this.editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "table",
      mode: "highest"
    });

    if (tableNode) return;
    if (!rows || !columns) {
      return;
    }
    const cellText = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => "")
    );
    const newTable = createTableNode(cellText);

    Transforms.insertNodes(this.editor, newTable, {
      mode: "highest"
    });
    Transforms.insertNodes(
      this.editor,
      { type: "paragraph", children: [{ text: "" }] },
      { mode: "highest" }
    );
  };

  insertCells = (tableNode, path, selection, action) => {
    const { anchor } = selection
    const cursorPosition = { row: anchor?.path[1], column: anchor?.path[2] }

    let existingText = Array.from(tableNode.children, (rows) =>
      Array.from(rows.children, (arr) => arr.children[0].text)
    );
    const columns = existingText[0].length;
    let newSelection = {...selection}

    if (action === 'insert-row-above') {
      existingText.splice(cursorPosition.row, 0, Array(columns).fill(''))
      let _path = [...anchor.path]
      _path.splice(1, 1, cursorPosition.row + 1)
      newSelection = {
        anchor: {
          ...newSelection.anchor,
          path: _path,
        },
        focus: {
          ...newSelection.focus,
          path: _path,
        }
      }
    } else if (action === 'insert-row-below') {
      existingText.splice(cursorPosition.row + 1, 0, Array(columns).fill(''))
    } else if (action === 'insert-column-above') {
      existingText = Array.from(existingText, (item) => {
        let _row = [...item]
        _row.splice(cursorPosition.column, 0, '')
        return _row
      })
      let _path = [...anchor.path]
      _path.splice(2, 1, cursorPosition.column + 1)
      newSelection = {
        anchor: {
          ...newSelection.anchor,
          path: _path,
        },
        focus: {
          ...newSelection.focus,
          path: _path,
        }
      }
    } else if (action === 'insert-column-below') {
      existingText = Array.from(existingText, (item) => {
        let _row = [...item]
        _row.splice(cursorPosition.column + 1, 0, '')
        return _row
      })
    } else if (action === 'delete-row' && existingText?.length > 1) {
      existingText.splice(cursorPosition.row, 1)
    } else if (action === 'delete-column' && columns > 1 ) {
      existingText = Array.from(existingText, (item) => {
        let _row = [...item]
        _row.splice(cursorPosition.column, 1)
        return _row
      })
    } else {
      return console.error('[insert cells run error]: unsupport action or can not delete', action, columns)
    }

    this.removeTable()
    const newTable = createTableNode(existingText);
    Transforms.insertNodes(this.editor, newTable, {
      at: path
    });
    if (action !== 'delete-row' && action !== 'delete-column') {
      // keep cursor position
      Transforms.select(this.editor, newSelection)
    }
  };

  removeTable = () => {
    Transforms.removeNodes(this.editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "table",
      mode: "highest"
    });
  };

  /**
   * insert or delete
   * @param {string} action 'insert-row-above' | 'insert-row-below' | 'insert-row-above' | 'insert-row-below' | 'delete-row' | 'delete-column'
   */
  edit = (action = 'insert-row-below') => {
    const { selection } = this.editor;
    if (!!selection && Range.isCollapsed(selection)) {
      const [tableNode] = Editor.nodes(this.editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "table"
      });
      if (tableNode) {
        const [oldTable, path] = tableNode;
        if (/^cursor-\w+/.test(action)) {
          this.moveCursor(oldTable, selection, action)
        } else {
          this.insertCells(oldTable, path, selection, action);
        }
      }
    }
  };

  moveCursor = (tableNode, selection, action = 'cursor-next') => {
    const { focus } = selection
    const cursorPosition = { row: focus?.path[1], column: focus?.path[2] }

    // console.log('[faiz:] === tableNode', tableNode)
    const rowsCount = tableNode.children.length
    const columnsCount = tableNode.children[0].children.length
    // console.log('[faiz:] === current cursor state', cursorPosition, rowsCount, columnsCount)

    function transformSelect(editor, _path) {
      const text = get(tableNode.children, _path.slice(1, 3).map(item => `[${item}].children`).concat(`[${_path[3]}].text`).join(''))
      const cursor = {
        path: _path,
        offset: text.length,
      }
      Transforms.select(editor, { anchor: cursor, focus: cursor })
    }

    if (action === 'cursor-next') {
      let path = [...focus.path]
      if (cursorPosition.column < columnsCount - 1) {
        // 横向移动到下一个
        path = [0, cursorPosition.row, cursorPosition.column + 1, 0]
      } else if (cursorPosition.row < rowsCount - 1) {
        // 处于当前行最后一个, 光标移动到下一行第一个
        path = [0, cursorPosition.row + 1, 0, 0]
      }
      transformSelect(this.editor, path)
    } else if (action === 'cursor-prev') {
      let path = [...focus.path]
      if (cursorPosition.column > 0) {
        // 横向移动到上一个
        path = [0, cursorPosition.row, cursorPosition.column - 1, 0]
      } else if (cursorPosition.row > 0) {
        // 处于当前行第一个, 光标移动到上一行最后一个
        path = [0, cursorPosition.row - 1, columnsCount - 1, 0]
      }
      transformSelect(this.editor, path)
    }

  }

}
