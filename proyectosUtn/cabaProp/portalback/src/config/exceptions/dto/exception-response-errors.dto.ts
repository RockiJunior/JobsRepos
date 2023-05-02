import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResponseErrorDto {
	@ApiProperty()
	private readonly statusCode: number;

	@ApiProperty()
	private readonly errorCode: string;

	@ApiProperty()
	private readonly message: string;

	constructor(statusCode: number, errorCode: string, message: string) {
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.message = message;
	}
}
