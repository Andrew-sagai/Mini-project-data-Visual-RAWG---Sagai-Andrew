import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#ef4444', '#06b6d4', '#f59e0b', '#8b5cf6', '#14b8a6', '#ec4899', '#f97316', '#eab308', '#d946ef', '#3b82f6'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="label">{d.name}</div>
      <div className="value">Tahun Rilis: {d.year}</div>
      <div className="value" style={{ color: '#06b6d4', marginTop: '4px' }}>Rating: {d.rating.toFixed(2)}</div>
    </div>
  );
}

export default function ScatterChartComp({ data, title, subtitle, animationDelay = 'delay-4' }) {
  // Domain dynamic calculation for XAxis based on data
  const minYear = data.length ? Math.min(...data.map(d => d.year)) - 1 : 'dataMin';
  const maxYear = data.length ? Math.max(...data.map(d => d.year)) + 1 : 'dataMax';

  return (
    <div className={`chart-card fade-slide-up ${animationDelay}`}>
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2c3d" />
            <XAxis
              type="number"
              dataKey="year"
              name="Tahun Rilis"
              domain={[minYear, maxYear]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#2a2c3d' }}
              tickFormatter={(tick) => tick.toString()}
            />
            <YAxis
              type="number"
              dataKey="rating"
              name="Rating"
              domain={[0, 5]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }} />
            <Scatter name="Games" data={data} animationDuration={1500}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
