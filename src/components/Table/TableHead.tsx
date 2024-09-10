import { TableCell, TableRow } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  columns: Array<Column>;
}

export interface Column {
  value: string;
  renderer?: (row: any) => ReactNode;
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
