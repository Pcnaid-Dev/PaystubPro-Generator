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
        className="bg-white text-black shadow-2xl relative"
        style={{ 
          width: '816px',       // 8.5 inches
          minHeight: '1056px',  // 11 inches
          fontFamily: '"Times New Roman", Times, serif',
          padding: '48px 64px', // Standard margins
          position: 'relative',
        }}
      >
        {/* Watermark - More prominent and visible */}
        <div 
          className="absolute pointer-events-none overflow-hidden"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
             <div 
               className="transform -rotate-45 text-gray-300/30 font-bold uppercase tracking-widest whitespace-nowrap select-none leading-none text-center"
               style={{ fontSize: '7rem' }}
             >
                PAY STATEMENT<br/>
                <span className="text-4xl mt-4 block tracking-normal">(NOT A CHECK)</span>
            </div>
        </div>

        {/* Main Content */}
        <div 
          className="flex-grow flex flex-col h-full"
          style={{ 
            position: 'relative', 
            zIndex: 1 
          }}
        >
            
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                {/* Void Pantograph Box */}
                <div style={{ width: '50%', border: '1px solid #d1d5db', padding: '8px', position: 'relative', backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                    <div 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 0,
                            opacity: 0.2,
                            pointerEvents: 'none',
                            backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)',
                            backgroundSize: '3px 3px',
                            printColorAdjust: 'exact',       // Standard property
                           WebkitPrintColorAdjust: 'exact'  // Safari/Chrome specific
                        }}
                    ></div>
                    
                    <div style={{ position: 'relative', zIndex: 1, fontSize: '10px', color: '#4b5563', fontFamily: 'sans-serif', lineHeight: '1.25' }}>
                        <div style={{ fontFamily: 'monospace', color: '#000', fontWeight: 'bold', marginBottom: '4px' }}>00457</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '30px 40px 40px 40px 1fr', gap: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.025em', fontSize: '8px', marginBottom: '2px' }}>
                            <div>Co.</div>
                            <div>File</div>
                            <div>Dept.</div>
                            <div>Clock</div>
                            <div>Vchr. No.</div>
                        </div>
                         <div style={{ display: 'grid', gridTemplateColumns: '30px 40px 40px 40px 1fr', gap: '8px', fontFamily: 'monospace', color: '#000', fontWeight: '500' }}>
                            <div>X93</div>
                            <div>529659</div>
                            <div>035300</div>
                            <div></div>
                            <div>0000{calculated.checkNumber}</div>
                        </div>
                    </div>
                </div>

                {/* Check Details */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '11px', fontWeight: '500', paddingTop: '4px' }}>
                     <div style={{ display: 'grid', gridTemplateColumns: '120px 100px', rowGap: '4px', textAlign: 'right' }}>
                        <div style={{ color: '#4b5563' }}>Check Number</div>
                        <div style={{ fontWeight: 'bold', color: '#000' }}>{calculated.checkNumber}</div>
                        
                        <div style={{ color: '#4b5563' }}>Batch Number</div>
                        <div style={{ color: '#000' }}>S00661484</div>
                        
                        <div style={{ color: '#4b5563' }}>Pay Period End Date</div>
                        <div style={{ color: '#000' }}>{calculated.periodEndDate}</div>
                        
                        <div style={{ color: '#4b5563' }}>Check Date</div>
                        <div style={{ color: '#000' }}>{calculated.payDate}</div>
                     </div>
                </div>
            </div>

            {/* Title */}

                <h1 style={{ fontSize: '30px', fontWeight: '500', color: '#000', letterSpacing: '-0.025em', lineHeight: '1', paddingBottom: '6px', marginBottom: '8px' }}>Statement of Earnings and Deductions</h1>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: '16px', borderBottom: '2px solid #000', paddingBottom: '4px' }}>
            </div>

            {/* Employee/Employer Info */}
             <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '32px', marginBottom: '32px' }}>
                 <div>
                     <div style={{ fontSize: '11px', marginBottom: '24px' }}>Employee Id: <span style={{ fontWeight: 'bold' }}>{data.employeeId}</span></div>
                     
                     <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4px', fontSize: '10px', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '4px', fontWeight: 'bold' }}>
                             <div style={{ whiteSpace: 'nowrap' }}>Marital Status / Exemptions</div>
                             <div style={{ textAlign: 'center' }}></div>
                             <div style={{ textAlign: 'center' }}></div>
                             <div style={{ textAlign: 'center' }}>Amounts</div>
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4px', fontSize: '10px' }}>
                             <div>Federal</div>
                             <div style={{ textAlign: 'center' }}>{data.maritalStatus.charAt(0).toUpperCase()}</div>
                             <div style={{ textAlign: 'center' }}>{data.exemptions.toString().padStart(2, '0')}</div>
                             <div style={{ textAlign: 'center' }}>0</div>
                     </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4px', fontSize: '10px' }}>
                             <div>Work State TX</div>
                             <div style={{ textAlign: 'center' }}>N/A</div>
                             <div style={{ textAlign: 'center' }}>N/A</div>
                             <div style={{ textAlign: 'center' }}>0</div>
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4px', fontSize: '10px' }}>
                             <div>Res State TX</div>
                             <div style={{ textAlign: 'center' }}>N/A</div>
                             <div style={{ textAlign: 'center' }}>N/A</div>
                             <div style={{ textAlign: 'center' }}>0</div>
                     </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: '8px', textAlign: 'right' }}>
                     <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{data.employeeName}</div>
                     <div style={{ fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', lineHeight: '1.25' }}>
                        <div>{data.employeeAddressStreet}</div>
                        <div>{data.employeeAddressCity}, {data.employeeAddressState} {data.employeeAddressZip}</div>
                     </div>
                 </div>
             </div>

             {/* Tables Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Earnings & Taxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '16px' }}>
                    {/* Earnings */}
                    <div>
                         <div style={{ backgroundColor: '#f3f4f6', padding: '4px', paddingBottom: '12px', marginBottom: '8px', fontSize: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', alignItems: 'center',borderTop: '1px solid #d1d5db', borderBottom: '1px solid #d1d5db' }}>
                             <span>Payments This Period</span>
                             <div style={{ display: 'flex', gap: '16px' }}>
                                 <span style={{ fontWeight: 'normal', fontSize: '9px', marginRight: '8px' }}>Reg. Rate {calculated.rate.toFixed(2)}</span>
                                 <span style={{ fontWeight: 'normal', fontSize: '9px' }}>Ovt Rate {(calculated.rate * 1.5).toFixed(2)}</span>
                             </div>
                         </div>
                         <div style={{ fontSize: '10px', paddingLeft: '8px', paddingRight: '8px', fontWeight: '500' }}>
                             {calculated.earnings.map((earn, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>{earn.name}</span>
                                    <div style={{ display: 'flex', gap: '32px' }}>
                                        <span style={{ width: '64px', textAlign: 'right' }}>{formatNumber(earn.current)}</span>
                                    </div>
                                </div>
                             ))}
                             
                             <div style={{ borderTop: '1px solid #d1d5db', marginTop: '8px', marginBottom: '8px' }}></div>
                             
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                 <span>Total Taxes Withheld</span>
                                 <span>{formatNumber(totalTaxesCurrent)}</span>
                             </div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontWeight: 'bold' }}>
                                 <span>Net Amount</span>
                                 <span>{formatNumber(calculated.netPayCurrent)}</span>
                             </div>
                         </div>
                    </div>

                    {/* Tax Info */}
                    <div style={{ paddingLeft: '16px' }}>
                        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', paddingBottom: '12px', marginBottom: '8px', fontSize: '10px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center',fontWeight: 'bold', borderTop: '1px solid #d1d5db', borderBottom: '1px solid #d1d5db' }}>
                            <span>Tax Information</span>
                            <span style={{ textAlign: 'right' }}>Tax</span>
                            <span style={{ textAlign: 'right' }}>Y-T-D</span>
                        </div>
                        <div style={{ fontSize: '10px', paddingLeft: '4px', paddingRight: '4px', fontWeight: '500' }}>
                             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', marginBottom: '4px' }}>
                                 <span>Federal Wages</span>
                                 <span style={{ textAlign: 'right' }}>{formatNumber(taxableWagesCurrent)}</span>
                                 <span style={{ textAlign: 'right' }}>{formatNumber(taxableWagesYTD)}</span>
                             </div>
                             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', marginBottom: '4px' }}>
                                 <span>FICA Wages</span>
                                 <span style={{ textAlign: 'right' }}>{formatNumber(calculated.grossPayCurrent)}</span>
                                 <span style={{ textAlign: 'right' }}>{formatNumber(calculated.grossPayYTD)}</span>
                             </div>
                             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', marginBottom: '4px' }}>
                                 <span>Medicare Wages</span>
                                 <span style={{ textAlign: 'right' }}>{formatNumber(calculated.grossPayCurrent)}</span>
                                 <span style={{ textAlign: 'right' }}>{formatNumber(calculated.grossPayYTD)}</span>
                             </div>
                             {data.stateTaxRate > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', marginBottom: '4px' }}>
                                    <span>State Wages</span>
                                    <span style={{ textAlign: 'right' }}>{formatNumber(calculated.grossPayCurrent)}</span>
                                    <span style={{ textAlign: 'right' }}>{formatNumber(calculated.grossPayYTD)}</span>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
                
                {/* Summary Box - Dedicated & Distinct */}
                <div style={{ backgroundColor: '#f3f4f6', borderTop: '2px solid #9ca3af', borderBottom: '2px solid #9ca3af', paddingTop: '8px', paddingBottom: '12px', paddingLeft: '8px', paddingRight: '8px', fontSize: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',fontWeight: 'bold', marginTop: '8px' }}>
                     <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', paddingRight: '32px' }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.025em' }}>Current Total Wages / Taxes</span>
                        <div style={{ display: 'flex', gap: '16px' }}>
                             <span>{formatNumber(calculated.grossPayCurrent)}</span>
                             <span>{formatNumber(totalTaxesCurrent)}</span>
                        </div>
                     </div>
                     <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', paddingLeft: '32px', borderLeft: '2px solid #d1d5db' }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.025em' }}>Net Pay This Period / Y-T-D</span>
                        <div style={{ display: 'flex', gap: '16px', color: '#000' }}>
                             <span>{formatNumber(calculated.netPayCurrent)}</span>
                             <span>{formatNumber(calculated.netPayYTD)}</span>
                        </div>
                     </div>
                </div>

                {/* Detailed Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '8px' }}>
                    {/* Payments Column */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', paddingBottom: '8px', marginBottom: '8px', fontSize: '10px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center',fontWeight: 'bold' }}>
                            <span>Payments</span>
                            <span style={{ textAlign: 'right' }}>Amount</span>
                            <span style={{ textAlign: 'right' }}>Hours</span>
                        </div>
                        <div style={{ paddingLeft: '4px', paddingRight: '4px', fontSize: '10px', fontWeight: '500', marginBottom: '16px' }}>
                             {calculated.earnings.map((earn, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>{earn.name}</span>
                                    <div style={{ display: 'flex', gap: '32px' }}>
                                        <span style={{ width: '64px', textAlign: 'right' }}>{formatNumber(earn.current)}</span>
                                        <span style={{ width: '48px', textAlign: 'right' }}>{earn.hours.toFixed(2)}</span>
                                    </div>
                                </div>
                             ))}
                        </div>

                         {/* Employer Benefits Section */}
                        {calculated.employerBenefits.length > 0 && (
                            <div style={{ marginTop: '8px' }}>
                                <div style={{ backgroundColor: '#f3f4f6', padding: '4px', paddingBottom: '8px', marginBottom: '8px', fontSize: '10px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center',fontWeight: 'bold' }}>
                                    <span>Employer Paid Benefits (Info Only)</span>
                                    <span style={{ textAlign: 'right' }}>Current</span>
                                    <span style={{ textAlign: 'right' }}>YTD</span>
                                </div>
                                <div style={{ paddingLeft: '4px', paddingRight: '4px', fontSize: '10px', fontWeight: '500', color: '#374151', marginBottom: '16px' }}>
                                    {calculated.employerBenefits.map((ben, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span>{ben.name}</span>
                                            <div style={{ display: 'flex', gap: '32px' }}>
                                                <span style={{ width: '64px', textAlign: 'right' }}>{formatNumber(ben.current)}</span>
                                                <span style={{ width: '64px', textAlign: 'right' }}>{formatNumber(ben.ytd)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Time Off Section (Nestled in left column) */}
                        <div style={{ marginTop: '8px' }}>
                            <div style={{ backgroundColor: '#f3f4f6', padding: '4px', paddingBottom: '8px', marginBottom: '8px', fontSize: '10px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center',fontWeight: 'bold' }}>
                                <span>Time Off</span>
                                <span style={{ textAlign: 'right' }}>Used YTD</span>
                                <span style={{ textAlign: 'right' }}>Balance</span>
                                <span></span>
                            </div>
                            <div style={{ paddingLeft: '4px', paddingRight: '4px', fontSize: '10px', fontWeight: '500' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', marginBottom: '4px' }}>
                                    <span>Vacation</span>
                                    <span style={{ textAlign: 'right' }}>{formatNumber(data.vacationUsed)}</span>
                                    <span style={{ textAlign: 'right' }}>{formatNumber(data.vacationBalance)}</span>
                                    <span></span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', marginBottom: '4px' }}>
                                    <span>Sick / PTO</span>
                                    <span style={{ textAlign: 'right' }}>{formatNumber(data.sickUsed)}</span>
                                    <span style={{ textAlign: 'right' }}>{formatNumber(data.sickBalance)}</span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deductions Column */}
                    <div>
                         {/* Header for Deductions */}
                         <div style={{ backgroundColor: '#f3f4f6', padding: '4px', paddingBottom: '8px', marginBottom: '8px', fontSize: '10px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center',fontWeight: 'bold' }}>
                            <span>Deductions / Benefits</span>
                            <span style={{ textAlign: 'right' }}>Amount</span>
                            <span style={{ textAlign: 'right' }}>YTD</span>
                        </div>
                        
                         <div style={{ paddingLeft: '4px', padding: '4px', paddingBottom: '8px', fontSize: '10px', fontWeight: '500' }}>
                             {/* Pre-Tax */}
                             {preTaxDeductions.length > 0 ? preTaxDeductions.map((d, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span>{d.name}</span>
                                        <div style={{ display: 'flex', gap: '32px' }}>
                                            <span style={{ width: '64px', textAlign: 'right' }}>{formatNumber(d.current)}</span>
                                            <span style={{ width: '64px', textAlign: 'right' }}>{formatNumber(d.ytd)}</span>
                                        </div>
                                    </div>
                             )) : <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>None</div>}

                             {/* Post-Tax Header */}
                             <div style={{ backgroundColor: '#f3f4f6', padding: '4px', paddingBottom: '8px', marginBottom: '8px', marginTop: '16px', fontSize: '10px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center',fontWeight: 'bold' }}>
                                <span>Post-Tax</span>
                                <span style={{ textAlign: 'right' }}>Amount</span>
                                <span style={{ textAlign: 'right' }}>YTD</span>
                             </div>

                             {/* Post-Tax Items */}
                             {postTaxDeductions.length > 0 ? postTaxDeductions.map((d, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span>{d.name}</span>
                                        <div style={{ display: 'flex', gap: '32px' }}>
                                            <span style={{ width: '64px', textAlign: 'right' }}>{formatNumber(d.current)}</span>
                                            <span style={{ width: '64px', textAlign: 'right' }}>{formatNumber(d.ytd)}</span>
                                        </div>
                                    </div>
                             )) : <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>None</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 'auto' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                     {/* Employer Info */}
                     <div>
                         <div style={{ fontWeight: 'bold', fontSize: '11px', fontStyle: 'italic', marginBottom: '4px' }}>{data.companyName}</div>
                         <div style={{ fontSize: '10px', fontStyle: 'italic', textTransform: 'uppercase' }}>
                            <div>{data.companyAddressStreet}</div>
                            <div>{data.companyAddressCity}, {data.companyAddressState} {data.companyAddressZip}</div>
                         </div>
                     </div>

                     {/* Codes Legend - Bottom Right, 4 items per row */}
                     <div style={{ fontSize: '8px', fontStyle: 'italic', color: '#4b5563', fontFamily: 'sans-serif', maxWidth: '50%' }}>
                         <div style={{ fontWeight: 'bold', marginBottom: '4px',  }}>Codes Legend</div>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: '16px', rowGap: '2px', whiteSpace: 'nowrap' }}>
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
                 
                 <div style={{ borderTop: '1px dashed #d1d5db', paddingTop: '8px', textAlign: 'center', fontSize: '9px', color: '#6b7280', fontFamily: 'sans-serif' }}>
                    Generated for internal payroll records. Misuse or misrepresentation is prohibited.
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaystubPreview;