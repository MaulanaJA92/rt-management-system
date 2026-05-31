import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import ResidentsPage from "./pages/Residents";
import LoginPage from "./pages/Login";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ExpensesPage from "./pages/Expenses";
import ReportPage from "./pages/Report";
import IncomePage from "./pages/Income";
import HousesPage from "./pages/Houses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
     
        <Route path="/login" element={<LoginPage />} />

     
        <Route
      
          element={
            <ProtectedRoute>
              <Layout>
                <Outlet /> 
              </Layout>
            </ProtectedRoute>
          }
        >
        
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/residents" element={<ResidentsPage />} />
          <Route path="/houses" element={<HousesPage />} />
          <Route path="/finance/expenses" element={<ExpensesPage />} />
          <Route path="/finance/income" element={<IncomePage />} />
          <Route path="/finance/report" element={<ReportPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;