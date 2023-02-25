import { PartialType } from '@nestjs/swagger';
import { CreateBranchOfficeDto } from './create-branch-office.dto';

export class UpdateBranchOfficeDto extends PartialType(CreateBranchOfficeDto) {}
