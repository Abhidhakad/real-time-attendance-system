import * as jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatDate, formatTime, formatDateTime, getTodayDateString, getDateString } from './date'

export const exportToPDF = (data, title) => {
  const doc = new jsPDF.jsPDF()
  
  doc.setFontSize(18)
  doc.text(title, 14, 22)
  
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30)
  
  const tableData = data.map(item => [
    item.userId?.name || item.name || 'N/A',
    item.date || getDateString(item.createdAt),
    item.punchIn?.time ? formatTime(item.punchIn.time) : 'N/A',
    item.punchOut?.time ? formatTime(item.punchOut.time) : 'N/A',
    item.workingHours ? `${item.workingHours}h` : 'N/A',
    item.status || 'N/A',
  ])
  
  autoTable(doc, {
    head: [['Name', 'Date', 'Punch In', 'Punch Out', 'Hours', 'Status']],
    body: tableData,
    startY: 40,
  })
  
  doc.save(`${title.replace(/\s+/g, '_')}_${getTodayDateString()}.pdf`)
}

export const exportToExcel = (data, title) => {
  const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
    'Name': item.userId?.name || item.name || 'N/A',
    'Email': item.userId?.email || item.email || 'N/A',
    'Department': item.userId?.department || item.department || 'N/A',
    'Date': item.date || getDateString(item.createdAt),
    'Punch In Time': item.punchIn?.time ? formatTime(item.punchIn.time) : 'N/A',
    'Punch Out Time': item.punchOut?.time ? formatTime(item.punchOut.time) : 'N/A',
    'Working Hours': item.workingHours || 0,
    'Status': item.status || 'N/A',
  })))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance')
  XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_')}_${getTodayDateString()}.xlsx`)
}
