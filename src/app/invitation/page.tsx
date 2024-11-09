"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Box,
  Paper,
  Snackbar,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { postToNotion } from '../api/page';
import Footer from '../components/footer'

// カスタムテーマの作成
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export default function RSVPPage() {
  const router = useRouter();
  const [nameKanji, setNameKanji] = useState('');
  const [nameKana, setNameKana] = useState('');
  const [attendance, setAttendance] = useState('');
  const [guests, setGuests] = useState('0');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your server
    console.log({ nameKanji, nameKana, attendance, guests, dietaryRestrictions, message });

    await postToNotion(nameKanji, nameKana, attendance, Number(guests), dietaryRestrictions, message);
    setOpenSnackbar(true);
    // Redirect to thank you page or home page after a short delay
    setTimeout(() => router.push('/'), 2000);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              出席確認
            </Typography>
            <Typography variant="subtitle1" gutterBottom align="center">
              2025年8月31日 の結婚式
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nameKanji"
                label="お名前(漢字)"
                name="nameKanji"
                autoComplete="nameKanji"
                value={nameKanji}
                onChange={(e) => setNameKanji(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="nameKana"
                label="お名前(かな)"
                name="nameKana"
                autoComplete="nameKana"
                value={nameKana}
                onChange={(e) => setNameKana(e.target.value)}
              />
              <FormControl component="fieldset" margin="normal" required>
                <FormLabel component="legend">出席</FormLabel>
                <RadioGroup
                  aria-label="attendance"
                  name="attendance"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="はい、出席します" />
                  <FormControlLabel value="no" control={<Radio />} label="いいえ、欠席します" />
                </RadioGroup>
              </FormControl>
              {attendance === 'yes' && (
                <>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="guests"
                    label="同伴者数"
                    name="guests"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="dietary"
                    label="食物アレルギー"
                    name="dietary"
                    placeholder="アレルギーなど"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                  />
                </>
              )}
              <TextField
                margin="normal"
                fullWidth
                id="message"
                label="メッセージ（任意）"
                name="message"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                送信
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="ご回答いただきありがとうございます。回答が正常に送信されました。"
      />
      <Footer/>
    </ThemeProvider>
  );
}