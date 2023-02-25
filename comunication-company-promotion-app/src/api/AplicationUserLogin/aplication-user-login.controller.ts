import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AplicationUserLoginService } from './aplication-user-login.service';
import { CreateAplicationUserLoginDto } from './dto/create-aplication-user-login.dto';
import { UpdateAplicationUserLoginDto } from './dto/update-aplication-user-login.dto';
import { errorsCatalog } from '../../common/errors-catalog';

@Controller('aplication-user-login')
export class AplicationUserLoginController {
  constructor(
    private readonly aplicationUserLoginService: AplicationUserLoginService,
  ) {}

  @Post()
  create(@Body() createAplicationUserLoginDto: CreateAplicationUserLoginDto) {
    try {
      return this.aplicationUserLoginService.create(
        createAplicationUserLoginDto,
      );
    } catch (err) {
      return {
        message: errorsCatalog.cantCreate,
        err,
      };
    }
  }

  @Get()
  findAll() {
    try {
      return this.aplicationUserLoginService.findAll();
    } catch (err) {
      return {
        message: errorsCatalog.cantFindAll,
        err,
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.aplicationUserLoginService.findOne(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantFindOne,
        err,
      };
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAplicationUserLoginDto: UpdateAplicationUserLoginDto,
  ) {
    try {
      return this.aplicationUserLoginService.update(
        id,
        updateAplicationUserLoginDto,
      );
    } catch (err) {
      return {
        message: errorsCatalog.cantFindAll,
        err,
      };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.aplicationUserLoginService.remove(+id);
    } catch (err) {
      return {
        message: errorsCatalog.cantFindOne,
        err,
      };
    }
  }
}
