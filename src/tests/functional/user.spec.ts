import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { USER_TYPES } from 'App/Utils/constants';
import UserService from 'App/Services/UserService';

const userService = new UserService();

test.group('User', () => {
	test('should create customer user', async ({ assert }) => {
		const userData = {
			full_name: faker.person.fullName(),
			phone_number: faker.phone.number(),
			type: USER_TYPES.customer,
			email: faker.internet.email(),
			password: faker.internet.password()
		};

		const userResponse = await userService.create(userData, false);

		assert.equal(userResponse['user'].fullName, userData.full_name);
		assert.equal(userResponse['user'].type, USER_TYPES.customer);
	});

	test('should create merchant user', async ({ assert }) => {
		const userData = {
			full_name: faker.person.fullName(),
			phone_number: faker.phone.number(),
			type: USER_TYPES.merchant,
			email: faker.internet.email(),
			password: faker.internet.password(),
			business_name: faker.company.buzzPhrase()
		};
		const userResponse = await userService.create(userData, false);

		assert.equal(userResponse['user'].type, USER_TYPES.merchant);
		assert.equal(userResponse['merchant'].name, userData.business_name);
		assert.equal(userResponse['merchant'].userId, userResponse['user'].id);
	});

	test('should return email or phone number already exists error', async ({ assert, client }) => {
		const userData = {
			full_name: faker.person.fullName(),
			phone_number: faker.phone.number(),
			type: USER_TYPES.customer,
			email: faker.internet.email(),
			password: faker.internet.password()
		};
		(await client.post('/users').json(userData)).body();
		const responseBody = (await client.post('/users').json(userData)).body();

		assert.equal(responseBody.status, 'error');
		assert.equal(responseBody.message, 'Email or phone number already exists');
	});

	test('should generate username', async ({ assert }) => {
		const userData = {
			full_name: faker.person.fullName(),
			phone_number: faker.phone.number(),
			type: USER_TYPES.customer,
			email: faker.internet.email(),
			password: faker.internet.password()
		};

		const username = await userService.generateUsername(userData.full_name);
		const userResponse = await userService.create(userData, false);

		assert.equal(userResponse['user'].username, username)
	})

	// test('should create and validate user pin', async ({ assert }) => {
	// 	const userData = {
	// 		full_name: faker.person.fullName(),
	// 		phone_number: faker.phone.number(),
	// 		type: USER_TYPES.merchant,
	// 		email: faker.internet.email(),
	// 		password: faker.internet.password(),
	// 		business_name: faker.company.buzzPhrase()
	// 	};
	// 	const userResponse = await userService.create(userData, false);
	// 	const pin = faker.number.int({ min: 1000, max: 9999 }).toString();

	// 	const updateData = { pin };
	// 	await userService.updateUser(userResponse['user'].id, updateData);

	// 	assert.isTrue(await userService.validateUserPin(userResponse['user'], pin));
	// });

	test('should get user');
	test('should get users');
})
