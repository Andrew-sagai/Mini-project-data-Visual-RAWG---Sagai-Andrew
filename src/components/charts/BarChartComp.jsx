import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#ef4444', '#f43f5e', '#f97316', '#fbbf24', '#84cc16', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];

function CustomTooltip({ active, payload, labelKey, valueKey }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="label">{d.fullName || d.name}</div>
      <div className="value">
        {labelKey}: {typeof d[valueKey] === 'number' && d[valueKey] % 1 !== 0 ? d[valueKey].toFixed(2) : d[valueKey]}
      </div>
    </div>
  );
}

export default function BarChartComp({ data, title, subtitle, dataKey = 'rating', xAxisKey = 'name', labelKey = 'Rating', animationDelay = 'delay-3' }) {
  return (
    <div className={`chart-card fade-slide-up ${animationDelay}`}>
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2c3d" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#2a2c3d' }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip labelKey={labelKey} valueKey={dataKey} />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
            <Bar dataKey={dataKey} name={labelKey} radius={[6, 6, 0, 0]} maxBarSize={40} animationDuration={1500}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
