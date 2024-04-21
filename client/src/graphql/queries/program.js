import { gql } from '@apollo/client';

export const GET_PROGRAMS = gql`
    query GetPrograms {
        programs {
            _id
            title
            goal
            createdAtFormatted
            updatedAtFormatted
            totalWorkouts
            totalRatings
            averageRating
            author {
                _id
                fullName
                profilePicture
            }
        }
    }
`;

export const GET_PROGRAM = gql`
    query GetProgram($programId: ID!) {
        program(programId: $programId) {
            _id
            title
            goal
            createdAtFormatted
            updatedAtFormatted
            totalWorkouts
            totalRatings
            averageRating
            author {
                _id
                fullName
                profilePicture
            }
            days {
                dayNumber
                isRestDay
                workout {
                    title
                    difficulty
                    exercises {
                        exercise {
                            name
                            gifUrl
                        }
                        sets
                        repetitions
                    }
                }
            }
        }
    }
`;