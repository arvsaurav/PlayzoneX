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
            if(userAccount) {
                const loggedinUserAccount = await this.login({email, password});
                return {
                    userAccount: loggedinUserAccount.userAccount,
                    message: 'Account created successfully. Logging you in...'
                }
            }
            else {
                return {
                    userAccount,
                    message: 'Account created successfully.'
                }
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
            await this.account.createEmailSession(email, password);
            const userData = await this.getCurrentUser();
            return {
                userAccount: userData,
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
            const userData = await this.account.get();
            return {
                name: userData.name,
                email: userData.email,
                id: userData['$id']
            }
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
