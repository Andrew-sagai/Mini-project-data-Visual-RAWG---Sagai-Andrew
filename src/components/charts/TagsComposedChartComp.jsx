import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#ef4444', '#f43f5e', '#f97316', '#fbbf24', '#84cc16', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="label">Tag: {d.tagName}</div>
      <div className="value">Jumlah Game: {d.count}</div>
    </div>
  );
}

export default function TagsComposedChartComp({ data, title, subtitle, animationDelay = 'delay-4' }) {
  return (
    <div className={`chart-card fade-slide-up ${animationDelay}`}>
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2c3d" vertical={false} />
            <XAxis
              dataKey="tagName"
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
            <Bar dataKey="count" name="Jumlah Game" radius={[6, 6, 0, 0]} maxBarSize={40} animationDuration={1500}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#1c1e2a', strokeWidth: 2, stroke: '#ef4444' }} 
              animationDuration={2000} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
