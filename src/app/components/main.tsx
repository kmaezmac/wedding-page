'use client'
import React, { useState, ReactNode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import { Calendar, Camera, MapPin, MessageCircle, Gem, CircleAlert } from "lucide-react";
import dayjs from 'dayjs';
import headerImage from './header.png';
import 'dayjs/locale/ja';
import { uploadFileToDrive } from '../api/api';



dayjs.locale('ja');

interface SectionProps {
  title: string;
  icon: ReactNode;
  content: string;
  children?: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, content, children }) => (
  <section className="text-center space-y-4">
    <div className="flex justify-center mb-4">{icon}</div>
    <h2 className="text-3xl font-serif text-[#7d5a50]">{title}</h2>
    <p className="text-lg text-gray-700 whitespace-pre-line">{content}</p>
    {children}
  </section>
);

const Main: React.FC = () => {

  const [dateText] = useState(
    `${process.env.NEXT_PUBLIC_DATE_YEAR}年${process.env.NEXT_PUBLIC_DATE_MONTH}月${process.env.NEXT_PUBLIC_DATE_DAY}日` || ''
  );
  const [timeCeremony] = useState(process.env.NEXT_PUBLIC_CEREMONY_TIME || '');
  const [timeReception] = useState(process.env.NEXT_PUBLIC_RECEPTION_TIME || '');
  const [churchName] = useState(process.env.NEXT_PUBLIC_CHURCH_NAME || '');
  const [churchAddress] = useState(process.env.NEXT_PUBLIC_CHURCH_ADDRESS || '');
  const [churchAccess] = useState(process.env.NEXT_PUBLIC_CHURCH_ACCESS || '');
  const [churchTel] = useState(process.env.NEXT_PUBLIC_CHURCH_TEL || '');
  const [churchMap] = useState(process.env.NEXT_PUBLIC_CHURCH_MAP_URL || '');
  const [emailAddress] = useState(process.env.NEXT_PUBLIC_MAIL_ADDRESS || '');
  const [groomName] = useState(process.env.NEXT_PUBLIC_GROOM_NAME || '');
  const [brideName] = useState(process.env.NEXT_PUBLIC_BRIDE_NAME || '');

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('ファイルを選択してください。');
      return;
    }

    setLoading(true);
    setUploadStatus('アップロード中...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64File = reader.result as string;
        await uploadFileToDrive(base64File, file.name, file.type);
        setUploadStatus(`アップロードに成功しました`);
      };
    } catch (error) {
      console.error('アップロードエラー:', error);
      setUploadStatus('アップロードに失敗しました。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-full h-screen bg-white relative flex items-center justify-center max-w-xl  mx-auto md:p-12 space-y-16  opacity-95">
        <img src={headerImage.src} alt="Full Image" className="w-full h-full object-contain aspect-auto" />
      </div>

      <main className="bg-white max-w-xl mx-auto p-6 md:p-12 space-y-16 opacity-95 ">
        {/* ご挨拶セクションをCardに変更 */}
        <Card sx={{ maxWidth: 600, mx: 'auto', mb: 6, boxShadow: 3, borderRadius: 2, backgroundColor: '#fff7f5' }}>
          <CardContent>
            <Box className="flex justify-center mb-4">
              <Gem className="h-10 w-10 text-rose-400" />
            </Box>
            <Typography variant="h5" component="div" className="font-serif text-[#7d5a50] text-center">
              ご挨拶
            </Typography>
            <Typography variant="body1" color="text.secondary" className="text-gray-700 text-center whitespace-pre-line mt-4">
              {`拝啓
晩秋の候、皆様にはますますご健勝のこととお慶び申し上げます

このたび、私たちは`}{dateText}{`に結婚式を挙げる運びとなりました

これまで私たちを支えていただきました皆様へ、日頃の感謝の気持ちをお伝えし、心に残るひとときを共に過ごしたく存じます

つきましては、誠に勝手ながら下記により挙式および披露宴を執り行いますので、ご多用中とは存じますが、ぜひご出席賜りますようお願い申し上げます
敬具`}
            </Typography>
          </CardContent>
        </Card>

        <Section
          title="お願い"
          icon={<CircleAlert className="h-10 w-10 text-rose-400" />}
          content="まだ回答されていない方は、こちらから出席確認を行なってください"
        >
          <Button
            variant="contained"
            href="/invitation"
            sx={{ backgroundColor: '#f5b2b2', color: '#fff' }}
          >
            出席確認
          </Button>

          <section className="text-center space-y-4">
            <h2 className="text-3xl font-serif text-[#7d5a50]"></h2>
            <p className="text-lg text-gray-700 whitespace-pre-line">
              まだ友達追加されていない方は、こちらから結婚式公式Lineアカウントの友達追加を行なってください
            </p>
            <Button
              variant="contained"
              href={process.env.NEXT_PUBLIC_LINE_URL}
              sx={{ backgroundColor: '#06C755', color: '#fff' }}>
              Line公式アカウントを友達追加
            </Button>
          </section>
        </Section>

        <Section
          title="日時"
          icon={<Calendar className="h-10 w-10 text-rose-400" />}
          content=""
        >
          <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ year: 'YYYY年' }}>
            <DatePicker
              label="挙式日"
              format="YYYY/MM/DD"
              slotProps={{ calendarHeader: { format: 'YYYY年MM月' } }}
              defaultValue={dayjs(`${process.env.NEXT_PUBLIC_DATE_YEAR}-${process.env.NEXT_PUBLIC_DATE_MONTH}-${process.env.NEXT_PUBLIC_DATE_DAY}`)}
            />
          </LocalizationProvider>
          <p>挙式: {timeCeremony}<br />披露宴: {timeReception}</p>
        </Section>

        <Section
          title="場所"
          icon={<MapPin className="h-10 w-10 text-rose-400" />}
          content={`会場: ${churchName}\n所在地: ${churchAddress}\nアクセス: ${churchAccess}\n電話番号: ${churchTel}`}
        >
          <Button
            variant="contained"
            href={process.env.NEXT_PUBLIC_CHURCH_URL}
            sx={{ backgroundColor: '#f5b2b2', color: '#fff' }}>
            式場公式サイトへ移動
          </Button>
          <iframe
            src={churchMap}
            width="100%"
            height="300"
            loading="lazy"
            className="rounded-md shadow-md"
          ></iframe>
        </Section>

        <Section
          title="写真"
          icon={<Camera className="h-10 w-10 text-rose-400" />}
          content="撮影した写真・動画をこちらにアップロードしてください"
        >
          <input type="file" onChange={handleFileChange} />
      <Button
        variant="contained"
        onClick={handleUpload}
        sx={{ backgroundColor: '#4285F4', color: '#fff' }}
        disabled={loading}
      >
        アップロード
      </Button>
      {loading && <CircularProgress />}
      <Typography variant="body2" color="text.secondary">
        {uploadStatus}
      </Typography>
      <Button
            variant="contained"
            href={process.env.NEXT_PUBLIC_GOOGLE_DRIVE_URL}
            sx={{ backgroundColor: '#4285F4', color: '#fff' }}
          >
            アップロードした写真・動画はこちらで確認
          </Button>

        </Section>

        <Section
          title="お問い合わせ"
          icon={<MessageCircle className="h-10 w-10 text-rose-400" />}
          content={`何かご不明な点や困りごとがございましたら こちらにメールしてください\n${emailAddress}`}
        />
      </main>

      <footer className="w-full text-center bg-white py-6 text-[#7d5a50] border-t max-w-xl mx-auto p-6 md:p-12 space-y-16 opacity-95">
        <p>© {new Date().getFullYear()} {groomName} & {brideName} All rights reserved.</p>
      </footer>
    </>
  )
}

export default Main;
