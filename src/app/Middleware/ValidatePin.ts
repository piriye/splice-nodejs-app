import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ERROR_CODES } from 'App/Utils/constants';
import HttpStatusCodes from 'App/Utils/HttpStatusCodes';
import UserService from 'App/Services/UserService';

export default class ValidatePin {
	public userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
		try {
			const pin = request.input('pin');

			// TODO: might be able to use a validator here
			if (pin == undefined || pin == "") {
				return response.status(HttpStatusCodes.UNAUTHORIZED).send({
					status: 'error',
					message: 'Invalid pin',
					data: []
				});
			}

			const isPinValid = await this.userService.validateTransactionPin(auth.user, pin);
	
			if (!isPinValid) {
				return response.status(HttpStatusCodes.UNAUTHORIZED).send({
					status: 'error',
					message: 'Invalid pin',
					data: []
				});
			}
	
			await next();
        } catch (error) {
			if (error.status === ERROR_CODES.transaction_pin_not_setup) {
				return response.status(HttpStatusCodes.BAD_REQUEST).send({
					status: 'error',
					message: error.message,
					data: []
				});
			}
			
			return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
				status: 'error',
				message: 'There was a problem, please try again later.',
				data: []
			});
        }
	}
}
