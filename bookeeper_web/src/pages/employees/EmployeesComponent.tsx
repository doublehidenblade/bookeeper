
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { EmployeeData, employeeFormOptions } from '../../schema/employee';
import { addEmployee, payEmployee } from '../../utils/functions';
import Form from '../common/Form';
import { useFirestore } from 'react-redux-firebase';
import SpinnerButton from '../common/SpinnerButton'
import Table from '../common/Table'

interface Props {
  employeesData: EmployeeData[],
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
  const { employeesData } = props;

  return (<>
    <Form
      action="add employee"
      title="add employee"
      options={employeeFormOptions}
      onSubmit={(data) => addEmployee(firestore, data)}
    />
    <div className={classes.card}>
      <Table
        headerData={
          employeeFormOptions.map(option => option.label)
        }
        data={
          employeesData.map((employee: EmployeeData, id: number) => {
            const button = (<SpinnerButton key={id} submitAction={() => payEmployee(firestore, {
              employee_id: employee.id,
              salary: employee.data.salary
            })} actionName="pay" />);
            return (
              [...employeeFormOptions.map(option => employee.data[option.key]), button]
            )
          })
        }
      />
    </div>
  </>);
}