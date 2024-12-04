// Para controllar as rotas

import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete
} from '@nestjs/common'
import { FestaService } from './festa.service'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreateFestaDto } from './dto/create-festa.dto'
import { UpdateFestaDto } from './dto/atualizar-festa.dto'
import { FestaDto } from './dto/festa.dto' // Importando o DTO

@Controller('festas')
export class FestaController {
    constructor(private readonly festaService: FestaService) {}

    // Criar festa
    @Post()
    @ApiOperation({ summary: 'Criar uma festa' })
    @ApiBody({
        description: 'Dados da festa a ser criada',
        type: CreateFestaDto
    })
    @ApiResponse({
        status: 201,
        description: 'Festa criada com sucesso.',
        type: FestaDto
    })
    async create(@Body() data: CreateFestaDto): Promise<FestaDto> {
        const festa = await this.festaService.create(data)
        return festa
    }

    // Listar todas as festas
    @Get()
    @ApiOperation({ summary: 'Listar todas as festas' })
    @ApiResponse({
        status: 200,
        description: 'Lista de festas',
        type: [FestaDto]
    })
    findAll() {
        return this.festaService.findAll()
    }

    // Selecionar uma festa
    @Get(':id')
    @ApiOperation({ summary: 'Buscar uma festa por ID' })
    @ApiResponse({
        status: 200,
        description: 'Festa encontrada',
        type: FestaDto
    })
    @ApiResponse({
        status: 404,
        description: 'Festa não encontrada'
    })
    findOne(@Param('id') id: string) {
        return this.festaService.findOne(Number(id))
    }

    // Atualizar uma festa
    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar uma festa' })
    @ApiBody({
        description: 'Dados para atualizar a festa',
        type: UpdateFestaDto
    })
    @ApiResponse({
        status: 200,
        description: 'Festa atualizada com sucesso.',
        type: FestaDto
    })
    @ApiResponse({
        status: 404,
        description: 'Festa não encontrada'
    })
    update(
        @Param('id') id: string,
        @Body() data: UpdateFestaDto
    ): Promise<FestaDto> {
        return this.festaService.update(Number(id), data)
    }

    // Deletar Festa
    @Delete(':id')
    @ApiOperation({ summary: 'Excluir uma festa' })
    @ApiResponse({
        status: 200,
        description: 'Festa excluída com sucesso.',
        type: FestaDto
    })
    @ApiResponse({
        status: 404,
        description: 'Festa não encontrada'
    })
    delete(@Param('id') id: string) {
        return this.festaService.delete(Number(id))
    }
}
