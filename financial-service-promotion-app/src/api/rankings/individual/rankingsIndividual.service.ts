import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RankingIndividual } from 'src/common/database_entities/rankingIndividual.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { RankingIndividualPatchDTO } from '../dto/rankingsIndividual.patch.dto';

@Injectable()
export class RankingIndividualService {
  constructor(
    @InjectRepository(RankingIndividual) private rankingsIndividualsRepository: Repository<RankingIndividual>,
  ) {}

  async findAll() {
    const result = await this.rankingsIndividualsRepository.find();
    return result;
  }

  async findAllForLevel() {
    const result = await this.rankingsIndividualsRepository.find({
      where: {
        level: Not(IsNull()),
      },
    });
    return result;
  }

  async findAllForScore() {
    const result = await this.rankingsIndividualsRepository.find({
      where: {
        activity: Not(IsNull()),
      },
    });
    return result;
  }

  async findById(id: string) {
    const result = await this.rankingsIndividualsRepository.findOne(id);
    return result;
  }

  async updateRankingById(id: string, ranking: RankingIndividualPatchDTO) {
    try {
      await this.rankingsIndividualsRepository.update(id, ranking);
      return { message: 'Cambio realizado con éxito.' };
    } catch (err) {
      console.log(err);
    }
  }
}
