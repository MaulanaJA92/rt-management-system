import { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
} from "@mui/material";
import type { Resident } from "../../types";
import { createResident, updateResident } from "../../api/residentsApi";

// type Resident = {
//   id?: number;
//   full_name: string;
//   foto_ktp: string;
//   phone_number: string;
//   status: string;
//   is_married: boolean;
// };
type Props = {
  mode: "add" | "edit";
  resident?: Resident | null;
  onClose: () => void;
};

const FormResidents = ({ mode, resident, onClose }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Resident>(
    resident || {
      id: 0,
      full_name: "",
      ktp_photo: "",
      phone_number: "",
      status: "Tetap",
      is_married: false,
    },
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFormData({
        ...formData,
        ktp_photo: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "add" && !formData.ktp_photo) {
      alert("Foto KTP wajib diunggah!");
      return;
    }
    const formData2 = new FormData();

    formData2.append("full_name", formData.full_name);
    formData2.append("status", formData.status);
    formData2.append("phone_number", formData.phone_number);
    formData2.append("is_married", formData.is_married ? "1" : "0");

    if (file) {
      formData2.append("ktp_photo", file);
    }
    try {
      if (mode === "add") {
        await createResident(formData2);
      } else {
        await updateResident(formData.id, formData2);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          label="Nama Lengkap"
          fullWidth
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          required
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Foto KTP
          </Typography>

          {formData.ktp_photo && (
            <Box sx={{ mb: 1 }}>
              <img src={`${formData.ktp_photo}`} alt="KTP" width="100" />
            </Box>
          )}

          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
          >
            {formData.ktp_photo ? "Ganti Foto" : "Pilih Foto KTP"}
          </Button>
        </Box>

        <TextField
          select
          label="Status"
          fullWidth
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          required
        >
          <MenuItem value="Tetap">Tetap</MenuItem>
          <MenuItem value="Kontrak">Kontrak</MenuItem>
        </TextField>
        <TextField
          label="No Telepon"
          fullWidth
          value={formData.phone_number}
          onChange={(e) =>
            setFormData({ ...formData, phone_number: e.target.value })
          }
          required
        />

        <TextField
          select
          label="Status perkawinan"
          fullWidth
          value={formData.is_married ? "true" : "false"}
          onChange={(e) =>
            setFormData({ ...formData, is_married: e.target.value === "true" })
          }
          required
        >
          <MenuItem value="true">Menikah</MenuItem>
          <MenuItem value="false">Belum Menikah</MenuItem>
        </TextField>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Batal
          </Button>
          <Button type="submit" variant="contained">
            {mode === "add" ? "Simpan" : "Update"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default FormResidents;
