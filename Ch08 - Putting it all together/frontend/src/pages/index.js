import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Stacks from '../components/Stacks'

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <Stacks />
    </Layout>
  )
}

export default IndexPage
