import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

export const userSchema = new Schema(
	{
		phone: {
			type: String,
			trim: true,
			index: true,
			min: 10,
			max: 10
		},
		name: {
			type: String,
			required: true,
			uppercase: true,
			trim: true
		},
		lastName: {
			type: String,
			uppercase: true,
			trim: true
		},
		maternalSurname: {
			type: String,
			uppercase: true,
			trim: true
		},
		address: {
			type: new Schema(
				{
					street: {
						type: String,
						required: true,
						uppercase: true,
						trim: true
					},
					number: {
						type: String,
						required: true,
						uppercase: true,
						trim: true
					},
					municipality: {
						type: String,
						uppercase: true,
						trim: true
					},
					city: {
						type: String,
						uppercase: true,
						trim: true
					},
					state: {
						type: String,
						uppercase: true,
						trim: true
					},
					place_id: {
						type: Number,
						required: true
					}
				},
				{ _id: false }
			),
			required: false
		},
		active: {
			type: Boolean,
			required: true
		}
	},
	{
		timestamps: true,
		discriminatorKey: 'user',
		collection: 'users'
	}
);

export const User = models.User || model('User', userSchema);

const customerSchema = new Schema({
	balance: {
		type: new Schema(
			{
				pendingBalance: {
					type: Boolean,
					default: false
				},
				dueBalance: {
					type: Number,
					default: 0
				}
			},
			{ _id: false }
		)
	}
});

export const Customer =
	User.discriminators != undefined
		? User.discriminators['Customer']
		: User.discriminator('Customer', customerSchema);
