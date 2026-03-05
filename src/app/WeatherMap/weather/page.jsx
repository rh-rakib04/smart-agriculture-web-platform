
import WeatherCard from '@/components/farmer/Weather/WeatherCard'
import Header from '@/components/shared/Header'
import React from 'react'

export default function page() {
  return (
    <div className='pt-20'>
      <Header></Header>
        <WeatherCard/>
    </div>
  )
}
