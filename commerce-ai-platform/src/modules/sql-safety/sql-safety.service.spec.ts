import { SqlSafetyService } from './sql-safety.service';

describe('SqlSafetyService', () => {
  let service: SqlSafetyService;

  beforeEach(() => {
    service = new SqlSafetyService();
  });

  it('blocks mutation SQL', () => {
    const result = service.validate('DELETE FROM marketplace.products');
    expect(result.allowed).toBe(false);
    expect(result.status).toBe('BLOCKED_MUTATION');
  });

  it('allows whitelisted SELECT with LIMIT', () => {
    const result = service.validate(
      'SELECT product_id, total_revenue FROM analytics.product_performance LIMIT 10',
    );
    expect(result.allowed).toBe(true);
    expect(result.status).toBe('ALLOWED');
  });

  it('requires LIMIT', () => {
    const result = service.validate('SELECT * FROM analytics.product_performance');
    expect(result.allowed).toBe(false);
    expect(result.status).toBe('MISSING_LIMIT');
  });

  it('blocks queries on unwhitelisted tables', () => {
    const result = service.validate('SELECT * FROM identity.users LIMIT 5');
    expect(result.allowed).toBe(false);
    expect(result.status).toBe('UNSAFE_TABLE');
  });
});
