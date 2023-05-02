import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	BadRequestException,
	HttpStatus,
	UseGuards,
	Req,
	Res,
	UseInterceptors,
	UploadedFiles,
} from '@nestjs/common';
import {
	ApiResponse,
	ApiTags,
	ApiOperation,
	ApiConsumes,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Public } from '../auth/decorators/public.decorator';
import { LoginClientDto } from './dto/login-client.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter } from 'src/api/Properties/properties/multerFunctions/image-file-filter';
import { UploadProfileClientPhotoDto } from './dto/profile-client-photo.dto';
import { editClientFileName } from './multerFuncions/edit-client-file-name';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from './entities/client.entity';
import { Repository } from 'typeorm';
import { SendVerificationTokenDto } from './dto/send-recovery-password.dto';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { PermissionEnumList } from '../../../config/enum-types';
import { PermissionGuard } from '../auth/guards/permission-guard';
import { ValidateUserDto } from '../users/dto/validate-user.dto';
import { VerifyClientDto } from './dto/verify-client.dto';
@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Public()
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Post()
	create(@Body() createClientDto: CreateClientDto) {
		return this.clientsService.create(createClientDto);
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
	@Post('verify-client')
	verifyUser(@Body() verifyTokenDto: VerifyClientDto) {
		return this.clientsService.verifyClient(verifyTokenDto);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Patch('upload-photo/:clientId')
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], {
			limits: { fileSize: 25 * 300 * 300 },
			storage: diskStorage({
				filename: editClientFileName,
				destination: './uploads/clients/profile-pictures',
			}),
			fileFilter: imageFileFilter,
		})
	)
	@ApiConsumes('multipart/form-data')
	async uploadProfilePhoto(
		@UploadedFiles() photoInController: UploadProfileClientPhotoDto,
		@Param('clientId') clientId: string,
		@Body() photoDto?: UploadProfileClientPhotoDto
	) {
		return this.clientsService.uploadProfilePhoto(photoInController, clientId);
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
	@Post('login')
	loginUser(@Body() clientLogin: LoginClientDto) {
		return this.clientsService.clientLogin(clientLogin);
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
	@Post('send-recovery-token')
	sendRecoveryToken(@Body() client: SendVerificationTokenDto) {
		return this.clientsService.sendRecoveryPasswordToken(client);
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
	@Post('recovery-password')
	recoveryToken(@Body() client: RecoveryPasswordDto) {
		return this.clientsService.recoveryPassword(client);
	}

	//  -------------------------------------------------------------------------------- LOGIN FACEBOOK

	@Public()
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get('login/facebook')
	@UseGuards(AuthGuard('facebook'))
	loginFacebook() {
		return HttpStatus.OK;
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
	@Get('login/facebook/callback')
	@UseGuards(AuthGuard('facebook'))
	async loginFacebookRedirect(@Req() req: Request, @Res() res: Response) {
		try {
			const { user } = <any>req;
			const { accessToken } = user;
			await this.clientsService.loginFacebookRedirect(user);
			res.redirect(`${process.env.FB_CALLBACK}callback?code=${accessToken}`);
		} catch (err) {
			return err;
		}
	}

	//  -------------------------------------------------------------------------------- LOGIN GOOGLE
	@Public()
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get('login/google')
	@UseGuards(AuthGuard('google'))
	async loginGoogle() {
		return HttpStatus.OK;
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
	@Get('login/google/callback')
	@UseGuards(AuthGuard('google'))
	async loginGoogleRedirect(@Req() req: Request, @Res() res: Response) {
		try {
			const { user } = <any>req;
			const { accessToken } = user;
			await this.clientsService.loginGoogleRedirect(user);
			res.redirect(`${process.env.CLIENT_URL}/callback?code=${accessToken}`);
		} catch (err) {
			return err;
		}
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeUsers)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get()
	findAll() {
		return this.clientsService.findAll();
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeUsers)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.clientsService.findOne(id);
	}

	@Public()
	@ApiOperation({
		summary: 'Finds a client by platform token',
	})
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Get('by-token/:accessToken')
	async findClientByAccessToken(@Param('accessToken') accessToken: string) {
		return this.clientsService.findClientByAccessToken(accessToken);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Patch('update-data/:clientId')
	updateData(
		@Param('clientId') clientId: string,
		@Body() updateClientDto: UpdateClientDto
	) {
		return this.clientsService.updateData(clientId, updateClientDto);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Patch('update-password/:clientId')
	updatePassword(
		@Param('clientId') clientId: string,
		@Body() updatePasswordDto: UpdatePasswordDto
	) {
		return this.clientsService.updatePassword(clientId, updatePasswordDto);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.deleteUsers)
	@UseGuards(PermissionGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.clientsService.remove(id);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@Delete('delete-profile-picture/:clientId')
	removePhoto(@Param('clientId') clientId: string) {
		return this.clientsService.removeProfilePicture(clientId);
	}
}
