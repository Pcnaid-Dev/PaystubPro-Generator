import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { calculatePaystub } from './calculations';
import { PaystubData } from '../types';

// Helper to wait for DOM updates
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateCombinedPDF = async (
  data: PaystubData, 
  count: number, 
  previewElementId: string,
  setTempOverrideData: (data: any | null) => void // Function to force update the preview view
) => {
  // Use 'p' for portrait, 'mm' units, 'a4' format (standard international, though US Letter is 216x279)
  // html2canvas capture will determine the aspect ratio
  const pdf = new jsPDF('p', 'mm', 'letter'); 
  
  // Set PDF Metadata
  // Cast to any to allow setting 'producer' which might not be in the strict TypeScript definition but is a valid PDF Info field
  pdf.setProperties({
    title: 'Payroll Checks',
    subject: 'Statement of Earnings and Deductions',
    author: data.companyName,
    creator: 'Pcnaid Reporting Engine, version: 4.7.0',
    producer: 'SAP Crystal Reports'
  } as any);

  const pdfWidth = pdf.internal.pageSize.getWidth();
  
  const element = document.getElementById(previewElementId);
  if (!element) {
    console.error("Preview element not found");
    return;
  }

  // Loop backwards from 0 (current) to count-1
  for (let i = 0; i < count; i++) {
    // 1. Calculate data for this specific past period
    const historicalStub = calculatePaystub(data, i);
    
    // 2. Update the View by setting a temporary override state in the main App
    setTempOverrideData(historicalStub);

    // 3. Wait for React to render (short delay)
    await wait(500);

    // 4. Capture
    // Using scale 2 or 3 ensures high quality text
    const canvas = await html2canvas(element, {
      scale: 3, 
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff' // Ensure white background for the print
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    
    // Calculate height based on width to maintain aspect ratio
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 5. Add to PDF
    if (i > 0) {
      pdf.addPage();
    }
    
    // Position at 0,0 to utilize the component's internal padding as the page margin
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
  }

  // Reset the view to normal
  setTempOverrideData(null);

  // Save
  pdf.save(`paystubs_${data.employeeName.replace(/\s+/g, '_')}_portrait.pdf`);
};