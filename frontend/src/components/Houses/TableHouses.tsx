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
  Box,
  Chip,
} from "@mui/material";
import type { House } from "../../types";
import Loading from "../Loading";

type Props = {
  houses: House[];
  onEdit: (house: House) => void;
  onDelete: (house: House) => void;
  onloading: boolean;
};

const TableHouses = ({ houses, onEdit, onDelete, onloading }: Props) => {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [openResidentHistory, setOpenResidentHistory] = useState(false);
  const [openBillingHistory, setOpenBillingHistory] = useState(false);

  const today = new Date();
  const currentPeriod = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;


  const getCurrentPaymentStatus = (house: House) => {
    if (house.status !== "Dihuni") return null;
    return house.billing_history.some(
      (bill) => bill.period === currentPeriod && bill.status === "Lunas",
    );
  };

  const handleOpenResident = (house: House) => {
    setSelectedHouse(house);
    setOpenResidentHistory(true);
  };

  const handleOpenBilling = (house: House) => {
    setSelectedHouse(house);
    setOpenBillingHistory(true);
  };

  const handleCloseAll = () => {
    setOpenResidentHistory(false);
    setOpenBillingHistory(false);
    setTimeout(() => setSelectedHouse(null), 200);
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
                Nomor Rumah
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status Rumah
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Penghuni Saat Ini
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Iuran Bulan Ini
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Riwayat
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
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
            ) : houses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Tidak ada Data.
                </TableCell>
              </TableRow>
            ) : (
              houses.map((row, index) => {
                const isPaid = getCurrentPaymentStatus(row);

                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Blok {row.house_number}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={row.status === "Dihuni" ? "success" : "default"}
                        size="small"
                        variant={"outlined"}
                      />
                    </TableCell>

                    <TableCell>{row.current_resident_name}</TableCell>

                    <TableCell>
                      {row.status === "Dihuni" ? (
                        <Chip
                          label={isPaid ? "Lunas" : "Belum Lunas"}
                          color={isPaid ? "success" : "error"}
                          size="small"
                          variant={"outlined"}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenResident(row)}
                      >
                        Penghuni
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenBilling(row)}
                      >
                        Tagihan
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => onEdit(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onDelete(row)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openResidentHistory}
        onClose={handleCloseAll}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
          Riwayat Penghuni - Blok {selectedHouse?.house_number}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedHouse && (
            <Box>
              {selectedHouse.house_histories.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Belum ada data riwayat penghuni.
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Mulai Huni
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Selesai Huni
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Status Warga
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...selectedHouse.house_histories]
                      .reverse()
                      .map((hist, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            {hist.resident?.full_name || "-"}
                          </TableCell>
                          <TableCell>{hist.start_date}</TableCell>
                          <TableCell>{hist.end_date || "Sekarang"}</TableCell>
                          <TableCell>{hist.resident?.status || "-"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
          <Button onClick={handleCloseAll} variant="contained" color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openBillingHistory}
        onClose={handleCloseAll}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
          Riwayat Tagihan Pembayaran - Blok {selectedHouse?.house_number}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedHouse && (
            <Box>
              {selectedHouse.billing_history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Belum ada riwayat pembayaran.
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Periode</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Dibayar Oleh
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Total (Rp)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedHouse.billing_history.map((bill, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{bill.period}</TableCell>
                        <TableCell>{bill.resident_name}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              bill.status === "Lunas" ? "Lunas" : "Belum Lunas"
                            }
                            color={
                              bill.status === "Lunas" ? "success" : "error"
                            }
                            size="small"
                            variant={"outlined"}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {bill.amount_paid
                            ? bill.amount_paid.toLocaleString("id-ID")
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
          <Button onClick={handleCloseAll} variant="contained" color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableHouses;
