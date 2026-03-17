import { Module } from '@nestjs/common'
//global env
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core'

import { PrismaModule } from '@/prisma/prisma.module'
import { AuthModule } from '@/auth/auth.module'
import { UsersModule } from '@/users/users.module'
//import { DashboardModule } from '@/dashboard/dashboard.module'
 
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { PermissionsGuard } from '@/common/guards/permissions.guard'

@Module({
  imports: [
    //must be imported in import
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
   // DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}