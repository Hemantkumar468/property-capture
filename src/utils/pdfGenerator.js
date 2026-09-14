import { jsPDF } from 'jspdf';

/**
 * Builds the jsPDF instance for LOI document
 */
export function buildLoiJsPdf(item) {
  if (!item) return null;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [200, 138, 24]; // Gold accent #C88A18
  const darkColor = [31, 42, 68];      // Dark slate #1F2A44
  const textColor = [51, 65, 85];      // Slate #334155
  const lightBg = [248, 250, 252];

  // Header Banner
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 28, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('MYSTERY ROOMS GAMING PRIVATE LIMITED', 15, 14);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('ENTERPRISE CONSOLE — PROPERTY FMS', 15, 21);

  // Gold accent bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 28, 210, 2, 'F');

  // Title
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('LETTER OF INTENT (LOI)', 105, 42, { align: 'center' });

  // Subtitle / Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Document Reference Date: ${item.startedOn || '14 Sep 2025'}`, 105, 48, { align: 'center' });

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 52, 195, 52);

  // Section 1: Overview Details
  let y = 60;

  const addField = (label, value) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.text(label, 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    
    const splitText = doc.splitTextToSize(String(value || '-'), 125);
    doc.text(splitText, 65, y);

    y += Math.max(7, splitText.length * 5.5);
  };

  addField('From:', 'Mystery Rooms Gaming Private Limited');
  addField('To / Lessor:', `Property Owner / Lessor (${item.propertyName || 'N/A'})`);
  addField('Subject:', `Proposal for Lease of Commercial Space at ${item.location || 'Bhopal, MP'}`);

  y += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, 195, y);
  y += 6;

  // Key Commercial Terms Table / Container
  doc.setFillColor(...lightBg);
  doc.roundedRect(15, y, 180, 78, 3, 3, 'F');
  doc.setDrawColor(200, 138, 24);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, y, 180, 78, 3, 3, 'S');

  let tableY = y + 8;
  const addTermRow = (termLabel, termVal) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.setFontSize(9.5);
    doc.text(termLabel, 20, tableY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9.5);
    doc.text(String(termVal || '-'), 70, tableY);

    tableY += 8;
  };

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.text('SUMMARY OF LEASE & COMMERCIAL TERMS', 20, tableY);
  tableY += 7;

  addTermRow('Premises / Address:', `${item.propertyName || ''}, ${item.fullAddress || item.location || ''} (${item.sqft || ''})`);
  addTermRow('Lessee:', `Mystery Rooms / ${item.leadName || ''} (${item.sourceTag || 'Phase 4 Cleared'})`);
  addTermRow('Monthly Rent:', item.rent || '-');
  addTermRow('Security Deposit:', item.deposit || '-');
  addTermRow('Lease Period:', `${item.leaseTerm || '-'} (Lock-in: ${item.lockIn || '-'})`);
  addTermRow('Rent Escalation:', item.escalation || '-');

  y += 86;

  // Terms and Disclaimer Notice
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.text('Terms & Legal Conditions:', 15, y);
  y += 5;

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8.5);
  const termsText = 'This Letter of Intent (LOI) sets out the principal terms and commercial framework of agreement for the leasing of the aforementioned property. This document serves as an initial understanding between parties and the final binding lease agreement remains subject to complete legal clearance, title verification, and executive approval.';
  const splitTerms = doc.splitTextToSize(termsText, 180);
  doc.text(splitTerms, 15, y);

  y += splitTerms.length * 4.5 + 15;

  // Signatures Section
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.setFontSize(9.5);

  // Left Signature
  doc.line(15, y, 85, y);
  doc.text('Authorized Signatory', 15, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Mystery Rooms Gaming Pvt. Ltd.', 15, y + 9);

  // Right Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.line(125, y, 195, y);
  doc.text('Lessor / Property Owner', 125, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(item.propertyName || 'Lessor Acceptance', 125, y + 9);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated automatically via Mystery Rooms Property FMS on ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' });

  return doc;
}

/**
 * Downloads the PDF file directly
 */
export function downloadLoiPdf(item) {
  const doc = buildLoiJsPdf(item);
  if (!doc) return;
  const fileName = `LOI_${(item.propertyName || 'Agreement').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
}

/**
 * Opens PDF in a new browser tab for viewing
 */
export function openLoiPdfInNewTab(item) {
  const doc = buildLoiJsPdf(item);
  if (!doc) return;
  const blobUrl = doc.output('bloburl');
  window.open(blobUrl, '_blank');
}

/**
 * Triggers clean print view for LOI
 */
export function printLoiDocument(item) {
  if (!item) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>LOI - ${item.propertyName || 'Mystery Rooms'}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #1F2A44; line-height: 1.6; }
          .header { border-bottom: 2px solid #C88A18; padding-bottom: 10px; margin-bottom: 20px; }
          .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; }
          .section { margin-bottom: 15px; }
          .label { font-weight: bold; width: 140px; display: inline-block; }
          .box { background: #F8FAFC; border: 1px solid #C88A18; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .box-row { margin-bottom: 8px; }
          .box-label { font-weight: bold; color: #1F2A44; width: 150px; display: inline-block; }
          .box-val { font-weight: bold; color: #C88A18; }
          .footer { margin-top: 50px; font-size: 11px; color: #64748B; font-style: italic; }
          .signatures { margin-top: 60px; display: flex; justify-content: space-between; }
          .sig-line { width: 200px; border-top: 1px solid #1F2A44; text-align: center; padding-top: 5px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin:0;">MYSTERY ROOMS GAMING PRIVATE LIMITED</h2>
          <small>ENTERPRISE CONSOLE — PROPERTY FMS</small>
        </div>
        <div class="title">Letter of Intent (LOI)</div>
        <div class="section"><span class="label">Date:</span> ${item.startedOn || '14 Sep 2025'}</div>
        <div class="section"><span class="label">From:</span> Mystery Rooms Gaming Private Limited</div>
        <div class="section"><span class="label">To:</span> Property Owner / Lessor (${item.propertyName || ''})</div>
        <div class="section"><span class="label">Subject:</span> Proposal for Lease of Commercial Space at ${item.location || ''}</div>
        
        <div class="box">
          <div class="box-row"><span class="box-label">Premises:</span> <span class="box-val">${item.propertyName || ''}, ${item.fullAddress || item.location || ''} (${item.sqft || ''})</span></div>
          <div class="box-row"><span class="box-label">Lessee:</span> <span class="box-val">Mystery Rooms / ${item.leadName || ''} (${item.sourceTag || 'Phase 4 Cleared'})</span></div>
          <div class="box-row"><span class="box-label">Monthly Rent:</span> <span class="box-val">${item.rent || '-'}</span></div>
          <div class="box-row"><span class="box-label">Security Deposit:</span> <span class="box-val">${item.deposit || '-'}</span></div>
          <div class="box-row"><span class="box-label">Lease Period:</span> <span class="box-val">${item.leaseTerm || '-'} (Lock-in: ${item.lockIn || '-'})</span></div>
          <div class="box-row"><span class="box-label">Rent Escalation:</span> <span class="box-val">${item.escalation || '-'}</span></div>
        </div>

        <div class="footer">
          This Letter of Intent sets out the principal terms of agreement for the leasing of the aforementioned property. Final binding agreement is subject to legal clearance.
        </div>

        <div class="signatures">
          <div class="sig-line">Authorized Signatory<br/><small>Mystery Rooms Gaming Pvt. Ltd.</small></div>
          <div class="sig-line">Lessor / Property Owner<br/><small>${item.propertyName || ''}</small></div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 300);
}
