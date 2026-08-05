import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsResponseDto {
  @ApiProperty({
    description: 'Dynamic key-value record returned by the analytics query',
    type: 'object',
    additionalProperties: true,
  })
  record: Record<string, unknown>;
}
