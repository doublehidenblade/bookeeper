// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useMemo } from 'react';
import { useFirebase } from 'react-redux-firebase';
import BalanceSheetComponent from './BalanceSheetComponent';
import { LAND_BUILDINGS, EQUIPMENT, FURNITURES_AND_FIXTURES, NOTES_PAYABLE, ACCRUALS, MORTGAGE } from '../../utils/constants';
import { useVariables } from '../common/useVariables';
import { ListData } from '../../utils/types';

export default function InvoicesDataContainer() {
  useFirebase();
  const { variables, dataLoadState } = useVariables();
  const balanceSheetData: ListData | null = useMemo(() => {
    if (variables == null) {
      return null;
    }
    const { cash, accounts_receivable, accounts_payable, inventory } = variables;
    const total_current_assets = cash + accounts_receivable + inventory;
    const total_fixed_assets = LAND_BUILDINGS + EQUIPMENT + FURNITURES_AND_FIXTURES;
    const total_assets = total_current_assets + total_fixed_assets;
    const total_current_liabilities = accounts_payable + NOTES_PAYABLE + ACCRUALS;
    const total_long_term_debt = MORTGAGE;
    const total_liabilities = total_current_liabilities + total_long_term_debt;
    return [
      {
        category: 'Assets',
        data: [
          {
            key: 'cash',
            label: 'cash($)',
            value: cash,
          },
          {
            key: 'accounts_receivable',
            label: 'accounts receivable($)',
            value: accounts_receivable,
          },
          {
            key: 'inventory',
            label: 'inventory($)',
            value: inventory,
          },
          {
            key: 'total_current_assets',
            label: 'total current assets($)',
            value: total_current_assets,
          },
          {
            key: 'land_buildings',
            label: 'land/buildings($)',
            value: LAND_BUILDINGS,
          },
          {
            key: 'equipment',
            label: 'equipment($)',
            value: EQUIPMENT,
          },
          {
            key: 'furniture_and_fixtures',
            label: 'furniture and fixtures($)',
            value: FURNITURES_AND_FIXTURES,
          },
          {
            key: 'total_fixed_assets',
            label: 'total fixed assets($)',
            value: total_fixed_assets,
          },
          {
            key: 'total_assets',
            label: 'total assets($)',
            value: total_assets,
          },
        ]
      },
      {
        category: 'Liabilities & Net Worth',
        data: [
          {
            key: 'accounts_payable',
            label: 'accounts payable($)',
            value: accounts_payable,
          },
          {
            key: 'notes_payable',
            label: 'notes payable($)',
            value: NOTES_PAYABLE,
          },
          {
            key: 'accruals',
            label: 'accruals($)',
            value: ACCRUALS,
          },
          {
            key: 'total_current_liabilities',
            label: 'total current liabilities($)',
            value: total_current_liabilities,
          },
          {
            key: 'mortgage',
            label: 'mortgage($)',
            value: MORTGAGE,
          },
          {
            key: 'total_long_term_debt',
            label: 'total long term debt($)',
            value: total_long_term_debt,
          },
          {
            key: 'total_liabilities',
            label: 'total liabilities($)',
            value: total_liabilities,
          },
        ]
      },
    ]
  }, [variables]);


  return <BalanceSheetComponent balanceSheetData={balanceSheetData} dataLoadState={dataLoadState} />;
}