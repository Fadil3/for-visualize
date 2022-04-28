import { cpp } from '@codemirror/lang-cpp'
import CodeMirror from '@uiw/react-codemirror'
import React, { useState } from 'react'

export default function Index() {
  const defaultValue = `// Print numbers from 1 to 10
#include <stdio.h>

int main() {
  int i;

  for (i = 1; i < 11; ++i)
  {
    printf("%d ", i);
  }
  return 0;
}`
  const [editor, setEditor] = useState(defaultValue)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function preprocess() {
    let code = editor.split('\n')

    // trim spaces
    code = code.map((line) => line.trim())

    // remove comments
    code = code.map((line) => {
      if (line.startsWith('//')) {
        return ''
      }
      return line
    })

    // move curly braces to new line
    code = splitCurlyBraces(code)

    checkPairCurlyBraces(code)
    checkSemicolon(code)

    // remove empty lines
    code = code.filter((line) => line.length > 0)

    console.log(code)
    console.log(error)
    console.log(errorMessage)
  }

  function splitCurlyBraces(code) {
    let newCode = []
    code = code.map((line) => {
      if (line.endsWith('}') || line.endsWith('{')) {
        // if length of line is 1, then it is a curly brace
        if (line.length === 1) {
          return newCode.push(line)
        }

        let lastChar = line.charAt(line.length - 1)
        //push to code and remove last char
        newCode.push(line.slice(0, -1))

        // push last char
        newCode.push(lastChar)
      } else {
        newCode.push(line)
      }
    })
    return newCode
  }

  function checkPairCurlyBraces(code) {
    // check if there is a pair of curly braces
    let curlyBraces = 0
    code.forEach((line) => {
      if (line === '{') {
        curlyBraces++
      } else if (line === '}') {
        curlyBraces--
      }
    })
    if (curlyBraces !== 0) {
      setError(true)
      setErrorMessage('Error: not all curly braces are paired')
    }
  }

  function checkSemicolon(code) {
    code.forEach((line) => {
      console.log(line)
      if (line.endsWith(')')) {
        //check if next line has a curly braces
        if (code[code.indexOf(line) + 1] !== '{') {
          setError(true)
          setErrorMessage(`Error: missing semicolon at ${line}`)
        }
      }
    })
  }

  return (
    <>
      <div className="mt-5 flex flex-col gap-3 justify-evenly items-center">
        <h1 className=" font-bold text-center text-3xl">For Visualizer</h1>
        <div className="w-full flex justify-around items-center mt-3">
          <div className="w-[555px] mx-auto border-slate-500 border-2">
            <CodeMirror
              value={editor}
              height="500px"
              width="550px"
              extensions={cpp()}
              className="mx-auto "
              onChange={(editor, viewUpdate) => {
                setEditor(editor)
              }}
            />
          </div>
          <div className="w-[550px] h-[500px] border mx-auto"></div>
        </div>
        <button
          onClick={() => console.log(preprocess())}
          className="mt-1 mb-5 px-5 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-center animate-pulse text-white w-auto font-semibold text-lg active:scale-95 transition-transform transform"
        >
          Visualisasikan !
        </button>
      </div>
    </>
  )
}
