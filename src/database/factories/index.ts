import Factory from '@ioc:Adonis/Lucid/Factory'
import Merchant from 'App/Models/Merchant'
import User from 'App/Models/User'
import { USER_TYPES } from 'App/Utils/constants'

export const CustomerUserFactory = Factory
    .define(User, ({ faker }) => {
        return {
			full_name: faker.internet.userName(),
			phone_number: faker.phone.phoneNumber(),
			type: USER_TYPES.customer,
			email: faker.internet.email(),
			password: faker.internet.password()
        }
    })
    .build();

export const MerchantUserFactory = Factory
    .define(User, ({ faker }) => {
        return {
			full_name: faker.internet.userName(),
			phone_number: faker.phone.phoneNumber(),
			type: USER_TYPES.merchant,
			email: faker.internet.email(),
			password: faker.internet.password()
        }
    })
    .build();

export const MerchantFactory = Factory
    .define(Merchant, async ({ faker }) => {
        const user = await MerchantUserFactory.create();

        return {
            name: faker.internet.userName(),
            phone_number: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            user_id: user.id,
        }
    })
    .build();

