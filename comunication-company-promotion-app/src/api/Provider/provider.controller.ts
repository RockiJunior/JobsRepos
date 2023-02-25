import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ADMINISTRADOR } from '../../common/constants';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { errorsCatalog } from '../../common/errors-catalog';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as moment from 'moment';
import { Request } from 'express';
import { ImageProvider } from './dto/image-provider.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('provider')
@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @ApiOperation({
    summary: 'Upload a provider',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateProviderDto,
    description: 'Successs Response',
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `${process.env.FILE_STORAGE}/provider`,
        filename: (req, file, cb) => {
          return cb(
            null,
            'DOC-' + moment().utc().format('yyMMDDHHmmss') + '.png',
          );
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFile() image: ImageProvider,
    @Body() data: CreateProviderDto,
    @Req() req: Request,
  ) {
    try {
      const user = req['user'];
      return this.providerService.create(image, data, user);
    } catch (err) {
      return {
        message: errorsCatalog.cantCreate,
        err,
      };
    }
  }

  @ApiOperation({
    summary: 'Gets all providers',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successs Response',
  })
  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    try {
      return this.providerService.findAll();
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
    return this.providerService.findOne(+id);
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providerService.update(+id, updateProviderDto);
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerService.remove(+id);
  }
}
