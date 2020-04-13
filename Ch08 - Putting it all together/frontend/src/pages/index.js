import React, { useState, useEffect } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
// import { Connect } from 'aws-amplify-react'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

import { GRAPHQL_ENDPOINT, GRAPHQL_KEY, AWS_REGION } from '../config/config'

const config = {
  aws_appsync_graphqlEndpoint: GRAPHQL_ENDPOINT,
  aws_appsync_region: AWS_REGION,
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: GRAPHQL_KEY,
}

console.log(config)

Amplify.configure(config)

const queries = {
  allRepos: `
    query RepositoryList {
      allRepos {
        id
        name
        html_url
        branches {
          name
          sha
        }
        stacks {
          stackName
        }
      }
    }
  `,
}

const IndexPage = () => {
  const [repos, setRepos] = useState([])

  useEffect(() => {
    const getAllRepos = async () => {
      const {
        data: { allRepos },
      } = await API.graphql(graphqlOperation(queries.allRepos))
      setRepos(allRepos)
    }

    getAllRepos()
  }, [setRepos])

  console.log(repos)

  const reposHTML = repos.map(s => <div key={s.id}>{s.name}</div>)

  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      {reposHTML}
    </Layout>
  )
}

export default IndexPage
