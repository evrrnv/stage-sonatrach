const GET_PARTICULAR_PROBLEM = gql`
  query getParticularProblem($id: UUID!) {
    problemById(id: $id) {
      id
      title
      description
      userAccountByCreatedBy {
        firstName
        lastName
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
`;

export default GET_PARTICULAR_PROBLEM;
