import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class PackageService {
  constructor(protected p: PrismaService) {}

  async getPackageInfo(packageId: string) {
    const _package = await this.p.package.findUnique({
      where: {
        id: packageId,
      },
      select: {
        deliveryDays: true,
        description: true,
        price: true,
        features: {
          select: {
            name: true,
            id: true,
          },
        },
        id: true,
        name: true,
        service: {
          select: {
            title: true,
          },
        },
      },
    });
    if (!_package) throw new HttpException('Package not found', 404);
    return _package;
  }
}
