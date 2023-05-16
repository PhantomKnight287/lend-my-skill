import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class PackageService {
  constructor(protected p: PrismaService) {}

  async getPackageInfo(packageId: string) {
    const packageName = await this.p.package.findUnique({
      where: {
        id: packageId,
      },
      select: {
        name: true,
      },
    });
    if (!packageName) throw new HttpException('Package not found', 404);
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
          where: {
            includedIn: {
              has: packageName.name,
            },
          },
        },
        id: true,
        name: true,
        service: {
          select: {
            title: true,
            images: true,
            package: {
              select: {
                name: true,
                price: true,
                description: true,
              },
              orderBy: {
                price: 'asc',
              },
            },
          },
        },
      },
    });
    if (!_package) throw new HttpException('Package not found', 404);
    return _package;
  }
}
