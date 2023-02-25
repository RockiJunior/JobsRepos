import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './config/database/type-orm.config.service';
import { EnvironmentVariablesModule } from './config/environment/environment.variables.module';
import { AuthModule } from './auth/auth.module';
import { AplicationUserClaimModule } from './api/AplicationUserClaim/aplication-user-claim.module';
import { AplicationUserLoginModule } from './api/AplicationUserLogin/aplication-user-login.module';
import { DocumentsModule } from './api/Documents/documents.module';
import { EvaluationsModule } from './api/Evaluations/evaluation.module';
import { ArticleModule } from './api/Article/article.module';
import { CampaingModule } from './api/Devices/campaing.module';
import { DocumentTypeModule } from './api/Document-type/document-type.module';
import { CompletedUserPodcastModule } from './api/CompletedUserPodcast/completed-user-podcast.module';
import { ConfigurationModule } from './api/Configuration/configuration.module';
import { ControlaccessModule } from './api/Controlaccess/controlaccess.module';
import { ControlaccessTagModule } from './api/ControlaccessTag/controlaccess-tag.module';
import { ControlaccessdatesModule } from './api/Controlaccessdates/controlaccessdates.module';
import { CourseModule } from './api/Course/course.module';
import { CourseSurveyModule } from './api/CourseSurvey/course-survey.module';
import { EventModule } from './api/Event/event.module';
import { EventProviderModule } from './api/EventProvider/event-provider.module';
import { GalleryModule } from './api/Gallery/gallery.module';
import { ImageModule } from './api/Image/image.module';
import { NotificationModule } from './api/Notification/notification.module';
import { OldUserPasswordModule } from './api/OldUserPassword/old-user-password.module';
import { PreviousPasswordModule } from './api/PreviousPassword/previous-password.module';
import { ProviderModule } from './api/Provider/provider.module';
import { RetroUserAnswerModule } from './api/RetroUserAnswer/retro-user-answer.module';
import { SessionModule } from './api/Session/session.module';
import { SurveyModule } from './api/Survey/survey.module';
import { SurveyDocumentModule } from './api/SurveyDocument/survey-document.module';
import { TagsConfigModule } from './api/TagsConfig/tags-config.module';
import { TestUserAnswerModule } from './api/TestUserAnswer/test-user-answer.module';
import { UserAnswerModule } from './api/UserAnswer/user-answer.module';
import { SysdiagramsModule } from './api/Sysdiagrams/sysdiagrams.module';
import { UsersModule } from './api/Users/users.module';
import { MigrationhistoryModule } from './api/__migrationhistory/__migrationhistory.module';
import { PodcastModule } from './api/Podcast/podcast.module';
import { VideoModule } from './api/Video/video.module';

@Module({
  imports: [
    EnvironmentVariablesModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UsersModule,
    AplicationUserClaimModule,
    AplicationUserLoginModule,
    DocumentsModule,
    DocumentTypeModule,
    EvaluationsModule,
    ArticleModule,
    CampaingModule,
    CompletedUserPodcastModule,
    ConfigurationModule,
    ControlaccessModule,
    ControlaccessTagModule,
    ControlaccessdatesModule,
    CourseModule,
    CourseSurveyModule,
    EventModule,
    EventProviderModule,
    GalleryModule,
    ImageModule,
    NotificationModule,
    OldUserPasswordModule,
    PreviousPasswordModule,
    ProviderModule,
    RetroUserAnswerModule,
    SessionModule,
    SurveyModule,
    SurveyDocumentModule,
    TagsConfigModule,
    TestUserAnswerModule,
    UserAnswerModule,
    SysdiagramsModule,
    UsersModule,
    MigrationhistoryModule,
    PodcastModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
