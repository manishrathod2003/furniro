import React from 'react'
import PageHeader from '../components/PageHeader'
import FeaturesSection from '../components/FeaturesSection'
import CheckoutSection from '../components/CheckoutSection'

const Checkout = () => {
  return (
    <>
     <PageHeader
            title="Checkout"
            breadcrumb={[{ label: "Home", path: "/" }, { label: "Checkout" }]}
            backgroundImage="/src/images/shop.jpg"
            showLogo={true}
            logoSrc="/src/images/logo.png"
          />

          <CheckoutSection/>
        <FeaturesSection/>
    </>
  )
}

export default Checkout