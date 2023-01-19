import { Controller } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';

@Controller('quotations')
export class QuotationsController {

    constructor(protected prisma:PrismaService,protected verification:VerificationService){}

    
    
}
