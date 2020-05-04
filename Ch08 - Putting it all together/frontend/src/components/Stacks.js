import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _find from 'lodash.find'

import { STACK_STATUSES_SETTLED } from '../config/config'
import { makeStyles } from '@material-ui/core/styles'

import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import GroupTable from './GroupTable'
import StackStatusChip from './StackStatusChip'
import StackRowOptions from './StackRowOptions'
import StackRowHeader from './StackRowHeader'

import ListStacks from '../graphql/queries/ListStacks'

const Stacks = () => {
  const { loading, error, data, startPolling, stopPolling } = useQuery(
    ListStacks,
  )
  const classes = useStyles()
  const rows = (data && data.allStacks) || []

  useEffect(() => {
    const isSettled = isStacksSettled(rows, STACK_STATUSES_SETTLED.unsettled)
    const pollInterval = isSettled ? 5000 : 1000
    const msg = `Stacks are ${
      isSettled ? '' : 'NOT '
    }settled. pollInterval: ${pollInterval}`

    console.log(msg)

    startPolling(pollInterval)
    return stopPolling
  }, [rows, startPolling, stopPolling])

  if (error) console.log(error)

  if (loading && !data) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <GroupTable
            rows={rows}
            columns={columns}
            rowHeader={StackRowHeader}
          />
        </TableContainer>
      </Paper>
    </div>
  )
}

const columns = [
  { dataKey: 'service', title: 'Service' },
  { dataKey: 'stage', title: 'Stage' },
  {
    dataKey: 'stackStatus',
    title: 'Status',
    cellContent: StackStatusChip,
  },
  {
    dataKey: 'options',
    title: 'Options',
    cellContent: StackRowOptions,
  },
]

const isStacksSettled = (stacks, unsettledStatuses) =>
  stacks.length > 0 &&
  !_find(stacks, stack => unsettledStatuses[stack.stackStatus])

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}))

export default Stacks
