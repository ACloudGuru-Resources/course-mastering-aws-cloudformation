import { gql } from 'apollo-boost'

export default gql`
  query listStacks {
    allStacks {
      stackId
      stackName
      description
      stackStatus
      service
      siteUrl
      serviceEndpoint
      serviceEndpointWebsocket
      websiteBucket
      stage
      stageFlag
      repository {
        id
        name
        commitUrl
        html_url
        branches {
          name
          sha
        }
      }
      creationTime
      lastUpdatedTime
    }
  }
`
