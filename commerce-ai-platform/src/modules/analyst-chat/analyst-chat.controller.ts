import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalystChatService } from './analyst-chat.service';
import { AnalystChatRequestDto, AnalystChatResponseDto } from './analyst-chat.dto';

@ApiTags('AI Analyst Chat')
@Controller('ai/analyst')
export class AnalystChatController {
  constructor(private readonly analystService: AnalystChatService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hỏi đáp báo cáo dữ liệu Text-to-SQL an toàn' })
  @ApiResponse({ status: 200, type: AnalystChatResponseDto })
  async ask(
    @Body() request: AnalystChatRequestDto,
  ): Promise<AnalystChatResponseDto> {
    return this.analystService.ask(request);
  }
}
