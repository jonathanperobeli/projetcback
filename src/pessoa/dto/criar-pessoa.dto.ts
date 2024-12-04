import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'

export class CriarPessoaDto {
    @ApiProperty({ description: 'Nome da pessoa' })
    @IsString()
    nome: string

    @ApiProperty({
        description: 'Idade da pessoa',
        example: 20
    })
    @IsNumber()
    idade: number

    @ApiProperty({ description: 'Nome completo da pessoa' })
    @IsString()
    nomeCompleto: string

    @ApiProperty({ description: 'Foto da pessoa', required: false })
    @IsOptional()
    @IsString()
    foto?: string

    @ApiProperty({ description: 'Indica se a pessoa está presente' })
    @IsBoolean()
    presente: boolean

    @ApiProperty({ description: 'Indica se a pessoa foi convidada' })
    @IsBoolean()
    convidada: boolean

    @ApiProperty({ description: 'Indica se a pessoa é anfitriã' })
    @IsBoolean()
    anfitriao: boolean

    @ApiProperty({ description: 'ID da festa associada', required: false })
    @IsOptional()
    festaId?: number
}
