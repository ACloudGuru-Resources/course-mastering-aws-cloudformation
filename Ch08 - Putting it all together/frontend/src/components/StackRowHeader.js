import React from 'react'

import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import GitHubIcon from '@material-ui/icons/GitHub'
import BranchCreatorButton from './BranchCreatorButton'

const StackRowHeader = ({
  itemKey,
  groupedData: stackGroup,
  onToggleExpand,
  isExpanded,
}) => {
  const group = stackGroup[itemKey]
  const repo = group[0].repository
  const repoUrl = repo && repo.html_url
  const isOther = itemKey === 'null'

  return (
    <TableRow>
      <TableCell
        style={{ fontWeight: 'bold', cursor: 'pointer' }}
        onClick={onToggleExpand.bind(null, itemKey)}
      >
        <IconButton>
          {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
        </IconButton>
        <span>{!isOther ? itemKey : 'Other'}</span>
      </TableCell>
      <TableCell align="right">
        {true && !isOther && <BranchCreatorButton repo={repo} />}
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
