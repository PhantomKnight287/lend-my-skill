import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VerificationService {
  constructor(public prisma: PrismaService) {}

  async verifySeller(id: string, checkForCompletedProfile?: boolean) {
    const user = await this.prisma.freelancer.findFirst({
      where: {
        id,
      },
    });
    if (!user)
      return {
        profileCompleted: false,
        userFound: false,
      };
    if (user) {
      if (checkForCompletedProfile) {
        if (user.profileCompleted) {
          return {
            profileCompleted: true,
            userFound: true,
          };
        } else {
          return {
            profileCompleted: false,
            userFound: true,
          };
        }
      } else {
        return {
          profileCompleted: true,
          userFound: true,
        };
      }
    }
  }
  async verifyBuyer(id: string, checkForCompletedProfile?: boolean) {
    const user = await this.prisma.client.findFirst({
      where: {
        id,
      },
    });
    if (!user)
      return {
        profileCompleted: false,
        userFound: false,
      };
    if (user) {
      if (checkForCompletedProfile) {
        if (user.profileCompleted) {
          return {
            profileCompleted: true,
            userFound: true,
          };
        } else {
          return {
            profileCompleted: false,
            userFound: true,
          };
        }
      } else {
        return {
          profileCompleted: true,
          userFound: true,
        };
      }
    }
  }
  async isEmailAlreadyRegistered(email: string, model: 'seller' | 'buyer') {
    if (model === 'seller') {
      const user = await this.prisma.freelancer.findFirst({
        where: {
          email,
        },
      });
      if (user) return true;
      else return false;
    } else if (model === 'buyer') {
      const user = await this.prisma.client.findFirst({
        where: {
          email,
        },
      });
      if (user) return true;
      else return false;
    }
  }
  async verifyCategory(id: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });
    if (category) return true;
    else return false;
  }
}
