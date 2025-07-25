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
import { Calendar } from 'lucide-react';
import Head from 'next/head';
import { postToNotion } from '../api/api';
// import Footer from '../components/footer'

// カスタムテーマの作成
const theme = createTheme({
  palette: {
    primary: {
      main: '#f43f5e',
    },
    secondary: {
      main: '#10b981',
    },
  },
  typography: {
    h4: {
      fontFamily: 'serif',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(244, 63, 94, 0.4)',
            transform: 'translateY(-2px)'
          }
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.1)',
        },
      },
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
  const [dateText] = useState(
    `${process.env.NEXT_PUBLIC_DATE_YEAR}年${process.env.NEXT_PUBLIC_DATE_MONTH}月${process.env.NEXT_PUBLIC_DATE_DAY}日` || ''
  );
  
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      </Head>
      <div className="gradient-bg min-h-screen py-8">
        <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <Box sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 6, backgroundColor: '#fff7f5' }}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 icon-bounce">
                <Calendar className="h-12 w-12 text-rose-500" />
              </div>
            </div>
            <Typography variant="h4" component="h1" gutterBottom align="center" className="text-gray-800 mb-4">
              出席確認
            </Typography>
            <Typography variant="h6" gutterBottom align="center" className="text-gray-600 mb-8">
              {dateText}の結婚式
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
                  <FormControlLabel value="yes" control={<Radio />} label="はい 出席します" />
                  <FormControlLabel value="no" control={<Radio />} label="いいえ 欠席します" />
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
          message="ご回答いただきありがとうございます 回答が正常に送信されました "
        />
        {/* <Footer/> */}
        </ThemeProvider>
      </div>
    </>
  );
}