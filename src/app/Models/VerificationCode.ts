import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class VerificationCode extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public userId: string

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

	@column()
	public verificationType: string

	@column()
	public description: string

	@column()
	public code: string

	@column()
	public sentTo: string

	@column()
	public isVerified: boolean

	@column()
	public reference: string

	@column()
	public deletedAt: string | null;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
