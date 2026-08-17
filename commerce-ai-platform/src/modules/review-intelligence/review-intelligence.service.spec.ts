import { ReviewIntelligenceService } from './review-intelligence.service';
import { CoreDataService } from '../core-data/core-data.service';
import { RuleBasedChatProvider } from '../providers/rule-based-chat.provider';
import { DataSource } from 'typeorm';

describe('ReviewIntelligenceService', () => {
  let service: ReviewIntelligenceService;
  let chatProvider: RuleBasedChatProvider;

  beforeEach(() => {
    chatProvider = new RuleBasedChatProvider();
    service = new ReviewIntelligenceService(
      {} as DataSource,
      {} as CoreDataService,
      chatProvider,
    );
  });

  it('classifies negative reviews with complaints', async () => {
    const result = await service.analyzeReviewText({
      rating: 2,
      title: 'Giao hàng chậm',
      content: 'Sản phẩm tốt nhưng giao hàng quá chậm và đóng gói kém',
    });

    expect(result.sentiment).toBe('negative');
    expect(result.complaints).toContain('delivery');
    expect(result.complaints).toContain('packaging');
  });

  it('classifies positive reviews with praises', async () => {
    const result = await service.analyzeReviewText({
      rating: 5,
      title: 'Rất ưng ý',
      content: 'Hàng chính hãng rất tốt, giao hàng nhanh và đóng gói cẩn thận',
    });

    expect(result.sentiment).toBe('positive');
    expect(result.praises).toContain('quality');
    expect(result.praises).toContain('delivery');
  });
});
