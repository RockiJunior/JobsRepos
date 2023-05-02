import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type StatisticsDocument = Statistics & Document;

@Schema({ strict: false, versionKey: false })
export class Statistics {
	@Prop()
	PropertyId: string;

	@Prop()
	userId: string;

	@Prop()
	ipAddress: string;

	@Prop()
	navigator: string;

	@Prop()
	origin: string;

	@Prop()
	operationSystem: string;

	@Prop({ type: () => Object })
	location: any;

	@Prop({ default: new Date() })
	created_at: Date;

	@Prop({ default: new Date() })
	updated_at: Date;

	@Prop({ default: null })
	deleted_at: Date;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
