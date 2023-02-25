import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentVariablesService } from './environment.variables.service';

describe('Environment Variables Service', () => {
  let environmentVariablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EnvironmentVariablesService,
          useValue: new EnvironmentVariablesService('.env.test'),
        },
      ],
    }).compile();

    environmentVariablesService = module.get<EnvironmentVariablesService>(
      EnvironmentVariablesService,
    );
  });

  it('Should be defined', () => {
    expect(environmentVariablesService).toBeDefined();
  });

  it('Environment not exist', async () => {
    try {
      await EnvironmentVariablesService.validateInput();
    } catch (error) {
      expect(error.message).toEqual(
        'Config validation error: "DB_NAME" is required',
      );
    }
  });

  it('Get specific key', () => {
    const DB_HOST = environmentVariablesService.get('DB_HOST');
    expect(DB_HOST).toEqual(expect.anything());
  });

  it('Get NodeEnv', () => {
    const NodeEnv = environmentVariablesService.getNodeEnv();
    expect(NodeEnv).toEqual(expect.anything());
  });

  it('Get Port', () => {
    const Port = environmentVariablesService.getPort();
    expect(Port).toEqual(expect.anything());
  });

  it('Get DatabaseHost', () => {
    const DatabaseHost = environmentVariablesService.getDatabaseHost();
    expect(DatabaseHost).toEqual(expect.anything());
  });

  it('Get DatabasePort', () => {
    const DatabasePort = environmentVariablesService.getDatabasePort();
    expect(DatabasePort).toEqual(expect.anything());
  });

  it('Get DatabaseUserName', () => {
    const DatabaseUserName = environmentVariablesService.getDatabaseUsername();
    expect(DatabaseUserName).toEqual(expect.anything());
  });

  it('Get DatabasePassword', () => {
    const DatabasePassword = environmentVariablesService.getDatabasePassword();
    expect(DatabasePassword).toEqual(expect.anything());
  });

  it('Get DatabaseName', () => {
    const DatabaseName = environmentVariablesService.getDatabaseName();
    expect(DatabaseName).toEqual(expect.anything());
  });

  it('Get SecretJWT', () => {
    const SecretJWT = environmentVariablesService.getSecretJWT();
    expect(SecretJWT).toEqual(expect.anything());
  });

  it('Get ExpiresInJWT', () => {
    const ExpiresInJWT = environmentVariablesService.getExpiresJWT();
    expect(ExpiresInJWT).toEqual(expect.anything());
  });
});
