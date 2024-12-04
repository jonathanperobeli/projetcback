import { Module } from '@nestjs/common'
import { FestaService } from './festa.service'
import { FestaController } from './festa.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    controllers: [FestaController],
    providers: [FestaService, PrismaService]
})
export class FestaModule {}
