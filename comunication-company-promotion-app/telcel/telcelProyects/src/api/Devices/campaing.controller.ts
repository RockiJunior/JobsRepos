import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CampaingService } from './campaing.service';
import { CreateCampaingDto } from './dto/create-campaing.dto';
import { UpdateCampaingDto } from './dto/update-campaing.dto';
import { errorsCatalog } from '../../common/errors-catalog';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMINISTRADOR } from '../../common/constants';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('devices')
@Controller('devices')
export class CampaingController {
  constructor(private readonly campaingService: CampaingService) {}

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Creates new campaing',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateCampaingDto,
    description: 'Success Response',
  })
  @Post()
  create(@Body() createCampaingDto: CreateCampaingDto) {
    try {
      return this.campaingService.create(createCampaingDto);
    } catch (err) {
      return {
        message: errorsCatalog.cantCreate,
        err,
      };
    }
  }

  @ApiOperation({
    summary: 'Gets campaing by status on true',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    description: 'Success Response',
  })
  @Get()
  async findByStatus() {
    try {
      return this.campaingService.findByStatus();
    } catch (err) {
      return {
        message: errorsCatalog.cantFindAll,
        err,
      };
    }
  }

  @ApiOperation({
    summary: 'Gets a specific campaing',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Get('find-by-id/:id')
  findOne(@Param('id') id: string) {
    try {
      return this.campaingService.findOne(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantFindOne,
        err,
      };
    }
  }

  @ApiOperation({
    summary: 'Updates a specific campaing',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaingDto: UpdateCampaingDto,
  ) {
    try {
      return this.campaingService.update(id, updateCampaingDto);
    } catch (err) {
      return {
        message: errorsCatalog.cantUpdate,
        err,
      };
    }
  }


  @ApiOperation({
    summary: 'Removes a specific campaing',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Delete(':id')
  remove(@Param('id') id: string){
    try{
      return this.campaingService.remove(id);
    }catch(err){
      return {
        message: errorsCatalog.cantDelete,
        err,
      }
    }
  }
}
