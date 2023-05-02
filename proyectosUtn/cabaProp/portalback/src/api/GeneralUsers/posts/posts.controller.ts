import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPermissions } from '../auth/decorators/permission.decorator';
import { PermissionEnumList } from '../../../config/enum-types';
import { PermissionGuard } from '../auth/guards/permission-guard';
import { PostsPaginationDto } from './dto/posts-pagination.dto';
import { DeletePostDto } from './dto/delete-post.dto';

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
	@ApiQuery({
		name: 'offset',
		required: false,
	})
	@ApiQuery({
		name: 'limit',
		required: true,
	})
	@Get('get-by-client/:clientId')
	findAllByClientId(
		@Query() pagination: PostsPaginationDto,
		@Param('clientId') clientId: string
	) {
		return this.postsService.findAllByClientId(clientId, pagination);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get('get-by-post/:postId')
	findOne(@Param('postId') postId: number) {
		return this.postsService.findOne(postId);
	}

	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Delete(':clientId')
	remove(
		@Body() deletePostDto: DeletePostDto,
		@Param('clientId') clientId: string
	) {
		return this.postsService.remove(clientId, deletePostDto);
	}
}
