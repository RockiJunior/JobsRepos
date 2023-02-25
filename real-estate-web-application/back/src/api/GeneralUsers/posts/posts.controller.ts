import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { PermissionEnumList } from '../../../config/enum-types';
import { PermissionGuard } from '../auth/guards/permission-guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Post(':clientId')
	create(
		@Body() createPostDto: CreatePostDto,
		@Param('clientId') clientId: string
	) {
		return this.postsService.create(createPostDto, clientId);
	}

	@ApiBearerAuth()
	@CheckPermissions(PermissionEnumList.seeUsers)
	@UseGuards(PermissionGuard)
	@Get()
	findAll() {
		return this.postsService.findAll();
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get('get-by-client/:clientId')
	findAllByClientId(@Param('clientId') clientId: string) {
		return this.postsService.findAllByClientId(clientId);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get('get-by-post/:postId')
	findOne(@Param('postId') postId: number) {
		return this.postsService.findOne(postId);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.postsService.remove(id);
	}
}
