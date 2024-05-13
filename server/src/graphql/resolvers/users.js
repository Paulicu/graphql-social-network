import User from "../../models/User.js";
import Article from "../../models/Article.js";
import Topic from "../../models/Topic.js";
import Workout from "../../models/Workout.js";
import Program from "../../models/Program.js";

import bcrypt from "bcrypt";

const userResolvers = {
    Query: {
        users: async (parent, args, context) => {
            try {
                const { getUser } = context;
                if (getUser().role !== "ADMIN") {
                    throw new Error("Restricted Access!");
                }
                const users = await User.find();
                return users;
            }
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch users!");
            }
        },

        authUser: async (parent, args, context) => {
			try {
				const user = await context.getUser();
				return user;
			} 
            catch (err) {
				console.error(err);
				throw new Error(err.message || "Failed to fetch authenticated user!");
			}
		},

		user: async (parent, { userId }) => {
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
        register: async(parent, { input }, context) => {
            try {
                const { firstName, lastName, username, password, email, gender } = input;
                if (!firstName || !lastName || !username || !password || !email || !gender) {
                    throw new Error("All fields are required!");
                }
                const nameRegex = /^[A-Z][a-z]{2,9}$/;
                if (!firstName.match(nameRegex) || !lastName.match(nameRegex)) {
                    throw new Error("Invalid name! Must start with a capital letter and be 3 to 10 characters long. (Ex: John Doe)");
                }
                const usernameRegex = /^[a-z][a-z0-9]{3,11}$/;
                if (!username.match(usernameRegex)) {
                    throw new Error("Invalid username! Can only include lowercase letters and digits, 4 to 12 characters long. (Ex: johndoe26)");
                }
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
                if (!password.match(passwordRegex)) {
                    throw new Error("Invalid password! Must be 8 to 16 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character from '!@#$%^&*.'");
                }
                const emailRegex = /^([a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
                if (!email.match(emailRegex)) {
                    throw new Error("Invalid Email Address! Example: 'johndoe@example.com'.");
                }

                const existingUser = await User.findOne({ $or: [{ username }, { email }] });
                if (existingUser) {
                    if (existingUser.username === username) {
                        throw new Error("Username already in use!");
                    }
                    if (existingUser.email === email) {
                        throw new Error("Email already in use!");
                    }
                }

                const saltRounds = parseInt(process.env.SALT_ROUNDS);
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(password, salt);
                const maleProfilePicture = `${ process.env.MALE_URL }?username=${ username }`;
                const femaleProfilePicture = `${ process.env.FEMALE_URL }?username=${ username }`;

                const user = new User({
                    firstName,
                    lastName,
                    username,
                    password: hashedPassword,
                    email,
                    gender,
                    profilePicture: gender === "MALE" ? maleProfilePicture : femaleProfilePicture
                });
                await user.save();
                await context.login(user);
                return user;
            }
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to register!");
            }
        },

        login: async(parent, { input }, context) => {
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

        logout: async (parent, args, context) => {
			try {
				await context.logout();
				context.req.session.destroy((err) => { 
                    if (err) {
                        throw err; 
                    }
                });
				context.res.clearCookie("connect.sid");
				return { message: "Logged out successfully!" };
			} 
            catch (err) {
				console.error(err);
				throw new Error(err.message || "Failed to log out!");
			}
		},

        changeRole: async (parent, { userId, role }, context) => {
            try {
                const { getUser } = context;
                if (getUser().role !== "ADMIN") {
                    throw new Error("You are not authorized to perform this operation!");
                }

                const user = await User.findById(userId);
                if (!user) {
                    throw new Error("User not found!");
                }
                if (!["ADMIN", "MEMBER"].includes(role)) {
                    throw new Error("Invalid role!");
                }
                user.role = role;
                await user.save();
                return user;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to change user role!");
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

        workouts: async (parent) => {
            try {
                const workouts = await Workout.find({ authorId: parent._id });
                return workouts;
            }
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch user's workouts!");
            }
        },

        programs: async (parent) => {
            try {
                const programs = await Program.find({ authorId: parent._id });
                return programs;
            }
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch user's programs!");
            }
        }
	}
};

export default userResolvers;