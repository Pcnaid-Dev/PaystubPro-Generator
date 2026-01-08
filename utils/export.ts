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

  let md = `# PAY STATEMENT - ${data.companyName}\n\n`;
  md += `**Employee:** ${data.employeeName}  \n`;
  md += `**Address:** ${data.employeeAddress}  \n`;
  md += `**ID:** ${data.employeeId} | **Pay Date:** ${calculated.payDate} | **Check #:** ${calculated.checkNumber}\n\n`;

  md += `## Earnings\n`;
  md += `| Item | Rate | Hours | Current | YTD |\n`;
  md += `|---|---:|---:|---:|---:|\n`;
  calculated.earnings.forEach(e => {
    md += `| ${e.name} | ${e.rate.toFixed(2)} | ${e.hours.toFixed(2)} | ${formatCurrency(e.current)} | ${formatCurrency(e.ytd)} |\n`;
  });
  md += `| **Total** | | | **${formatCurrency(calculated.grossPayCurrent)}** | **${formatCurrency(calculated.grossPayYTD)}** |\n\n`;

  md += `## Taxes\n`;
  md += `| Tax | Current | YTD |\n`;
  md += `|---|---:|---:|\n`;
  md += `| Federal Tax | ${formatCurrency(calculated.fedTaxCurrent)} | ${formatCurrency(calculated.fedTaxYTD)} |\n`;
  md += `| Social Security | ${formatCurrency(calculated.ssTaxCurrent)} | ${formatCurrency(calculated.ssTaxYTD)} |\n`;
  md += `| Medicare | ${formatCurrency(calculated.medicareTaxCurrent)} | ${formatCurrency(calculated.medicareTaxYTD)} |\n`;
  if (calculated.stateTaxCurrent > 0 || calculated.stateTaxYTD > 0) {
      md += `| State Tax | ${formatCurrency(calculated.stateTaxCurrent)} | ${formatCurrency(calculated.stateTaxYTD)} |\n`;
  }
  md += `\n`;

  if (calculated.deductions.length > 0) {
      md += `## Deductions\n`;
      md += `| Item | Current | YTD |\n`;
      md += `|---|---:|---:|\n`;
      calculated.deductions.forEach(d => {
        md += `| ${d.name} | ${formatCurrency(d.current)} | ${formatCurrency(d.ytd)} |\n`;
      });
      md += `\n`;
  }

  md += `## Summary\n`;
  md += `| Category | Current | YTD |\n`;
  md += `|---|---:|---:|\n`;
  md += `| **Gross Pay** | **${formatCurrency(calculated.grossPayCurrent)}** | **${formatCurrency(calculated.grossPayYTD)}** |\n`;
  
  const totalTaxesCurrent = calculated.fedTaxCurrent + calculated.ssTaxCurrent + calculated.medicareTaxCurrent + calculated.stateTaxCurrent;
  const totalTaxesYTD = calculated.fedTaxYTD + calculated.ssTaxYTD + calculated.medicareTaxYTD + calculated.stateTaxYTD;
  
  md += `| Total Taxes | ${formatCurrency(totalTaxesCurrent)} | ${formatCurrency(totalTaxesYTD)} |\n`;
  
  const totalDedOnlyCurrent = calculated.deductions.reduce((a,b)=>a+b.current,0);
  const totalDedOnlyYTD = calculated.deductions.reduce((a,b)=>a+b.ytd,0);

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
