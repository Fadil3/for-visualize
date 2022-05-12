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
  const [isChange, setIsChange] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  function preprocess() {
    setError(false)
    setErrorMessage('')
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

    // getForAttribute(code)

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
      // console.log(line)
      if (line.endsWith(')')) {
        //check if next line has a curly braces
        if (code[code.indexOf(line) + 1] !== '{') {
          setError(true)
          setErrorMessage(`Error: missing semicolon at ${line}`)
        }
      }
    })
  }

  function getForAttribute(code) {
    let forAttribute = ''
    code.forEach((line) => {
      if (line.startsWith('for')) {
        forAttribute = line
      }
    })

    // split for attribute
    let forAttributeArray = forAttribute.split(';')
    console.log(forAttributeArray)

    // get value after = sign
    let initialValue = forAttributeArray[0].split('=')[1]
    console.log(initialValue)

    // check if include < , > , <= , >=
    let condition = forAttributeArray[1].includes('<')

    // get increment value
    let incrementValue = forAttributeArray[2].split(';')[0].includes('++')

    // console.log(initialValue)
    console.log(condition)
    console.log(boundaryValue)
    console.log(incrementValue)
    return forAttribute
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
                setIsChange(true)
                setIsSubmit(false)
              }}
            />
          </div>
          <div className="w-[550px] h-[500px] border mx-auto"></div>
        </div>
        <div className="flex gap-5">
          <button
            onClick={() => {
              preprocess()
              setIsSubmit(true)
            }}
            className={
              isSubmit
                ? ' mt-1 mb-5 px-5 py-2 rounded-md text-white bg-gray-300 focus:outline-none'
                : 'mt-1 mb-5 px-5 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-center animate-pulse text-white w-auto font-semibold text-lg active:scale-95 transition-transform transform'
            }
            disabled={isSubmit}
          >
            Visualisasikan !
          </button>
          {/* reset */}
          <button
            onClick={() => {
              setEditor(defaultValue)
              setIsChange(false)
              setIsSubmit(false)
              setErrorMessage('')
            }}
            className="mt-1 mb-5 px-5 py-2 rounded-md bg-gradient-to-r from-red-400 to-rose-500 text-center  text-white w-auto font-semibold text-lg active:scale-95 transition-transform transform"
          >
            Reset
          </button>
          {/* error */}
          {error && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}
        </div>
      </div>
    </>
  )
}
