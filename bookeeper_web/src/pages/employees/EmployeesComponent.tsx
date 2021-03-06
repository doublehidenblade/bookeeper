
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { EmployeeData, employeeFormOptions, Employee, employeeTableOptions } from '../../schema/employee';
import { addEmployee, payEmployee } from '../../utils/functions';
import Form from '../common/Form';
import { useFirestore } from 'react-redux-firebase';
import SpinnerButton from '../common/SpinnerButton'
import Table from '../common/Table'
import { LoadState, Entries } from '../../utils/types';
import LazyComponent from '../common/LazyComponent';

interface Props {
  employeesData: EmployeeData[],
  dataLoadState: LoadState,
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function EmployeesComponent(props: Props) {
  const classes = useStyles();
  const firestore = useFirestore();
  const { employeesData, dataLoadState } = props;

  return (<>
    <Form
      action="add employee"
      title="add employee"
      options={employeeFormOptions}
      onSubmit={(formData: Entries) => addEmployee(firestore, new Employee(formData))}
    />
    <div className={classes.card}>
      <LazyComponent dataLoadState={dataLoadState} >
        <Table
          headerData={
            [...employeeTableOptions.map(option => option.label), 'action']
          }
          data={
            employeesData.map((employee: EmployeeData, id: number) => {
              const button = (<SpinnerButton key={id} submitAction={() => payEmployee(firestore, {
                employee_id: employee.id,
                salary: employee.data.salary
              })} actionName="pay" />);
              return (
                [...employeeTableOptions.map(option => employee.data[option.key]), button]
              )
            })
          }
        />
      </LazyComponent>
    </div>
  </>);
}