import { Module, Global, Logger } from '@nestjs/common';
import { EnvironmentVariablesService } from './environmentVariables.service';

Logger.log(`Mode: ${process.env.NODE_ENV || 'development'}`);

@Global()
@Module({
  providers: [
    {
      provide: EnvironmentVariablesService,
      useValue: new EnvironmentVariablesService(process.env.NODE_ENV === 'test' ? '.env.test' : '.env'),
    },
  ],
  
  exports: [EnvironmentVariablesService],
})
export class EnvironmentVariablesModule {}
