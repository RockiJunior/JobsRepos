import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { diskStorage } from 'multer';
import * as moment from 'moment';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileDocument } from './dto/file-document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMINISTRADOR } from '../../common/constants';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { errorsCatalog } from '../../common/errors-catalog';
import { Request } from 'express';
import { HttpStatus } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Upload files to Documents entity',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateDocumentDto,
    description: 'Successs Response',
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `${process.env.FILE_STORAGE}/pdf`,
        filename: (req, file, cb) => {
          return cb(
            null,
            'DOC-' + moment().utc().format('yyMMDDHHmmss') + '.pdf',
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype == 'application/pdf') {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .pdf format allowed!'), false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFile() file: FileDocument,
    @Body() data: CreateDocumentDto,
    @Req() req: Request,
  ) {
    try {
      const user = req['user'];
      return this.documentsService.create(file, data, user);
    } catch (err) {
      return {
        message: errorsCatalog.cantCreate,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Updates an existing document',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateDocumentDto,
    description: 'Successs Response',
  })
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `${process.env.FILE_STORAGE}/pdf`,
        filename: (req, file, cb) => {
          return cb(
            null,
            'DOC-' + moment().utc().format('yyMMDDHHmmss') + '.pdf',
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype == 'application/pdf') {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .pdf format allowed!'), false);
        }
      },
    }),
  )
  updateDocument(
    @Param('id') id: string,
    @UploadedFile() file: FileDocument,
    @Body() data: UpdateDocumentDto,
  ) {
    try {
      return this.documentsService.update(id, file, data);
    } catch (err) {
      return {
        message: errorsCatalog.cantUpdate,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Gets documents by type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successs Response',
  })
  @Get()
  findByType(@Query('type') type: number) {
    try {
      return this.documentsService.findByType(type);
    } catch (err) {
      return {
        message: `Can't find document`,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Gets documents by device Id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successs Response',
  })
  @Get('documents-by-device/:id')
  documentsByDevice(@Param('id') id: string) {
    try {
      return this.documentsService.documentsByDeviceId(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantFindById,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Removes document',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successs Response',
  })
  @Delete(':id')
  removeDocument(@Param('id') id: string) {
    try {
      return this.documentsService.removeDocument(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantRemove,
        err,
      };
    }
  }
}
