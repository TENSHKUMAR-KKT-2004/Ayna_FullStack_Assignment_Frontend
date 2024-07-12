import { useQuery, gql } from '@apollo/client'
import { userData } from '../helper'

const GET_SESSIONS = gql`
  query GetSessions($userId: ID!) {
    sessions(filters: { users_permissions_user: { id: { eq: $userId } } }, pagination: { limit: 1000 }) {
      data {
        id
        attributes {
          name
          last_message
          users_permissions_user {
            data {
              id
              attributes {
                username
              }
            }
          }
          start_time
          active
        }
      }
    }
  }
`

const useSessions = (userId) => {
  const { uid } = userData()
  const { loading, error, data } = useQuery(GET_SESSIONS, {
    variables: { userId: uid },
  })

  return {
    data,
    loading,
    error
  }
}

export default useSessions 
