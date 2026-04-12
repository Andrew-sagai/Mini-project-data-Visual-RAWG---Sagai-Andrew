import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="label">{d.genre}</div>
      <div className="value">Skor Popularitas: {d.popularityScore.toLocaleString('id-ID')}</div>
      {d.baseCount && <div className="value" style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>Jumlah Game: {d.baseCount}</div>}
      {d.avgRating && <div className="value" style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Avg Rating: {d.avgRating.toFixed(2)} / 5</div>}
    </div>
  );
}

export default function GenrePopularityRadarChartComp({ data, title, subtitle, animationDelay = 'delay-4' }) {
  return (
    <div className={`chart-card fade-slide-up ${animationDelay}`}>
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      <div className="chart-wrapper" style={{ height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#2a2c3d" />
            <PolarAngleAxis dataKey="genre" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Popularitas"
              dataKey="popularityScore"
              stroke="#ef4444"
              strokeWidth={2}
              fill="#ef4444"
              fillOpacity={0.4}
              animationDuration={1500}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
