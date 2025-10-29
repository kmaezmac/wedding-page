import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const credentials = {
      type: "service_account",
      project_id: process.env.NEXT_PUBLIC_PROJECT_ID,
      private_key_id: process.env.NEXT_PUBLIC_PRIVATE_KEY_ID,
      private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY!.split(String.raw`\n`).join('\n'),
      client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.NEXT_PUBLIC_CLIENT_X509_CRERT_URL,
      universe_domain: "googleapis.com"
    };

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    if (!accessToken.token) {
      throw new Error('アクセストークンの取得に失敗しました');
    }

    console.log('[TOKEN] アクセストークン取得成功');

    return NextResponse.json({ accessToken: accessToken.token });
  } catch (error) {
    console.error('[TOKEN] エラー:', error);
    return NextResponse.json(
      { error: 'トークン取得に失敗しました' },
      { status: 500 }
    );
  }
}
