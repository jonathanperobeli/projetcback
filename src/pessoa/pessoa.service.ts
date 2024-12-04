import {
    Injectable,
    BadRequestException,
    NotFoundException
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Pessoa } from '@prisma/client'
import { CriarPessoaDto } from './dto/criar-pessoa.dto'

@Injectable()
export class PessoasService {
    constructor(private readonly prisma: PrismaService) {}

    // CRIAR PESSOA
    async criarPessoa(data: CriarPessoaDto): Promise<Pessoa> {
        if (!data.nome || data.nome.trim() === '') {
            throw new BadRequestException('O nome não pode ser vazio.')
        }

        if (data.festaId) {
            const festaExistente = await this.prisma.festa.findUnique({
                where: { id: data.festaId }
            })

            if (!festaExistente) {
                throw new NotFoundException(
                    `Festa com ID ${data.festaId} não encontrada.`
                )
            }
        } else {
            throw new BadRequestException('O campo festaId é obrigatório.')
        }

        if (!data.idade || typeof data.idade !== 'number' || data.idade <= 0) {
            throw new BadRequestException(
                'A idade deve ser um número válido e maior que zero.'
            )
        }

        if (data.idade > 150) {
            throw new BadRequestException('Idade excessivamente grande')
        }

        if (data.anfitriao) {
            const anfitriaoExistente = await this.prisma.pessoa.findMany({
                where: {
                    festaId: data.festaId,
                    anfitriao: true
                }
            })

            if (anfitriaoExistente.length > 0) {
                throw new BadRequestException(
                    'Já existe um anfitrião para esta festa.'
                )
            }
        }

        return this.prisma.pessoa.create({
            data: { ...data }
        })
    }

    calcularIdade(dataNascimento: Date): number {
        const hoje = new Date()
        let idade = hoje.getFullYear() - dataNascimento.getFullYear()
        const mes = hoje.getMonth() - dataNascimento.getMonth()

        if (
            mes < 0 ||
            (mes === 0 && hoje.getDate() < dataNascimento.getDate())
        ) {
            idade--
        }

        return idade
    }

    async encontrarTodasAsPessoas(): Promise<Pessoa[]> {
        return this.prisma.pessoa.findMany()
    }

    async buscarPessoa(id: number | string): Promise<Pessoa> {
        const idNumerico = typeof id === 'string' ? parseInt(id, 10) : id

        if (isNaN(idNumerico)) {
            throw new BadRequestException('ID inválido.')
        }

        const pessoa = await this.prisma.pessoa.findUnique({
            where: { id: idNumerico }
        })

        if (!pessoa) {
            throw new NotFoundException(
                `Pessoa com ID ${idNumerico} não encontrada.`
            )
        }

        return pessoa
    }

    async atualizarPessoa(
        id: number | string,
        data: Partial<CriarPessoaDto>
    ): Promise<Pessoa> {
        const idNumerico = typeof id === 'string' ? parseInt(id, 10) : id

        if (isNaN(idNumerico)) {
            throw new BadRequestException('ID inválido.')
        }

        const pessoaExistente = await this.prisma.pessoa.findUnique({
            where: { id: idNumerico }
        })

        if (!pessoaExistente) {
            throw new NotFoundException(
                `Pessoa com ID ${idNumerico} não encontrada.`
            )
        }

        // Verificar se o festaId existe antes de atualizar
        if (data.festaId) {
            const festaExistente = await this.prisma.festa.findUnique({
                where: { id: data.festaId }
            })

            if (!festaExistente) {
                throw new NotFoundException(
                    `Festa com ID ${data.festaId} não encontrada.`
                )
            }
        }

        return this.prisma.pessoa.update({
            where: { id: idNumerico },
            data
        })
    }

    async deletarPessoa(id: number | string): Promise<Pessoa> {
        const idNumerico = typeof id === 'string' ? parseInt(id, 10) : id

        if (isNaN(idNumerico)) {
            throw new BadRequestException('ID inválido.')
        }

        const pessoaExistente = await this.prisma.pessoa.findUnique({
            where: { id: idNumerico }
        })

        if (!pessoaExistente) {
            throw new NotFoundException(
                `Pessoa com ID ${idNumerico} não encontrada.`
            )
        }

        return this.prisma.pessoa.delete({
            where: { id: idNumerico }
        })
    }

    async encontrarPessoasPorFesta(
        festaId: number | string
    ): Promise<Pessoa[]> {
        const idNumerico =
            typeof festaId === 'string' ? parseInt(festaId, 10) : festaId

        if (isNaN(idNumerico)) {
            throw new BadRequestException('ID da festa inválido.')
        }

        const festaExistente = await this.prisma.festa.findUnique({
            where: { id: idNumerico }
        })

        if (!festaExistente) {
            throw new NotFoundException(
                `Festa com ID ${idNumerico} não encontrada.`
            )
        }

        return this.prisma.pessoa.findMany({
            where: { festaId: idNumerico }
        })
    }

    async encontrarAnfitriaoPorFesta(festaId: number): Promise<Pessoa[]> {
        return this.prisma.pessoa.findMany({
            where: { festaId, anfitriao: true }
        })
    }

    async encontrarFestaPorId(festaId: number): Promise<any> {
        return this.prisma.festa.findUnique({
            where: { id: festaId }
        })
    }
}
