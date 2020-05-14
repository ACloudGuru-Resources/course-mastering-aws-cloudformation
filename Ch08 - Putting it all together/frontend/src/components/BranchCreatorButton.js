import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { TextField, Box } from '@material-ui/core'
import Menu from './ForkedMenu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import CheckIcon from '@material-ui/icons/Check'
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks'
import CreateIcon from '@material-ui/icons/Create'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import { useMutation } from '@apollo/react-hooks'
import CreateBranch from '../graphql/mutations/CreateBranch'

const BranchCreatorButton = ({ repo }) => {
  const branches = (repo && repo.branches.slice().reverse()) || []
  const [createBranch] = useMutation(CreateBranch)
  const classes = useStyles()
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })
  const [selected, setSelected] = useState(branches[0])
  const [branchName, setBranchName] = useState()

  const handleSelect = branch => {
    setSelected(branch)
  }

  const handleSubmit = (name, { sha }) => {
    const repository = repo.name
    createBranch({ variables: { repository, name, sha } })
    setBranchName(null)
    popupState.close()
  }

  const handleChange = ({ target }) => {
    const { value } = target
    setBranchName(value)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSubmit(branchName, selected)
    }
  }

  const branchesHTML = branches.map((branch, index) => (
    <MenuItem key={index} onClick={() => handleSelect(branch)}>
      <ListItemIcon>
        {selected.name === branch.name ? (
          <CheckIcon fontSize="small" />
        ) : (
          <span />
        )}
      </ListItemIcon>
      <ListItemText primary={branch.name} />
    </MenuItem>
  ))

  const branchButton = (
    <MenuItem onClick={() => handleSubmit(branchName, selected)}>
      <ListItemIcon>
        <CreateIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={`Create branch '${branchName}' from '${selected.name}'`}
      />
    </MenuItem>
  )

  return (
    <div className={classes.inline}>
      <IconButton variant="contained" {...bindTrigger(popupState)}>
        <AddCircleIcon />
      </IconButton>
      <Menu {...bindMenu(popupState)}>
        <Box px={1} py={0}>
          <TextField
            label="New Branch Name"
            type="search"
            variant="outlined"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </Box>
        {branchName ? branchButton : branchesHTML}
      </Menu>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  inline: {
    display: 'inline-block',
  },
}))

export default BranchCreatorButton
