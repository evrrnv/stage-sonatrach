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
    }
  }
`;

export default GET_PARTICULAR_PROBLEM