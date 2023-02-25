import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { PropertyEnumStatus } from '../../../../config/enum-types';

// export type PropertyDocument = any;
export type PropertyDocument = Property & Document;

@Schema({ strict: false, versionKey: false })
export class Property {
	@Prop()
	description: string;

	@Prop({ default: PropertyEnumStatus.pending })
	status: PropertyEnumStatus;

	@Prop()
	images: [];

	@Prop()
	videoUrl: string;

	@Prop()
	video360Url: string;

	@Prop({ default: new Date() })
	created_at: Date;

	@Prop({ default: new Date() })
	updated_at: Date;

	@Prop({ default: null })
	deleted_at: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property);