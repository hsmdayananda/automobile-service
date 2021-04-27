import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AutomobileModule } from './automobile/automobile.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';



@Module({
  imports: [TypeOrmModule.forRoot(), AutomobileModule,
  GraphQLModule.forRoot({
    typePaths: ['./**/*.graphql'],
    definitions: {
      path: join(process.cwd(), 'src/graphql.ts'),
    },
    context: ({ req, res }) => ({ headers: req.headers, res }),
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
