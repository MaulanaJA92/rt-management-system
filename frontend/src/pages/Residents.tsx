import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import TableResidents from "../components/Residents/TableResidents";
import { useEffect, useState } from "react";
import FormResidents from "../components/Residents/FormResidents";
import { deleteResident, getResidents } from "../api/residentsApi";
import type { Resident } from "../types";

const ResidentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const response = await getResidents();
      setResidents(response.data);
    } catch (error) {
      console.error("Error fetching residents:", error);
    } finally {
      setLoading(false);
    }
  };
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [openDelete, setOpenDelete] = useState(false);
  const [selection, setSelection] = useState<Resident | null>(null);
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
        <h2>Data Penghuni</h2>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setMode("add");
            setOpenForm(true);
          }}
        >
          Tambah Penghuni
        </Button>
      </Box>
      <TableResidents
        onloading={loading}
        residents={residents}
        openForm={(selection: Resident) => {
          setMode("edit");
          setOpenForm(true);
          setSelection(selection);
        }}
        onDelete={(resident: Resident) => {
          setSelection(resident);
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
          <DialogTitle>
            {mode === "add" ? "Tambah Penghuni Baru" : "Edit Data Penghuni"}
          </DialogTitle>

          <DialogContent dividers>
            <FormResidents
              mode={mode}
              resident={selection ?? undefined}
              onClose={() => {
                setOpenForm(false);
                setSelection(null);
                fetchResidents();
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
          <DialogTitle>Hapus Penghuni</DialogTitle>
          <DialogContent>
            <p>Apakah Anda yakin ingin menghapus penghuni ini?</p>
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
                    await deleteResident(selection.id);
                    await fetchResidents();
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

export default ResidentsPage;
