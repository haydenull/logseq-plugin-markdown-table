import MarkdownIt from "markdown-it"

import { tableLineReg } from "./contants"

const md = new MarkdownIt()

const parseMarkdownTable = (str) => {
  const strArr = str.split('\n')
  // token https://github.com/markdown-it/markdown-it/blob/master/lib/token.js
  const tokenList = md.parse(str)

  return tokenList
    .filter(token => token?.type === 'table_open')
    .map(token => {
      // map is Sourse map, format [startLine, endLine]
      let [startLine , endLine] = token.map
      const endLineStr = strArr[endLine]

      if (tableLineReg.test(endLineStr)) return token.map

      // fix markdown-it table must have a newLine after
      let trueEndLine = -1
      while (endLine > startLine) {
        if (tableLineReg.test(strArr[endLine])) {
          trueEndLine = endLine
          break
        }
        endLine--
      }
      return [startLine, trueEndLine + 1]
    })
}

export default parseMarkdownTable