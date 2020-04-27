import { gql } from 'apollo-boost'

export default gql`
  mutation deleteBranch($repository: String!, $name: String!) {
    deleteBranch(repository: $repository, name: $name) {
      name
      url
    }
  }
`
