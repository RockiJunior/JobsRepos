import { EnvironmentVariablesService } from '../../environment/environmentVariables.service';
import { Injectable } from '@nestjs/common';
import * as i18n from 'i18n';

@Injectable()
export class LanguageService {
  private readonly defaultlocale: string;

  constructor(config: EnvironmentVariablesService) {
    i18n.configure({
      locales: config.getLocales(),
      defaultLocale: config.getDefaultLocale(),
      directory: `${process.cwd()}/src/config/languages`,
    });

    this.defaultlocale = config.getDefaultLocale();
  }

  getLanguageTranslation() {
    return require(`${process.cwd()}/src/config/languages/${this.defaultlocale}.js`);
  }
}
