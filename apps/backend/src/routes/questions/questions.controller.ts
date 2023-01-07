import { Body, Controller, HttpException, Param, Post } from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AnswersDto } from 'src/validators/questions.validator';

@Controller('questions')
export class QuestionsController {
  constructor(protected prisma: PrismaService) {}

  @Post(':orderId/answer')
  async answerQuestions(
    @Param('orderId') orderId: string,
    @Body() body: AnswersDto,
    @Token({ serialize: true }) { id },
  ) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        client: {
          id,
        },
      },
      select: {
        Chat: {
          select: {
            questionAnswered: true,
            id: true,
          },
        },
      },
    });
    if (!order) throw new HttpException('No Order Found', 404);
    if (order.Chat.questionAnswered)
      throw new HttpException('Questions Already Answered', 409);
    await this.prisma.message.createMany({
      data: body.answers.map((ans) => ({
        chatId: order.Chat.id,
        clientId: id,
        content: ans.isAttachment
          ? ans.question
          : `${ans.question} \n${ans.answer}`,
        attachments: ans.isAttachment ? ans.answer : undefined,
      })),
    });
    await this.prisma.chat.update({
      where: {
        id: order.Chat.id,
      },
      data: {
        questionAnswered: true,
      },
    });
    return {
      message: 'Questions Answered',
    };
  }
}
