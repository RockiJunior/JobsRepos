import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

class SubCharacteristics {
	@ApiProperty()
	@IsOptional()
	ambience: number;

	@ApiProperty()
	@IsOptional()
	bedrooms: number;

	@ApiProperty()
	@IsOptional()
	bathrooms: number;

	@ApiProperty()
	@IsOptional()
	toilettes: number;

	@ApiProperty()
	@IsOptional()
	laundries: number;

	@ApiProperty()
	@IsOptional()
	garages: number;

	@ApiProperty({
		default: false,
	})
	@IsOptional()
	porch: boolean;

	@ApiProperty()
	@IsOptional()
	floors: number;

	@ApiProperty({
		default: false,
	})
	@IsOptional()
	covered: boolean;

	@ApiProperty({
		default: false,
	})
	@IsOptional()
	lift: boolean;

	@ApiProperty({
		default: false,
	})
	@IsOptional()
	underground: boolean;

	@ApiProperty({
		default: false,
	})
	@IsOptional()
	building: boolean;
}

class SubSurface {
	@ApiProperty()
	@IsOptional()
	totalSurface: number;

	@ApiProperty()
	@IsOptional()
	coveredSurface: number;
}

class SubPrice {
	@ApiProperty({
		description: 'System of money - Type of currency',
	})
	@IsOptional()
	currency: number;

	@ApiProperty({
		description: 'Total of price',
	})
	@IsOptional()
	total: number;

	@ApiProperty({
		description: 'if is a rente, general expenses of it',
	})
	@IsOptional()
	expenses: number;
}

class SubAntiquity {
	@ApiProperty({
		description: 'Antiquity type',
	})
	@IsOptional()
	type: number;

	@ApiProperty({
		description: 'Years of Antiquity',
	})
	@IsOptional()
	years: number;
}

export class UploadCharacteristicsDto {
	@ApiProperty({
		description: 'Property Characteristics',
	})
	characteristics: SubCharacteristics;

	@ApiProperty({
		description: 'Surfaces of the property',
	})
	surface?: SubSurface;

	@ApiProperty({
		description: 'Property antiquity',
	})
	antiquity?: SubAntiquity;

	@ApiProperty({
		description: 'Price of property',
	})
	price?: SubPrice;
}
