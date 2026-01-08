import React from 'react';
import { CalculatedPaystub, PaystubData } from '../types';

interface Props {
  data: PaystubData;
  calculated: CalculatedPaystub;
  id: string; // ID for html2canvas
}

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const PaystubPreview: React.FC<Props> = ({ data, calculated, id }) => {
  const totalTaxesCurrent = calculated.fedTaxCurrent + calculated.ssTaxCurrent + calculated.medicareTaxCurrent + calculated.stateTaxCurrent;
  const totalTaxesYTD = calculated.fedTaxYTD + calculated.ssTaxYTD + calculated.medicareTaxYTD + calculated.stateTaxYTD;
  
  const preTaxDeductions = calculated.deductions.filter(d => d.isPreTax);
  const postTaxDeductions = calculated.deductions.filter(d => !d.isPreTax);
  
  // Calculate taxable wages simulation
  const deduction401k = calculated.deductions.find(d => d.name.includes('401'))?.current || 0;
  const deduction401kYTD = calculated.deductions.find(d => d.name.includes('401'))?.ytd || 0;
  
  const taxableWagesCurrent = calculated.grossPayCurrent - deduction401k;
  const taxableWagesYTD = calculated.grossPayYTD - deduction401kYTD;

  return (
    <div className="flex justify-center p-8 bg-gray-200 rounded-xl overflow-auto">
      <div 
        id={id} 
        className="bg-white text-black shadow-2xl relative flex flex-col"
        style={{ 
          width: '816px',       // 8.5 inches
          minHeight: '1056px',  // 11 inches
          fontFamily: '"Times New Roman", Times, serif',
          padding: '48px 64px', // Standard margins
        }}
      >
        {/* Watermark - More prominent and visible */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
             <div className="transform -rotate-45 text-gray-300/30 text-[7rem] font-bold uppercase tracking-widest whitespace-nowrap select-none leading-none text-center">
                PAY STATEMENT<br/>
                <span className="text-4xl mt-4 block tracking-normal">(NOT A CHECK)</span>
            </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-grow flex flex-col h-full">
            
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                {/* Void Pantograph Box */}
                <div className="w-[50%] border border-gray-300 p-2 relative bg-gray-50/50">
                    <div 
                        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)',
                            backgroundSize: '3px 3px'
                        }}
                    ></div>
                    
                    <div className="relative z-10 text-[10px] text-gray-600 font-sans leading-tight">
                        <div className="font-mono text-black font-bold mb-1">00457</div>
                        <div className="grid grid-cols-[30px_40px_40px_40px_1fr] gap-2 font-bold uppercase tracking-tight text-[8px] mb-0.5">
                            <div>Co.</div>
                            <div>File</div>
                            <div>Dept.</div>
                            <div>Clock</div>
                            <div>Vchr. No.</div>
                        </div>
                         <div className="grid grid-cols-[30px_40px_40px_40px_1fr] gap-2 font-mono text-black font-medium">
                            <div>X93</div>
                            <div>529659</div>
                            <div>035300</div>
                            <div></div>
                            <div>0000{calculated.checkNumber}</div>
                        </div>
                    </div>
                </div>

                {/* Check Details */}
                <div className="flex flex-col items-end text-[11px] font-medium pt-1">
                     <div className="grid grid-cols-[120px_100px] gap-y-1 text-right">
                        <div className="text-gray-600">Check Number</div>
                        <div className="font-bold text-black">{calculated.checkNumber}</div>
                        
                        <div className="text-gray-600">Batch Number</div>
                        <div className="text-black">S00661484</div>
                        
                        <div className="text-gray-600">Pay Period End Date</div>
                        <div className="text-black">{calculated.periodEndDate}</div>
                        
                        <div className="text-gray-600">Check Date</div>
                        <div className="text-black">{calculated.payDate}</div>
                     </div>
                </div>
            </div>

            {/* Title */}
            <div className="flex justify-between items-end mb-8 border-b-2 border-black pb-1">
                <h1 className="text-3xl font-medium text-black tracking-tight mb-[-2px]">Statement of Earnings and Deductions</h1>
                <div className="mb-1">
                    <span className="font-sans font-black italic text-2xl tracking-tighter text-gray-800" style={{ transform: 'skewX(-10deg)' }}>ADP</span>
                </div>
            </div>

            {/* Employee/Employer Info */}
             <div className="grid grid-cols-12 gap-8 mb-8">
                 <div className="col-span-5">
                     <div className="text-[11px] mb-6">Employee Id: <span className="font-bold">{data.employeeId}</span></div>
                     
                     <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-1 text-[10px] border-b border-black pb-1 mb-1 font-bold">
                             <div className="whitespace-nowrap">Marital Status/Exemptions</div>
                             <div className="text-center"></div>
                             <div className="text-center"></div>
                             <div className="text-center">Amounts</div>
                     </div>
                     <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-1 text-[10px]">
                             <div>Federal</div>
                             <div className="text-center">{data.maritalStatus.charAt(0).toUpperCase()}</div>
                             <div className="text-center">{data.exemptions.toString().padStart(2, '0')}</div>
                             <div className="text-center">0</div>
                     </div>
                      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-1 text-[10px]">
                             <div>Work State TX</div>
                             <div className="text-center">N/A</div>
                             <div className="text-center">N/A</div>
                             <div className="text-center">0</div>
                     </div>
                     <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-1 text-[10px]">
                             <div>Res State TX</div>
                             <div className="text-center">N/A</div>
                             <div className="text-center">N/A</div>
                             <div className="text-center">0</div>
                     </div>
                 </div>

                 {/* Removed pl-20 to allow full right alignment */}
                 <div className="col-span-7 flex flex-col items-end pt-2 text-right">
                     <div className="text-[12px] font-bold uppercase tracking-wide">{data.employeeName}</div>
                     <div className="text-[12px] whitespace-pre-line mb-2 uppercase leading-tight">{data.employeeAddress}</div>
                 </div>
             </div>

             {/* Tables Section */}
            <div className="flex flex-col gap-6">
                
                {/* Earnings & Taxes */}
                <div className="grid grid-cols-12 gap-4">
                    {/* Earnings */}
                    <div className="col-span-8">
                         <div className="bg-gray-100 p-1 mb-2 text-[10px] flex justify-between font-bold border-t border-b border-gray-300">
                             <span>Payments This Period</span>
                             <div className="flex gap-4">
                                 <span className="font-normal text-[9px] mr-2">Reg. Rate {calculated.rate.toFixed(2)}</span>
                                 <span className="font-normal text-[9px]">Ovt Rate {(calculated.rate * 1.5).toFixed(2)}</span>
                             </div>
                         </div>
                         <div className="space-y-1 text-[10px] px-2 font-medium">
                             {calculated.earnings.map((earn, i) => (
                                <div key={i} className="flex justify-between">
                                    <span>{earn.name}</span>
                                    <div className="flex gap-8">
                                        <span className="w-16 text-right">{formatNumber(earn.current)}</span>
                                        {/* Optional: Show hours if non-zero */}
                                    </div>
                                </div>
                             ))}
                             
                             <div className="border-t border-gray-300 my-2"></div>
                             
                              <div className="flex justify-between mt-2">
                                 <span>Total Taxes Withheld</span>
                                 <span>{formatNumber(totalTaxesCurrent)}</span>
                             </div>
                             <div className="flex justify-between mt-2 font-bold">
                                 <span>Net Amount</span>
                                 <span>{formatNumber(calculated.netPayCurrent)}</span>
                             </div>
                         </div>
                    </div>

                    {/* Tax Info */}
                    <div className="col-span-4 pl-4">
                        <div className="bg-gray-100 p-1 mb-2 text-[10px] grid grid-cols-[2fr_1fr_1fr] font-bold border-t border-b border-gray-300">
                            <span>Tax Information</span>
                            <span className="text-right">Tax</span>
                            <span className="text-right">Y-T-D</span>
                        </div>
                        <div className="space-y-1 text-[10px] px-1 font-medium">
                             <div className="grid grid-cols-[2fr_1fr_1fr]">
                                 <span>Federal Wages</span>
                                 <span className="text-right">{formatNumber(taxableWagesCurrent)}</span>
                                 <span className="text-right">{formatNumber(taxableWagesYTD)}</span>
                             </div>
                             <div className="grid grid-cols-[2fr_1fr_1fr]">
                                 <span>FICA Wages</span>
                                 <span className="text-right">{formatNumber(calculated.grossPayCurrent)}</span>
                                 <span className="text-right">{formatNumber(calculated.grossPayYTD)}</span>
                             </div>
                             <div className="grid grid-cols-[2fr_1fr_1fr]">
                                 <span>Medicare Wages</span>
                                 <span className="text-right">{formatNumber(calculated.grossPayCurrent)}</span>
                                 <span className="text-right">{formatNumber(calculated.grossPayYTD)}</span>
                             </div>
                             {calculated.stateTaxRate > 0 && (
                                <div className="grid grid-cols-[2fr_1fr_1fr]">
                                    <span>State Wages</span>
                                    <span className="text-right">{formatNumber(calculated.grossPayCurrent)}</span>
                                    <span className="text-right">{formatNumber(calculated.grossPayYTD)}</span>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
                
                {/* Summary Box - Dedicated & Distinct */}
                <div className="bg-gray-100 border-t-2 border-b-2 border-gray-400 py-2 px-2 text-[10px] flex justify-between font-bold mt-2">
                     <div className="w-1/2 flex justify-between pr-8">
                        <span className="uppercase tracking-wide">Current Total Wages / Taxes</span>
                        <div className="flex gap-4">
                             <span>{formatNumber(calculated.grossPayCurrent)}</span>
                             <span>{formatNumber(totalTaxesCurrent)}</span>
                        </div>
                     </div>
                     <div className="w-1/2 flex justify-between pl-8 border-l-2 border-gray-300">
                        <span className="uppercase tracking-wide">Net Pay This Period / Y-T-D</span>
                        <div className="flex gap-4 text-black">
                             <span>{formatNumber(calculated.netPayCurrent)}</span>
                             <span>{formatNumber(calculated.netPayYTD)}</span>
                        </div>
                     </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-12 gap-8 mt-2">
                    {/* Payments Column */}
                    <div className="col-span-6 flex flex-col">
                        <div className="bg-gray-100 p-1 mb-2 text-[10px] grid grid-cols-[2fr_1fr_1fr] font-bold">
                            <span>Payments</span>
                            <span className="text-right">Amount</span>
                            <span className="text-right">Hours</span>
                        </div>
                        <div className="px-1 text-[10px] font-medium space-y-1 mb-4">
                             {calculated.earnings.map((earn, i) => (
                                <div key={i} className="flex justify-between">
                                    <span>{earn.name}</span>
                                    <div className="flex gap-8">
                                        <span className="w-16 text-right">{formatNumber(earn.current)}</span>
                                        <span className="w-12 text-right">{earn.hours.toFixed(2)}</span>
                                    </div>
                                </div>
                             ))}
                        </div>

                         {/* Employer Benefits Section */}
                        {calculated.employerBenefits.length > 0 && (
                            <div className="mt-2">
                                <div className="bg-gray-100 p-1 mb-2 text-[10px] grid grid-cols-[2fr_1fr_1fr] font-bold">
                                    <span>Employer Paid Benefits (Info Only)</span>
                                    <span className="text-right">Current</span>
                                    <span className="text-right">YTD</span>
                                </div>
                                <div className="px-1 text-[10px] font-medium space-y-1 text-gray-700 mb-4">
                                    {calculated.employerBenefits.map((ben, i) => (
                                        <div key={i} className="flex justify-between">
                                            <span>{ben.name}</span>
                                            <div className="flex gap-8">
                                                <span className="w-16 text-right">{formatNumber(ben.current)}</span>
                                                <span className="w-16 text-right">{formatNumber(ben.ytd)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Time Off Section (Nestled in left column) */}
                        <div className="mt-2">
                            <div className="bg-gray-100 p-1 mb-2 text-[10px] grid grid-cols-[2fr_1fr_1fr_1fr] font-bold">
                                <span>Time Off</span>
                                <span className="text-right">Used YTD</span>
                                <span className="text-right">Balance</span>
                                <span></span>
                            </div>
                            <div className="px-1 text-[10px] font-medium space-y-1">
                                <div className="grid grid-cols-[2fr_1fr_1fr_1fr]">
                                    <span>Vacation</span>
                                    <span className="text-right">{formatNumber(data.vacationUsed)}</span>
                                    <span className="text-right">{formatNumber(data.vacationBalance)}</span>
                                    <span></span>
                                </div>
                                <div className="grid grid-cols-[2fr_1fr_1fr_1fr]">
                                    <span>Sick / PTO</span>
                                    <span className="text-right">{formatNumber(data.sickUsed)}</span>
                                    <span className="text-right">{formatNumber(data.sickBalance)}</span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deductions Column */}
                    <div className="col-span-6">
                         {/* Header for Deductions */}
                         <div className="bg-gray-100 p-1 mb-2 text-[10px] grid grid-cols-[2fr_1fr_1fr] font-bold">
                            <span>Deductions / Benefits</span>
                            <span className="text-right">Amount</span>
                            <span className="text-right">YTD</span>
                        </div>
                        
                         <div className="px-1 text-[10px] font-medium space-y-1">
                             {/* Pre-Tax */}
                             {preTaxDeductions.length > 0 ? preTaxDeductions.map((d, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span>{d.name}</span>
                                        <div className="flex gap-8">
                                            <span className="w-16 text-right">{formatNumber(d.current)}</span>
                                            <span className="w-16 text-right">{formatNumber(d.ytd)}</span>
                                        </div>
                                    </div>
                             )) : <div className="text-gray-400 italic">None</div>}

                             {/* Post-Tax Header */}
                             <div className="bg-gray-100 p-1 mb-2 mt-4 text-[10px] grid grid-cols-[2fr_1fr_1fr] font-bold">
                                <span>Post-Tax</span>
                                <span className="text-right">Amount</span>
                                <span className="text-right">YTD</span>
                             </div>

                             {/* Post-Tax Items */}
                             {postTaxDeductions.length > 0 ? postTaxDeductions.map((d, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span>{d.name}</span>
                                        <div className="flex gap-8">
                                            <span className="w-16 text-right">{formatNumber(d.current)}</span>
                                            <span className="w-16 text-right">{formatNumber(d.ytd)}</span>
                                        </div>
                                    </div>
                             )) : <div className="text-gray-400 italic">None</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto">
                 <div className="flex justify-between items-end mb-4">
                     {/* Employer Info */}
                     <div>
                         <div className="font-bold text-[11px] italic mb-1">{data.companyName}</div>
                         <div className="text-[10px] italic uppercase">{data.companyAddress}</div>
                     </div>

                     {/* Codes Legend - Bottom Right, 4 items per row */}
                     <div className="text-[8px] italic text-gray-600 font-sans border border-blue-400/0 max-w-[50%]">
                         <div className="font-bold mb-1">Codes Legend</div>
                         <div className="grid grid-cols-4 gap-x-4 gap-y-0.5 whitespace-nowrap">
                            <div>A= Prior Period Adj</div>
                            <div>N= Ded Susp/No Mk-up</div>
                            <div>D= Ded Suspend/Mk-up</div>
                            <div>R= Refund</div>
                            <div>M= Make-up Included</div>
                            <div>O= Add'l Current Pmts</div>
                            <div>X= Add'l Nontaxable Pmts</div>
                         </div>
                     </div>
                 </div>
                 
                 <div className="border-t border-dashed border-gray-300 pt-2 text-center text-[9px] text-gray-500 font-sans">
                    Generated for internal payroll records. Misuse or misrepresentation is prohibited.
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaystubPreview;