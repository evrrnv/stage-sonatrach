import { gql } from "@apollo/client";

const CHANGE_PROBLEM_STATUS = gql`
  mutation updateProblemStatus($id: UUID!, $status: UUID!) {
    updateProblemById(input: { id: $id, problemPatch: { status: $status } }) {
      problem {
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
      }
    }
  }
`;

export default CHANGE_PROBLEM_STATUS
