// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Databases, Controllers, Services & Dtos
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Roles } from './entities/role.entity';
import { RoleToUser } from './entities/role_user.entity';
import { Users } from '../users/entities/user.entity';
import { Permissions } from '../permissions/entities/permission.entity';
import { RoleToPermission } from './entities/role_permission.entity';
import { RealEstate } from '../real-estate/entities/real-estate.entity';
import { BranchOfficeToUser } from '../branch-offices/entities/branch-office-user.entity';
import { AuthService } from '../auth/auth.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Roles,
			RoleToUser,
			Users,
			Permissions,
			RoleToPermission,
			RealEstate,
			BranchOfficeToUser,
		]),
	],
	controllers: [RolesController],
	providers: [RolesService, AuthService],
	exports: [RolesService],
})
export class RolesModule {}
