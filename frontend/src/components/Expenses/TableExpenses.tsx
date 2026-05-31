import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import type { Expense } from "../../types";
import Loading from "../Loading";

type Props = {
  expenses: Expense[];
  onDelete: (expense: Expense) => void;
  onloading: boolean;
};

const TableExpenses = ({ expenses, onDelete, onloading }: Props) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: "#1976d2" }}>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              No
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              deskripsi{" "}
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Jumlah Rp
            </TableCell>

            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Tanggal
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Aksi
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {onloading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Loading />
              </TableCell>
            </TableRow>
          ) : expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Tidak ada Data.
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((row, index) => (
              <TableRow
                key={row.id}
                hover
                sx={{ "&:last-child td": { border: 0 } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  {parseFloat(row.amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>{row.expense_date}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onDelete(row)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableExpenses;
