import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import type { ReportDetails } from "../../types";
import Loading from "../Loading";


type Props = {
  details: ReportDetails | null;
  onloading:boolean;
};

const TableReport = ({ details,onloading }: Props) => {
  if (!details) return <Typography>Tidak ada data laporan.</Typography>;


  const transactions = [
    ...details.incomes.map((inc) => ({
      id: `inc-${inc.id}`,
      date: inc.payment_date,
      type: "Pemasukan",
    
      description: `Iuran ${inc.fee.fee_type} - Blok ${inc.house.house_number}`,
      income_amount: inc.amount,
      expense_amount: 0,
    })),
    ...details.expenses.map((exp) => ({
      id: `exp-${exp.id}`,
      date: exp.expense_date,
      type: "Pengeluaran",
      description: exp.description,
      income_amount: 0,
      expense_amount: exp.amount,
    })),
  ];

  
  transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }}>
      
        <TableHead sx={{ backgroundColor: "#1976d2" }}>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>No</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tanggal</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Keterangan</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Jenis</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "right" }}>Pemasukan (Rp)</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "right" }}>Pengeluaran (Rp)</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
        {onloading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Loading />
              </TableCell>
            </TableRow>
          ) : ( transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Tidak ada transaksi pada bulan ini.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((row, index) => (
              <TableRow
                key={row.id}
                hover
                sx={{ "&:last-child td": { border: 0 } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>{row.description}</TableCell>
                
                <TableCell>
                 
                  <Chip 
                    label={row.type} 
                    color={row.type === "Pemasukan" ? "success" : "error"} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                
                <TableCell align="right" sx={{ color: "success.main", fontWeight: "bold" }}>
                  {row.income_amount > 0 ? row.income_amount.toLocaleString("id-ID") : "-"}
                </TableCell>
                
                <TableCell align="right" sx={{ color: "error.main", fontWeight: "bold" }}>
                  {row.expense_amount > 0 ? row.expense_amount.toLocaleString("id-ID") : "-"}
                </TableCell>
              </TableRow>
            ))
          ))} 
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableReport;