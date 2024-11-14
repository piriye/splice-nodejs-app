import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { USER_TYPES } from 'App/Utils/constants';

export default class UsersSchema extends BaseSchema {
	protected tableName = 'users'

	public async up () {
		this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
		this.schema.createTable(this.tableName, (table) => {
			table
				.uuid('id')
				.primary()
				.defaultTo(this.raw('uuid_generate_v4()'));

			table.string('full_name').notNullable();
			table.string('phone_number').notNullable().unique();
			table.enum('type', Object.values(USER_TYPES)).notNullable();
			table.string('email', 255).notNullable().unique();
			table.string('password', 180).nullable();
			table.string('pin', 180).nullable();
			table.boolean('email_verified').defaultTo(false);
			table.boolean('phone_verified').defaultTo(false);
			table.string('image_url').nullable();
			table.string('remember_me_token').nullable();

			table.timestamps(true);
		})
	}

	public async down () {
		this.schema.dropTable(this.tableName)
	}
}
