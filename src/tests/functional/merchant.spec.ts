import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { USER_TYPES } from 'App/Utils/constants';
import UserService from 'App/Services/UserService';

const userService = new UserService();

test('Merchant', async ({ client }) => {
    const response = await client.get('/')

    response.assertStatus(200)
    response.assertBodyContains({ hello: 'world' })
})

test('should create sub-merchant', async ({ assert }) => {
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
