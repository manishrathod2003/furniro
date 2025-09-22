import React from 'react'
import PageHeader from '../components/PageHeader'
import FeaturesSection from '../components/FeaturesSection'
import BlogLayout from '../components/BlogLayout'

const About = () => {
  return (
    <>
     <PageHeader
            title="Blog"
            breadcrumb={[{ label: "Home", path: "/" }, { label: "Blog" }]}
            backgroundImage="/images/shop.jpg"
            showLogo={true}
            logoSrc="/images/logo.png"
          />
          <BlogLayout/>
    <FeaturesSection/>
    </>
  )
}

export default About