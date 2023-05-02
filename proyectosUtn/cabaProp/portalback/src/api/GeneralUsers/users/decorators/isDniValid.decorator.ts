import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
} from 'class-validator';

export function IsDniValid(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isDniValid',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					// DNI validation logic here
					const dniRegex = /^\d{8}$/;
					return dniRegex.test(value);
				},
			},
		});
	};
}
