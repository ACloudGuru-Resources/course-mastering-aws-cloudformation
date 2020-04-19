import React, { Fragment } from 'react'
import IconButton from '@material-ui/core/IconButton'
import WebIcon from '@material-ui/icons/Web'

const StackRowOptions = ({ cellItem: stack, ...rest }) => {
  return (
    <Fragment>
      {stack.siteUrl && (
        <a href={stack.siteUrl} target="_blank" rel="noopener noreferrer">
          <IconButton variant="contained">
            <WebIcon />
          </IconButton>
        </a>
      )}
    </Fragment>
  )
}

export default StackRowOptions
