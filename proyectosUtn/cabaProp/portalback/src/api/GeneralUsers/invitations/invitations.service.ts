import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitations } from './entities/invitation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvitationsService {
	constructor(
		@InjectRepository(Invitations)
		private readonly invitationRepository: Repository<Invitations>
	) {}

	async findOne(token: string) {
		const invitation = this.invitationRepository.findOne({
			where: {
				token: token,
			},
		});
		if (!invitation) {
			throw new NotFoundException('No se encontró la invitación especificada');
		}
		return invitation;
	}
}
