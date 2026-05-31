import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import type { Income } from "../../types";
import Loading from "../Loading";

type Props = {
  income: Income[];
  onDelete: (income: Income) => void;
  onloading: boolean;
};

const TableIncome = ({ income, onDelete, onloading }: Props) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const handleOpenDetail = (data: Income) => {
    setSelectedIncome(data);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedIncome(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                No
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Rumah
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Penghuni
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Tanggal Bayar
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total (Rp)
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
            ) : income.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Tidak ada Data.
                </TableCell>
              </TableRow>
            ) : (
              income.map((row, index) => (
                <TableRow
                  key={`${row.house_number}-${row.payment_date}`}
                  hover
                  sx={{ "&:last-child td": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>Blok {row.house_number}</TableCell>
                  <TableCell>{row.resident_name}</TableCell>
                  <TableCell>{row.payment_date}</TableCell>
                  <TableCell>
                    {Number(row.total_amount).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenDetail(row)}
                    >
                      Detail
                    </Button>
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

      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
          Detail Pembayaran
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedIncome && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Rumah:</strong> Blok {selectedIncome.house_number} (
                {selectedIncome.resident_name})
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Tanggal Bayar:</strong> {selectedIncome.payment_date}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="h6"
                sx={{ fontSize: 16, mb: 1, fontWeight: "bold" }}
              >
                Rincian Iuran:
              </Typography>

              {selectedIncome.details.map((detail, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1.5,
                    mb: 1,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 1,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                    >
                      {detail.fee_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Periode: {detail.period}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    Rp {Number(detail.amount).toLocaleString("id-ID")}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  TOTAL:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "success.main" }}
                >
                  Rp{" "}
                  {Number(selectedIncome.total_amount).toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
          <Button
            onClick={handleCloseDetail}
            variant="contained"
            color="primary"
          >
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableIncome;
