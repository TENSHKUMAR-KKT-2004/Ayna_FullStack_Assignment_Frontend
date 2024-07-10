import { gql, useQuery } from '@apollo/client';
import { userData } from '../helper';

const GET_SESSIONS = gql`
  query GetSessions($userId: ID!) {
    sessions(filters: { users_permissions_user: { id: { eq: $userId } } }) {
      data {
        id
        attributes {
          name
          users_permissions_user {
            data {
              id
              attributes {
                username
              }
            }
          }
          start_time
          end_time
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

  const sortedSessions = data ? [...data.sessions.data].sort(
    (a, b) => new Date(b.attributes.start_time) - new Date(a.attributes.start_time)
  ) : [];

  return { loading, error, sortedSessions };
};

export default useSessions;
