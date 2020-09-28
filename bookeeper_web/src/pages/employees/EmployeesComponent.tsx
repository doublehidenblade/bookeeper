
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Employee, EmployeeData, employeeFormOptions } from '../../schema/employee';
import Form from '../common/Form';

interface Props {
  employeesData: EmployeeData[],
  addEmployee: (employee: Employee) => void,
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function ExampleNewsComponent(props: Props) {
  const classes = useStyles();
  const { employeesData, addEmployee } = props;

  return (<>
    <Form
      action="add employee"
      title="add employee"
      options={employeeFormOptions}
      onSubmit={addEmployee}
    />
    <div className={classes.card}>
      {employeesData.map((employee: EmployeeData, id: number) => {
        return (
          <div key={id}>
            {employee.data.getName()}
          </div>
        );
      })}
    </div>
  </>);
}