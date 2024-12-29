'use server'
import { Client } from "@notionhq/client";
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

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

export async function uploadFileToDrive(file: File) {
    const drive = google.drive({ version: 'v3', auth });
    const directoryId = process.env.NEXT_PUBLIC_DIRECTORY_ID!;
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [directoryId],
      },
      media: {
        mimeType: file.type,
        body: file,
      },
    });
  
    return NextResponse.json({
      message: 'アップロード成功！',
      url: `https://drive.google.com/file/d/${response.data.id}`,
    });
  }
