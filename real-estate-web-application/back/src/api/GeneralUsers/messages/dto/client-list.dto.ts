import { IsOptional } from "@nestjs/class-validator";

export class ClientListDto {
	propertyId: string;
	clientId: string;
	branchOfficeId: number;
	conversationId: number;
    @IsOptional()
	socketId?: string;
}
