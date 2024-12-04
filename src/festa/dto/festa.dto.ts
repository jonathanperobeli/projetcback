import { IsString, IsNumber } from 'class-validator'

export class FestaDto {
    @IsNumber()
    id: number

    @IsString()
    nome: string
}
