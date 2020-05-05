export const GRAPHQL_ENDPOINT = process.env.GATSBY_GRAPH_Q_L
export const GRAPHQL_KEY = process.env.GATSBY_A_P_I_KEY
export const AWS_REGION = process.env.GATSBY_AWS_REGION
export const STACK_STATUSES_SETTLED = {
  settled: {
    CREATE_COMPLETE: 'success',
    UPDATE_COMPLETE: 'success',
    IMPORT_COMPLETE: 'info',
    DELETE_COMPLETE: 'info',
    CREATE_FAILED: 'error',
    DELETE_FAILED: 'error',
    ROLLBACK_COMPLETE: 'error',
    ROLLBACK_FAILED: 'error',
    UPDATE_ROLLBACK_COMPLETE: 'error',
    UPDATE_ROLLBACK_FAILED: 'error',
    IMPORT_ROLLBACK_FAILED: 'error',
    IMPORT_ROLLBACK_COMPLETE: 'error',
  },
  unsettled: {
    REVIEW_IN_PROGRESS: 'info',
    CREATE_IN_PROGRESS: 'info',
    UPDATE_COMPLETE_CLEANUP_IN_PROGRESS: 'info',
    UPDATE_IN_PROGRESS: 'info',
    DELETE_IN_PROGRESS: 'info',
    IMPORT_IN_PROGRESS: 'info',
    ROLLBACK_IN_PROGRESS: 'error',
    UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS: 'error',
    UPDATE_ROLLBACK_IN_PROGRESS: 'error',
    IMPORT_ROLLBACK_IN_PROGRESS: 'error',
  },
}

export const STACK_STATUSES = {
  ...STACK_STATUSES_SETTLED.settled,
  ...STACK_STATUSES_SETTLED.unsettled,
}
