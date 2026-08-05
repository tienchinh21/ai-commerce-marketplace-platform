import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Public } from './modules/auth/public.decorator';

@Controller()
export class AppController {
  @Public()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        service: { type: 'string', example: 'commerce-core-service-nestjs' },
      },
    },
  })
  @Get('/health')
  health() {
    return { status: 'ok', service: 'commerce-core-service-nestjs' };
  }
}
