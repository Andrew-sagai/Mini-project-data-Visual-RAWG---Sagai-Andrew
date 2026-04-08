import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#ef4444', '#f43f5e', '#f97316', '#fbbf24', '#84cc16', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="label">{d.platform}</div>
      <div className="value">{d.count} game</div>
    </div>
  );
}

export default function PlatformBarChartComp({ data, title, subtitle, animationDelay = 'delay-2' }) {
  return (
    <div className={`chart-card fade-slide-up ${animationDelay}`}>
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2c3d" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="platform"
              tick={{ fontSize: 11, fill: '#f9fafb', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#2a2c3d' }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
            <Bar dataKey="count" name="Jumlah Game" radius={[0, 6, 6, 0]} maxBarSize={30} animationDuration={1500}>
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
