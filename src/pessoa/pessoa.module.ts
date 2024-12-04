import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { PessoasController } from './pessoa.controller'
import { PessoasService } from './pessoa.service'

@Module({
    imports: [PrismaModule],
    providers: [PessoasService],
    controllers: [PessoasController]
})
export class PessoasModule {}
