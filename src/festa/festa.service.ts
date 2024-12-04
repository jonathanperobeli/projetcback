// Regra de negócio

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Festa } from '@prisma/client'
import { CreateFestaDto } from './dto/create-festa.dto'
import { UpdateFestaDto } from './dto/atualizar-festa.dto'

@Injectable()
export class FestaService {
    constructor(private readonly prisma: PrismaService) {}

    // Criar Festa
    // DTO para mandar o corpo correto da requisição
    async create(data: CreateFestaDto): Promise<Festa> {
        const festaData = {
            nome: data.nome,
            data: new Date(data.data)
        }

        return this.prisma.festa.create({
            data: festaData
        })
    }

    // Pegar todas as Festas
    async findAll(): Promise<Festa[]> {
        return this.prisma.festa.findMany()
    }

    // Pegar uma festa
    async findOne(id: number): Promise<Festa> {
        return this.prisma.festa.findUnique({
            where: { id }
        })
    }

    // Atualizar festa
    async update(id: number, data: UpdateFestaDto): Promise<Festa> {
        const festaData: Partial<Festa> = {
            ...data,
            data: data.data ? new Date(data.data) : undefined
        }

        return this.prisma.festa.update({
            where: { id },
            data: festaData
        })
    }

    // Deletar uma festa
    async delete(id: number): Promise<Festa> {
        return this.prisma.festa.delete({
            where: { id }
        })
    }
}
