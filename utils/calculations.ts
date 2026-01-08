import { PaystubData, CalculatedPaystub, PayFrequency, EmploymentType, EarningsItem, DeductionItem, BenefitItem } from '../types';
import { differenceInCalendarDays, subDays, startOfYear, isBefore, parseISO, format } from 'date-fns';

const SOCIAL_SECURITY_RATE = 0.062;
const MEDICARE_RATE = 0.0145;

export const getPayPeriodDays = (frequency: PayFrequency): number => {
  switch (frequency) {
    case PayFrequency.Weekly: return 7;
    case PayFrequency.BiWeekly: return 14;
    case PayFrequency.SemiMonthly: return 15; // Approx
    case PayFrequency.Monthly: return 30; // Approx
  }
};

const getDetailedDeductions = (gross: number, periodsYTD: number, seed: boolean): DeductionItem[] => {
  if (!seed) return [];
  
  // Pre-Tax
  const medical = Math.floor(gross * 0.03);
  const dental = 15.00;
  const vision = 8.50;
  const hsa = 50.00;
  const k401 = Math.floor(gross * 0.04);

  // Post-Tax
  const criticalIllness = 12.50;
  const support = 0.00; // Placeholder

  return [
    { name: 'Medical', current: medical, ytd: medical * periodsYTD, isPreTax: true },
    { name: 'Dental', current: dental, ytd: dental * periodsYTD, isPreTax: true },
    { name: 'Vision', current: vision, ytd: vision * periodsYTD, isPreTax: true },
    { name: 'HSA', current: hsa, ytd: hsa * periodsYTD, isPreTax: true },
    { name: '401(k)', current: k401, ytd: k401 * periodsYTD, isPreTax: true },
    { name: 'Critical Illness', current: criticalIllness, ytd: criticalIllness * periodsYTD, isPreTax: false },
    { name: 'Support', current: support, ytd: support * periodsYTD, isPreTax: false },
  ];
};

const getEmployerBenefits = (gross: number, periodsYTD: number, seed: boolean): BenefitItem[] => {
    if (!seed) return [];
    
    const medMatch = Math.floor(gross * 0.05);
    const k401Match = Math.floor(gross * 0.03);
    
    return [
        { name: 'Medical ER', current: medMatch, ytd: medMatch * periodsYTD },
        { name: '401(k) Match', current: k401Match, ytd: k401Match * periodsYTD }
    ];
};

export const calculatePaystub = (data: PaystubData, offsetPeriods = 0): CalculatedPaystub => {
  const periodDays = getPayPeriodDays(data.payFrequency);
  
  // Calculate specific dates based on offset (for historical stub generation)
  const currentPayDateObj = subDays(parseISO(data.payDate), offsetPeriods * periodDays);
  const periodEndDateObj = subDays(currentPayDateObj, 2); 
  const periodStartDateObj = subDays(periodEndDateObj, periodDays - 1);
  
  const currentYearStart = startOfYear(currentPayDateObj);
  const hireDateObj = parseISO(data.hireDate);
  const effectiveYTDStart = isBefore(hireDateObj, currentYearStart) ? currentYearStart : hireDateObj;
  
  let daysElapsed = differenceInCalendarDays(currentPayDateObj, effectiveYTDStart);
  if (daysElapsed < 0) daysElapsed = 0;
  
  const periodsYTD = Math.floor(daysElapsed / periodDays) + 1;

  // 1. Calculate Earnings (Regular + OT)
  let earnings: EarningsItem[] = [];
  let grossPayCurrent = 0;
  let displayRate = 0;
  let displayHours = 0;

  if (data.employmentType === EmploymentType.Hourly) {
    displayRate = data.hourlyRate;
    displayHours = data.hoursPerWeek;

    const regHours = Math.min(data.hoursPerWeek, 40);
    const otHours = Math.max(data.hoursPerWeek - 40, 0);

    const regPay = regHours * data.hourlyRate;
    const otPay = otHours * (data.hourlyRate * 1.5);

    earnings.push({
        name: 'Regular Pay',
        rate: data.hourlyRate,
        hours: regHours,
        current: regPay,
        ytd: regPay * periodsYTD
    });

    if (otHours > 0) {
        earnings.push({
            name: 'Overtime Pay',
            rate: data.hourlyRate * 1.5,
            hours: otHours,
            current: otPay,
            ytd: otPay * periodsYTD
        });
    }

    grossPayCurrent = regPay + otPay;
  } else {
    // Salary
    let annualPeriods = 52;
    if (data.payFrequency === PayFrequency.BiWeekly) annualPeriods = 26;
    if (data.payFrequency === PayFrequency.SemiMonthly) annualPeriods = 24;
    if (data.payFrequency === PayFrequency.Monthly) annualPeriods = 12;
    
    grossPayCurrent = data.annualSalary / annualPeriods;
    displayRate = data.annualSalary;
    displayHours = 86.67; // Standard placeholder for salaried hours

    earnings.push({
        name: 'Salary',
        rate: data.annualSalary,
        hours: displayHours,
        current: grossPayCurrent,
        ytd: grossPayCurrent * periodsYTD
    });
  }

  // Optional: Holiday (Randomly populated if needed, here just placeholder 0 if random selected to show field)
  if (data.includeRandomDeductions) {
      earnings.push({
          name: 'Holiday',
          rate: 0,
          hours: 0,
          current: 0.00,
          ytd: 0.00
      });
  }

  const grossPayYTD = grossPayCurrent * periodsYTD;

  // 2. Calculate Taxes
  const fedTaxCurrent = grossPayCurrent * (data.federalTaxRate / 100);
  const stateTaxCurrent = grossPayCurrent * (data.stateTaxRate / 100);
  const ssTaxCurrent = grossPayCurrent * SOCIAL_SECURITY_RATE;
  const medicareTaxCurrent = grossPayCurrent * MEDICARE_RATE;

  const fedTaxYTD = fedTaxCurrent * periodsYTD;
  const stateTaxYTD = stateTaxCurrent * periodsYTD;
  const ssTaxYTD = ssTaxCurrent * periodsYTD;
  const medicareTaxYTD = medicareTaxCurrent * periodsYTD;

  // 3. Deductions & Benefits
  const deductions = getDetailedDeductions(grossPayCurrent, periodsYTD, data.includeRandomDeductions);
  const employerBenefits = getEmployerBenefits(grossPayCurrent, periodsYTD, data.includeRandomDeductions);

  const totalDeductionsCalc = deductions.reduce((acc, curr) => acc + curr.current, 0);
  const totalDeductionsYTDCalc = deductions.reduce((acc, curr) => acc + curr.ytd, 0);

  // Totals
  const totalTaxesCurrent = fedTaxCurrent + stateTaxCurrent + ssTaxCurrent + medicareTaxCurrent;
  const totalTaxesYTD = fedTaxYTD + stateTaxYTD + ssTaxYTD + medicareTaxYTD;

  const totalDeductionsCurrent = totalTaxesCurrent + totalDeductionsCalc;
  const totalDeductionsYTD = totalTaxesYTD + totalDeductionsYTDCalc;

  const netPayCurrent = grossPayCurrent - totalDeductionsCurrent;
  const netPayYTD = grossPayYTD - totalDeductionsYTD;

  const checkNumber = 1000 + Math.floor(currentPayDateObj.getTime() / 100000000) + offsetPeriods;

  return {
    periodStartDate: format(periodStartDateObj, 'MM/dd/yyyy'),
    periodEndDate: format(periodEndDateObj, 'MM/dd/yyyy'),
    payDate: format(currentPayDateObj, 'MM/dd/yyyy'),
    checkNumber,
    earnings,
    grossPayCurrent,
    grossPayYTD,
    rate: displayRate,
    hours: displayHours,
    fedTaxCurrent,
    fedTaxYTD,
    ssTaxCurrent,
    ssTaxYTD,
    medicareTaxCurrent,
    medicareTaxYTD,
    stateTaxCurrent,
    stateTaxYTD,
    deductions,
    employerBenefits,
    totalDeductionsCurrent,
    totalDeductionsYTD,
    netPayCurrent,
    netPayYTD
  };
};