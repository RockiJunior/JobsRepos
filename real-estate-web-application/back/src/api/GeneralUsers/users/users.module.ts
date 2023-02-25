// Libraries
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// Databases, Controllers, Services & Dtos

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/user.entity';
import { Permissions } from '../permissions/entities/permission.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { MailModule } from '../../../mail/mail.module';
import { Invitations } from '../invitations/entities/invitation.entity';
import { BranchOfficeToUser } from '../branch-offices/entities/branch-office-user.entity';
import { BranchOffice } from '../branch-offices/entities/branch-office.entity';
import { Roles } from '../roles/entities/role.entity';
import { RoleToUser } from '../roles/entities/role_user.entity';
import { RealEstate } from '../real-estate/entities/real-estate.entity';
import { AuthService } from '../auth/auth.service';
@Module({
	imports: [
		TypeOrmModule.forFeature([
			Users,
			RoleToUser,
			BranchOfficeToUser,
			BranchOffice,
			Permissions,
			Invitations,
			Roles,
			RealEstate,
			Permissions,
		]),
		JwtModule.register({
			secret: `${process.env.JWT_SECRET}`,
			signOptions: { expiresIn: '24h' },
		}),
		MailModule,
	],
	controllers: [UsersController],
	providers: [UsersService, JwtStrategy, AuthService],
	exports: [UsersService],
})
export class UsersModule {}
