import React from 'react';
import { PaystubData, PayFrequency, EmploymentType, CalculatedPaystub } from '../types';
import { Building2, User, Wallet, Calendar, Calculator, Clock, PieChart } from 'lucide-react';

interface Props {
  data: PaystubData;
  onChange: (data: PaystubData) => void;
  calculated: CalculatedPaystub;
}

const formatCurrency = (val: number) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const InputForm: React.FC<Props> = ({ data, onChange, calculated }) => {
  const handleChange = (field: keyof PaystubData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 space-y-8 h-full overflow-y-auto">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          Paystub Generator
        </h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to generate your paystub.</p>
      </div>

      {/* YTD Summary Card (Read Only) */}
      <section className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-3">
        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide flex items-center gap-2">
          <PieChart className="w-4 h-4" /> Estimated YTD Totals
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block text-xs text-blue-600 font-medium uppercase">YTD Gross Pay</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(calculated.grossPayYTD)}</span>
          </div>
          <div>
            <span className="block text-xs text-blue-600 font-medium uppercase">YTD Net Pay</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(calculated.netPayYTD)}</span>
          </div>
        </div>
        <p className="text-xs text-blue-400 italic">Calculated based on hire date and pay schedule.</p>
      </section>

      {/* Company Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Company Information
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Address</label>
            <input
              type="text"
              value={data.companyAddress}
              onChange={(e) => handleChange('companyAddress', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="123 Business Rd, City, State, Zip"
            />
          </div>
        </div>
      </section>

      {/* Employee Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <User className="w-4 h-4" /> Employee Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Employee Name</label>
            <input
              type="text"
              value={data.employeeName}
              onChange={(e) => handleChange('employeeName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Employee Address</label>
            <input
              type="text"
              value={data.employeeAddress}
              onChange={(e) => handleChange('employeeAddress', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
            <input
              type="text"
              value={data.employeeId}
              onChange={(e) => handleChange('employeeId', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SSN (Last 4)</label>
            <input
              type="text"
              maxLength={4}
              value={data.ssnLast4}
              onChange={(e) => handleChange('ssnLast4', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">Marital Status</label>
             <select
               value={data.maritalStatus}
               onChange={(e) => handleChange('maritalStatus', e.target.value)}
               className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
             >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Head of Household">Head of Household</option>
             </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Exemptions</label>
            <input
              type="number"
              min={0}
              value={data.exemptions}
              onChange={(e) => handleChange('exemptions', parseInt(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </section>

      {/* Pay Schedule */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Pay Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hire Date</label>
            <input
              type="date"
              value={data.hireDate}
              onChange={(e) => handleChange('hireDate', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Most Recent Pay Date</label>
            <input
              type="date"
              value={data.payDate}
              onChange={(e) => handleChange('payDate', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pay Frequency</label>
            <select
              value={data.payFrequency}
              onChange={(e) => handleChange('payFrequency', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {Object.values(PayFrequency).map((freq) => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Time Off Balances */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Time Off Balances
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vacation Balance</label>
            <input
              type="number"
              value={data.vacationBalance}
              onChange={(e) => handleChange('vacationBalance', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vacation Used (YTD)</label>
            <input
              type="number"
              value={data.vacationUsed}
              onChange={(e) => handleChange('vacationUsed', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PTO/Sick Balance</label>
            <input
              type="number"
              value={data.sickBalance}
              onChange={(e) => handleChange('sickBalance', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PTO/Sick Used (YTD)</label>
            <input
              type="number"
              value={data.sickUsed}
              onChange={(e) => handleChange('sickUsed', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </section>

      {/* Financials */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Wallet className="w-4 h-4" /> Financial Details
        </h3>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handleChange('employmentType', EmploymentType.Hourly)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border ${
              data.employmentType === EmploymentType.Hourly
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => handleChange('employmentType', EmploymentType.Salary)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border ${
              data.employmentType === EmploymentType.Salary
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Salary
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.employmentType === EmploymentType.Hourly ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={data.hourlyRate}
                  onChange={(e) => handleChange('hourlyRate', parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hours Per Week</label>
                <input
                  type="number"
                  value={data.hoursPerWeek}
                  onChange={(e) => handleChange('hoursPerWeek', parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </>
          ) : (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Annual Salary ($)</label>
              <input
                type="number"
                value={data.annualSalary}
                onChange={(e) => handleChange('annualSalary', parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}

          <div>
             <label className="block text-sm font-medium text-gray-700">Federal Tax Rate (%)</label>
             <input
               type="number"
               min="0"
               max="100"
               value={data.federalTaxRate}
               onChange={(e) => handleChange('federalTaxRate', parseFloat(e.target.value) || 0)}
               className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
             />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">State Tax Rate (%)</label>
             <input
               type="number"
               min="0"
               max="100"
               value={data.stateTaxRate}
               onChange={(e) => handleChange('stateTaxRate', parseFloat(e.target.value) || 0)}
               className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
             />
          </div>
           
           <div>
            <label className="block text-sm font-medium text-gray-700">Account Last 4</label>
            <input
              type="text"
              maxLength={4}
              value={data.accountLast4}
              onChange={(e) => handleChange('accountLast4', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="md:col-span-2 flex items-center mt-4">
            <input
              id="randomDeductions"
              type="checkbox"
              checked={data.includeRandomDeductions}
              onChange={(e) => handleChange('includeRandomDeductions', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="randomDeductions" className="ml-2 block text-sm text-gray-900">
              Include Common Deductions (Health, Dental, 401k)
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InputForm;