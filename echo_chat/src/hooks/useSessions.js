import { gql, useQuery } from '@apollo/client';
import { userData } from '../helper';

const GET_SESSIONS = gql`
  query GetSessions($userId: ID!) {
    sessions(filters: { users_permissions_user: { id: { eq: $userId } } }) {
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
`;

const useSessions = () => {
  const { uid } = userData();
  const { loading, error, data } = useQuery(GET_SESSIONS, {
    variables: { userId: uid }
  });

  return { loading, error, data };
};

export default useSessions;