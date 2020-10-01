// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useMemo } from 'react';
import { useFirebase } from 'react-redux-firebase';
import IncomeStatementComponent from './IncomeStatementComponent';
import { COST_PER_UNIT, BILLS, ANNUAL_EXPENSES, OTHER_INCOME, INCOME_TAX_RATE, PRICE } from '../../utils/constants';
import { useVariables } from '../common/useVariables';
import { ListData } from '../../utils/types';

export default function InvoicesDataContainer() {
  useFirebase();
  const { variables, dataLoadState } = useVariables();
  const incomeStatementData: ListData | null = useMemo(() => {
    if (variables == null) {
      return null;
    }
    const { payroll, payroll_withholding, accounts_receivable } = variables;
    const sales = accounts_receivable;
    const COGS = COST_PER_UNIT * sales / PRICE;
    const gross_profit = sales - COGS;
    const total_expenses = payroll + payroll_withholding + BILLS + ANNUAL_EXPENSES;
    const operating_income = gross_profit - total_expenses;
    const income_taxes = operating_income * INCOME_TAX_RATE;
    const net_income = operating_income - income_taxes;
    return [
      {
        category: 'Sales',
        data: [
          {
            key: 'sales',
            label: 'sales($)',
            value: sales,
          },
          {
            key: 'COGS',
            label: 'COGS($)',
            value: COGS,
          },
          {
            key: 'gross_profit',
            label: 'Gross Profit($)',
            value: gross_profit,
          },
        ]
      },
      {
        category: 'Expenses',
        data: [
          {
            key: 'payroll',
            label: 'payroll($)',
            value: payroll,
          },
          {
            key: 'payroll_withholding',
            label: 'payroll withholding($)',
            value: payroll_withholding,
          },
          {
            key: 'bills',
            label: 'bills($)',
            value: BILLS,
          },
          {
            key: 'annual_expenses',
            label: 'annual expenses($)',
            value: ANNUAL_EXPENSES,
          },
          {
            key: 'total_expenses',
            label: 'total expenses($)',
            value: total_expenses,
          },
        ]
      },
      {
        category: '',
        data: [
          {
            key: 'other_income',
            label: 'other income($)',
            value: OTHER_INCOME,
          },
          {
            key: 'operating_income',
            label: 'operating income($)',
            value: operating_income,
          },
          {
            key: 'income_taxes',
            label: 'income taxes($)',
            value: income_taxes,
          },
          {
            key: 'net_income',
            label: 'net income($)',
            value: net_income,
          },
        ]
      }
    ]
  }, [variables]);


  return <IncomeStatementComponent incomeStatementData={incomeStatementData} dataLoadState={dataLoadState} />;
}