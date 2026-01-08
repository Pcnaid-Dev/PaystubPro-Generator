export enum PayFrequency {
  Weekly = 'Weekly',
  BiWeekly = 'Bi-Weekly',
  SemiMonthly = 'Semi-Monthly',
  Monthly = 'Monthly',
}

export enum EmploymentType {
  Hourly = 'Hourly',
  Salary = 'Salary',
}

export interface PaystubData {
  // Employer
  companyName: string;
  companyAddress: string;

  // Employee
  employeeName: string;
  employeeAddress: string;
  employeeId: string;
  ssnLast4: string;
  accountLast4: string; // Direct deposit
  maritalStatus: string;
  exemptions: number;
  
  // Dates
  hireDate: string;
  payDate: string; // The "Check Date"
  
  // Pay Details
  payFrequency: PayFrequency;
  employmentType: EmploymentType;
  hourlyRate: number;
  hoursPerWeek: number;
  annualSalary: number;

  // Deductions Config
  includeRandomDeductions: boolean;
  federalTaxRate: number; // Percentage 0-100
  stateTaxRate: number; // Percentage 0-100

  // Time Off Balances
  vacationBalance: number;
  vacationUsed: number;
  sickBalance: number;
  sickUsed: number;
}

export interface EarningsItem {
  name: string;
  rate: number;
  hours: number;
  current: number;
  ytd: number;
}

export interface DeductionItem {
  name: string;
  current: number;
  ytd: number;
  isPreTax: boolean;
}

export interface BenefitItem {
  name: string;
  current: number;
  ytd: number;
}

export interface CalculatedPaystub {
  periodStartDate: string;
  periodEndDate: string;
  payDate: string;
  checkNumber: number;
  
  // Earnings
  earnings: EarningsItem[];
  grossPayCurrent: number;
  grossPayYTD: number;
  rate: number; // Base rate for display
  hours: number; // Total hours for display

  // Taxes
  fedTaxCurrent: number;
  fedTaxYTD: number;
  ssTaxCurrent: number; // 6.2%
  ssTaxYTD: number;
  medicareTaxCurrent: number; // 1.45%
  medicareTaxYTD: number;
  stateTaxCurrent: number;
  stateTaxYTD: number;

  // Deductions
  deductions: DeductionItem[];
  totalDeductionsCurrent: number;
  totalDeductionsYTD: number;

  // Employer Benefits
  employerBenefits: BenefitItem[];

  // Net
  netPayCurrent: number;
  netPayYTD: number;
}