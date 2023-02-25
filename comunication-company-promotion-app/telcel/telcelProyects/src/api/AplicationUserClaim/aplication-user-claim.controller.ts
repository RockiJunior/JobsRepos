import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AplicationUserClaimService } from './aplication-user-claim.service';
import { CreateAplicationUserClaimDto } from './dto/create-aplication-user-claim.dto';
import { UpdateAplicationUserClaimDto } from './dto/update-aplication-user-claim.dto';
import { errorsCatalog } from '../../common/errors-catalog';

@Controller('aplication-user-claim')
export class AplicationUserClaimController {
  constructor(
    private readonly aplicationUserClaimService: AplicationUserClaimService,
  ) {}

  @Post()
  create(@Body() createAplicationUserClaimDto: CreateAplicationUserClaimDto) {
    try {
      return this.aplicationUserClaimService.create(
        createAplicationUserClaimDto,
      );
    } catch (err) {
      return {
        message: errorsCatalog.cantCreate,
      };
    }
  }

  @Get()
  findAll() {
    try {
      return this.aplicationUserClaimService.findAll();
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
      return this.aplicationUserClaimService.findOne(id);
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
    @Body() updateAplicationUserClaimDto: UpdateAplicationUserClaimDto,
  ) {
    try {
      return this.aplicationUserClaimService.update(
        id,
        updateAplicationUserClaimDto,
      );
    } catch (err) {
      return {
        message: errorsCatalog.cantUpdate,
        err,
      };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.aplicationUserClaimService.remove(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantRemove,
        err,
      };
    }
  }
}
