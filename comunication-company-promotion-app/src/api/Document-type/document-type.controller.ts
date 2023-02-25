import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { errorsCatalog } from '../../common/errors-catalog';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ADMINISTRADOR } from '../../common/constants';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('document-type')
@Controller('document-type')
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) {}

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypeService.create(createDocumentTypeDto);
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'get documents-type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    description: 'Success Response',
  })
  @Get()
  findAll() {
    try {
      return this.documentTypeService.findAll();
    } catch (err) {
      return {
        message: errorsCatalog.cantFindAll,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentTypeService.findOne(+id);
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
  ) {
    return this.documentTypeService.update(+id, updateDocumentTypeDto);
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentTypeService.remove(+id);
  }
}
