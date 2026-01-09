import React, { useState, useMemo } from 'react';
import { PaystubData, PayFrequency, EmploymentType, CalculatedPaystub } from './types';
import { calculatePaystub } from './utils/calculations';
import { generateCombinedPDF } from './utils/pdfGenerator';
import { downloadImage, generateMarkdown, downloadMarkdown } from './utils/export';
import InputForm from './components/InputForm';
import PaystubPreview from './components/PaystubPreview';
import { Printer, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';

const INITIAL_DATA: PaystubData = {
  companyName: 'Tech Solutions Inc.',
  companyAddressStreet: '101 Silicon Valley Blvd',
  companyAddressCity: 'San Jose',
  companyAddressState: 'CA',
  companyAddressZip: '94000',
  employeeName: 'Jane Smith',
  employeeAddressStreet: '42 Wallaby Way',
  employeeAddressCity: 'Sydney',
  employeeAddressState: 'TX',
  employeeAddressZip: '76000',
  employeeId: 'EMP-9921',
  ssnLast4: '1234',
  accountLast4: '9876',
  maritalStatus: 'Single',
  exemptions: 1,
  hireDate: '2023-01-15',
  payDate: format(new Date(), 'yyyy-MM-dd'),
  payFrequency: PayFrequency.BiWeekly,
  employmentType: EmploymentType.Salary,
  hourlyRate: 25.00,
  hoursPerWeek: 40,
  annualSalary: 85000,
  includeRandomDeductions: true,
  federalTaxRate: 12,
  stateTaxRate: 0,
  vacationBalance: 45.5,
  vacationUsed: 16.0,
  sickBalance: 24.0,
  sickUsed: 8.0,
};

export default function App() {
  const [data, setData] = useState<PaystubData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [stubCount, setStubCount] = useState(1);
  
  // This state is used ONLY during PDF generation to override the view with historical data
  const [tempOverrideData, setTempOverrideData] = useState<CalculatedPaystub | null>(null);

  // Derived state for the live preview
  const liveCalculated = useMemo(() => calculatePaystub(data), [data]);

  // Use either the temporary override (for PDF loop) or the live data
  const displayedCalculated = tempOverrideData || liveCalculated;

  const handlePrintClick = () => {
    setShowPrintModal(true);
  };

  const handleConfirmPrint = async () => {
    setShowPrintModal(false);
    setIsGenerating(true);
    try {
      // Small timeout to allow modal to close visually
      await new Promise(r => setTimeout(r, 300));
      await generateCombinedPDF(data, stubCount, 'paystub-preview-container', setTempOverrideData);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveImage = () => {
    const filename = `paystub_${data.employeeName.replace(/\s+/g, '_')}`;
    downloadImage('paystub-preview-container', filename);
  };

  const handleSaveMarkdown = () => {
    const markdown = generateMarkdown(data, displayedCalculated);
    const filename = `paystub_${data.employeeName.replace(/\s+/g, '_')}`;
    downloadMarkdown(markdown, filename);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-slate-900 text-white p-4 shadow-md z-20 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-blue-500 p-1.5 rounded-lg">
                <Printer className="w-5 h-5 text-white" />
             </div>
             <h1 className="text-xl font-bold tracking-tight">Paystub<span className="text-blue-400">Pro</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button
                onClick={handleSaveMarkdown}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
                title="Save as Markdown"
             >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Markdown</span>
             </button>
             
             <button
                onClick={handleSaveImage}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
                title="Save as Image"
             >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Image</span>
             </button>

            <button 
              onClick={handlePrintClick}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm disabled:opacity-50 text-sm"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Form */}
        <div className="lg:col-span-4 xl:col-span-3 h-[calc(100vh-140px)] sticky top-24">
           <InputForm 
              data={data} 
              onChange={setData} 
              calculated={liveCalculated}
           />
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-8 xl:col-span-9 bg-gray-200/50 rounded-xl border border-gray-300 flex items-center justify-center overflow-auto p-8 shadow-inner relative z-10">
           <div className="scale-100 origin-top">
              <PaystubPreview 
                id="paystub-preview-container" 
                data={data} 
                calculated={displayedCalculated} 
              />
           </div>
        </div>

      </main>

      {/* Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Download Paystubs</h3>
            <p className="text-gray-600 text-sm mb-6">
              How many recent paystubs would you like to generate? This will create a single PDF with multiple pages, calculating backwards from your selected Pay Date.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Stubs</label>
              <select 
                value={stubCount} 
                onChange={(e) => setStubCount(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 border p-2 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 6, 12, 24].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Stub' : 'Stubs'}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmPrint}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
              >
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
