import { Table as MuiTable, TableBody, TableProps } from "@mui/material";

export default function Table({ children, ...props }: TableProps) {
  return (
    <MuiTable {...props}>
      <TableBody>{children}</TableBody>
    </MuiTable>
  );
}
