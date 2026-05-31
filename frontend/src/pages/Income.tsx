import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Income } from "../types";

import FormIncome from "../components/Income/FormIncome";
import { deleteIncome, getIncomes } from "../api/Income";
import TableIncome from "../components/Income/TableIncome";

const IncomePage = () => {
  const [loading, setLoading] = useState(true);
  const [periodMonth, setPeriodMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [income, setIncome] = useState<Income[]>([]);

  useEffect(() => {
    fetchIncome();
  }, [periodMonth]);

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const response = await getIncomes(`${periodMonth}`);
      setIncome(response.data);
    } catch (error) {
      console.error("Error fetching income:", error);
    } finally {
      setLoading(false);
    }
  };

  const [openForm, setOpenForm] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [selection, setSelection] = useState<Income | null>(null);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Data Pemasukan
        </Typography>

        <TextField
          label="Pilih Periode"
          type="month"
          value={periodMonth}
          onChange={(e) => setPeriodMonth(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          size="small"
          sx={{ backgroundColor: "white", width: 250 }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setOpenForm(true);
          }}
        >
          Tambah Pemasukan
        </Button>
      </Box>
      <TableIncome
        onloading={loading}
        income={income}
        onDelete={(incomeItem: Income) => {
          setSelection(incomeItem);
          setOpenDelete(true);
        }}
      />
      {openForm && (
        <Dialog
          open={openForm}
          onClose={() => {
            setOpenForm(false);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>"Tambah Pemasukan Baru"</DialogTitle>

          <DialogContent dividers>
            <FormIncome
              onClose={() => {
                setOpenForm(false);
                fetchIncome();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      {openDelete && selection && (
        <Dialog
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
            setSelection(null);
          }}
        >
          <DialogTitle>Hapus Pemasukan</DialogTitle>
          <DialogContent>
            <p>Apakah Anda yakin ingin menghapus pemasukan ini?</p>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setOpenDelete(false);
                setSelection(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                if (selection) {
                  try {
                    await deleteIncome(selection.id);
                    await fetchIncome();
                  } catch (error) {
                    console.error("Gagal menghapus:", error);
                    alert("Terjadi kesalahan saat menghapus data.");
                  }
                }

                setOpenDelete(false);
                setSelection(null);
              }}
            >
              Hapus
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default IncomePage;
