import { cpp } from '@codemirror/lang-cpp'
import CodeMirror from '@uiw/react-codemirror'
import React, { useState } from 'react'

export default function Index() {
  const [value, setValue] = useState('')

  // get line by line from value and trim
  const lines = value.split('\n')

  return (
    <>
      <div className="mt-5 flex flex-col gap-3 justify-evenly items-center">
        <h1 className=" font-bold text-center text-4xl">Test Code mirror</h1>
        <div className="w-[455px] mt-10 mx-auto border-slate-500 border-2">
          <CodeMirror
            value={value}
            height="500px"
            width="450px"
            extensions={cpp()}
            className="mx-auto "
            onChange={(value, viewUpdate) => {
              setValue(value)
            }}
          />
        </div>
        <button
          onClick={() => console.log(lines)}
          className="mb-5 px-5 py-2 rounded-md hover:bg-green-600 bg-green-500 text-center text-white w-auto"
        >
          Test
        </button>
      </div>
    </>
  )
}
