import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  head: {
    backgroundColor: '#aaa',
  },
}));

type Cell = number | string | JSX.Element;

type Row = Cell[];

interface Props {
  data: Row[],
  headerData: string[],
}

export default function BasicTable(props: Props) {
  const classes = useStyles();
  const { headerData, data } = props;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.head}>
          <TableRow>
            {
              headerData.map((cell, id) => (<TableCell key={id} align="center">{cell ?? '-'}</TableCell>))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {
                row.map((cell, id) => (<TableCell key={id} align="center">{cell ?? '-'}</TableCell>))
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}