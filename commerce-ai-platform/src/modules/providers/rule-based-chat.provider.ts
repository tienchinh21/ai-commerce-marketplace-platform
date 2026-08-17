import { Injectable } from '@nestjs/common';
import {
  ChatProvider,
  ProductMatchExplanationInput,
  ReviewAnalysisInput,
  ReviewAnalysisResult,
} from './chat-provider.interface';

const COMPLAINT_KEYWORDS: Record<string, string[]> = {
  delivery: ['giao hàng chậm', 'giao chậm', 'chậm', 'trễ', 'lâu', 'delay'],
  packaging: ['đóng gói kém', 'móp', 'vỡ', 'hư hộp', 'rách', 'bể', 'méo'],
  quality: ['hỏng', 'lỗi', 'kém', 'không tốt', 'tệ', 'dở', 'hàng giả', 'fake', 'nhái'],
  service: ['thái độ kém', 'tư vấn tệ', 'không nhiệt tình', 'không trả lời'],
};

const PRAISE_KEYWORDS: Record<string, string[]> = {
  quality: ['tốt', 'bền', 'xịn', 'chất lượng', 'đẹp', 'chính hãng', 'auth', 'chuẩn', 'ưng ý'],
  price: ['giá tốt', 'rẻ', 'đáng tiền', 'tiết kiệm', 'hợp lý', 'sale tốt'],
  delivery: ['giao nhanh', 'siêu nhanh', 'hỏa tốc', 'đúng hẹn', 'đóng gói cẩn thận', 'kỹ càng'],
  service: ['nhiệt tình', 'chu đáo', 'tư vấn tốt', 'thân thiện', 'hỗ trợ nhanh'],
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
  'Chất lượng sản phẩm': ['chất lượng', 'chất liệu', 'hiệu quả', 'bền', 'dùng tốt', 'công dụng'],
  'Giao hàng': ['giao hàng', 'vận chuyển', 'shipper', 'đóng gói', 'hộp', 'thời gian giao'],
  'Giá cả & Ưu đãi': ['giá', 'tiền', 'voucher', 'khuyến mãi', 'ưu đãi', 'giảm giá'],
  'Dịch vụ & Hỗ trợ': ['shop', 'tư vấn', 'chăm sóc', 'nhân viên', 'hỗ trợ', 'đổi trả'],
};

@Injectable()
export class RuleBasedChatProvider implements ChatProvider {
  async explainProductMatch(input: ProductMatchExplanationInput): Promise<string> {
    const fields = input.matchedFields.length > 0
      ? input.matchedFields.map((f) => {
          if (f === 'title') return 'tên sản phẩm';
          if (f === 'brand') return 'thương hiệu';
          if (f === 'category') return 'danh mục';
          if (f === 'seller') return 'nhà bán hàng';
          return f;
        }).join(', ')
      : 'nội dung mô tả và thông số kỹ thuật';

    const matchPercent = Math.round(Math.max(0, Math.min(1, input.score)) * 100);
    return `Sản phẩm "${input.productTitle}" có độ tương đồng ngữ nghĩa ${matchPercent}% với tìm kiếm "${input.query}", khớp qua ${fields}.`;
  }

  async analyzeReview(input: ReviewAnalysisInput): Promise<ReviewAnalysisResult> {
    const text = `${input.title ?? ''} ${input.content}`.toLowerCase();

    const complaints: string[] = [];
    for (const [category, keywords] of Object.entries(COMPLAINT_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) {
        complaints.push(category);
      }
    }

    const praises: string[] = [];
    for (const [category, keywords] of Object.entries(PRAISE_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) {
        praises.push(category);
      }
    }

    const topics: string[] = [];
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) {
        topics.push(topic);
      }
    }
    if (topics.length === 0) {
      topics.push('Trải nghiệm chung');
    }

    // Sentiment calculation
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let sentimentScore = 0.5;

    if (input.rating >= 4) {
      sentiment = 'positive';
      sentimentScore = input.rating === 5 ? 0.95 : 0.8;
      if (complaints.length > 0) {
        sentimentScore = Math.max(0.6, sentimentScore - complaints.length * 0.1);
      }
    } else if (input.rating <= 2) {
      sentiment = 'negative';
      sentimentScore = input.rating === 1 ? 0.05 : 0.2;
      if (praises.length > 0) {
        sentimentScore = Math.min(0.4, sentimentScore + praises.length * 0.1);
      }
    } else {
      // Rating 3
      if (complaints.length > praises.length) {
        sentiment = 'negative';
        sentimentScore = 0.35;
      } else if (praises.length > complaints.length) {
        sentiment = 'positive';
        sentimentScore = 0.65;
      } else {
        sentiment = 'neutral';
        sentimentScore = 0.5;
      }
    }

    return {
      sentiment,
      sentimentScore: Number(sentimentScore.toFixed(4)),
      topics,
      complaints,
      praises,
    };
  }
}
