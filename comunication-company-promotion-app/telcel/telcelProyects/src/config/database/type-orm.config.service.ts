import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Role } from 'src/api/Users/entities/role.entity';
import { User } from 'src/api/Users/entities/user.entity';
import { Document } from 'src/api/Documents/entities/document.entity';
import { EnvironmentVariablesService } from '../environment/environment.variables.service';
import { ApplicationUserClaim } from '../../api/AplicationUserClaim/entities/aplicationUserClaim.entity';
import { ApplicationUserLogin } from '../../api/AplicationUserLogin/entities/applicationUserLogin.entity';
import { Article } from '../../api/Article/entities/article.entity';
import { Campaing } from '../../api/Devices/entities/campaing.entity';
import { EvaluationAnswer } from '../../api/Evaluations/entities/evaluation-answer.entity';
import { EvaluationQuestion } from '../../api/Evaluations/entities/evaluation-question.entity';
import { DocumentType } from '../../api/Document-type/entities/document-type.entity';
import { CompletedUserPodcast } from '../../api/CompletedUserPodcast/entities/completed-user-podcast.entity';
import { Configuration } from '../../api/Configuration/entities/configuration.entity';
import { Controlaccess } from '../../api/Controlaccess/entities/controlaccess.entity';
import { ControlaccessTag } from '../../api/ControlaccessTag/entities/controlaccess-tag.entity';
import { Controlaccessdate } from '../../api/Controlaccessdates/entities/controlaccessdate.entity';
import { Course } from '../../api/Course/entities/course.entity';
import { CourseSurvey } from '../../api/CourseSurvey/entities/course-survey.entity';
import { Event } from '../../api/Event/entities/event.entity';
import { EventProvider } from '../../api/EventProvider/entities/event-provider.entity';
import { Gallery } from '../../api/Gallery/entities/gallery.entity';
import { OldUserPassword } from '../../api/OldUserPassword/entities/old-user-password.entity';
import { PreviousPassword } from '../../api/PreviousPassword/entities/previous-password.entity';
import { Provider } from '../../api/Provider/entities/provider.entity';
import { RetroUserAnswer } from '../../api/RetroUserAnswer/entities/retro-user-answer.entity';
import { Session } from '../../api/Session/entities/session.entity';
import { Survey } from '../../api/Survey/entities/survey.entity';
import { SurveyDocument } from '../../api/SurveyDocument/entities/survey-document.entity';
import { TagsConfig } from '../../api/TagsConfig/entities/tags-config.entity';
import { TestUserAnswer } from '../../api/TestUserAnswer/entities/test-user-answer.entity';
import { UserAnswer } from '../../api/UserAnswer/entities/user-answer.entity';
import { __Migrationhistory } from 'src/api/__migrationhistory/entities/__migrationhistory.entity';
import { Image } from 'src/api/Image/entities/image.entity';
import { Notification } from 'src/api/Notification/entities/notification.entity';
import { Podcast } from '../../api/Podcast/entities/podcast.entity';
import { Video } from 'src/api/Video/entities/video.entity';
import { UserToken } from 'src/api/Users/entities/user-token.entity';
import { CampaingDocument } from 'src/api/Devices/entities/campaingDocument.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: EnvironmentVariablesService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mssql',
      host: this.config.getDatabaseHost(),
      port: this.config.getDatabasePort(),
      username: this.config.getDatabaseUsername(),
      password: this.config.getDatabasePassword(),
      database: this.config.getDatabaseName(),
      entities: [
        __Migrationhistory,
        ApplicationUserClaim,
        ApplicationUserLogin,
        Article,
        Campaing,
        CampaingDocument,
        CompletedUserPodcast,
        Configuration,
        Controlaccess,
        ControlaccessTag,
        Controlaccessdate,
        Course,
        CourseSurvey,
        Document,
        DocumentType,
        EvaluationAnswer,
        EvaluationQuestion,
        Event,
        EventProvider,
        Gallery,
        Image,
        Notification,
        OldUserPassword,
        Podcast,
        PreviousPassword,
        Provider,
        RetroUserAnswer,
        Role,
        Session,
        Survey,
        SurveyDocument,
        TagsConfig,
        TestUserAnswer,
        UserAnswer,
        User,
        Video,
        UserToken,
      ],
      autoLoadEntities: true,
      synchronize: false,
      options: {
        encrypt: true,
      },
      extra: {
        trustServerCertificate: true,
      },
    };
  }
}
