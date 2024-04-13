import User from '../../models/User.js';
import Comment from '../../models/Comment.js'
import Article from '../../models/Article.js';
import Topic from '../../models/Topic.js';
import Workout from '../../models/Workout.js';

import bcrypt from 'bcrypt';

const userResolvers = {

    Query: {

        users: async (_, __) => {

            try {

                const users = await User.find();
                return users;
            }
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch users!");
            }
        },

        authUser: async (_, __, context) => {

			try {

				const user = await context.getUser();
				return user;
			} 
            catch (err) {

				console.error(err);
				throw new Error(err.message || "Failed to fetch authenticated user!");
			}
		},

		user: async (_, { userId }) => {

			try {

				const user = await User.findById(userId);
				return user;
			} 
            catch (err) {

				console.error(err);
				throw new Error(err.message || "Failed to fetch user!");
			}
		}
    },

    Mutation: {

        register: async(_, { input }, context) => {
            
            try {

                const { firstName, lastName, username, password, email, gender } = input;

                if (!firstName || !lastName || !username || !password || !email || !gender) {

                    throw new Error("All fields are required!");
                }
                
                const nameRegex = /^[A-Z][a-z]{2,9}$/;
                if (!firstName.match(nameRegex) || !lastName.match(nameRegex)) {

                    throw new Error("Invalid name!")
                }

                const usernameRegex = /^[a-z][a-z0-9]{3,9}$/;
                if (!username.match(usernameRegex)) {

                    throw new Error("Invalid username!");
                }

                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
                if (!password.match(passwordRegex)) {
                    throw new Error("Invalid password!");
                }

                const emailRegex = /^([a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
                if (!email.match(emailRegex)) {

                    throw new Error("Invalid Email Address!");
                }

                const existingUser = await User.findOne({ $or: [{ username }, { email }] });
                if (existingUser) {

                    if (existingUser.username === username) throw new Error("Username already in use!");
                    
                    if (existingUser.email === email) throw new Error("Email already in use!");
                }

                const saltRounds = parseInt(process.env.SALT_ROUNDS);
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(password, salt);

                const maleProfilePicture = `${process.env.MALE_URL}?username=${username}`;
                const femaleProfilePicture = `${process.env.FEMALE_URL}?username=${username}`;

                const newUser = new User(
                {
                    firstName,
                    lastName,
                    username,
                    password: hashedPassword,
                    email,
                    gender,
                    profilePicture: gender === "MALE" ? maleProfilePicture : femaleProfilePicture
                });

                await newUser.save();
                await context.login(newUser);
                return newUser;
            }
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to register!");
            }
        },

        login: async(_, { input }, context) => {

            try {

				const { username, password } = input;

				if (!username || !password) {

                    throw new Error("All fields are required!");
                }
                    
				const { user } = await context.authenticate("graphql-local", { username, password });

				await context.login(user);
				return user;
			} 
            catch (err) {

				console.error(err);
				throw new Error(err.message || "Failed to log in!");
			}
        },

        logout: async (_, __, context) => {

			try {

				await context.logout();

				context.req.session.destroy((err) => { if (err) throw err; });
				context.res.clearCookie("connect.sid");

				return { message: "Logged out successfully." };
			} 
            catch (err) {

				console.error(err);
				throw new Error(err.message || "Failed to log out!");
			}
		}
    },

    User: {

        topics: async (parent) => {

            try {
                
                const topics = await Topic.find({ adminId: parent._id });
                return topics;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to fetch user's topics!");
            }
        },

		articles: async (parent) => {

			try {

				const articles = await Article.find({ authorId: parent._id });
				return articles;
			} 
            catch (err) {
                
				console.error(err);
				throw new Error(err.message || "Failed to fetch user's articles!");
			}
		},

        comments: async (parent) => {

            try {
                
                const comments = await Comment.find({ authorId: parent._id });
                return comments;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch user's comments!");
            }
        },

        workouts: async (parent) => {

            try {

                const workouts = await Workout.find({ authorId: parent._id});
                return workouts;
            }
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch user's workouts!");
            }
        }
	}
};

export default userResolvers;