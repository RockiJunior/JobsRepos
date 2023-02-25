import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFiles,
	Req,
	Query,
	BadRequestException,
	UploadedFile,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import {
	ApiConsumes,
	ApiProperty,
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiQuery,
	ApiBearerAuth,
} from '@nestjs/swagger';
import {
	FileFieldsInterceptor,
	FileInterceptor,
} from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { editPropertyFileName } from './multerFunctions/edit-property-file-name';
import { imageFileFilter } from './multerFunctions/image-file-filter';
import { UploadCharacteristicsDto } from './dto/uploadCharacteristics.dto';
import { UploadMultimediaDto } from './dto/upload-multimedia.dto';
import { PropertyPublishedStatusDto } from './dto/property-published-status.dto';
import { Request } from 'express';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindPropertyOptionsDto } from './dto/find-property-options.dto';
import { CheckPermissions } from '../../GeneralUsers/auth/decorators/permission.decorator';
import { PermissionEnumList } from 'src/config/enum-types';
import { UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../../GeneralUsers/auth/guards/permission-guard';
import { Public } from 'src/api/GeneralUsers/auth/decorators/public.decorator';
import { UploadCloudinaryDto } from './dto/upload-cloudinary';
import { DeleteCloudinaryDto } from './dto/delete-cloudinary';
@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
	constructor(private readonly propertiesService: PropertiesService) {}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.publishProperty)
	@UseGuards(PermissionGuard)
	@Post()
	create(@Body() createPropertyDto: CreatePropertyDto) {
		return this.propertiesService.create(createPropertyDto);
	}

	@ApiBearerAuth()
	@CheckPermissions(
		PermissionEnumList.publishProperty,
		PermissionEnumList.editProperty
	)
	@UseGuards(PermissionGuard)
	@Patch('upload-characteristics/:propertyId')
	uploadCharacteristics(
		@Body() uploadCharacteristicsDto: UploadCharacteristicsDto,
		@Param('propertyId') propertyId: string
	) {
		return this.propertiesService.uploadCharacteristics(
			propertyId,
			uploadCharacteristicsDto
		);
	}

	// @ApiBearerAuth()
	// @CheckPermissions(
	// 	PermissionEnumList.publishProperty,
	// 	PermissionEnumList.editProperty
	// )
	// @UseGuards(PermissionGuard)
	// @Patch('upload-multimedia/:propertyId')
	// @UseInterceptors(
	// 	FileFieldsInterceptor(
	// 		[
	// 			{
	// 				name: 'image',
	// 				maxCount: 1,
	// 			},
	// 			{
	// 				name: 'houseMap',
	// 				maxCount: 1,
	// 			},
	// 		],
	// 		{
	// 			limits: { fileSize: 25 * 300 * 300 },
	// 			storage: diskStorage({
	// 				filename: editPropertyFileName,
	// 				destination: './uploads/properties',
	// 			}),
	// 			fileFilter: imageFileFilter,
	// 		}
	// 	)
	// )
	// @ApiConsumes('multipart/form-data')
	// uploadImages(
	// 	@UploadedFiles() files: UploadMultimediaDto,
	// 	@Param('propertyId') propertyId: string,
	// 	@Body() body: UploadMultimediaDto
	// ) {
	// 	return this.propertiesService.uploadMultimedia(files, propertyId, body);
	// }

	@Patch('upload-multimedia/:propertyId')
	@UseInterceptors(FileInterceptor('file'))
	uploadImage(
		@UploadedFile() uploadCloudinaryDto: UploadCloudinaryDto,
		@Param('propertyId') propertyId: string,
		@Body() body: UploadCloudinaryDto
	) {
		return this.propertiesService.uploadImageToCloudinary(
			uploadCloudinaryDto,
			propertyId,
			body
		);
	}

	@Delete('delete-image/:propertyId')
	@UseInterceptors(FileInterceptor('file'))
	deleteImage(
		@Body() body: DeleteCloudinaryDto,
		@Param('propertyId') propertyId: string
	) {
		return this.propertiesService.deleteImageCloudinary(body, propertyId);
	}

	@Public()
	@ApiOperation({
		summary: 'Find all properties & by queries to',
	})
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	@ApiQuery({
		name: 'limit',
		required: true,
	})
	@ApiQuery({
		name: 'offset',
		required: true,
	})
	@Post('find-properties')
	findAllPropertyByQueries(
		@Query() pagination?: PaginationQueryDto,
		@Body() findOptions?: FindPropertyOptionsDto,
	) {
		return this.propertiesService.findAllPropertyByQueries(
			pagination,
			findOptions,
		);
	}

	@Public()
	@Get(':propertyId')
	findOne(@Param('propertyId') propertyId: string) {
		if (!propertyId) {
			throw new BadRequestException(
				'Por favor ingrese un id de propiedad válido'
			);
		}
		return this.propertiesService.findOneClient(propertyId);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeProperty)
	@UseGuards(PermissionGuard)
	@Get('real-estate/:branchOfficeId')
	findAllRealEstate(@Param('branchOfficeId') branchOfficeId: number) {
		return this.propertiesService.findAllRealEstate(branchOfficeId);
	}

	@ApiBearerAuth()
	@CheckPermissions(
		PermissionEnumList.publishProperty,
		PermissionEnumList.editProperty
	)
	@UseGuards(PermissionGuard)
	@Patch('basic-data/:propertyId')
	update(
		@Param('propertyId') propertyId: string,
		@Body() updatePropertyDto: UpdatePropertyDto
	) {
		return this.propertiesService.update(propertyId, updatePropertyDto);
	}

	@ApiBearerAuth()
	@CheckPermissions(
		PermissionEnumList.publishProperty,
		PermissionEnumList.editProperty
	)
	@UseGuards(PermissionGuard)
	@Patch('publish/:id')
	propertyPublished(
		@Param('id') id: string,
		@Body() status: PropertyPublishedStatusDto
	) {
		return this.propertiesService.publishProperty(id, status);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.deleteProperty)
	@UseGuards(PermissionGuard)
	@Delete('logical/:id')
	removeLogical(@Param('id') id: string) {
		return this.propertiesService.removeLogical(id);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.deleteProperty)
	@UseGuards(PermissionGuard)
	@Delete('phisical/:id')
	removePhisical(@Param('id') id: string) {
		return this.propertiesService.removePhisical(id);
	}

	@ApiBearerAuth()
	@CheckPermissions(
		PermissionEnumList.editProperty,
		PermissionEnumList.deleteProperty
	)
	@UseGuards(PermissionGuard)
	@Delete('delete-file/:propertyId/:imageId')
	editImages(
		@Param('propertyId') propertyId: string,
		@Param('imageId') imageId: string
	) {
		return this.propertiesService.deleteFile(propertyId, imageId);
	}
}
