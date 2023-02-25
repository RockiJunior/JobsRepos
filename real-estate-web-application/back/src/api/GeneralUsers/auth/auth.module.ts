// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Databases, Controllers, Services & Dtos
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PermissionGuard } from './guards/permission-guard';

@Module({
	imports: [TypeOrmModule.forFeature([Users])],
	controllers: [AuthController],
	providers: [AuthService, PermissionGuard],
	exports: [AuthService],
})
export class AuthModule {}
