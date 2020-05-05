import { gql } from 'apollo-boost'

export default gql`
  mutation createBranch($repository: String!, $name: String!, $sha: String!) {
    createBranch(repository: $repository, name: $name, sha: $sha) {
      name
      sha
      url
    }
  }
`
