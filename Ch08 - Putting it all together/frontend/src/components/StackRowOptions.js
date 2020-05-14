import React, { Fragment } from 'react'
import IconButton from '@material-ui/core/IconButton'
import WebIcon from '@material-ui/icons/Web'
import GitHubIcon from '@material-ui/icons/GitHub'
import DeleteIcon from '@material-ui/icons/Delete'
import { useMutation } from '@apollo/react-hooks'

import DeleteBranch from '../graphql/mutations/DeleteBranch'

const prohibitedBranches = ['master', 'prod']

const StackRowOptions = ({ cellItem: stack, ...rest }) => {
  const { siteUrl } = stack
  const { commitUrl } = stack.repository || {}
  const branch = stack.stage
  const [deleteBranch] = useMutation(DeleteBranch)

  const handleDelete = () => {
    const repository = stack.repository.name
    const name = branch
    deleteBranch({ variables: { repository, name } })
  }

  const isNotProhibitedBranch = !prohibitedBranches.includes(branch)

  return (
    <Fragment>
      {siteUrl && (
        <a href={siteUrl} target="_blank" rel="noopener noreferrer">
          <IconButton variant="contained">
            <WebIcon />
          </IconButton>
        </a>
      )}
      {commitUrl && (
        <a
          href={stack.repository && commitUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton variant="contained">
            <GitHubIcon />
          </IconButton>
        </a>
      )}
      {isNotProhibitedBranch && (
        <IconButton variant="contained" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      )}
    </Fragment>
  )
}

export default StackRowOptions
