import React from 'react';
import { Card, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number | string;
    isUp?: boolean;
    label?: string;
  };
  subTitle?: string;
  cardStyle?: React.CSSProperties;
  iconColor?: string;
  iconBg?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  subTitle,
  cardStyle,
  iconColor = '#2563eb',
  iconBg = '#eff6ff',
}: MetricCardProps) {
  return (
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        ...cardStyle,
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>
            {title}
          </Typography.Text>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', marginTop: 4, marginBottom: 4 }}>
            {value}
          </div>

          {trend && (
            <Space size={4} style={{ fontSize: 12 }}>
              <span
                style={{
                  fontWeight: 600,
                  color: trend.isUp ? '#16a34a' : '#dc2626',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {trend.isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {trend.value}
              </span>
              {trend.label && <span style={{ color: '#94a3b8' }}>{trend.label}</span>}
            </Space>
          )}

          {subTitle && !trend && (
            <Typography.Text type="secondary" style={{ fontSize: 12, color: '#94a3b8' }}>
              {subTitle}
            </Typography.Text>
          )}
        </div>

        {icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: iconBg,
              color: iconColor,
              display: 'grid',
              placeItems: 'center',
              fontSize: 20,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
