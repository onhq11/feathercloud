import { TableCell, TableRow } from "@mui/material";

interface Props {
  columns: Array<Column>;
}

export interface Column {
  value: string;
  props?: any;
}

export default function TableHead({ columns }: Props) {
  return (
    <TableRow>
      {columns.map((row, index) => (
        <TableCell key={index} {...row.props}>
          {row.value}
        </TableCell>
      ))}
    </TableRow>
  );
}
