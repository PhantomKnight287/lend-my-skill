import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';

@Controller('categories')
export class CategoryController {
  constructor(
    protected prisma: PrismaService,
    protected verification: VerificationService,
  ) {}

  @Get()
  async fetchAllCategories() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return categories;
  }
  @Post('create')
  async createCategory(
    @Token({ serialize: true }) { id },
    @Body() body: { name: string },
  ) {
    if (!body.name)
      throw new HttpException('Name of category is required', 400);
    const { userFound: isValidClient } = await this.verification.verifyBuyer(
      id,
    );
    const { userFound: isValidFreelancer } =
      await this.verification.verifySeller(id);
    if (!isValidClient && !isValidFreelancer) {
      throw new HttpException(
        'You are not allowed to perform this action',
        403,
      );
    }
    const category = await this.prisma.category.create({
      data: {
        name: body.name,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return category;
  }
}
