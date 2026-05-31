import { useEffect, useState } from "react";
import { Box, Typography, TextField, Paper, Grid } from "@mui/material";

import TableReport from "../components/Report/TableReport";
import { getReport } from "../api/report";
import type { ReportDetails, ReportSummary } from "../types";

const ReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [periodMonth, setPeriodMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const [reportData, setReportData] = useState<ReportDetails>({
    incomes: [],
    expenses: [],
  });

  const [summary, setSummary] = useState<ReportSummary>({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true)
        const response = await getReport(`${periodMonth}`);

        setReportData(response.data.details);
        setSummary(response.data.summary);
      } catch (error) {
        console.error("Error fetching report:", error);
        setReportData({
          incomes: [],
          expenses: [],
        });
        setSummary({
          total_income: 0,
          total_expense: 0,
          balance: 0,
        });
      }finally {
      setLoading(false);
    }
    };

    fetchReport();
  }, [periodMonth]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Laporan Keuangan RT
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
      </Box>

      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{ p: 3, borderTop: "4px solid #4caf50", textAlign: "center" }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Total Pemasukan
            </Typography>
            <Typography
              variant="h5"
              color="success.main"
              sx={{ fontWeight: "bold" }}
            >
              Rp {summary.total_income.toLocaleString("id-ID")}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{ p: 3, borderTop: "4px solid #f44336", textAlign: "center" }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Total Pengeluaran
            </Typography>
            <Typography
              variant="h5"
              color="error.main"
              sx={{ fontWeight: "bold" }}
            >
              Rp {summary.total_expense.toLocaleString("id-ID")}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{ p: 3, borderTop: "4px solid #2196f3", textAlign: "center" }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Saldo Akhir
            </Typography>
            <Typography
              variant="h5"
              color="primary.main"
              sx={{ fontWeight: "bold" }}
            >
              Rp {summary.balance.toLocaleString("id-ID")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Buku Kas (Rincian Transaksi)
      </Typography>

      <TableReport onloading={loading} details={reportData} />
    </Box>
  );
};

export default ReportPage;
