import { Controller, Get, Query } from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('messages')
export class MessagesController {

    constructor(protected prisma:PrismaService){}

    @Get()
    async getMessages(
        @Token({serialize:true}) {id},
        @Query('page') page: string,
    ){
        const toTake = Number.isNaN(Number(page)) ? 10 : Number(page);
        
    }
}
