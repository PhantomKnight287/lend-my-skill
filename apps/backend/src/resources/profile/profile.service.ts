import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CompletedProfileDTO } from './dto/complete-profile.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(protected p: PrismaService) {}

  async findUser(id: string) {
    const user = await this.p.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        profileCompleted: true,
        role: true,
        avatarUrl: true,
        bio: true,
        country: true,
      },
    });
    if (!user) throw new HttpException('No User Found', 404);
    return user;
  }
  async updateUser(id: string, body: UpdateProfileDTO) {
    const user = await this.p.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) throw new HttpException('No User Found', 404);
    const { avatarUrl, bio, country } = body;
    await this.p.user.update({
      where: {
        id,
      },
      data: {
        avatarUrl: avatarUrl || user.avatarUrl,
        bio: bio || user.bio,
        country: country || user.country,
      },
    });
    return {
      updated: true,
    };
  }
  async getProfileByUsername(username: string) {
    const user = await this.p.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        avatarUrl: true,
        bio: true,
        country: true,
        createdAt: true,
        verified: true,
        name: true,
        username: true,
        role: true,
      },
    });
    if (!user) throw new HttpException('No User Found', 404);

    return user;
  }

  private async checkIfProfileCompleted(id: string) {
    const user = await this.p.user.findUnique({
      where: {
        id,
      },
      select: {
        profileCompleted: true,
      },
    });
    if (!user) throw new HttpException('No User Found', 404);
    return user.profileCompleted;
  }

  async completeProfile(id: string, body: CompletedProfileDTO) {
    const profileCompleted = await this.checkIfProfileCompleted(id);
    if (profileCompleted)
      throw new HttpException('Profile Already Completed', 400);
    const { documents, mobileNumber, paypalEmail, upiId } = body;
    if (!paypalEmail && !upiId)
      throw new HttpException(
        'Please Provide Either Paypal Email or UPI ID',
        400,
      );

    await this.p.user.update({
      where: {
        id,
      },
      data: {
        kycDocuments: documents,
        phone: mobileNumber,
        paypalEmail,
        upiId,
        profileCompleted: true,
      },
    });
    return 'Profile Completed';
  }
}
