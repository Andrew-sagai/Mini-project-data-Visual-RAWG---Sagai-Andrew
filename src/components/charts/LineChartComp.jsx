import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload, label, suffix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="value">
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(entry.value % 1 ? 2 : 0) : entry.value}{suffix}
        </div>
      ))}
    </div>
  )
}

export default function LineChartComp({ data, title, subtitle, animationDelay = 'delay-2' }) {
  return (
    <div className={`chart-card fade-slide-up ${animationDelay}`}>
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2c3d" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#2a2c3d' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip suffix=" game" />} cursor={{ stroke: 'rgba(239, 68, 68, 0.2)', strokeWidth: 2 }} />
            <Line
              type="monotone"
              dataKey="jumlah"
              name="Jumlah Game"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4, fill: '#1c1e2a', strokeWidth: 2, stroke: '#ef4444' }}
              activeDot={{ r: 7, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
