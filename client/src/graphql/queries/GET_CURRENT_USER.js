const { gql } = require("@apollo/client");

const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      email
      firstName
      lastName
      userRolesByUserIdList {
        roleByRoleId {
          name
          code
        }
      }
    }
  }
`;

export default GET_CURRENT_USER