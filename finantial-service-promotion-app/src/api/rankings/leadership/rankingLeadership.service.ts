import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RankingLeadership } from 'src/common/database_entities/rankingLeadership.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { RankingLeadershipPatchDTO } from '../dto/rankingsLeadership.path.dto';

@Injectable()
export class RankingLeadershipService {
    constructor(
        @InjectRepository(RankingLeadership) private rankingsIndividualsRepository: Repository<RankingLeadership>,
    ) { }

    async findAll() {
        const result = await this.rankingsIndividualsRepository.find();
        return result;
    }

    async findById(id: string) {
        const result = await this.rankingsIndividualsRepository.findOne(id);
        return result;
    }

    async updateRanking(ranking: RankingLeadershipPatchDTO) {
        const result = await this.rankingsIndividualsRepository.update(ranking.id, ranking);
        return result;
    }

    async updateRankingById(id: string, ranking: RankingLeadershipPatchDTO) {
        const result = await this.rankingsIndividualsRepository.update(id, ranking);
        return result;
    }

}
