// app.module.ts
import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { FestaModule } from './festa/festa.module'
import { PessoasModule } from './pessoa/pessoa.module'

@Module({
    imports: [PrismaModule, PessoasModule, FestaModule]
})
export class AppModule {}
