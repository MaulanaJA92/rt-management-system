import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
} from "@mui/material";
import { createIncome, getFees, getHouses } from "../../api/Income";

type Props = {
  onClose: () => void;
};

type HouseDropdown = {
  house_id: number;
  house_number: string;
  resident_id: number;
  resident_name: string;
};

type FeeItem = {
  id: number;
  name: string;
  amount: number;
  isPaid: boolean; 
};

const FormIncome = ({ onClose }: Props) => {
  const [houses, setHouses] = useState<HouseDropdown[]>([]);
  const [fees, setFees] = useState<FeeItem[]>([]);

  const [periodMonth, setPeriodMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const [selectedHouseId, setSelectedHouseId] = useState<number | "">("");
  const [selectedResidentId, setSelectedResidentId] = useState<number | "">("");
  const [yearlyStatus, setYearlyStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      const response = await getHouses();
      setHouses(response.data);
      //   setHouses([
      //     { house_id: 1, house_number: "A-01", resident_id: 10, resident_name: "Budi Santoso" },
      //     { house_id: 2, house_number: "B-05", resident_id: 11, resident_name: "Siti Aminah" },
      //   ]);
    };
    fetchInitialData();
  }, []);

  
  useEffect(() => {
    if (!selectedHouseId || !periodMonth) {
      setFees([]);
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        const response = await getFees(selectedHouseId, periodMonth);
        const fetchedFees = response.data || []; 
        if (!Array.isArray(fetchedFees) || fetchedFees.length === 0 || typeof fetchedFees[0].isPaid === "undefined") {
          console.error("Data tagihan tidak dalam format yang diharapkan:", fetchedFees);
          alert("Data tagihan tidak valid. Silakan coba lagi.");
          setFees([]);
          return;
        }
        
        setFees(fetchedFees);

        const initialYearlyState: Record<number, boolean> = {};
        fetchedFees.forEach((fee: any) => { 
          initialYearlyState[fee.id] = false;
        });

       
        setYearlyStatus(initialYearlyState);
      } catch (error) {
        console.error("Gagal mengecek status pembayaran:", error);
      }
    };

    fetchPaymentStatus();
  }, [selectedHouseId, periodMonth]);

  const handleHouseChange = (e: any) => {
    const hId = e.target.value as number;
    setSelectedHouseId(hId);
    const house = houses.find((h) => h.house_id === hId);
    if (house) setSelectedResidentId(house.resident_id);
  };

  const handleYearlyCheck = (feeId: number) => {
    setYearlyStatus((prev) => ({ ...prev, [feeId]: !prev[feeId] }));
  };

  const totalAmount = (fees || []).reduce((total, fee) => {
    if (fee.isPaid) return total;
    const isYearly = yearlyStatus[fee.id] || false;
    return total + fee.amount * (isYearly ? 12 : 1);
  }, 0);
 
  const isAllPaid = (fees || []).length > 0 && (fees || []).every((fee) => fee.isPaid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHouseId || isAllPaid) {
      alert("Tidak ada tagihan yang perlu dibayar!");
      return;
    }

    const feesPayload = fees
      .filter((fee) => !fee.isPaid)
      .map((fee) => ({
        fee_id: fee.id,
        pay_yearly: yearlyStatus[fee.id] || false,
      }));

    const payload = {
      house_id: selectedHouseId,
      resident_id: selectedResidentId,
      payment_date: new Date().toISOString().split("T")[0],
      period_date: `${periodMonth}-01`,
      fees: feesPayload,
    };

    try {
      console.log("Payload dikirim:", payload);
      const response = await createIncome(payload);
      console.log("Response dari server:", response);
      alert("Data berhasil disimpan! (Cek Console)");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Stack spacing={3}>
        <TextField
          label="Periode Bulan & Tahun"
          type="month"
          fullWidth
          value={periodMonth}
          onChange={(e) => setPeriodMonth(e.target.value)}
          required
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <FormControl fullWidth required>
          <InputLabel id="house-select-label">
            Pilih Rumah - Penghuni
          </InputLabel>
          <Select
            labelId="house-select-label"
            value={selectedHouseId}
            label="Pilih Rumah - Penghuni"
            onChange={handleHouseChange}
          >
            {houses.map((house) => (
              <MenuItem key={house.house_id} value={house.house_id}>
                Blok {house.house_number} - {house.resident_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Status Tagihan Iuran:
          </Typography>

          {!selectedHouseId ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              Silakan pilih rumah terlebih dahulu.
            </Typography>
          ) : (
            fees.map((fee) => (
              <Box
                key={fee.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: fee.isPaid ? "success.light" : "#eee",
                  borderRadius: 1,
                  backgroundColor: fee.isPaid ? "#f0fdf4" : "#fafafa",
                  opacity: fee.isPaid ? 0.7 : 1,
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {fee.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={fee.isPaid ? "success.main" : "text.secondary"}
                    sx={{ fontWeight: fee.isPaid ? "bold" : "normal" }}
                  >
                    {fee.isPaid
                      ? "✔ LUNAS"
                      : `Rp ${fee.amount.toLocaleString("id-ID")} / bulan`}
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={yearlyStatus[fee.id] || false}
                      onChange={() => handleYearlyCheck(fee.id)}
                      disabled={fee.isPaid}
                    />
                  }
                  label={
                    <Typography
                      component="span"
                      variant="body2"
                      color={fee.isPaid ? "text.disabled" : "primary"}
                      sx={{ fontWeight: "bold" }}
                    >
                      1 Tahun (x12)
                    </Typography>
                  }
                />
              </Box>
            ))
          )}
        </Box>

        <TextField
          label="Total Pembayaran Baru (Rp)"
          fullWidth
          value={totalAmount.toLocaleString("id-ID")}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { readOnly: true },
          }}
          sx={{ backgroundColor: "#f0f8ff" }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!selectedHouseId || isAllPaid}
          >
            Simpan Pembayaran
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default FormIncome;
