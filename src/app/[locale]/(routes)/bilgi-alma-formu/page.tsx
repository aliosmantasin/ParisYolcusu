import React from 'react'
import InfoForm from './InFoFormComponent'

const page = () => {
  return (
    <>
    <InfoForm/>
    </>
  )
}

export default page

export async function generateStaticParams() {
  return [
    { locale: 'tr' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
}