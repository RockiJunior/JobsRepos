// Libraries
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpStatus,
	BadRequestException,
	Query,
	UseInterceptors,
	UploadedFiles,
	Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Databases, Controllers, Services & Dtos
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ValidateUserDto } from './dto/validate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEnumStatus } from 'src/config/enum-types';
import { ReSendDto } from './dto/reSend-email.dto';
import { UpdateUserProfileDto } from './dto/update-profile-user-dto';
import { UpdateUserRolesDto } from './dto/update-roles.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ediUserFileName } from './multerFunctions/edit-collabUser-file-name';
import { imageFileFilter } from 'src/api/Properties/properties/multerFunctions/image-file-filter';
import { UploadProfileUserPhotoDto } from './dto/profile-user-photo.dto';
import { editAdminFileName } from './multerFunctions/edit-adminUser-file-name';
import { UseGuards } from '@nestjs/common';
import { PermissionEnumList, TypeOfUser } from '../../../config/enum-types';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { PermissionGuard } from '../auth/guards/permission-guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@CheckPermissions(PermissionEnumList.seeUsers)
	@UseGuards(PermissionGuard)
	@Get('check-user-perms')
	checkUserPermissions(@Req() req: Request): Promise<any> {
		const user = req['user'];
		return this.usersService.checkUserPermissions(user.id);
	}

	// esto es momentaneo, porque los admins vienen de cucicba
	// @ApiBearerAuth()
	// @CheckPermissions(PermissionEnumList.createUsers)
	// @UseGuards(PermissionGuard)
	@ApiOperation({
		summary: 'Creates a new admin user',
	})
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Post('create-admin/:realEstateId')
	createAdmin(
		@Body() createAdminDto: CreateAdminDto,
		@Param('realEstateId') realEstateId: number
	) {
		return this.usersService.createAdminUser(createAdminDto, realEstateId);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.editUsers)
	@UseGuards(PermissionGuard)
	@ApiOperation({
		summary: 'Uploads photo to admin user',
	})
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Patch('upload-admin-photo/:adminId')
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], {
			limits: { fileSize: 25 * 300 * 300 },
			storage: diskStorage({
				filename: editAdminFileName,
				destination: './uploads/admins/profile-pictures',
			}),
			fileFilter: imageFileFilter,
		})
	)
	@ApiConsumes('multipart/form-data')
	async uploadAdminProfilePhoto(
		@UploadedFiles() photoInController: UploadProfileUserPhotoDto,
		@Param('adminId') adminId: string,
		@Body() photoDto?: UploadProfileUserPhotoDto
	) {
		return this.usersService.uploadAdminProfilePhoto(
			photoInController,
			adminId
		);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.createUsers)
	@UseGuards(PermissionGuard)
	@ApiOperation({
		summary: 'Creates a new colaborator user',
	})
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Post('create-user')
	createUser(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
		const user = req['user'];
		const adminId =
			user.typeOfUser === TypeOfUser.collabUser ? user.adminUserId : user.id;
		return this.usersService.createCollabUser(createUserDto, adminId);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.editUsers)
	@UseGuards(PermissionGuard)
	@Patch('upload-user-photo/:userId')
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], {
			limits: { fileSize: 25 * 300 * 300 },
			storage: diskStorage({
				filename: ediUserFileName,
				destination: './uploads/users/profile-pictures',
			}),
			fileFilter: imageFileFilter,
		})
	)
	@ApiConsumes('multipart/form-data')
	async uploadCollabProfilePhoto(
		@UploadedFiles() photoInController: UploadProfileUserPhotoDto,
		@Param('userId') userId: string,
		@Body() photoDto?: UploadProfileUserPhotoDto
	) {
		return this.usersService.uploadCollabProfilePhoto(
			photoInController,
			userId
		);
	}

	@Public()
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Post('verify-user')
	verifyUser(@Body() validateUserDto: ValidateUserDto) {
		return this.usersService.verifyUser(validateUserDto);
	}

	// @ApiBearerAuth()
	// @UseGuards(JwtAuthGuard)
	
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Post('refresh-token')
	refreshToken(@Body() body) {
		const { token } = body
		return this.usersService.refreshToken(token);
	}

	@Public()
	@ApiOperation({
		summary: 'Re send confirmation email to collaborator user',
	})
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Post('resend-confirmation')
	reSendUserConfirmation(@Body() reSendDto: ReSendDto) {
		return this.usersService.reSendUserConfirmation(reSendDto);
	}

	@Public()
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Post('login')
	loginUser(@Body() userLogin: LoginUserDto) {
		return this.usersService.loginUser(userLogin);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeUsers)
	@UseGuards(PermissionGuard)
	@ApiOperation({
		summary: 'Gets all colaborator users',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get('collab-users')
	findAll(@Req() req: Request) {
		const user = req['user'];
		return this.usersService.findAll(user);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeUsers)
	@UseGuards(PermissionGuard)
	@ApiOperation({
		summary: 'Gets user by status',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get('get-by-status')
	getUsersByStatus(@Query('status') status: UserEnumStatus) {
		return this.usersService.getUsersByStatus(status);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeUsers)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.editUsers)
	@UseGuards(PermissionGuard)
	@ApiOperation({
		summary: 'This is for administrators only, Edit collaborator-user data',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Patch('edit-data/:userId')
	update(
		@Param('userId') userId: string,
		@Body() updateUserDataDto: UpdateUserDataDto
	) {
		return this.usersService.updateData(userId, updateUserDataDto);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.editRoles)
	@UseGuards(PermissionGuard)
	@ApiOperation({
		summary: 'This is for administrators only, Edit collaborator-user data',
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Patch('edit-roles/:userId')
	updateRoles(
		@Param('userId') userId: string,
		@Body() updateUserRolesDto: UpdateUserRolesDto
	) {
		return this.usersService.updateRoles(userId, updateUserRolesDto);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.editUsers)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Patch('edit-profile/:userId')
	updateProfile(
		@Param('userId') userId: string,
		@Body() updateUserDto: UpdateUserProfileDto
	) {
		return this.usersService.updateProfile(userId, updateUserDto);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.editUsers)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Patch('active-user/:userId')
	activateUser(@Param('userId') userId: string) {
		return this.usersService.reActivateUser(userId);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.deleteUsers)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(id);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	// @CheckPermissions(PermissionEnumList.deleteUsers)
	// @UseGuards(PermissionGuard)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Delete(':userId')
	removePhoto(@Param('userId') userId: string) {
		return this.usersService.removePhoto(userId);
	}
}
