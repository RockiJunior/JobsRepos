import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from './entities/client.entity';
import { MailModule } from '../../../mail/mail.module';
import { Invitations } from '../invitations/entities/invitation.entity';
import { JwtModule } from '@nestjs/jwt';
import { FacebookStrategy } from '../auth/strategies/facebook.strategy';
import { GoogleStrategy } from '../auth/strategies/google.strategy';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Users } from '../users/entities/user.entity';

@Module({
	imports: [
		MailModule,
		TypeOrmModule.forFeature([Clients, Invitations, Users]),
		JwtModule.register({
			secret: `${process.env.JWT_SECRET}`,
			signOptions: { expiresIn: '24h' },
		}),
	],
	controllers: [ClientsController],
	providers: [
		ClientsService,
		FacebookStrategy,
		GoogleStrategy,
		AuthService,
		JwtStrategy,
	],
	exports: [ClientsService],
})
export class ClientsModule {}
