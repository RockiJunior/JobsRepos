import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Ip,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UploadedFile,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import {
	FileFieldsInterceptor,
	FileInterceptor,
} from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import csv from 'csvtojson';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { Public } from 'src/api/GeneralUsers/auth/decorators/public.decorator';
import { PermissionEnumList } from 'src/config/enum-types';
import { CheckPermissions } from '../../GeneralUsers/auth/decorators/permission.decorator';
import { PermissionGuard } from '../../GeneralUsers/auth/guards/permission-guard';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FindPropertiesAdmin } from './dto/find-properties-admin.dto';
import { FindPropertyOptionsDto } from './dto/find-property-options.dto';
import { PaginationQueryBranchOfficeDto } from './dto/pagination-query-branchOffice.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PropertyPublishedStatusDto } from './dto/property-published-status.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UploadCsvDto } from './dto/upload-csv.dto';
import { UploadMultimediaDto } from './dto/upload-multimedia.dto';
import { UploadCharacteristicsDto } from './dto/uploadCharacteristics.dto';
import { editPropertyFileName } from './multerFunctions/edit-property-file-name';
import { imageFileFilter } from './multerFunctions/image-file-filter';
import { PropertiesService } from './properties.service';
import * as jwt from 'jsonwebtoken';

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

	@ApiBearerAuth()
	@CheckPermissions(
		PermissionEnumList.publishProperty,
		PermissionEnumList.editProperty
	)
	@UseGuards(PermissionGuard)
	@Patch('upload-multimedia/:propertyId')
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{
					name: 'image',
					maxCount: 1,
				},
				{
					name: 'houseMap',
					maxCount: 1,
				},
			],
			{
				limits: { fileSize: 25 * 800 * 600 },
				storage: diskStorage({
					filename: editPropertyFileName,
					destination: './uploads/properties',
				}),
				fileFilter: imageFileFilter,
			}
		)
	)
	@ApiConsumes('multipart/form-data')
	uploadImages(
		@UploadedFiles() files: UploadMultimediaDto,
		@Param('propertyId') propertyId: string,
		@Body() body: UploadMultimediaDto
	) {
		return this.propertiesService.uploadMultimedia(files, propertyId, body);
	}

	@Delete('delete-image/:propertyId')
	deleteImage(@Body() body: any, @Param('propertyId') propertyId: string) {
		return this.propertiesService.deleteFile(propertyId, body);
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
		name: 'realEstateId',
		required: false,
	})
	@ApiQuery({
		name: 'limit',
		required: true,
	})
	@ApiQuery({
		name: 'offset',
		required: true,
	})
	@ApiQuery({
		name: 'orderBy',
		required: false,
	})
	@ApiQuery({
		name: 'sort',
		required: false,
	})
	@Post('find-properties')
	findAllPropertyByQueries(
		@Query() pagination?: PaginationQueryDto,
		@Body() findOptions?: FindPropertyOptionsDto
	) {
		return this.propertiesService.findAllPropertyByQueries(
			pagination,
			findOptions
		);
	}

	@Public()
	@Get(':propertyId')
	findOne(@Req() req: Request, @Param('propertyId') propertyId: string) {
		// ------------------------------------------------------------- get request data
		let userId: string;
		let ipAddress = req.headers['x-forwarded-for'];
		let navigator = req.headers['sec-ch-ua'];
		let origin = req.headers.origin;
		let operationSystem = req.headers['sec-ch-ua-platform'];
		let auth = req.headers['authorization'];
	
		if (!navigator) {
			navigator = '"test-local"- without proxy configuration';
		}
		if (!operationSystem) {
			operationSystem = '"test-local"- without proxy configuration';
		}
		if (!origin) {
			origin = '"test-local"- without proxy configuration';
		}
		if (!ipAddress) {
			ipAddress = `"local"- without proxy configuration`;
		}
		if (auth !== undefined && auth !== null) {
			const token = auth.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			userId = decoded['id'];
		}
		let obj = {
			userId,
			ipAddress,
			navigator,
			origin,
			operationSystem,
		};
		return this.propertiesService.findOneProperty(propertyId, obj);
	}

	@ApiBearerAuth()
	@CheckPermissions(
		PermissionEnumList.publishProperty,
		PermissionEnumList.editProperty,
		PermissionEnumList.deleteProperty
	)
	@UseGuards(PermissionGuard)
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
	@ApiQuery({
		name: 'field',
		required: false,
	})
	@Post('branch-office')
	findPropertiesByBranchOffice(
		@Body() body: FindPropertiesAdmin,
		@Query() pagination?: PaginationQueryBranchOfficeDto
	) {
		return this.propertiesService.findPropertiesByBranchOffice(
			body,
			pagination
		);
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

	@ApiBearerAuth()
	@CheckPermissions(
		PermissionEnumList.publishProperty,
		PermissionEnumList.editProperty,
		PermissionEnumList.deleteProperty
	)
	@UseGuards(PermissionGuard)
	@Post('upload-by-csv')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiOperation({
		summary: `Uploads Properties`,
	})
	@ApiResponse({
		status: 200,
		description: 'Success Response',
	})
	@ApiResponse({
		type: BadRequestException,
		description: 'Try to fix or fill empty fields',
	})
	async uploadMultiplePropertiesByCsv(
		@UploadedFile() file: Express.Multer.File,
		@Body() body: UploadCsvDto,
		@Req() req: Request
	) {
		const user = req['user'];
		const rawData = (file['buffer'] as Buffer).toString();
		const data = await csv({
			headers: [
				'ID',
				'DESCRIPCION',
				'ESTADO',
				'TITULO',
				'IMAGENES',
				'PLANOS',
				'VIDEO',
				'VIDEO360',
				'MONEDA',
				'PRECIO TOTAL',
				'TIPO DE OPERACION',
				'TIPO DE PROPIEDAD',
				'CALLE',
				'ALTURA/NUMERO',
				'BARRIO',
				'CODIGO POSTAL',
				'SUFIJO CODIGO POSTAL',
				'LOCALIDAD',
				'SUPERFICIE TOTAL',
				'SUPERFICIE CUBIERTA',
				'ANTIGUEDAD',
				'AÑOS DE ANTIGUEDAD',
				//  -------------------------------- characteristics
				'AMBIENTES',
				'DORMITORIOS',
				'BAÑOS',
				'BAÑOS PRIVADOS',
				'TOILETTES',
				'GARAGES',
				'PISOS',
				'GARAGE CUBIERTO',
				'ELEVADOR',
				'COCHERA BAJO TIERRA',
				'COCHERA DE EDIFICO',
				// ---------------------------------- EXTRAS
				// ---------------------------------- generalCharacteristics
				'ACCESO P/PERSONAS C/DISCAPACIDAD',
				'PARRILLA',
				'SOLARIUM',
				'APTO PROFESIONAL',
				'PERMITE MASCOTAS',
				'USO COMERCIAL',
				'GIMNASIO',
				'PILETA',
				'HIDROMASAJE',
				'SALA DE JUEGOS',
				// ---------------------------------- characteristics
				'AIRE ACONDICIONADO',
				'COCINA EQUIPADA',
				'SUM',
				'ALARMA',
				'FRIGOBAR',
				'SAUNA',
				'AMOBLADO',
				'LAVARROPAS',
				'SECARROPAS',
				'CALDERA',
				'LAVAVAJILLAS',
				'TERMOTANQUE',
				'CALEFACCION',
				'MICROONDAS',
				'VIGILANCIA',
				'CANCHA DEPORTES',
				'QUINCHO',
				'PLAZA DE MANIOBRAS',
				'GRUA',
				'FUERZA MOTRIZ',
				'MOTORES',
				'GRUPO ELECTROGENO',
				'ASCENSOR',
				// ---------------------------------- services
				'CAJA FUERTE',
				'LAUNDRY',
				'INTERNET',
				'WIFI',
				'CABLE',
				// ---------------------------------- ambience
				'BALCON',
				'DORMITORIO EN SUITE',
				'LIVING COMEDOR',
				'BAULERA',
				'ESCRITORIO',
				'PATIO',
				'COCINA',
				'HALL',
				'SOTANO',
				'COMEDOR',
				'JARDIN',
				'TERRAZA',
				'COMEDOR DE DIARIO',
				'LAVADERO',
				'TOILLETE',
				'DEPENCIA DE SERVICIO',
				'LIVING',
				'VESTIDOR',
				'OFICINAS',
				'VESTUARIOS',
			],
		}).fromString(rawData);

		return this.propertiesService.uploadMultiplePropertiesByCsv(
			user,
			data,
			body
		);
	}
}
