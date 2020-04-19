import React, { Fragment } from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import GitHubIcon from '@material-ui/icons/GitHub'

const StackRowHeader = ({
  itemKey,
  groupedData: stackGroup,
  onToggleExpand,
  isExpanded,
}) => {
  console.log(stackGroup)
  const group = stackGroup[itemKey]
  const repoUrl = group[0].repository && group[0].repository.html_url

  return (
    <TableRow>
      <TableCell
        style={{ fontWeight: 'bold', cursor: 'pointer' }}
        onClick={onToggleExpand.bind(null, itemKey)}
      >
        <IconButton>
          {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
        </IconButton>
        <span>{itemKey !== 'null' ? itemKey : 'Other'}</span>
      </TableCell>
      <TableCell align="right">
        {repoUrl && (
          <a href={repoUrl} target="_blank" rel="noopener noreferrer">
            <IconButton variant="contained">
              <GitHubIcon />
            </IconButton>
          </a>
        )}
      </TableCell>
    </TableRow>
  )
}

export default StackRowHeader
