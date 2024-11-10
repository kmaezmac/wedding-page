// Main.js
'use client'
import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Button } from "@mui/material";
import { useState } from 'react';
import { Calendar, Camera, MapPin, MessageCircle, Gem, CircleAlert } from "lucide-react"

const Main = () => {
  const [dateText] = useState(process.env.NEXT_PUBLIC_DATE_YEAR + "年" + process.env.NEXT_PUBLIC_DATE_MONTH + "月" + process.env.NEXT_PUBLIC_DATE_DAY + "日" || '');
  const [timeCeremony] = useState(process.env.NEXT_PUBLIC_CEREMONY_TIME || '');
  const [timeReception] = useState(process.env.NEXT_PUBLIC_RECEPTION_TIME || '');
  const [churchName] = useState(process.env.NEXT_PUBLIC_CHURCH_NAME || '');
  const [churchAddress] = useState(process.env.NEXT_PUBLIC_CHURCH_ADDRESS || '');
  const [churchAccess] = useState(process.env.NEXT_PUBLIC_CHURCH_ACCESS || '');
  const [churchTel] = useState(process.env.NEXT_PUBLIC_CHURCH_TEL || '');
  const [churchMap] = useState(process.env.NEXT_PUBLIC_CHURCH_MAP_URL || '');
  const [emailAddress] = useState(process.env.NEXT_PUBLIC_MAIL_ADDRESS || '');
  

  return (
    <div className="mt-16 min-h-screen pb-16"> {/* Headerとの余白とFooterのスペースを確保 */}
      <div className="flex flex-col justify-center bg-white opacity-85 relative px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 max-w-4xl mx-auto">
        <section className="my-6 text-center">
        <Gem className="mx-auto mb-4 h-8 w-8 text-rose-400" />
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] mb-6">ご挨拶</h2>
          <p className="text-base sm:text-lg leading-relaxed break-words">
            拝啓<br />
            晩秋の候、皆様にはますますご健勝のこととお慶び申し上げます<br />
            このたび、私たちは{dateText}に結婚式を挙げる運びとなりました<br />
            これまで私たちを支えていただきました皆様へ、日頃の感謝の気持ちをお伝えし、心に残るひとときを共に過ごしたく存じます<br />
            つきましては、誠に勝手ながら下記により挙式および披露宴を執り行いますので、ご多用中とは存じますが、ぜひご出席賜りますようお願い申し上げます<br />
            敬具
          </p>
        </section>
        <section className="my-6  text-center">
        <CircleAlert className="mx-auto mb-4 h-8 w-8 text-rose-400 mt-12" />
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] mb-6">お願い</h2>
          <p className="text-base sm:text-lg leading-relaxed break-words mb-4">
            まだ回答されていない方は、こちらから出席確認を行なってください
          </p>
          <div className='flex justify-center pb-4'>
            <Button sx={{ backgroundColor: '#f5b2b2', color: '#FFFFFF' }} variant="contained" href="/invitation">
              出席確認
            </Button>
          </div>
          <p className="text-base sm:text-lg leading-relaxed break-words mb-4">
            まだ友達追加されていない方は、こちらから結婚式公式Lineアカウントの友達追加を行なってください
          </p>
          <div className='flex justify-center pb-6'>
            <Button sx={{ backgroundColor: '#06C755', color: '#FFFFFF' }} variant="contained" href={process.env.NEXT_PUBLIC_LINE_URL}>
              Line公式アカウントを友達追加
            </Button>
          </div>
        </section>

        <section className="my-1 text-center mt-12">
        <Calendar className="mx-auto mb-4 h-8 w-8 text-rose-400" />
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] ">日時</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='flex justify-center pt-4 sm:pt-6'>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="挙式日" defaultValue={dayjs(process.env.NEXT_PUBLIC_DATE_YEAR + '-' + process.env.NEXT_PUBLIC_DATE_MONTH + '-' + process.env.NEXT_PUBLIC_DATE_DAY)} />
              </DemoContainer>
            </div>
          </LocalizationProvider>
          挙式: {timeCeremony}<br />
          披露宴: {timeReception}
        </section>
        <section className="my-1 text-center mt-12">
        <MapPin className="mx-auto mb-4 h-8 w-8 text-rose-400" />
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] mb-6">場所</h2>
          <p className="text-base sm:text-lg leading-relaxed break-words">
            会場: {churchName}<br />
            所在地: {churchAddress}<br />
            アクセス: {churchAccess}<br />
            電話番号: {churchTel}
          </p>
          <div className='flex justify-center pb-6'>
            <iframe src={churchMap} width="600" height="450" loading="lazy" ></iframe>
          </div>
        </section>
        <section className="my-1 text-center mt-12">
        <Camera className="mx-auto mb-4 h-8 w-8 text-rose-400" />
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] mb-6">写真</h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4 break-words">
            撮影した写真・動画をこちらにアップロードしてください
          </p>
          <Button sx={{ backgroundColor: '#4285F4', color: '#FFFFFF' }} variant="contained" href={process.env.NEXT_PUBLIC_GOOGLE_DRIVE_URL}>
              写真をアップロード
            </Button>
        </section>
        <section className="my-1 text-center mt-12">
        <MessageCircle className="mx-auto mb-4 h-8 w-8 text-rose-400" />
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] mb-6">お問い合わせ</h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4 break-words">
            何かご不明な点や困りごとがございましたら こちらにメールしてください<br/>
            {emailAddress}
          </p>
        </section>
      </div>
    </div>
  )
}

export default Main
