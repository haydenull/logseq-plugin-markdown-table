// Import React dependencies.
import React, { useMemo, useState } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

function App() {
  const editor = useMemo(() => withReact(createEditor()), [])
  const initialValue = [
    {      type: 'paragraph',      children: [{ text: 'A line of text in a paragraph.' }],    },
  ]
  const [value, setValue] = useState(initialValue)
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}
    >
      <Editable />
    </Slate>
  )
}

export default App;
