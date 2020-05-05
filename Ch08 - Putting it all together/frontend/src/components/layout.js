// https://bit.ly/2RL1FuT - Migrate react-apollo from v2 to v3 in conjunction with AWS AppSync
import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import { createAuthLink } from 'aws-appsync-auth-link'
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'
import { ApolloProvider } from '@apollo/react-common'
import { ApolloLink } from 'apollo-link'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import ThemeProvider from '../context/context-theme'
import Header from './header'
import './layout.css'

import { GRAPHQL_ENDPOINT, GRAPHQL_KEY, AWS_REGION } from '../config/config'

const config = {
  url: GRAPHQL_ENDPOINT,
  region: AWS_REGION,
  auth: {
    type: 'API_KEY',
    apiKey: GRAPHQL_KEY,
  },
}

const client = new ApolloClient({
  link: ApolloLink.from([
    createAuthLink(config),
    createSubscriptionHandshakeLink(config),
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <ThemeProvider>
      <ApolloProvider client={client}>
        <Header siteTitle={data.site.siteMetadata.title} />
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0 1.0875rem 1.45rem`,
          }}
        >
          <main>{children}</main>
        </div>
      </ApolloProvider>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
