import { gql } from "@apollo/client";

const GET_PROBLEMS = gql`
  query allProblems($lessThan: Datetime, $greaterThan: Datetime) {
    allProblems(
      orderBy: CREATED_AT_DESC
      filter: {
        or: {
          createdAt: {
            lessThanOrEqualTo: $lessThan
            greaterThanOrEqualTo: $greaterThan
          }
        }
      }
    ) {
      nodes {
        id
        title
        description
        userAccountByCreatedBy {
          id
          firstName
          lastName
          userRolesByUserIdList {
            roleByRoleId {
              code
            }
          }
        }
        problemStatusByStatus {
          name
        }
        createdAt
        attachmentsByProblemId {
          nodes {
            id
            name
          }
        }
      }
    }
  }
`;

export default GET_PROBLEMS;
