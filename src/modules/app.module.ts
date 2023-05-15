import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthModule } from './auth.module';
import { CategoryModule } from './category.module';
import { EntryModule } from './entry.module';
import { UserModule } from './user.module';
import { EventsGateway } from 'src/services/events.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_ATLAS_URL),
    AuthModule,
    UserModule,
    EntryModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
