import { Card, Col, Row, Statistic, Typography } from 'antd';

export function DashboardPage() {
  return (
    <>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Products" value={0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Reviews" value={0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Sellers" value={0} /></Card></Col>
        <Col span={6}><Card><Statistic title="AI Jobs" value={0} /></Card></Col>
      </Row>
    </>
  );
}
