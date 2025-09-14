import React from 'react'

interface TableRendererProps {
  rows: number
  cols: number
  content: string
}

const TableRenderer: React.FC<TableRendererProps> = ({ rows, cols, content }) => {
  const parseTableContent = (htmlContent: string): string[][] => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const table = doc.querySelector('table')
    
    if (!table) {
      // Fallback: create default table structure
      const tableData: string[][] = []
      for (let i = 0; i < rows; i++) {
        const row: string[] = []
        for (let j = 0; j < cols; j++) {
          if (i === 0) {
            row.push(`Column ${j + 1}`)
          } else {
            row.push(`Row ${i} Col ${j + 1}`)
          }
        }
        tableData.push(row)
      }
      return tableData
    }

    // Extract data from existing table
    const tableData: string[][] = []
    const tableRows = table.querySelectorAll('tr')
    
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('th, td')
      const rowData: string[] = []
      cells.forEach(cell => {
        rowData.push(cell.textContent || '')
      })
      if (rowData.length > 0) {
        tableData.push(rowData)
      }
    })
    
    return tableData
  }

  const tableData = parseTableContent(content)

  if (tableData.length === 0) {
    return (
      <div className="my-6 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        <p>Table could not be rendered</p>
      </div>
    )
  }

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-gray-50">
            {tableData[0]?.map((header, index) => (
              <th
                key={index}
                className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 bg-gray-100"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-gray-300 px-4 py-3 text-gray-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableRenderer