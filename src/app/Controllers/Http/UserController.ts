import { ERROR_CODES } from "App/Utils/constants";
import AddWithdrawalAccountValidator from "App/Validators/AddWithdrawalAccountValidator";
import BaseController from "./BaseController";
import ChangePasswordValidator from "App/Validators/ChangePasswordValidator";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import HttpStatusCodes from "App/Utils/HttpStatusCodes";
import InitiateWithdrawalValidator from "App/Validators/InitiateWithdrawalValidator";
import SaveCardValidator from "App/Validators/SaveCardValidator";
import UserService from "App/Services/UserService";
import WalletService from "App/Services/WalletService";

class UserController extends BaseController {
    public userService: UserService;
    public walletService: WalletService;

    constructor() {
        super();
        this.userService = new UserService();
        this.walletService = new WalletService();
    }

    public async createUser({ request, response }) {
        try {
            const userData = await request.validate(CreateUserValidator);
            const user = await this.userService.create(userData);

            return this.success(
                response,
                user,
                'Successfully created user',
                HttpStatusCodes.CREATED
            )
        } catch (error) {
            if (error.code === 'E_VALIDATION_FAILURE') {
                return this.error(
                    response, 
                    HttpStatusCodes.BAD_REQUEST, 
                    'Validation errors', 
                    error.messages
                );
            }

            if (error.code === '23505') {
                return this.error(
                    response,
                    HttpStatusCodes.BAD_REQUEST,
                    'Email or phone number already exists',
                )
            }

            return this.error(response);
        }
    }

    public async verifyEmail({ request, response, auth }) {
        try {
            const userId = request.param('user_id');
            const code = request.input('code');

            const verifyEmailResponse = await this.userService.verifyEmail(auth, userId, code);
            
            return this.success(
                response,
                verifyEmailResponse,
                'Successfully verified email',
                HttpStatusCodes.OK
            );
        } catch (error) {
			if (error.status === ERROR_CODES.code_invalid) {
				return this.error(
					response,
					HttpStatusCodes.BAD_REQUEST,
					error.message,
				);
			}

            return this.error(response);
        }
    }

    public async resendEmailVerification({ request, response }) {
        try {
            const userId = request.param('user_id');
            await this.userService.resendEmailVerification(userId);
            
            return this.success(
                response,
                {},
                'Successfully resent email verification',
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async createUserPin({ request, response }) {
        try {
            const userId = request.param('user_id');
            const pin = request.input('pin');

            const userData = { pin };
            const user = await this.userService.updateUser(userId, userData);

            return this.success(
                response, 
                user, 
                'Successfully created login pin', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async createUserTransactionPin({ request, response }) {
        try {
            const userId = request.param('user_id');
            const transactionPin = request.input('pin');

            const userData = { transaction_pin: transactionPin };
            const user = await this.userService.updateUser(userId, userData);

            return this.success(
                response, 
                user, 
                'Successfully created transaction pin', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async addWithdrawalAccount({ auth, request, response }) {
        try {
            const userId = auth.user.id;
            const withdrawalAccountData = await request.validate(AddWithdrawalAccountValidator);
            const responseData = await this.userService.addWithdrawalAccount(userId, 
                withdrawalAccountData);

            return this.success(
                response, 
                responseData, 
                'Successfully added withdrawal account', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            if (error.code === 'E_VALIDATION_FAILURE') {
                return this.error(
                    response, 
                    HttpStatusCodes.BAD_REQUEST, 
                    'Validation errors', 
                    error.messages
                );
            }

			if (error.status === ERROR_CODES.withdrawal_account_already_exists) {
				return this.error(
					response,
					HttpStatusCodes.BAD_REQUEST,
					error.message,
				);
			}

            return this.error(response);
        }
    }

    public async getWithdrawalAccount({ auth, response }) {
        try {
            const userId = auth.user.id;
            const responseData = await this.userService.getWithdrawalAccount(userId);

            return this.success(
                response, 
                responseData, 
                'Successfully fetched withdrawal account', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async getUsers({ request, response }) {
        try {
            const queryParams = request.qs();
            const users = await this.userService.getUsers(queryParams);

            return this.success(
                response, 
                users, 
                'Successfully fetched users', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async getUserToDos({ request, response }) {
        try {
            const userId = request.param('user_id');
            const toDos = await this.userService.getUserToDos(userId);

            return this.success(
                response, 
                toDos, 
                'Successfully fetched user to-dos', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async changePassword({ auth, request, response }) {
        try {
            const changePasswordData = await request.validate(ChangePasswordValidator);
            await this.userService.changePassword(auth.user, changePasswordData);

            return this.success(
                response, 
                [], 
                'Successfully changed password', 
                HttpStatusCodes.OK
            );
        } catch (error) {
			if (error.status === ERROR_CODES.invalid_password) {
				return this.error(
					response,
					HttpStatusCodes.BAD_REQUEST,
					error.message,
				);
			}

            return this.error(response);
        }
    }

    public async getMyProfile({ auth, response }) {
        try {
            return this.success(
                response, 
                auth.user, 
                'Successfully fetched my profile', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async getUser({ request, response }) {
        try {
            const userId = request.param('user_id');
            const user = await this.userService.getById(userId);

            return this.success(
                response, 
                user, 
                'Successfully fetched user', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async saveCard({ auth, request, response }) {
        try {
            const userId = auth.user.id;
            const cardData = await request.validate(SaveCardValidator);
            const saveCardResponse = await this.userService.saveCard(userId, cardData)

            return this.success(
                response, 
                saveCardResponse,
                'Successfully saved card', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async getCards({ auth, response }) {
        try {
            const userId = auth.user.id;
            const cardDetails = await this.userService.getCards(userId)

            return this.success(
                response, 
                cardDetails,
                'Successfully fetched cards', 
                HttpStatusCodes.OK
            );
        } catch (error) {
            return this.error(response);
        }
    }

    public async initiateWithdrawal({ auth, request, response }) {
        try {
            const initiateWithdrawalData = await request.validate(InitiateWithdrawalValidator);
            await this.userService.initiateWithdrawal(auth.user.id, initiateWithdrawalData.amount);

            return this.success(
                response, 
                [],
                'Successfully initiated withdrawal', 
                HttpStatusCodes.OK
            );
        } catch (error) {
			if (error.status === ERROR_CODES.insufficient_funds) {
				return this.error(
					response,
					HttpStatusCodes.BAD_REQUEST,
					error.message,
				);
			}

            return this.error(response);
        }
    }
}

export default UserController;
