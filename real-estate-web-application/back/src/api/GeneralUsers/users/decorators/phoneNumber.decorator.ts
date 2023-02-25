import { registerDecorator, ValidationOptions } from 'class-validator';

export function PhoneNumberDecorator(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isArgentinianPhoneNumber',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any) {
					if (value !== '') {
						const phoneRegex = /(\+?\d{7,13})/;
						return phoneRegex.test(value);
					} else {
						return true;
					}
				},
			},
		});
	};
}
