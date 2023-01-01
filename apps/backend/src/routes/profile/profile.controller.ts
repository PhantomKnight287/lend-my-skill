import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Client, Freelancer } from '@prisma/client';
import { DecodedJWT, Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerificationService } from 'src/services/verification/verification.service';
import { UpdateProfileDto } from 'src/validators/profile.validator';

@Controller('profile')
export class ProfileController {
  constructor(
    protected prisma: PrismaService,
    protected verify: VerificationService,
  ) {}

  @Get()
  async getProfile(@Token({ serialize: true }) { id }) {
    const { userFound: isValidFreelancer } = await this.verify.verifySeller(id);
    const { userFound: isValidClient } = await this.verify.verifyBuyer(id);
    if (!isValidFreelancer && !isValidClient) {
      throw new HttpException('Unauthorized', 401);
    }
    let profile;
    if (isValidFreelancer) {
      profile = await this.prisma.freelancer.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          username: true,
          profileCompleted: true,
        },
      });
    } else {
      profile = await this.prisma.client.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          username: true,
          profileCompleted: true,
        },
      });
    }
    return {
      ...profile,
      type: isValidFreelancer ? 'freelancer' : 'client',
    };
  }
  @Get(':username')
  async getUserProfile(@Param('username') username: string) {
    const isValidFreelancer = await this.verify.verifyFreelancerByUsername(
      username,
    );
    const isValidClient = await this.verify.verifyClientByUsername(username);
    if (!isValidFreelancer && !isValidClient) {
      throw new HttpException('No user found with provided username', 401);
    }
    let profile;
    if (isValidFreelancer) {
      profile = await this.prisma.freelancer.findFirst({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
        select: {
          avatarUrl: true,
          bio: true,
          country: true,
          createdAt: true,
          id: true,
          name: true,
          username: true,
          verified: true,
          profileCompleted: true,
          aboutMe: true,
        },
      });
    } else {
      profile = await this.prisma.client.findFirst({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
        select: {
          avatarUrl: true,
          bio: true,
          country: true,
          createdAt: true,
          id: true,
          name: true,
          username: true,
          verified: true,
          profileCompleted: true,
          aboutMe: true,
        },
      });
    }
    return {
      ...profile,
      type: isValidFreelancer ? 'freelancer' : 'client',
    };
  }
  @Get(':username/authenticated')
  async getProfileInfo(
    @Token({ serialize: true }) { id, userType }: DecodedJWT,
  ) {
    const account =
      userType === 'client'
        ? await this.prisma.client.findFirst({
            where: {
              id,
            },
            select: {
              aboutMe: true,
              avatarUrl: true,
              bio: true,
              country: true,
            },
          })
        : await this.prisma.freelancer.findFirst({
            where: { id },
            select: {
              aboutMe: true,
              avatarUrl: true,
              bio: true,
              country: true,
            },
          });
    if (!account)
      throw new HttpException(
        'No account found with provided token',
        HttpStatus.NOT_FOUND,
      );
    return account;
  }
  @Post('update')
  async updateProfile(
    @Token({ serialize: true }) { id, userType }: DecodedJWT,
    @Body() body: UpdateProfileDto,
  ) {
    const user =
      userType === 'client'
        ? await this.prisma.client.findFirst({
            where: { id },
          })
        : await this.prisma.client.findFirst({
            where: { id },
          });
    if (!user)
      throw new HttpException(
        "The resource you are trying to update doesn't exist.",
        HttpStatus.NOT_FOUND,
      );
    const { aboutMe, avatarUrl, bio, country } = body;

    if (userType === 'client') {
      await this.prisma.client.update({
        where: {
          email: user.email,
        },
        data: {
          aboutMe,
          avatarUrl,
          bio,
          country,
        },
      });
    } else {
      await this.prisma.freelancer.update({
        where: {
          email: user.email,
        },
        data: {
          aboutMe,
          avatarUrl,
          bio,
          country,
        },
      });
    }
    return {
      updated: true,
    };
  }
  @Get(':username/completed')
  async checkIfProfileIsCompleted(@Token({ serialize: true }) { id }) {
    const { userFound: isValidFreelancer } = await this.verify.verifySeller(id);
    const { userFound: isValidClient } = await this.verify.verifyBuyer(id);
    if (!isValidFreelancer && !isValidClient) {
      throw new HttpException('Unauthorized', 401);
    }
    let profile: Partial<Freelancer | Client>;
    if (isValidFreelancer) {
      profile = await this.prisma.freelancer.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          username: true,
          profileCompleted: true,
        },
      });
    } else {
      profile = await this.prisma.client.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          username: true,
          profileCompleted: true,
        },
      });
    }
    if (profile.profileCompleted) {
      return {
        completed: true,
      };
    } else {
      return {
        completed: false,
      };
    }
  }
  @Post('complete')
  async completeProfile(
    @Token({ serialize: true }) { id },
    @Body()
    body: {
      urls: string[];
      mobileNumber: string;
      upiId: string;
    },
  ) {
    if (!body.urls || !body.urls.length)
      throw new HttpException(
        'Please enter urls of uploaded documents.',
        HttpStatus.BAD_REQUEST,
      );
    if (!body.mobileNumber)
      throw new HttpException(
        'Please enter your mobile number.',
        HttpStatus.BAD_REQUEST,
      );
    if (!body.upiId)
      throw new HttpException(
        'Please enter your UPI ID.',
        HttpStatus.BAD_REQUEST,
      );

    const { userFound: isValidFreelancer } = await this.verify.verifySeller(id);
    const { userFound: isValidClient } = await this.verify.verifyBuyer(id);
    if (!isValidFreelancer && !isValidClient) {
      throw new HttpException('Unauthorized', 401);
    }
    let profile: Partial<Freelancer | Client>;
    if (isValidFreelancer) {
      profile = await this.prisma.freelancer.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          username: true,
          profileCompleted: true,
        },
      });
    } else {
      profile = await this.prisma.client.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          username: true,
          profileCompleted: true,
        },
      });
    }
    if (profile.profileCompleted)
      throw new HttpException(
        'Your profile is already completed. You can use all services of our platform.',
        HttpStatus.CONFLICT,
      );
    if (isValidClient) {
      await this.prisma.client.update({
        where: {
          id: profile.id,
        },
        data: {
          kycDocuments: body.urls,
          phoneNumber: body.mobileNumber,
          profileCompleted: true,
          upiId: body.upiId,
        },
      });
    } else {
      await this.prisma.freelancer.update({
        where: {
          id: profile.id,
        },
        data: {
          kycDocuments: body.urls,
          phoneNumber: body.mobileNumber,
          profileCompleted: true,
          upiId: body.upiId,
        },
      });
    }
    return {
      success: true,
    };
  }
}
