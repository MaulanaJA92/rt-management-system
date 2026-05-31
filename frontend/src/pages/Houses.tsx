import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { getHouses, deleteHouse } from "../api/house";
import TableHouses from "../components/Houses/TableHouses";
import FormHouses from "../components/Houses/FormHouses";
import type { House } from "../types";

const HousesPage = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selection, setSelection] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const response = await getHouses();

      setHouses(response.data.houses || []);
    } catch (error) {
      console.error("Gagal memuat data rumah:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Data Rumah & Riwayat
        </Typography>

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setSelection(null);
            setOpenForm(true);
            console.log("Tambah Rumah clicked");
          }}
        >
          Tambah Rumah
        </Button>
      </Box>

      <TableHouses
        onloading={loading}
        houses={houses}
        onEdit={(house: House) => {
          setSelection(house);
          setOpenForm(true);
        }}
        onDelete={(house: House) => {
          setSelection(house);
          setOpenDelete(true);
        }}
      />

      {openForm && (
        <Dialog
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setSelection(null);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
            {selection ? "Edit Data Rumah" : "Tambah Rumah Baru"}
          </DialogTitle>
          <DialogContent dividers>
            <FormHouses
              mode={selection ? "edit" : "add"}
              selectedHouse={selection}
              onClose={() => {
                setOpenForm(false);
                setSelection(null);
                fetchHouses();
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
          <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
            Hapus Data Rumah
          </DialogTitle>
          <DialogContent>
            <p>
              Apakah Anda yakin ingin menghapus data rumah
              <strong> Blok {selection.house_number}</strong>? Tindakan ini
              mungkin akan menghapus riwayat yang terkait.
            </p>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
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
                try {
                  await deleteHouse(selection.id);
                  await fetchHouses();
                } catch (error) {
                  console.error("Gagal menghapus:", error);
                  alert("Terjadi kesalahan saat menghapus data.");
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

export default HousesPage;
