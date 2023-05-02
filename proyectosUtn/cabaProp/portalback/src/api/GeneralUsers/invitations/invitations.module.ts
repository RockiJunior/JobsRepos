import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitations } from './entities/invitation.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Invitations])],
	controllers: [InvitationsController],
	providers: [InvitationsService],
	exports: [InvitationsService],
})
export class InvitationsModule {}
