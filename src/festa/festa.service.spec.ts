import { Test, TestingModule } from '@nestjs/testing'
import { FestaService } from './festa.service'
import { PrismaService } from '../prisma/prisma.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('FestaService', () => {
    let service: FestaService
    let prisma: PrismaService

    // Mock do PrismaService
    const mockPrismaService = {
        festa: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FestaService,
                { provide: PrismaService, useValue: mockPrismaService }
            ]
        }).compile()

        service = module.get<FestaService>(FestaService)
        prisma = module.get<PrismaService>(PrismaService)
    })

    it('deve ser definido', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        it('deve criar uma festa com sucesso', async () => {
            mockPrismaService.festa.create.mockResolvedValueOnce({
                id: 1,
                nome: 'Festa de Aniversário',
                data: new Date('2024-12-10')
            })

            const festa = await service.create({
                nome: 'Festa de Aniversário',
                data: '2024-12-10'
            })

            expect(festa).toHaveProperty('id')
            expect(festa.nome).toBe('Festa de Aniversário')
        })

        it('deve lançar um erro se o nome for vazio', async () => {
            await expect(
                service.create({ nome: '', data: '2024-12-10' })
            ).rejects.toThrow(BadRequestException)
        })
    })

    describe('findAll', () => {
        it('deve retornar todas as festas', async () => {
            const festasMock = [
                {
                    id: 1,
                    nome: 'Festa de Aniversário',
                    data: new Date('2024-12-10')
                },
                {
                    id: 2,
                    nome: 'Festa de Casamento',
                    data: new Date('2024-12-12')
                }
            ]
            mockPrismaService.festa.findMany.mockResolvedValueOnce(festasMock)

            const festas = await service.findAll()

            expect(festas).toHaveLength(2)
            expect(festas[0].nome).toBe('Festa de Aniversário')
        })
    })

    describe('findOne', () => {
        it('deve lançar um erro se a festa não for encontrada', async () => {
            mockPrismaService.festa.findUnique.mockResolvedValueOnce(null)

            await expect(service.findOne(1)).rejects.toThrow(NotFoundException)
        })

        it('deve retornar uma festa', async () => {
            mockPrismaService.festa.findUnique.mockResolvedValueOnce({
                id: 1,
                nome: 'Festa de Aniversário',
                data: new Date('2024-12-10')
            })

            const festa = await service.findOne(1)

            expect(festa).toHaveProperty('id')
            expect(festa.nome).toBe('Festa de Aniversário')
        })
    })

    describe('update', () => {
        it('deve lançar um erro se a festa não for encontrada', async () => {
            mockPrismaService.festa.findUnique.mockResolvedValueOnce(null)

            await expect(
                service.update(1, { nome: 'Nova Festa' })
            ).rejects.toThrow(NotFoundException)
        })

        it('deve atualizar a festa com sucesso', async () => {
            mockPrismaService.festa.findUnique.mockResolvedValueOnce({
                id: 1,
                nome: 'Festa de Aniversário',
                data: new Date('2024-12-10')
            })

            mockPrismaService.festa.update.mockResolvedValueOnce({
                id: 1,
                nome: 'Nova Festa',
                data: new Date('2024-12-10')
            })

            const festa = await service.update(1, { nome: 'Nova Festa' })

            expect(festa.nome).toBe('Nova Festa')
        })
    })

    describe('delete', () => {
        it('deve lançar um erro se a festa não for encontrada', async () => {
            mockPrismaService.festa.findUnique.mockResolvedValueOnce(null)

            await expect(service.delete(1)).rejects.toThrow(NotFoundException)
        })

        it('deve deletar a festa com sucesso', async () => {
            mockPrismaService.festa.findUnique.mockResolvedValueOnce({
                id: 1,
                nome: 'Festa de Aniversário',
                data: new Date('2024-12-10')
            })

            mockPrismaService.festa.delete.mockResolvedValueOnce({
                id: 1,
                nome: 'Festa de Aniversário',
                data: new Date('2024-12-10')
            })

            const festa = await service.delete(1)

            expect(festa).toHaveProperty('id')
            expect(festa.id).toBe(1)
        })
    })
})
