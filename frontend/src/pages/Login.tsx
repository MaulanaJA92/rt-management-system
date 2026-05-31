import { useState } from 'react';
import { Box, TextField, Button, Typography, Stack, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authLogin } from '../api/auth';

const LoginPage = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
  
      const response = await  authLogin(email, password);
      console.log('Login successful:', response);
      
      localStorage.setItem('token', response.token);
      
      navigate('/dashboard');
    } catch (error) {
      alert("Login gagal! Cek email dan password.");
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>Login Sistem RT</Typography>
          <Stack spacing={3} component="form" onSubmit={handleLogin}>
            <TextField 
              label="Email" 
              fullWidth 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <TextField 
              label="Password" 
              type="password" 
              fullWidth 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Button type="submit" variant="contained" size="large">
              Masuk
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;