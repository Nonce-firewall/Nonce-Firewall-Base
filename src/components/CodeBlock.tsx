import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Clipboard, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (fallbackErr) {
        alert('Failed to copy code to clipboard.')
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="relative my-6 group">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-800/90 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium shadow-lg backdrop-blur-sm border border-gray-600"
          aria-label="Copy code to clipboard"
        >
          {isCopied ? (
            <>
              <Check size={16} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Clipboard size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          padding: '1.5rem',
          paddingTop: '3.5rem',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          position: 'relative'
        }}
        codeTagProps={{
          style: {
            fontFamily: '"Fira Code", "JetBrains Mono", "Monaco", "Cascadia Code", monospace',
          },
        }}
        showLineNumbers
        wrapLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock