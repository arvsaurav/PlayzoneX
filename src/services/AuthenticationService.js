import { Client, Account, ID } from 'appwrite';
import configuration from '../configuration/appwriteConfiguration';

export class AuthenticationService {
    client = new Client();
    account;

    constructor() {
        this.client
                .setEndpoint(configuration.appwriteUrl)
                .setProject(configuration.appwriteProjectId)
        this.account = new Account(this.client);
    }

    async createAccount({name, email, password}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            return {
                userAccount,
                message: 'Account created successfully.'
            }
        }
        catch(error) {
            if(error.code === 409) {
                return {
                    userAccount: null,
                    message: 'A user with the same email already exists.'
                }
            }
            else {
                return {
                    userAccount: null,
                    message: 'Something went wrong.'
                }
            }
        }
    }

    async login({email, password}) {
        try {
            const userAccount = await this.account.createEmailPasswordSession(email, password);
            return {
                userAccount: userAccount,
                message: 'Login successful.'
            }
        }
        catch(error) {
            if(error.code === 401) {
                return {
                    userAccount: null,
                    message: 'Invalid credentials. Please check the email and password.'
                }
            }
            else if(error.code === 429) {
                return {
                    userAccount: null,
                    message: 'Too many requests. Please try after sometime.'
                }
            }
            else {
                return {
                    userAccount: null,
                    message: 'Something went wrong.'
                }
            }
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        }
        catch {
            return null;
        }
    }

    async logout(sessionId) {
        try {
            return await this.account.deleteSessions(sessionId);
        }
        catch {
            return null;
        }
    }
}

const authService = new AuthenticationService();

export default authService;
