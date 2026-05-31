import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box 
} from '@mui/material';

const Navbar = () => {
 
  const [openL, setopenL] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setopenL(event.currentTarget);
  };

  const handleMenuClose = () => {
    setopenL(null);
  };

  const handleLogout = () => {
    console.log("User logged out"); 
    handleMenuClose();
  };

  return (
    <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
       
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Sistem Iuran RT
        </Typography>
        <Box>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 'bold' }}>
              A
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={openL}
            open={Boolean(openL)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{ mt: 1 }} 
          >
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 'bold' }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;