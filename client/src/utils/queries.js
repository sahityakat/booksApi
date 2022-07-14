import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
  query users($username: String) {
    users(username: $username) {
        _id
        email
        bookCount
        savedBooks {
            _id
            bookId
            author
            description
            title
            image
            link
      }
    }
  }
`;

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      friendCount
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
        reactions {
          _id
          createdAt
          reactionBody
          username
        }
      }
      friends {
        _id
        username
      }
    }
  }
`;

