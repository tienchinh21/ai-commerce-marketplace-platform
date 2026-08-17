import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth(): { status: 'ok'; service: 'commerce-ai-platform'; timestamp: string } {
    return {
      status: 'ok',
      service: 'commerce-ai-platform',
      timestamp: new Date().toISOString(),
    };
  }
}
