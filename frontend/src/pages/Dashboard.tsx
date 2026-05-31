import { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Grid from "@mui/material/Grid";
import { getDashboard } from "../api/dashboard";
import type { DashboardData } from "../types";
import Loading from "../components/Loading";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData[]>([]);

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getDashboard();

        const chartData: DashboardData[] = response.data.chart || [];
        setData(chartData);

        const data = response.data.summary;
        setSummary({
          income: data.income,
          expense: data.expense,
          balance: data.balance,
        });
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard Keuangan
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "Total Pemasukan",
            value: `Rp ${summary.income.toLocaleString("id-ID")}`,
            color: "#10b981",
          },
          {
            title: "Total Pengeluaran",
            value: `Rp ${summary.expense.toLocaleString("id-ID")}`,
            color: "#ef4444",
          },
          {
            title: "Saldo Akhir",
            value: `Rp ${summary.balance.toLocaleString("id-ID")}`,
            color: "#3b82f6",
          },
        ].map((item, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card>
              <CardContent sx={{ backgroundColor: item.color, color: "white" }}>
                <Typography color="inherit">{item.title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Grafik Pemasukan & Pengeluaran 12 Bulan Terakhir
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: any) =>
                `Rp ${Number(value || 0).toLocaleString("id-ID")}`
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              name="Pemasukan"
              stroke="#10b981"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Pengeluaran"
              stroke="#ef4444"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="Saldo"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
};

export default DashboardPage;
