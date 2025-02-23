import { TableCell, TableRow } from "@mui/material";
import { Column } from "@/components/Table/TableHead";

interface Props {
  columns: Array<Column>;
  data: Array<any>;
}

export default function TableBody({ columns, data }: Props) {
  return (
    Array.isArray(data) &&
    data.map((row, index) => (
      <TableRow key={index}>
        {columns.map((cell, index) => (
          <TableCell key={index} {...cell.props}>
            {cell?.renderer ? cell.renderer(row) : row?.[cell.value]}
          </TableCell>
        ))}
      </TableRow>
    ))
  );
}
