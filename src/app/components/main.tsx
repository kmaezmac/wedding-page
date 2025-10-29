'use client'
import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Typography, CircularProgress } from "@mui/material";
import { Calendar, Camera, MapPin, MessageCircle, Gem, CircleAlert, Menu } from "lucide-react";
import dayjs from 'dayjs';
import headerImage from './header.png';
import middleImage from './middle.png';
import 'dayjs/locale/ja';
import { logToServer } from '../api/api';

dayjs.locale('ja');



// Google Drive APIのアクセストークンを取得
async function getAccessToken(): Promise<string> {
  const credentials = {
    type: "service_account",
    project_id: process.env.NEXT_PUBLIC_PROJECT_ID,
    private_key_id: process.env.NEXT_PUBLIC_PRIVATE_KEY_ID,
    private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY!.split(String.raw`\n`).join('\n'),
    client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  };

  // JWTを作成してアクセストークンを取得
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credentials })
  });

  if (!response.ok) {
    throw new Error('トークン取得に失敗しました');
  }

  const data = await response.json();
  return data.accessToken;
}

const Main: React.FC = () => {
  const [dateText] = useState(
    `${process.env.NEXT_PUBLIC_DATE_YEAR}年${process.env.NEXT_PUBLIC_DATE_MONTH}月${process.env.NEXT_PUBLIC_DATE_DAY}日` || ''
  );
  const [timeFamilyGathering] = useState(process.env.NEXT_PUBLIC_FAMILY_GATHERING_TIME || '');
  const [timeReceptionStart] = useState(process.env.NEXT_PUBLIC_RECEPTION_START_TIME || '');
  const [timeCeremony] = useState(process.env.NEXT_PUBLIC_CEREMONY_TIME || '');
  const [timeReception] = useState(process.env.NEXT_PUBLIC_RECEPTION_TIME || '');
  const [churchName] = useState(process.env.NEXT_PUBLIC_CHURCH_NAME || '');
  const [churchPostalCode] = useState(process.env.NEXT_PUBLIC_CHURCH_POSTALCODE || '');
  const [churchAddress] = useState(process.env.NEXT_PUBLIC_CHURCH_ADDRESS || '');
  const [churchAccessOnFoot] = useState(process.env.NEXT_PUBLIC_CHURCH_ACCESS_ONFOOT || '');
  const [churchAccessByCar] = useState(process.env.NEXT_PUBLIC_CHURCH_ACCESS_BYCAR || '');
  const [churchTel] = useState(process.env.NEXT_PUBLIC_CHURCH_TEL || '');
  const [churchMap] = useState(process.env.NEXT_PUBLIC_CHURCH_MAP_URL || '');
  const [emailAddress] = useState(process.env.NEXT_PUBLIC_MAIL_ADDRESS || '');
  const [groomName] = useState(process.env.NEXT_PUBLIC_GROOM_NAME || '');
  const [brideName] = useState(process.env.NEXT_PUBLIC_BRIDE_NAME || '');
  const [menuOpen, setMenuOpen] = useState(false);

  const [files, setFiles] = useState<File[]>([]); // 複数ファイルを管理
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      console.log('=== ファイル選択開始 ===');
      await logToServer('=== ファイル選択開始 ===');
      console.log('選択されたファイル数:', selectedFiles.length);
      await logToServer('選択されたファイル数:', selectedFiles.length);
      selectedFiles.forEach(async (file, index) => {
        const fileInfo = {
          name: file.name,
          type: file.type,
          size: file.size,
          sizeInMB: (file.size / 1024 / 1024).toFixed(2) + 'MB'
        };
        console.log(`ファイル${index + 1}:`, fileInfo);
        await logToServer(`ファイル${index + 1}:`, fileInfo);
      });

      // ファイル形式をチェック（MIMEタイプと拡張子の両方を確認）
      const allowedTypes = [
        // 画像形式
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif',
        // 動画形式
        'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'video/x-matroska', 'video/3gpp'
      ];

      const allowedExtensions = [
        // 画像拡張子
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif',
        // 動画拡張子
        '.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.3gp'
      ];

      const invalidFiles = selectedFiles.filter(file => {
        const hasValidMimeType = file.type && allowedTypes.includes(file.type);
        const hasValidExtension = allowedExtensions.some(ext =>
          file.name.toLowerCase().endsWith(ext)
        );

        // MIMEタイプが空の場合は拡張子でチェック、それ以外は両方を確認
        if (!file.type || file.type === '') {
          const logMsg = `ファイル ${file.name}: MIMEタイプが空、拡張子でチェック: ${hasValidExtension}`;
          console.log(logMsg);
          logToServer(logMsg);
          return !hasValidExtension;
        }

        const isValid = hasValidMimeType || hasValidExtension;
        const logMsg = `ファイル ${file.name}: MIMEタイプチェック=${hasValidMimeType}, 拡張子チェック=${hasValidExtension}, 結果=${isValid}`;
        console.log(logMsg);
        logToServer(logMsg);
        return !isValid;
      });

      if (invalidFiles.length > 0) {
        const invalidInfo = invalidFiles.map(f => ({ name: f.name, type: f.type }));
        console.error('無効なファイル形式:', invalidInfo);
        await logToServer('無効なファイル形式:', invalidInfo);
        setUploadStatus(`対応していないファイル形式が含まれています: ${invalidFiles.map(f => f.name).join(', ')}`);
        return;
      }

      console.log('ファイル形式チェック: OK');
      await logToServer('ファイル形式チェック: OK');
      setFiles(selectedFiles);
      await handleUpload(selectedFiles); // ファイル選択後に即座にアップロード
    }
  };

  const handleUpload = async (filesToUpload = files) => {
    if (filesToUpload.length === 0) {
      console.log('アップロード中止: ファイルが選択されていません');
      await logToServer('アップロード中止: ファイルが選択されていません');
      setUploadStatus('ファイルを選択してください ');
      return;
    }

    console.log('=== アップロード開始 ===');
    await logToServer('=== アップロード開始 ===');
    console.log('アップロード対象ファイル数:', filesToUpload.length);
    await logToServer('アップロード対象ファイル数:', filesToUpload.length);
    setLoading(true);
    setUploadStatus('アップロード中...');

    try {
      const uploadPromises = filesToUpload.map(async (file, index) => {
        try {
          const startMsg = `[${index + 1}/${filesToUpload.length}] アップロード開始: ${file.name}`;
          console.log(startMsg);
          await logToServer(startMsg);

          // クライアント側で直接Google Drive APIを呼び出し
          const accessToken = await getAccessToken();
          console.log('[CLIENT] アクセストークン取得完了');
          await logToServer('[CLIENT] アクセストークン取得完了');

          const folderId = process.env.NEXT_PUBLIC_DIRECTORY_ID;
          const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
          console.log('[CLIENT] アップロード先フォルダURL:', folderUrl);
          await logToServer('[CLIENT] アップロード先フォルダURL:', folderUrl);

          // MIMEタイプを決定
          let finalMimeType = file.type;
          if (!finalMimeType || finalMimeType === '') {
            const extension = file.name.toLowerCase().split('.').pop();
            const mimeTypeMap: { [key: string]: string } = {
              'mp4': 'video/mp4', 'mov': 'video/quicktime', 'avi': 'video/x-msvideo',
              'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
            };
            finalMimeType = mimeTypeMap[extension || ''] || 'application/octet-stream';
            console.log('[CLIENT] MIMEタイプを推測:', finalMimeType);
            await logToServer('[CLIENT] MIMEタイプを推測:', finalMimeType);
          }

          const metadata = {
            name: file.name,
            mimeType: finalMimeType,
            parents: [folderId]
          };

          const form = new FormData();
          form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
          form.append('file', file);

          const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            body: form
          });

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('[CLIENT] アップロードエラー:', uploadResponse.status, errorText);
            await logToServer('[CLIENT] アップロードエラー:', { status: uploadResponse.status, error: errorText });
            throw new Error(`アップロード失敗: ${uploadResponse.status}`);
          }

          const result = await uploadResponse.json();
          const fileUrl = `https://drive.google.com/file/d/${result.id}`;

          console.log('[CLIENT] ✓ アップロード成功');
          console.log('[CLIENT] ファイルID:', result.id);
          console.log('[CLIENT] ファイルURL:', fileUrl);
          console.log('[CLIENT] フォルダURL:', folderUrl);
          await logToServer('[CLIENT] ✓ アップロード成功', { fileId: result.id, fileUrl, folderUrl });

          const successMsg = `[${index + 1}/${filesToUpload.length}] アップロード成功: ${file.name}`;
          console.log(successMsg);
          await logToServer(successMsg);
        } catch (error) {
          const errorMsg = `[${index + 1}/${filesToUpload.length}] アップロード失敗: ${file.name}`;
          console.error(errorMsg, error);
          await logToServer(errorMsg, error);
          throw error;
        }
      });

      await Promise.all(uploadPromises);
      console.log('=== 全ファイルのアップロード完了 ===');
      await logToServer('=== 全ファイルのアップロード完了 ===');
      setUploadStatus('全てのファイルがアップロードされました ');
    } catch (error) {
      console.error('=== アップロードエラー ===', error);
      await logToServer('=== アップロードエラー ===', error);
      setUploadStatus('一部または全てのファイルのアップロードに失敗しました ');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <>
      {/* メニューボタン */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="menu-button"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* ドロップダウンメニュー */}
      {menuOpen && (
        <div className="fixed top-16 right-4 z-40 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-3 min-w-[160px] max-w-[180px]">
          <div className="space-y-1">
            <button onClick={() => scrollToSection('greeting')} className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg transition-colors">
              ご挨拶
            </button>
            <button onClick={() => scrollToSection('attendance')} className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg transition-colors">
              お願い
            </button>
            <button onClick={() => scrollToSection('datetime')} className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg transition-colors">
              日時
            </button>
            <button onClick={() => scrollToSection('venue')} className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg transition-colors">
              場所
            </button>
            <button onClick={() => scrollToSection('photos')} className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg transition-colors">
              写真
            </button>
            <button onClick={() => scrollToSection('contact')} className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg transition-colors">
              お問い合わせ
            </button>
          </div>
        </div>
      )}

      <main className="px-4 md:px-6 space-y-6">
        <div className="section-container text-center space-y-4 bg-white rounded-xl shadow-sm">
          <img src={headerImage.src} alt="Header Image" className="w-full max-w-sm object-contain aspect-auto rounded-xl mx-auto" />
        </div>
        {/* ご挨拶セクションをCardに変更 */}
        <section id="greeting" className="section-container text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 icon-bounce">
              <Gem className="h-10 w-10 text-rose-500" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-3">ご挨拶</h2>
          <p className="text-base md:text-lg text-gray-600 whitespace-pre-line leading-relaxed ">
            {`拝啓
皆様にはますますご健勝のこととお慶び申し上げます

このたび 
私たちは`}{dateText}{`に
結婚式を挙げる運びとなりました

これまで私たちを支えていただきました皆様へ 
日頃の感謝の気持ちをお伝えし 
心に残るひとときを共に過ごしたく存じます

つきましては 誠に勝手ながら下記により
挙式および披露宴を執り行いますので
ご多用中とは存じますが 
ぜひご出席賜りますようお願い申し上げます
敬具`}
          </p>
        </section>

        <section id="attendance" className="section-container text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 icon-bounce">
              <CircleAlert className="h-10 w-10 text-rose-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-3">お願い</h2>
          <p className="text-base md:text-lg text-gray-600 whitespace-pre-line leading-relaxed ">未回答の方は出席確認をお願いします</p>
          <div className="space-y-3 pt-2">
          <Button
            variant="contained"
            href="/invitation"
            className="modern-button"
            sx={{ 
              backgroundColor: '#f43f5e', 
              color: '#fff',
              '&:hover': { 
                backgroundColor: '#e11d48',
                boxShadow: '0 6px 20px 0 rgba(244, 63, 94, 0.4)',
                transform: 'translateY(-2px)'
              },
              borderRadius: '25px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.3)'
            }}
          >
            出席確認
          </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-base md:text-lg text-gray-600 whitespace-pre-line leading-relaxed  mb-3">
                結婚式公式LINEアカウントの{'\n'}友達追加をお願いします
              </p>
              <Button
                variant="contained"
                href={process.env.NEXT_PUBLIC_LINE_URL}
                className="modern-button"
                sx={{ 
                  backgroundColor: '#06C755', 
                  color: '#fff',
                  '&:hover': { 
                  backgroundColor: '#05A647',
                  boxShadow: '0 6px 20px 0 rgba(6, 199, 85, 0.4)',
                  transform: 'translateY(-2px)'
                },
                  borderRadius: '25px',
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px 0 rgba(6, 199, 85, 0.3)'
                }}>
                LINEアカウントを友達追加
              </Button>
            </div>
          </div>
        </section>

        <section id="datetime" className="section-container text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 icon-bounce">
              <Calendar className="h-10 w-10 text-rose-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-3">日時</h2>
          <div className="space-y-3 pt-2">
          <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ year: 'YYYY年' }}>
            <DatePicker
              label="挙式日"
              format="YYYY/MM/DD"
              slotProps={{ calendarHeader: { format: 'YYYY年MM月' } }}
              defaultValue={dayjs(`${process.env.NEXT_PUBLIC_DATE_YEAR}-${process.env.NEXT_PUBLIC_DATE_MONTH}-${process.env.NEXT_PUBLIC_DATE_DAY}`)}
            />
          </LocalizationProvider>
            <p className="text-base md:text-lg text-gray-600">親族集合: {timeFamilyGathering}<br />受付開始: {timeReceptionStart}<br />挙式: {timeCeremony}<br />披露宴: {timeReception}</p>
          </div>
        </section>

        <section id="venue" className="section-container text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 icon-bounce">
              <MapPin className="h-10 w-10 text-rose-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-3">場所</h2>
          <p className="text-base md:text-lg text-gray-600 whitespace-pre-line leading-relaxed">{`会場: ${churchName}\n郵便番号: ${churchPostalCode}\n所在地: ${churchAddress}\n徒歩でのアクセス: ${churchAccessOnFoot}\n車でのアクセス: ${churchAccessByCar}\n電話番号: ${churchTel}`}</p>
          <div className="space-y-3 pt-2">
          <Button
            variant="contained"
            href={process.env.NEXT_PUBLIC_CHURCH_URL}
            className="modern-button"
            sx={{ 
              backgroundColor: '#f59e0b', 
              color: '#fff',
              '&:hover': { 
                backgroundColor: '#d97706',
                boxShadow: '0 6px 20px 0 rgba(245, 158, 11, 0.4)',
                transform: 'translateY(-2px)'
              },
              borderRadius: '25px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.3)'
            }}>
            式場公式サイトへ移動
          </Button>
            <iframe
              src={churchMap}
              width="100%"
              height="350"
              loading="lazy"
              className="rounded-2xl shadow-lg border-4 border-white"
            ></iframe>
          </div>
        </section>

        <section id="photos" className="section-container text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 icon-bounce">
              <Camera className="h-10 w-10 text-rose-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-3">写真</h2>
          <p className="text-base md:text-lg text-gray-600 whitespace-pre-line leading-relaxed ">撮影された写真・動画は{'\n'}こちらにアップロードをお願いします</p>
          <div className="space-y-3 pt-2">
          <input 
            type="file" 
            id="file-input"
            multiple 
            accept="image/*,video/*"
            onChange={handleFileChange} 
            className="hidden"
          />
          <Button
            variant="contained"
            onClick={() => document.getElementById('file-input')?.click()}
            className="modern-button"
            sx={{ 
              backgroundColor: '#2563eb', 
              color: '#fff',
              '&:hover': { 
                backgroundColor: '#1d4ed8',
                boxShadow: '0 6px 20px 0 rgba(37, 99, 235, 0.4)',
                transform: 'translateY(-2px)'
              },
              borderRadius: '25px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.3)',
              '&:disabled': {
                backgroundColor: '#9CA3AF',
                transform: 'none'
              }
            }}
            disabled={loading}
          >
            {loading ? 'アップロード中...' : '写真・動画をアップロード'}
          </Button>
          {loading && <CircularProgress />}
          <Typography variant="body2" color="text.secondary">
            {uploadStatus}
          </Typography>
          <Button
            variant="contained"
            href={process.env.NEXT_PUBLIC_GOOGLE_DRIVE_URL}
            className="modern-button"
            sx={{ 
              backgroundColor: '#10b981', 
              color: '#fff',
              '&:hover': { 
                backgroundColor: '#059669',
                boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.4)',
                transform: 'translateY(-2px)'
              },
              borderRadius: '25px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)'
            }}
          >
            写真・動画の確認
          </Button>
          </div>
        </section>

        <div className="section-container text-center my-8 bg-white rounded-xl shadow-sm">
          <img src={middleImage.src} alt="Middle Image" className="w-full max-w-sm object-contain aspect-auto rounded-xl mx-auto" />
        </div>

        <section id="contact" className="section-container text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 icon-bounce">
              <MessageCircle className="h-10 w-10 text-rose-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-3">お問い合わせ</h2>
          <p className="text-base md:text-lg text-gray-600 whitespace-pre-line leading-relaxed ">
            {`ご不明な点や困りごとがございましたら こちらにメールもしくはLINEにお願いします\n`}
            <a 
              href={`mailto:${emailAddress}`}
              className="text-rose-500 hover:text-rose-600 underline break-all"
            >
              {emailAddress}
            </a>
          </p>
        </section>
        <footer className="section-container text-center mt-6">
          <p className="text-sm text-gray-500 whitespace-pre-line">© {new Date().getFullYear()} {groomName} & {brideName} All rights reserved.{'\n'}Created by {groomName}, GitHub Copilot & Claude Code</p>
        </footer>
      </main>
    </>
  )
}

export default Main;
