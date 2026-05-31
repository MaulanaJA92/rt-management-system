import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Users,
  Home,
  Wallet,
  TrendingUp,
  TrendingDown,
  FileText,
} from "lucide-react";

type Props = { drawerWidth: number };

const Sidebar = ({ drawerWidth }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFinance, setOpenFinance] = useState(() =>
    location.pathname.startsWith("/finance"),
  );

  const menuItems = [
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { text: "Penghuni", path: "/residents", icon: <Users size={20} /> },
    { text: "Rumah", path: "/houses", icon: <Home size={20} /> },
    {
      text: "Keuangan",
      isParent: true,
      icon: <Wallet size={20} />,
      subMenu: [
        {
          text: "Pemasukan",
          path: "/finance/income",
          icon: <TrendingUp size={18} />,
        },
        {
          text: "Pengeluaran",
          path: "/finance/expenses",
          icon: <TrendingDown size={18} />,
        },
        {
          text: "Laporan",
          path: "/finance/report",
          icon: <FileText size={18} />,
        },
      ],
    },
  ];

  const activeStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      backgroundColor: isActive ? "rgba(25, 118, 210, 0.08)" : "transparent",
      color: isActive ? "#1976d2" : "inherit",
      borderRight: isActive ? "4px solid #1976d2" : "4px solid transparent",
      "&:hover": {
        backgroundColor: isActive
          ? "rgba(25, 118, 210, 0.12)"
          : "rgba(0, 0, 0, 0.04)",
      },
      "& .MuiListItemIcon-root": {
        color: isActive ? "#1976d2" : "inherit",
      },
    };
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Toolbar />
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <Box key={item.text}>
            <ListItemButton
              sx={{
                ...(!item.isParent && item.path ? activeStyle(item.path) : {}),
                mb: 0.5,
              }}
              onClick={() => {
                if (item.isParent) {
                  setOpenFinance(!openFinance);
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: {
                    style: {
                      fontWeight: "bold",
                    },
                  },
                }}
              />
              {item.isParent &&
                (openFinance ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                ))}
            </ListItemButton>

            {item.subMenu && (
              <Collapse in={openFinance} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subMenu.map((sub) => (
                    <ListItemButton
                      key={sub.text}
                      sx={{
                        pl: 4,
                        ...activeStyle(sub.path),
                        mb: 0.5,
                      }}
                      onClick={() => navigate(sub.path)}
                    >
                      <ListItemIcon sx={{ minWidth: 35 }}>
                        {sub.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={sub.text}
                        slotProps={{
                          primary: {
                            style: {
                              fontWeight: "bold",
                            },
                          },
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
