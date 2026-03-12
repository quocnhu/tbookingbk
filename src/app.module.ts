import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { PrismaModule } from '@/prisma/prisma.module'
import { AuthModule } from '@/auth/auth.module'
import { UsersModule } from '@/users/users.module'
//import { DashboardModule } from '@/dashboard/dashboard.module'
 
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { PermissionsGuard } from '@/common/guards/permissions.guard'

@Module({
  imports: [
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