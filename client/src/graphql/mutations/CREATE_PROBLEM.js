import { gql } from "@apollo/client";

const CREATE_PROBLEM = gql`
  mutation createProblem($title: String!, $description: String!) {
    createProblem(
      input: { problem: { title: $title, description: $description } }
    ) {
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

export default CREATE_PROBLEM;
