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
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { errorsCatalog } from '../../common/errors-catalog';
import { HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMINISTRADOR } from '../../common/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as moment from 'moment';
import { FileArticle } from './dto/file-article.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Upload files to Documents entity',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateArticleDto,
    description: 'Successs Response',
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `${process.env.FILE_STORAGE}/article`,
        filename: (req, file, cb) => {
          return cb(
            null,
            'DOC-' + moment().utc().format('yyMMDDHHmmss') + '.pdf',
          );
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFile() image: FileArticle,
    @Body() data: CreateArticleDto,
    @Req() req: Request,
  ) {
    try {
      const user = req['user'];
      return this.articleService.create(image, data, user);
    } catch (err) {
      return {
        message: errorsCatalog.cantCreate,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    try {
      return this.articleService.findAll();
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
    try {
      return this.articleService.findOne(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantFindOne,
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
    type: UpdateArticleDto,
    description: 'Successs Response',
  })
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `${process.env.FILE_STORAGE}/article`,
        filename: (req, file, cb) => {
          return cb(
            null,
            'DOC-' + moment().utc().format('yyMMDDHHmmss') + '.pdf',
          );
        },
      }),
    }),
  )
  updateDocument(
    @Param('id') id: string,
    @UploadedFile() image: FileArticle,
    @Body() data: UpdateArticleDto,
    @Req() req: Request,
  ) {
    try {
      const user = req['user'];
      return this.articleService.update(id, image, data, user);
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
    summary: 'Removes an Article',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.articleService.remove(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantRemove,
        err,
      };
    }
  }
}
