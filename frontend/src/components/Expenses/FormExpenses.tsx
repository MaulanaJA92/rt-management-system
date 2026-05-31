import { useState } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";
import type { Expense } from "../../types";
import { createExpense } from "../../api/expenses";

type Props = {
  expense?: Expense | null;
  onClose: () => void;
};

const FormExpenses = ({ onClose }: Props) => {
  const [formData, setFormData] = useState<Expense>({
    id: 0,
    description: "",
    amount: "",
    expense_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.expense_date) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      await createExpense(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          label="Deskripsi"
          fullWidth
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <TextField
          label="Jumlah Rp"
          fullWidth
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />

        <TextField
          type="date"
          fullWidth
          value={formData.expense_date}
          onChange={(e) =>
            setFormData({ ...formData, expense_date: e.target.value })
          }
          required
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Batal
          </Button>
          <Button type="submit" variant="contained">
            Simpan
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default FormExpenses;
