import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // Habilitar CORS para permitir requisições do frontend na porta 3001
    app.enableCors({
        origin: 'http://localhost:3001' // Permitir apenas o frontend na porta 3001
    })

    const config = new DocumentBuilder()
        .setTitle('API Example')
        .setDescription('The API description')
        .setVersion('1.0')
        // Removido o método addBearerAuth
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(3000)
}
bootstrap()
