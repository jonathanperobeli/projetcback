// Para controllar as rotas

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    BadRequestException,
    NotFoundException
} from '@nestjs/common'
import { PessoasService } from './pessoa.service'
import { CriarPessoaDto } from './dto/criar-pessoa.dto'
import { AtualizarPessoaDto } from './dto/atualizar-pessoa.dto'
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger'

@ApiTags('pessoas')
@Controller('pessoas')
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}

    @Post()
    @ApiBody({ type: CriarPessoaDto })
    @ApiResponse({ status: 201, description: 'Pessoa criada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Requisição inválida.' })
    async criarPessoa(@Body() data: CriarPessoaDto): Promise<any> {
        if (!data.nome || data.nome.trim() === '') {
            throw new BadRequestException('O nome não pode ser vazio.')
        }

        if (data.festaId) {
            const festaExistente =
                await this.pessoasService.encontrarFestaPorId(data.festaId)

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
            const anfitriaoExistente =
                await this.pessoasService.encontrarAnfitriaoPorFesta(
                    data.festaId
                )

            if (anfitriaoExistente.length > 0) {
                throw new BadRequestException(
                    'Já existe um anfitrião para esta festa.'
                )
            }
        }

        return this.pessoasService.criarPessoa(data)
    }

    @Put(':id')
    @ApiBody({ type: AtualizarPessoaDto })
    @ApiResponse({ status: 200, description: 'Pessoa atualizada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pessoa não encontrada.' })
    async atualizarPessoa(
        @Param('id') id: number,
        @Body() data: AtualizarPessoaDto
    ): Promise<any> {
        if (!data.nome || data.nome.trim() === '') {
            throw new BadRequestException('O nome não pode ser vazio.')
        }

        const pessoaExistente = await this.pessoasService.buscarPessoa(id)

        if (!pessoaExistente) {
            throw new NotFoundException(`Pessoa com ID ${id} não encontrada.`)
        }

        return this.pessoasService.atualizarPessoa(id, data)
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Lista de pessoas retornada com sucesso.'
    })
    async buscarPessoas(): Promise<any> {
        return this.pessoasService.encontrarTodasAsPessoas()
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Pessoa encontrada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pessoa não encontrada.' })
    async buscarPessoa(@Param('id') id: number): Promise<any> {
        return this.pessoasService.buscarPessoa(id)
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Pessoa deletada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pessoa não encontrada.' })
    async deletarPessoa(@Param('id') id: number): Promise<any> {
        return this.pessoasService.deletarPessoa(id)
    }

    // Endpoint para buscar todas as pessoas de uma festa
    @Get('festa/:festaId')
    async getPessoasDaFesta(@Param('festaId') festaId: number) {
        return this.pessoasService.encontrarPessoasPorFesta(festaId)
    }
}
