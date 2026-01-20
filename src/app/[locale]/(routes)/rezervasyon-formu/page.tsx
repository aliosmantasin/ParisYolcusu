import React from 'react'
import FirstGlanceRezervation from './FirstGlanceRezervation'
import ReservationForm from './ReservaitonForm'
import GoogleAdsQualitySummary from './GoogleAdsQualitySummary'
import GuestHighlightStrip from './GuestHighlightStrip'
import CustomerReviewSection from './CustomerReviewSection'
import OurVehiclesReservation from '../_components/homepage/OurVehiclesReservation'
import AlwaysIncluded from '../_components/homepage/AlwaysIncluded'

const page = () => {
  return (
    <>
      <FirstGlanceRezervation />
      <GoogleAdsQualitySummary />
      <GuestHighlightStrip />
      <ReservationForm />
      <CustomerReviewSection />
      <OurVehiclesReservation />
      <AlwaysIncluded />
    </>
  )
}

export default page