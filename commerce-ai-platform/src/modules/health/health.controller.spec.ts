import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns AI service health', () => {
    const controller = new HealthController();
    expect(controller.getHealth()).toMatchObject({
      status: 'ok',
      service: 'commerce-ai-platform',
    });
  });
});
