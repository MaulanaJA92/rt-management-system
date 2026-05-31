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
import type { Expense } from "../types";
import { deleteExpense, getExpenses } from "../api/expenses";
import TableExpenses from "../components/Expenses/TableExpenses";
import FormExpenses from "../components/Expenses/FormExpenses";

const ExpensesPage = () => {
  const [loading, setLoading] = useState(true);
  const [periodMonth, setPeriodMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses();
  }, [periodMonth]);

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await getExpenses(`${periodMonth}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }finally {
      setLoading(false);
    }
  };

  const [openForm, setOpenForm] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [selection, setSelection] = useState<Expense | null>(null);
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
          Tambah Pengeluaran
        </Button>
      </Box>
      <TableExpenses
        onloading={loading}
        expenses={expenses}
        onDelete={(expense: Expense) => {
          setSelection(expense);
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
          <DialogTitle>"Tambah Pengeluaran Baru"</DialogTitle>

          <DialogContent dividers>
            <FormExpenses
              expense={selection ?? undefined}
              onClose={() => {
                setOpenForm(false);
                fetchExpenses();
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
          <DialogTitle>Hapus Pengeluaran</DialogTitle>
          <DialogContent>
            <p>Apakah Anda yakin ingin menghapus pengeluaran ini?</p>
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
                    await deleteExpense(selection.id);
                    await fetchExpenses();
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

export default ExpensesPage;
