'use server'
import { Client } from "@notionhq/client";

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