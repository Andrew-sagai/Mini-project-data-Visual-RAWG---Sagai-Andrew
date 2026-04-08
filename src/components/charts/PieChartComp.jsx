import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#ef4444', '#f43f5e', '#f97316', '#fbbf24', '#84cc16', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="label">{d.name}</div>
      <div className="value">{d.value} game ({((d.value / total) * 100).toFixed(1)}%)</div>
    </div>
  );
}

function renderPieLabel({ name, percent }) {
  if (percent < 0.04) return null;
  return `${name} (${(percent * 100).toFixed(0)}%)`;
}

export default function PieChartComp({ data, title, subtitle, animationDelay = 'delay-4' }) {
  const total = data.reduce((s, g) => s + g.value, 0);

  return (
    <div className={`chart-card full-width fade-slide-up ${animationDelay}`}>
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      <div className="chart-wrapper" style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={140}
              dataKey="value"
              nameKey="name"
              label={renderPieLabel}
              labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
              animationDuration={1500}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={total} />} />
            <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: 8, color: '#9ca3af' }} iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
