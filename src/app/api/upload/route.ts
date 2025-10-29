import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Stream } from 'stream';

const credentials = {
  "type": "service_account",
  "project_id": process.env.NEXT_PUBLIC_PROJECT_ID,
  "private_key_id": process.env.NEXT_PUBLIC_PRIVATE_KEY_ID,
  "private_key": process.env.NEXT_PUBLIC_PRIVATE_KEY!.split(String.raw`\n`).join('\n'),
  "client_email": process.env.NEXT_PUBLIC_CLIENT_EMAIL,
  "client_id": process.env.NEXT_PUBLIC_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.NEXT_PUBLIC_CLIENT_X509_CRERT_URL,
  "universe_domain": "googleapis.com"
};

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();
  console.log('\n\n========================================');
  console.log('[1] API Route /api/upload 開始');
  console.log('[1] タイムスタンプ:', timestamp);
  console.log('========================================\n');

  try {
    const body = await request.json();
    const { base64File, fileName, mimeType } = body;

    console.log('[2] リクエストボディ受信');
    console.log('[2] ファイル名:', fileName);
    console.log('[2] MIMEタイプ (受信):', mimeType);
    console.log('[2] Base64データ長:', base64File?.length || 0);

    if (!base64File || !fileName) {
      console.error('[ERROR] 必須パラメータが不足しています');
      return NextResponse.json(
        { error: 'ファイルデータとファイル名は必須です' },
        { status: 400 }
      );
    }

    let finalMimeType = mimeType;

    const drive = google.drive({ version: 'v3', auth });
    const directoryId = process.env.NEXT_PUBLIC_DIRECTORY_ID!;
    console.log('[3] ディレクトリID:', directoryId);

    const buffer = Buffer.from(base64File.split(',')[1], 'base64');
    const fileSizeInMB = (buffer.length / 1024 / 1024).toFixed(2);
    console.log('[4] ファイルサイズ:', buffer.length, 'bytes (', fileSizeInMB, 'MB)');

    // MIMEタイプが空の場合、ファイル拡張子から推測
    if (!finalMimeType || finalMimeType === '') {
      const extension = fileName.toLowerCase().split('.').pop();
      const mimeTypeMap: { [key: string]: string } = {
        // 画像
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'heic': 'image/heic',
        'heif': 'image/heif',
        // 動画
        'mp4': 'video/mp4',
        'mov': 'video/quicktime',
        'avi': 'video/x-msvideo',
        'wmv': 'video/x-ms-wmv',
        'flv': 'video/x-flv',
        'webm': 'video/webm',
        'mkv': 'video/x-matroska',
        '3gp': 'video/3gpp'
      };
      finalMimeType = mimeTypeMap[extension || ''] || 'application/octet-stream';
      console.log('[5] MIMEタイプを推測:', finalMimeType, '(拡張子:', extension, ')');
    } else {
      console.log('[5] MIMEタイプ (使用):', finalMimeType);
    }

    const FIVE_MB = 5 * 1024 * 1024;
    const folderUrl = `https://drive.google.com/drive/folders/${directoryId}`;
    console.log('\n--- [6] アップロード先情報 ---');
    console.log('[6] フォルダID:', directoryId);
    console.log('[6] フォルダURL:', folderUrl);
    console.log('-----------------------------\n');

    if (buffer.length > FIVE_MB) {
      console.log('[7] 5MB超: Resumable uploadを使用します');

      const response = await drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: finalMimeType,
          parents: [directoryId],
        },
        media: {
          mimeType: finalMimeType,
          body: new Stream.PassThrough().end(buffer),
        },
        fields: 'id,name,mimeType,size,webViewLink,webContentLink',
      }, {
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / buffer.length) * 100;
          console.log(`[7] Upload progress: ${progress.toFixed(2)}%`);
        },
      });

      console.log('\n========================================');
      console.log('[8] ✓ アップロード成功 (resumable)');
      console.log('========================================');
      console.log('[8] レスポンス全体:', JSON.stringify(response.data, null, 2));
      console.log('[8] ファイルID:', response.data.id);
      console.log('[8] ファイル名:', response.data.name);

      const fileUrl = `https://drive.google.com/file/d/${response.data.id}`;
      console.log('\n--- [9] アップロード結果URL ---');
      console.log('[9] ファイルURL:', fileUrl);
      console.log('[9] フォルダURL:', folderUrl);
      console.log('-------------------------------\n');

      return NextResponse.json({
        message: 'アップロード成功！',
        url: fileUrl,
        fileId: response.data.id,
      });
    } else {
      console.log('[10] 5MB以下: 通常のアップロードを使用します');

      const response = await drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: finalMimeType,
          parents: [directoryId],
        },
        media: {
          mimeType: finalMimeType,
          body: new Stream.PassThrough().end(buffer),
        },
        fields: 'id,name,mimeType,size,webViewLink,webContentLink',
      });

      console.log('\n========================================');
      console.log('[11] ✓ アップロード成功 (通常)');
      console.log('========================================');
      console.log('[11] レスポンス全体:', JSON.stringify(response.data, null, 2));
      console.log('[11] ファイルID:', response.data.id);
      console.log('[11] ファイル名:', response.data.name);

      const fileUrl = `https://drive.google.com/file/d/${response.data.id}`;
      console.log('\n--- [12] アップロード結果URL ---');
      console.log('[12] ファイルURL:', fileUrl);
      console.log('[12] フォルダURL:', folderUrl);
      console.log('-------------------------------\n');

      return NextResponse.json({
        message: 'アップロード成功！',
        url: fileUrl,
        fileId: response.data.id,
      });
    }
  } catch (error) {
    console.error('\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('[ERROR] ✗ アップロードエラー発生');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('[ERROR] エラー詳細 (JSON):', JSON.stringify(error, null, 2));
    console.error('[ERROR] エラー詳細 (toString):', String(error));

    if (error instanceof Error) {
      console.error('[ERROR] エラーメッセージ:', error.message);
      console.error('[ERROR] エラー名:', error.name);
      console.error('[ERROR] スタックトレース:', error.stack);
    }

    if (typeof error === 'object' && error !== null) {
      const errorObj = error as Record<string, unknown>;
      if ('code' in errorObj) {
        console.error('[ERROR] エラーコード:', errorObj.code);
      }
      if ('errors' in errorObj) {
        console.error('[ERROR] エラー配列:', JSON.stringify(errorObj.errors, null, 2));
      }
      if ('response' in errorObj) {
        console.error('[ERROR] レスポンス:', JSON.stringify(errorObj.response, null, 2));
      }
    }

    return NextResponse.json(
      {
        error: 'アップロードに失敗しました',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
