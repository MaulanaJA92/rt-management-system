import { Box, Toolbar } from "@mui/material";
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};
const Layout = ({ children }: Props) => {
  const drawerWidth = 240; // Pastikan ini konsisten dengan yang digunakan di Sidebar
  return (

    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Sidebar drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`, // TAMBAHKAN INI!
          width: `calc(100% - ${drawerWidth}px)`, // Agar tidak melebar keluar layar
        }}
      >
        <Toolbar />
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
