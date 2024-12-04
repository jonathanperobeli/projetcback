import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'

export class AtualizarPessoaDto {
    @ApiProperty({ description: 'Nome da pessoa', required: false })
    @IsOptional()
    @IsString()
    nome?: string

    @ApiProperty({
        description: 'Data de nascimento da pessoa',
        example: new Date().toISOString(),
        required: false
    })
    @IsOptional()
    @IsNumber()
    idade?: number

    @ApiProperty({ description: 'Nome completo da pessoa', required: false })
    @IsOptional()
    @IsString()
    nomeCompleto?: string

    @ApiProperty({ description: 'Foto da pessoa', required: false })
    @IsOptional()
    @IsString()
    foto?: string

    @ApiProperty({
        description: 'Indica se a pessoa está presente',
        required: false
    })
    @IsOptional()
    @IsBoolean()
    presente?: boolean

    @ApiProperty({
        description: 'Indica se a pessoa foi convidada',
        required: false
    })
    @IsOptional()
    @IsBoolean()
    convidada?: boolean

    @ApiProperty({
        description: 'Indica se a pessoa é anfitriã',
        required: false
    })
    @IsOptional()
    @IsBoolean()
    anfitriao?: boolean

    @ApiProperty({ description: 'ID da festa associada', required: false })
    @IsOptional()
    @IsNumber()
    festaId?: number
}
