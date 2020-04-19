import { gql } from 'apollo-boost'

export default gql`
  query listRepositories {
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
`
