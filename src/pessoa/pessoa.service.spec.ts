/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing'
import { PessoasService } from './pessoa.service'
import { PrismaService } from '../prisma/prisma.service'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { Pessoa } from '@prisma/client'
import { CriarPessoaDto } from './dto/criar-pessoa.dto'

describe('PessoasService', () => {
    let service: PessoasService

    const mockPrismaService = {
        pessoa: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        },
        festa: {
            findUnique: jest.fn()
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PessoasService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService
                }
            ]
        }).compile()

        service = module.get<PessoasService>(PessoasService)
    })

    // TESTES NO MÓDULO PESSOA

    describe('criarPessoa', () => {
        it('Deve criar uma nova pessoa', async () => {
            const dto: CriarPessoaDto = {
                nome: 'João Silva',
                idade: 22,
                nomeCompleto: 'João da Silva',
                foto: 'http://example.com/foto.jpg',
                presente: true,
                convidada: true,
                anfitriao: false,
                festaId: 1
            }

            mockPrismaService.festa.findUnique.mockResolvedValue({
                id: dto.festaId
            })

            mockPrismaService.pessoa.create.mockResolvedValue(dto as Pessoa)

            const result = await service.criarPessoa(dto)
            expect(result).toEqual(dto)
            expect(mockPrismaService.pessoa.create).toHaveBeenCalledWith({
                data: {
                    ...dto
                }
            })
        })

        it('deve lançar NotFoundException se a festa não existir', async () => {
            const dto: CriarPessoaDto = {
                nome: 'Maria',
                idade: 22,
                nomeCompleto: 'Maria da Silva',
                foto: 'http://example.com/foto-maria.jpg',
                presente: false,
                convidada: true,
                anfitriao: false,
                festaId: 1000000
            }

            mockPrismaService.festa.findUnique.mockResolvedValue(null)

            await expect(service.criarPessoa(dto)).rejects.toThrow(
                NotFoundException
            )
        })

        it('deve lançar BadRequestException se o nome for vazio', async () => {
            const dto: CriarPessoaDto = {
                nome: '',
                idade: 22,
                nomeCompleto: 'João da Silva',
                foto: 'http://example.com/foto.jpg',
                presente: true,
                convidada: true,
                anfitriao: false,
                festaId: 1
            }

            mockPrismaService.festa.findUnique.mockResolvedValue({
                id: dto.festaId
            })

            await expect(service.criarPessoa(dto)).rejects.toThrow(
                BadRequestException
            )
        })

        it('deve lançar BadRequestException se a idade for inválida', async () => {
            const dto: CriarPessoaDto = {
                nome: 'João Silva',
                idade: 'invalid date' as any, // Simulando um valor inválido
                nomeCompleto: 'João da Silva',
                foto: 'http://example.com/foto.jpg',
                presente: true,
                convidada: true,
                anfitriao: false,
                festaId: 1
            }

            mockPrismaService.festa.findUnique.mockResolvedValue({
                id: dto.festaId
            })

            await expect(service.criarPessoa(dto)).rejects.toThrow(
                BadRequestException
            )
        })

        it('deve lançar Error se ocorrer um erro de banco de dados', async () => {
            const dto: CriarPessoaDto = {
                nome: 'João Silva',
                idade: 22,
                nomeCompleto: 'João da Silva',
                foto: 'http://example.com/foto.jpg',
                presente: true,
                convidada: true,
                anfitriao: false,
                festaId: 1
            }

            mockPrismaService.festa.findUnique.mockResolvedValue({
                id: dto.festaId
            })

            jest.spyOn(mockPrismaService.pessoa, 'create').mockRejectedValue(
                new Error('Erro de banco de dados')
            )

            await expect(service.criarPessoa(dto)).rejects.toThrow(Error)
        })

        it('deve lançar BadRequestException se já existir um anfitrião para a festa', async () => {
            const dto: CriarPessoaDto = {
                nome: 'Carlos Silva',
                idade: 22,
                nomeCompleto: 'Carlos da Silva',
                foto: 'http://example.com/foto-carlos.jpg',
                presente: true,
                convidada: true,
                anfitriao: true,
                festaId: 1
            }

            mockPrismaService.festa.findUnique.mockResolvedValue({
                id: dto.festaId
            })

            mockPrismaService.pessoa.findMany.mockResolvedValue([
                {
                    id: 1,
                    nome: 'Anfitrião Atual',
                    anfitriao: true,
                    festaId: dto.festaId
                }
            ])

            await expect(service.criarPessoa(dto)).rejects.toThrow(
                BadRequestException
            )
            expect(mockPrismaService.pessoa.findMany).toHaveBeenCalledWith({
                where: {
                    festaId: dto.festaId,
                    anfitriao: true
                }
            })
        })

        it('deve lançar BadRequestException se a idade for negativa', async () => {
            const dto: CriarPessoaDto = {
                nome: 'João Silva',
                idade: -1, // Idade inválida
                nomeCompleto: 'João da Silva',
                foto: 'http://example.com/foto.jpg',
                presente: true,
                convidada: true,
                anfitriao: false,
                festaId: 1
            }

            mockPrismaService.festa.findUnique.mockResolvedValue({
                id: dto.festaId
            })

            await expect(service.criarPessoa(dto)).rejects.toThrow(
                BadRequestException
            )
        })

        it('deve lançar BadRequestException se a idade for excessivamente grande', async () => {
            const dto: CriarPessoaDto = {
                nome: 'João Silva',
                idade: 200, // Idade excessivamente grande
                nomeCompleto: 'João da Silva',
                foto: 'http://example.com/foto.jpg',
                presente: true,
                convidada: true,
                anfitriao: false,
                festaId: 1
            }

            // Simula que a criação da pessoa no banco de dados não ocorrerá
            jest.spyOn(mockPrismaService.pessoa, 'create').mockRejectedValue(
                new Error('Erro de banco de dados') // Simula um erro de banco de dados
            )

            // Agora testamos se a BadRequestException será lançada com a idade excessiva
            await expect(service.criarPessoa(dto)).rejects.toThrow(
                BadRequestException // Espera-se que seja lançada uma BadRequestException
            )
        })
    })

    describe('encontrarTodasAsPessoas', () => {
        it('Deve retornar uma lista de pessoas', async () => {
            const pessoas = [{ id: 1 }]
            mockPrismaService.pessoa.findMany.mockResolvedValue(pessoas)

            const result = await service.encontrarTodasAsPessoas()
            expect(result).toEqual(pessoas)
            expect(mockPrismaService.pessoa.findMany).toHaveBeenCalled()
        })

        it('deve retornar uma lista vazia se não houver pessoas', async () => {
            mockPrismaService.pessoa.findMany.mockResolvedValue([])

            const result = await service.encontrarTodasAsPessoas()
            expect(result).toEqual([]) // Espera uma lista vazia
            expect(mockPrismaService.pessoa.findMany).toHaveBeenCalled()
        })
    })

    describe('buscarPessoa', () => {
        it('Deve retornar uma pessoa pelo id', async () => {
            const id = 1
            const pessoa = { id }
            mockPrismaService.pessoa.findUnique.mockResolvedValue(pessoa)

            const result = await service.buscarPessoa(id)
            expect(result).toEqual(pessoa)
            expect(mockPrismaService.pessoa.findUnique).toHaveBeenCalledWith({
                where: { id }
            })
        })

        it('deve lançar NotFoundException se a pessoa não existir', async () => {
            const id = 1
            mockPrismaService.pessoa.findUnique.mockResolvedValue(null)

            await expect(service.buscarPessoa(id)).rejects.toThrow(
                NotFoundException
            )
        })

        it('deve lançar NotFoundException se tentar deletar uma pessoa que não existe', async () => {
            const id = 9999 // ID que não existe
            mockPrismaService.pessoa.findUnique.mockResolvedValue(null)

            await expect(service.deletarPessoa(id)).rejects.toThrow(
                NotFoundException
            )
        })
    })

    describe('atualizarPessoa', () => {
        it('Deve atualizar uma pessoa', async () => {
            const id = 1
            const dto: Partial<CriarPessoaDto> = {}
            const updatedPessoa = { id }
            mockPrismaService.pessoa.findUnique.mockResolvedValue(updatedPessoa)
            mockPrismaService.pessoa.update.mockResolvedValue(updatedPessoa)

            const result = await service.atualizarPessoa(id, dto)
            expect(result).toEqual(updatedPessoa)
            expect(mockPrismaService.pessoa.update).toHaveBeenCalledWith({
                where: { id },
                data: dto
            })
        })

        it('deve lançar NotFoundException se a pessoa não existir', async () => {
            const id = 1
            mockPrismaService.pessoa.findUnique.mockResolvedValue(null)

            await expect(service.atualizarPessoa(id, {})).rejects.toThrow(
                NotFoundException
            )
        })

        it('deve atualizar uma pessoa com dados parciais', async () => {
            const id = 1
            const dto: Partial<CriarPessoaDto> = {
                idade: 25 // Somente a idade sendo atualizada
            }
            const updatedPessoa = { id, ...dto }
            mockPrismaService.pessoa.findUnique.mockResolvedValue(updatedPessoa)
            mockPrismaService.pessoa.update.mockResolvedValue(updatedPessoa)

            const result = await service.atualizarPessoa(id, dto)
            expect(result).toEqual(updatedPessoa)
            expect(mockPrismaService.pessoa.update).toHaveBeenCalledWith({
                where: { id },
                data: dto
            })
        })
    })

    describe('deletarPessoa', () => {
        it('Deve deletar uma pessoa pelo id', async () => {
            const id = 1
            const pessoa = { id }
            mockPrismaService.pessoa.findUnique.mockResolvedValue(pessoa)
            mockPrismaService.pessoa.delete.mockResolvedValue(pessoa)

            const result = await service.deletarPessoa(id)
            expect(result).toEqual(pessoa)
            expect(mockPrismaService.pessoa.delete).toHaveBeenCalledWith({
                where: { id }
            })
        })

        it('deve lançar NotFoundException se a pessoa não existir', async () => {
            const id = 1
            mockPrismaService.pessoa.findUnique.mockResolvedValue(null)

            await expect(service.deletarPessoa(id)).rejects.toThrow(
                NotFoundException
            )
        })
    })
})
