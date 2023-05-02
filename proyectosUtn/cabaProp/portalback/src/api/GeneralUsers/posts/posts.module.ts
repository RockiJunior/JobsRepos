import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { Clients } from '../clients/entities/client.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthService } from '../auth/auth.service';
import { Users } from '../users/entities/user.entity';
import {
	Property,
	PropertySchema,
} from '../../Properties/properties/schema/property.schema';

@Module({
	imports: [
		TypeOrmModule.forFeature([Posts, Clients, Users]),
		MongooseModule.forFeature([
			{ name: Property.name, schema: PropertySchema },
		]),
	],
	controllers: [PostsController],
	providers: [PostsService, JwtStrategy, AuthService],
	exports: [PostsService],
})
export class PostsModule {}
