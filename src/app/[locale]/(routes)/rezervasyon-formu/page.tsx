import React from 'react'
import FirstGlanceRezervation from './FirstGlanceRezervation'
import ReservationForm from './ReservatonForm'
import GoogleAdsQualitySummary from './GoogleAdsQualitySummary'
import GuestHighlightStrip from './GuestHighlightStrip'
import CustomerReviewSection from './CustomerReviewSection'
import OurVehiclesReservation from '../_components/homepage/OurVehiclesReservation'
import AlwaysIncluded from '../_components/homepage/AlwaysIncluded'
import CallToActionComponent from '../_components/homepage/CallToActionComponent'

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
      <CallToActionComponent />
    </>
  )
}

export default page