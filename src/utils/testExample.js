export const empty = ''

export const onlyText = 'normal text\nnor'

export const onlyOneTable = '|title1|title2|\n|--|--|\n|content1|content2|'

export const tableWithTextBefore = 'foo\n`yarn install`\n|title1|title2|\n|--|--|\n|content1|content2|'

export const tableWithTextBeforeAndAfter = 'foo\n`yarn install`\n|title1|title2|\n|--|--|\n|content1|content2|\n**bold**\nother'

export const multipleTables = 'foo\n`yarn install`\n|title1|title2|\n|--|--|\n|content1|content2|\n|**bold**|\nother\n\n|table2|table2|\n|--|--|\n|contentB|contentB|\ntest text'

export const longTables = 'foo\n`yarn install`\n|title1|title2|\n|--|--|\n|content1|content2|\n\n**bold**\nother\n\n|table2|table2|\n|--|--|\n|contentB|contentB|\n\n|table2|table2|\n|--|--|\n|contentB|contentB|\n|contentB|contentB|\n|contentB|contentB|\n|contentB|contentB|'