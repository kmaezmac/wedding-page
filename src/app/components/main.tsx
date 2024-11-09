'use client'
import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Button } from "@mui/material";

const Main = () => {
  return (
    <>
      <div className="flex flex-col justify-center bg-white opacity-85 relative h-screen p-4 sm:p-8 md:p-16 lg:p-24 xl:p-32">
        <section className="my-6 sm:my-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] mb-4 sm:mb-6">ご挨拶</h2>
          <p className="text-base sm:text-lg leading-relaxed">
            謹啓　〇〇の候（時候の挨拶）皆様にはますますご清祥のこととお慶び申し上げます
            このたび　私たちは結婚式を挙げることになりました
            つきましては　日ごろお世話になっている皆様に お集まりいただき
            ささやかな披露宴を催したいと存じます
            ご多用中　誠に恐縮ではございますが
            ご来臨の栄を賜りたく　謹んでご案内申し上げます
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] my-6">お願い</h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4">
            まだ回答されていない方は、こちらから出席確認を行なってください。
          </p>
          <div className='flex justify-center pb-4'>
            <Button sx={{ backgroundColor: '#f5b2b2', color: '#FFFFFF' }} variant="contained" href="/invitation">
              出席確認
            </Button>
          </div>
          <p className="text-base sm:text-lg leading-relaxed mb-4">
            まだ友達追加されていない方は、こちらから結婚式公式Lineアカウントを友達追加を行なってください。
          </p>
          <div className='flex justify-center pb-6'>
            <Button sx={{ backgroundColor: '#06C755', color: '#FFFFFF' }} variant="contained" href={process.env.NEXT_PUBLIC_LINE_URL}>
              Line公式アカウントを友達追加
            </Button>
          </div>
        </section>

        <section className="my-6 sm:my-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] mb-4 sm:mb-6">スケジュール</h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4">
            結婚式の日程はこちらです。
          </p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='flex justify-center pt-4 sm:pt-6'>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="挙式日" defaultValue={dayjs('2025-04-17')} />
              </DemoContainer>
            </div>
          </LocalizationProvider>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7d5a50] mt-8 mb-4 sm:mb-6">場所</h2>
          <p className="text-base sm:text-lg leading-relaxed">
            結婚式の場所はこちらです。
          </p>
        </section>
      </div>
    </>
  )
}

export default Main
