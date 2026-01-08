import html2canvas from 'html2canvas';
import { PaystubData, CalculatedPaystub } from '../types';

export const downloadImage = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Preview element not found");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error("Failed to generate image", err);
  }
};

export const generateMarkdown = (data: PaystubData, calculated: CalculatedPaystub): string => {
  const formatCurrency = (num: number) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  let md = `# PAY STATEMENT\n\n`;

  // General Info Table
  md += `| Reference | Details |\n`;
  md += `|---|---|\n`;
  md += `| **Company** | ${data.companyName} |\n`;
  md += `| **Employee** | ${data.employeeName} |\n`;
  md += `| **Employee ID** | ${data.employeeId} |\n`;
  md += `| **Pay Date** | ${calculated.payDate} |\n`;
  md += `| **Check #** | ${calculated.checkNumber} |\n\n`;

  // Earnings
  md += `### Earnings\n`;
  md += `| Description | Rate | Current Hours | Current Amount | YTD Amount |\n`;
  md += `|---|---:|---:|---:|---:|\n`;
  calculated.earnings.forEach(e => {
    md += `| ${e.name} | ${e.rate.toFixed(2)} | ${e.hours.toFixed(2)} | ${formatCurrency(e.current)} | ${formatCurrency(e.ytd)} |\n`;
  });
  md += `| **Total Earnings** | | | **${formatCurrency(calculated.grossPayCurrent)}** | **${formatCurrency(calculated.grossPayYTD)}** |\n\n`;

  // Taxes
  md += `### Taxes\n`;
  md += `| Tax Type | Current Amount | YTD Amount |\n`;
  md += `|---|---:|---:|\n`;
  md += `| Federal Tax | ${formatCurrency(calculated.fedTaxCurrent)} | ${formatCurrency(calculated.fedTaxYTD)} |\n`;
  md += `| Social Security | ${formatCurrency(calculated.ssTaxCurrent)} | ${formatCurrency(calculated.ssTaxYTD)} |\n`;
  md += `| Medicare | ${formatCurrency(calculated.medicareTaxCurrent)} | ${formatCurrency(calculated.medicareTaxYTD)} |\n`;
  if (calculated.stateTaxCurrent > 0 || calculated.stateTaxYTD > 0) {
      md += `| State Tax | ${formatCurrency(calculated.stateTaxCurrent)} | ${formatCurrency(calculated.stateTaxYTD)} |\n`;
  }
  md += `\n`;

  // Deductions
  if (calculated.deductions.length > 0) {
      md += `### Deductions\n`;
      md += `| Description | Current Amount | YTD Amount |\n`;
      md += `|---|---:|---:|\n`;
      calculated.deductions.forEach(d => {
        md += `| ${d.name} | ${formatCurrency(d.current)} | ${formatCurrency(d.ytd)} |\n`;
      });
      md += `\n`;
  }

  // Summary
  const totalTaxesCurrent = calculated.fedTaxCurrent + calculated.ssTaxCurrent + calculated.medicareTaxCurrent + calculated.stateTaxCurrent;
  const totalTaxesYTD = calculated.fedTaxYTD + calculated.ssTaxYTD + calculated.medicareTaxYTD + calculated.stateTaxYTD;
  
  const totalDedOnlyCurrent = calculated.deductions.reduce((a,b)=>a+b.current,0);
  const totalDedOnlyYTD = calculated.deductions.reduce((a,b)=>a+b.ytd,0);

  md += `### Summary\n`;
  md += `| Category | Current Amount | YTD Amount |\n`;
  md += `|---|---:|---:|\n`;
  md += `| **Gross Pay** | **${formatCurrency(calculated.grossPayCurrent)}** | **${formatCurrency(calculated.grossPayYTD)}** |\n`;
  md += `| Total Taxes | ${formatCurrency(totalTaxesCurrent)} | ${formatCurrency(totalTaxesYTD)} |\n`;
  md += `| Total Deductions | ${formatCurrency(totalDedOnlyCurrent)} | ${formatCurrency(totalDedOnlyYTD)} |\n`;
  md += `| **Net Pay** | **${formatCurrency(calculated.netPayCurrent)}** | **${formatCurrency(calculated.netPayYTD)}** |\n`;

  return md;
};

export const downloadMarkdown = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};