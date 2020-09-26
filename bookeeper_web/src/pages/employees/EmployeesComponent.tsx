
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Employee, EmployeeData } from '../../schema/employee';

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

  const newEmployeeData = new Employee(
    'John',
    'Doe',
    125000,
  );

  return (<>
    <div className={classes.card}>
      {employeesData.map((employee: EmployeeData, id: number) => {
        return (
          <div key={id}>
            {employee.data.getName()}
          </div>
        );
      })}
    </div>
    <Button onClick={() => addEmployee(newEmployeeData)} >ADD</Button>
  </>);
}