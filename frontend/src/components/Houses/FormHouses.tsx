import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { createHouse, getAvailableResidents, updateHouse } from "../../api/house";
import type { House } from "../../types";

type Props = {
  mode: "add" | "edit"; 
  onClose: () => void;
  selectedHouse?: House | null;
};

const FormHouses = ({ mode, onClose, selectedHouse }: Props) => {
  const [houseNumber, setHouseNumber] = useState("");
  const [currentResidentId, setCurrentResidentId] = useState<number | "">("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [residents, setResidents] = useState<any[]>([]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res = await getAvailableResidents();
        setResidents(res.data);

        // setResidents([
        //   { id: 1, full_name: "Budi" },
        //   { id: 2, full_name: "Siti" },
        //   { id: 3, full_name: "Agus" },
        // ]);
      } catch (error) {
        console.error("Gagal memuat data penghuni", error);
      }
    };
    fetchResidents();

    if (mode === "edit" && selectedHouse) {
      setHouseNumber(selectedHouse.house_number);

      const activeHistory = selectedHouse.house_histories?.find(
        (h) => h.end_date === null,
      );

      if (activeHistory) {
        const resId = activeHistory.resident_id || activeHistory.resident?.id;
        setCurrentResidentId(resId ? Number(resId) : "");
        setStartDate(activeHistory.start_date || "");
      }
    }
  }, [mode, selectedHouse]);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      house_number: houseNumber,
      current_resident_id: currentResidentId === "" ? null : currentResidentId,
      start_date: startDate === "" ? null : startDate,
    };

    try {
      if (mode === "edit" && selectedHouse) {
       
        await updateHouse(selectedHouse.id, payload); 
        alert("Rumah berhasil diupdate!");
      } else {
       
        await createHouse(payload);
        alert("Rumah berhasil ditambahkan!");
      }
      onClose();
    } catch (error) {
      console.error("Gagal menyimpan data rumah:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        label="Nomor/Blok Rumah"
        fullWidth
        required
        margin="normal"
        value={houseNumber}
        onChange={(e) => setHouseNumber(e.target.value)}
        placeholder="Contoh: A-12"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="resident-select-label">
          Penghuni Saat Ini (Opsional)
        </InputLabel>
        <Select
          labelId="resident-select-label"
          value={currentResidentId}
          label="Penghuni Saat Ini (Opsional)"
          onChange={(e) => setCurrentResidentId(e.target.value as number | "")}
        >
          <MenuItem value="">
            <em>-- Kosongkan (Tidak Dihuni) --</em>
          </MenuItem>
          {residents.map((res) => (
            <MenuItem key={res.id} value={res.id}>
              {res.full_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {currentResidentId !== "" && (
        <TextField
          label="Tanggal Mulai Menempati"
          type="date"
          fullWidth
          margin="normal"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          helperText="Kapan penghuni ini mulai menempati rumah?"
        />
      )}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
          Batal
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {mode === "edit" ? "Simpan Perubahan" : "Tambah Rumah"}
        </Button>
      </Box>
    </Box>
  );
};

export default FormHouses;
