import React, { useState } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

import useInstance from '../hooks/useInstance'

const GroupedTable = props => {
  const groups = useInstance({})
  const [groupBy] = useState('service')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [expandedGroups, setExpandedGroups] = useState([])

  const getColumnData = columns =>
    columns.filter(item => item.dataKey !== groupBy)

  const getGroupedData = rows => {
    const groupedData = rows.reduce((acc, item) => {
      let key = item[groupBy]
      let groupData = acc[key] || []
      acc[key] = groupData.concat([item])
      return acc
    }, {})

    const expGroup = {}

    Object.keys(groupedData).forEach(item => {
      expGroup[item] = expandedGroups.indexOf(item) !== -1
      groupedData[item] = groupedData[item].sort(getSorting(sortOrder, sortBy))
    })

    groups.current = expGroup
    return groupedData
  }

  const handleRequestSort = property => {
    const order = sortBy === property && sortOrder === 'desc' ? 'asc' : 'desc'

    setSortOrder(order)
    setSortBy(property)
  }

  const expandRow = groupVal => {
    const curr = groups.current[groupVal]
    let expGroup = expandedGroups
    if (curr) {
      expGroup = expGroup.filter(item => item !== groupVal)
    } else {
      if (expGroup.indexOf(groupVal) === -1) {
        //Maintain all open groups ever!!
        expGroup = expGroup.concat([groupVal])
      }
    }
    setExpandedGroups(expGroup)
  }

  let { rows, columns, rowHeader: RowHeader } = props
  let columnData = getColumnData(columns)
  let groupedData = getGroupedData(rows)

  const { null: thing, ...filteredGroupedData } = groupedData

  return (
    <Table>
      <TableBody>
        {Object.keys(filteredGroupedData).map((key, index) => {
          return (
            <React.Fragment key={index}>
              {RowHeader ? (
                <RowHeader
                  groupedData={groupedData}
                  itemKey={key}
                  isExpanded={groups.current[key]}
                  onToggleExpand={expandRow}
                />
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnData.length}
                    style={{ fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={expandRow.bind(null, key)}
                  >
                    <IconButton>
                      {groups.current[key] ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowRightIcon />
                      )}
                    </IconButton>
                    <span>{key !== 'null' ? key : 'Other'}</span>
                  </TableCell>
                </TableRow>
              )}
              {groups.current[key] && (
                <TableRow>
                  <TableCell>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {columnData.map((item, index) => (
                            <TableCell key={index}>
                              <TableSortLabel
                                active={sortBy === item.dataKey}
                                direction={sortOrder}
                                onClick={handleRequestSort.bind(
                                  null,
                                  item.dataKey,
                                )}
                              >
                                {item.title}
                              </TableSortLabel>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groups.current[key] &&
                          groupedData[key].map((item, index) => (
                            <TableRow key={index}>
                              {columnData.map((col, index) => {
                                return (
                                  <TableCell key={index}>
                                    {col.cellContent ? (
                                      <col.cellContent cellItem={item}>
                                        {item[col.dataKey]}
                                      </col.cellContent>
                                    ) : (
                                      item[col.dataKey]
                                    )}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          )
        })}
      </TableBody>
    </Table>
  )
}

const getSorting = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => (a[orderBy] > b[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1)
}

export default GroupedTable
