import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import { STACK_STATUSES } from '../config/config'

const StackStatusChip = ({ children, cellItem: stack }) => {
  const classes = useStyles()
  const statusType = STACK_STATUSES[stack.stackStatus]
  return (
    <Button
      classes={{
        disabled: classes.disabled,
      }}
      className={clsx(classes.button, {
        [classes.success]: statusType === 'success',
        [classes.info]: statusType === 'info',
        [classes.error]: statusType === 'error',
      })}
      variant="contained"
      size="small"
      disabled
    >
      {children}
    </Button>
  )
}

const useStyles = makeStyles(theme => ({
  button: {
    '&$disabled': {
      color: 'white',
      boxShadow: 'none',
      opacity: 0.6,
    },
  },
  success: {
    '&$disabled': {
      background: theme.palette.success.dark,
    },
  },
  info: {
    '&$disabled': {
      background: theme.palette.info.dark,
    },
  },
  error: {
    '&$disabled': {
      background: theme.palette.error.dark,
    },
  },
  disabled: {},
}))

StackStatusChip.propTypes = {
  children: PropTypes.string.isRequired,
}

export default StackStatusChip
