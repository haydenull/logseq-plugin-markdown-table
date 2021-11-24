import MarkdownIt from "markdown-it"

const md = new MarkdownIt()

const parseMarkdownTable = (str) => {
  // token https://github.com/markdown-it/markdown-it/blob/master/lib/token.js
  const tokenList = md.parse(str)

  const tableOpenTokens = tokenList.filter(token => token?.type === 'table_open')

  // map is Sourse map, format [startLine, endLine]
  return tableOpenTokens.map(token => token.map)
}

export default parseMarkdownTable