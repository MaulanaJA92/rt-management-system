import { Box, Typography } from "@mui/material";


const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        backgroundColor: "background.paper",
        textAlign: "center",
        justifyContent: "center",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">@ 2026 . All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;
