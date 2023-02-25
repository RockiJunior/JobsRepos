import { Injectable } from '@nestjs/common';
import { CreateAplicationUserClaimDto } from './dto/create-aplication-user-claim.dto';
import { UpdateAplicationUserClaimDto } from './dto/update-aplication-user-claim.dto';

@Injectable()
export class AplicationUserClaimService {
  create(createAplicationUserClaimDto: CreateAplicationUserClaimDto) {
    return 'This action adds a new aplicationUserClaim';
  }

  findAll() {
    return `This action returns all aplicationUserClaim`;
  }

  findOne(id: string) {
    return `This action returns a #${id} aplicationUserClaim`;
  }

  update(
    id: string,
    updateAplicationUserClaimDto: UpdateAplicationUserClaimDto,
  ) {
    return `This action updates a #${id} aplicationUserClaim`;
  }

  remove(id: string) {
    return `This action removes a #${id} aplicationUserClaim`;
  }
}
