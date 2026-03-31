import jsPDF from 'jspdf';
import type { DocumentFormData } from '../types';

function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(26, 86, 219);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NyayaSaathi — Legal Aid Platform', 15, 9);
  doc.setFontSize(10);
  doc.text('nyayasaathi.in | Legal Information Only', 15, 15);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 15, 32);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Date: ' + new Date().toLocaleDateString('en-IN'), 150, 32);
  doc.setDrawColor(26, 86, 219);
  doc.line(15, 36, 195, 36);
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('DISCLAIMER: This is a template document for informational purposes only. This is not legal advice.', 15, 285);
    doc.text('Verify all information before submission. NyayaSaathi is not responsible for legal outcomes.', 15, 289);
    doc.text('Page ' + i + ' of ' + pageCount, 185, 289);
  }
}

function addField(doc: jsPDF, label: string, value: string, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(26, 86, 219);
  doc.text(label + ':', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const lines = doc.splitTextToSize(value || 'N/A', 165);
  doc.text(lines, 50, y);
  return y + (lines.length * 5) + 3;
}

export function generateComplaintPDF(fields: DocumentFormData, templateTitle: string, lawCitation: string): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  addHeader(doc, templateTitle);
  let y = 45;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TO,', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(fields.respondentName || 'The Appropriate Authority', 15, y); y += 5;
  const respLines = doc.splitTextToSize(fields.respondentAddress || '', 165);
  doc.text(respLines, 15, y); y += respLines.length * 5 + 8;
  doc.setFont('helvetica', 'bold');
  doc.text('SUBJECT: Complaint / Grievance Application', 15, y); y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Respected Sir/Madam,', 15, y); y += 7;
  const body = doc.splitTextToSize('I, ' + fields.name + ', residing at ' + fields.address + ', hereby lodge this complaint regarding the matter described below. The incident occurred on ' + fields.incidentDate + '. ' + fields.description + ' I request your kind intervention and appropriate action under the applicable laws including ' + lawCitation + '.', 180);
  doc.text(body, 15, y); y += body.length * 5 + 10;
  y = addField(doc, 'Complainant', fields.name, y);
  y = addField(doc, 'Address', fields.address, y);
  y = addField(doc, 'Phone', fields.phone, y);
  y = addField(doc, 'Date of Incident', fields.incidentDate, y);
  if (fields.amount) y = addField(doc, 'Amount Involved', fields.amount, y);
  y += 15;
  doc.text('Yours sincerely,', 15, y); y += 10;
  doc.text('____________________', 15, y); y += 5;
  doc.text(fields.name, 15, y); y += 5;
  doc.text(fields.date, 15, y);
  addFooter(doc);
  doc.save(templateTitle.replace(/\s+/g, '_') + '.pdf');
}

export function generateRTIPDF(fields: DocumentFormData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  addHeader(doc, 'RTI Application under Right to Information Act, 2005');
  let y = 45;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TO,', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('The Public Information Officer', 15, y); y += 5;
  doc.text(fields.authority || 'Concerned Government Department', 15, y); y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('SUBJECT: Application under Right to Information Act, 2005 — Section 6(1)', 15, y); y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Respected Public Information Officer,', 15, y); y += 7;
  const intro = doc.splitTextToSize('I, ' + fields.name + ', a citizen of India, residing at ' + fields.address + ', wish to seek the following information under the Right to Information Act, 2005:', 180);
  doc.text(intro, 15, y); y += intro.length * 5 + 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Information Requested:', 15, y); y += 6;
  doc.setFont('helvetica', 'normal');
  const infoLines = doc.splitTextToSize(fields.infoRequested || '', 175);
  doc.text(infoLines, 20, y); y += infoLines.length * 5 + 8;
  doc.text('Application fee of Rs. 10/- has been paid via [IPO/Postal Order/Online].', 15, y); y += 8;
  doc.text('I request you to provide the above information within 30 days as mandated by the Act.', 15, y); y += 15;
  doc.text('Yours faithfully,', 15, y); y += 10;
  doc.text('____________________', 15, y); y += 5;
  doc.text(fields.name, 15, y); y += 5;
  doc.text(fields.address, 15, y); y += 5;
  doc.text('Phone: ' + fields.phone, 15, y); y += 5;
  doc.text('Date: ' + fields.date, 15, y);
  addFooter(doc);
  doc.save('RTI_Application.pdf');
}

export function generateChecklistPDF(items: { item: { en: string }, checked: boolean }[], situationTitle: string): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  addHeader(doc, 'Document Checklist — ' + situationTitle);
  let y = 45;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Documents Required:', 15, y); y += 10;
  items.forEach((it, i) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const box = it.checked ? '[X]' : '[ ]';
    doc.text(box + '  ' + (i + 1) + '. ' + it.item.en, 15, y);
    y += 8;
  });
  addFooter(doc);
  doc.save('Document_Checklist.pdf');
}
