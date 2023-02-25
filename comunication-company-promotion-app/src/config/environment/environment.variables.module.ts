import { Global, Module } from '@nestjs/common';
import { EnvironmentVariablesService } from './environment.variables.service';

@Global()
@Module({
  providers: [
    {
      provide: EnvironmentVariablesService,
      useValue: new EnvironmentVariablesService(
        process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      ),
    },
  ],
  exports: [EnvironmentVariablesService],
})
export class EnvironmentVariablesModule {}
