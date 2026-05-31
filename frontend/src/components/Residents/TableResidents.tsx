import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import type { Resident } from "../../types";
import Loading from "../Loading";
// type Resident = {
//   id: number;
//   full_name: string;
//   foto_ktp: string;
//   status: string;
//   phone_number: string;
//   is_married: boolean;
// };
type Props = {
  residents: Resident[];
  openForm: (selection: Resident) => void;
  onDelete: (resident: Resident) => void;
  onloading: boolean;
};

const TableResidents = ({
  residents,
  openForm,
  onDelete,
  onloading,
}: Props) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: "#1976d2" }}>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              No
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Nama Penghuni
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Foto KTP
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Status
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              No Telepon
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Status Perkawinan
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
          ) : (residents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Tidak ada Data.
              </TableCell>
            </TableRow>
          ) : (
            residents.map((row, index) => (
              <TableRow
                key={row.id}
                hover
                sx={{ "&:last-child td": { border: 0 } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.full_name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    component="a"
                    href={row?.ktp_photo || "#"}
                    target="_blank"
                  >
                    Lihat KTP
                  </Button>
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.phone_number}</TableCell>
                <TableCell>
                  {row.is_married ? "Menikah" : "Belum Menikah"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => openForm(row)}
                  >
                    Edit
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableResidents;
