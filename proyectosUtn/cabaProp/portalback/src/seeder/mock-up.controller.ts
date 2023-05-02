import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { MockUpService } from './mock-up.service';

@Controller('mock-up')
export class MockUpController {
	constructor(private readonly mockUpService: MockUpService) {}
}
