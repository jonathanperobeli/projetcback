// Para encaminhar os dados

import { ApiProperty } from '@nestjs/swagger'

export class CreateFestaDto {
    @ApiProperty({
        description: 'Nome da festa',
        example: 'Festa de Aniversário'
    })
    nome: string

    @ApiProperty({
        description: 'Data da festa',
        example: '2024-12-25T20:00:00Z'
    })
    data: string
}
