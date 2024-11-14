import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
	column,
	beforeSave,
	BaseModel
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: string

	@column()
	public fullName: string
 
	@column()
	public phoneNumber: string

	@column()
	public type: string

	@column()
	public parentId: string

	@column()
	public email: string

	@column({ serializeAs: null })
	public password: string

	@column({ serializeAs: null })
	public pin: string

	@column()
	public emailVerified: string

	@column()
	public phoneVerified: string

	@column()
	public imageUrl?: string

	@column()
	public rememberMeToken?: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@column()
	public username: string

	@column({ serializeAs: null })
	public transactionPin: string

	@beforeSave()
	public static async hashPassword (user: User) {
		if (user.$dirty.password) {
			user.password = await Hash.make(user.password);
		}
	}

	@beforeSave()
	public static async hashPin (user: User) {
		if (user.$dirty.pin) {
			user.pin = await Hash.make(user.pin);
		}
	}

	@beforeSave()
	public static async hashTransactionPin (user: User) {
		if (user.$dirty.transactionPin) {
			user.transactionPin = await Hash.make(user.transactionPin);
		}
	}
}
