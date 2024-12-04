import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateFestaDto } from './create-festa.dto'

export class UpdateFestaDto extends PartialType(CreateFestaDto) {
    @ApiProperty({
        description: 'Nome da festa',
        example: 'Festa de Aniversário',
        required: false
    })
    nome?: string

    @ApiProperty({
        description: 'Data da festa',
        example: '2024-12-25T20:00:00Z',
        required: false
    })
    data?: string
}
