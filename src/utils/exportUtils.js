// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Export to Excel
export const exportToExcel = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// Export to PDF
export const exportToPDF = (data, title, columns) => {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  doc.autoTable({
    head: [columns],
    body: data.map(item => columns.map(col => item[col])),
  });
  doc.save(`${title}.pdf`);
};

// Export Members
export const exportMembers = (members) => {
  const columns = ['Name', 'Email', 'Phone', 'Membership', 'Status'];
  const data = members.map(m => ({
    Name: m.name,
    Email: m.email || 'N/A',
    Phone: m.phone,
    Membership: m.membership,
    Status: m.status
  }));
  exportToExcel(data, 'members_export');
};