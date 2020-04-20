import React, { Fragment } from 'react'
import IconButton from '@material-ui/core/IconButton'
import WebIcon from '@material-ui/icons/Web'
import GitHubIcon from '@material-ui/icons/GitHub'

const StackRowOptions = ({ cellItem: stack, ...rest }) => {
  const { siteUrl } = stack
  const { commitUrl } = stack.repository || {}
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
    </Fragment>
  )
}

export default StackRowOptions
