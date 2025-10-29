'use server'
import { Client } from "@notionhq/client";
import { google } from 'googleapis';
import { Stream } from 'stream';

const notion = new Client({
    auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN
});

const DATABASE_ID = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID
console.log("fafafsaf" + DATABASE_ID)
export const postToNotion = async (nameKanji: string, nameKana: string, attendance: string, guests: number, dietaryRestrictions: string, message: string) => {
    try {
        const response = await notion.pages.create({
            parent: {
                type: "database_id",
                database_id: DATABASE_ID == undefined ? "" : DATABASE_ID
            },
            properties: {
                Attendance: {
                    select: {
                        name: attendance
                    }
                },
                NameKanji: {
                    title: [
                        {
                            text: {
                                content: nameKanji
                            }
                        }
                    ]
                },
                NameKana: {
                    rich_text: [{
                        text: {
                            content: nameKana
                        }
                    }]
                },
                GuestsNumber: {
                    number: guests
                },
                DietaryRestrictions: {
                    rich_text: [{
                        text: {
                            content: dietaryRestrictions
                        }
                    }]
                },
                Message: {
                    rich_text: [{
                        text: {
                            content: message
                        }
                    }]
                }
            }
        }
        );

        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

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

  // クライアントからのログをサーバー側に記録
  export async function logToServer(message: string, data?: unknown) {
    console.log('[CLIENT LOG]', message, data || '');
  }

  export async function uploadFileToDrive(base64File: string, fileName: string, mimeType: string) {
    console.log('=== [SERVER] uploadFileToDrive 開始 ===');
    console.log('[SERVER] ファイル名:', fileName);
    console.log('[SERVER] MIMEタイプ (受信):', mimeType);

    try {
      const drive = google.drive({ version: 'v3', auth });
      const directoryId = process.env.NEXT_PUBLIC_DIRECTORY_ID!;
      console.log('[SERVER] ディレクトリID:', directoryId);

      const buffer = Buffer.from(base64File.split(',')[1], 'base64');
      const fileSizeInMB = (buffer.length / 1024 / 1024).toFixed(2);
      console.log('[SERVER] ファイルサイズ:', buffer.length, 'bytes (', fileSizeInMB, 'MB)');

      // MIMEタイプが空の場合、ファイル拡張子から推測
      let finalMimeType = mimeType;
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
        console.log('[SERVER] MIMEタイプを推測:', finalMimeType, '(拡張子:', extension, ')');
      } else {
        console.log('[SERVER] MIMEタイプ (使用):', finalMimeType);
      }

      // 5MB以上のファイルはresumable uploadを使用
      const FIVE_MB = 5 * 1024 * 1024;

      if (buffer.length > FIVE_MB) {
        console.log('[SERVER] 5MB超: Resumable uploadを使用します');
        // Resumable upload
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
          fields: 'id',
        }, {
          // resumableアップロードを有効化
          onUploadProgress: (evt) => {
            const progress = (evt.bytesRead / buffer.length) * 100;
            console.log(`[SERVER] Upload progress: ${progress.toFixed(2)}%`);
          },
        });
        console.log('[SERVER] アップロード成功 (resumable):', response.data.id);

        return {
          message: 'アップロード成功！',
          url: `https://drive.google.com/file/d/${response.data.id}`,
        };
      } else {
        console.log('[SERVER] 5MB以下: 通常のアップロードを使用します');
        // 5MB以下は通常のアップロード
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
        });
        console.log('[SERVER] アップロード成功 (通常):', response.data.id);

        return {
          message: 'アップロード成功！',
          url: `https://drive.google.com/file/d/${response.data.id}`,
        };
      }
    } catch (error) {
      console.error('[SERVER] === アップロードエラー ===');
      console.error('[SERVER] ファイル名:', fileName);
      console.error('[SERVER] エラー詳細:', error);
      if (error instanceof Error) {
        console.error('[SERVER] エラーメッセージ:', error.message);
        console.error('[SERVER] スタックトレース:', error.stack);
      }
      throw error;
    }
  }
