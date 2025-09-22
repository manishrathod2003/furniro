import React from 'react'
import PageHeader from '../components/PageHeader'
import FeaturesSection from '../components/FeaturesSection'
import ContactSection from '../components/ContactSection'

const Contact = () => {
  return (
    <>

         <PageHeader
        title="Contact"
        breadcrumb={[{ label: "Home", path: "/" }, { label: "Contact" }]}
        backgroundImage="/images/shop.jpg"
        showLogo={true}
        logoSrc="/images/logo.png"
      />

      <ContactSection/>
       <FeaturesSection/>
    </>
  )
}

export default Contact