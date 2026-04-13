import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import Button from './Button'
import { exportToPDF, exportToExcel } from '../utils'

const ExportButton = ({ data, title = 'Report', format = 'both' }) => {
  const handleExportPDF = () => {
    exportToPDF(data, title)
  }

  const handleExportExcel = () => {
    exportToExcel(data, title)
  }

  return (
    <div className="flex gap-2">
      {format === 'both' || format === 'pdf' ? (
        <Button onClick={handleExportPDF} variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          PDF
        </Button>
      ) : null}
      {format === 'both' || format === 'excel' ? (
        <Button onClick={handleExportExcel} variant="outline" size="sm">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Excel
        </Button>
      ) : null}
    </div>
  )
}

export default ExportButton
