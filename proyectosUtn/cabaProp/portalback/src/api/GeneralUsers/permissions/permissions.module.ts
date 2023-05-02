// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Databases, Controllers, Services & Dtos
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permissions } from './entities/permission.entity';
import { AuthService } from '../auth/auth.service';
import { Users } from '../users/entities/user.entity';
import { Clients } from '../clients/entities/client.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Permissions, Users, Clients])],
	controllers: [PermissionsController],
	providers: [PermissionsService, AuthService],
	exports: [PermissionsService],
})
export class PermissionsModule {}
