import React from 'react';

export default function KPI({ icon, label, value, subText, animationDelay = 'delay-1' }) {
  return (
    <div className={`kpi-card fade-slide-up ${animationDelay}`}>
      <div className="kpi-header">
        <div className="kpi-icon">{icon}</div>
        <span className="kpi-label">{label}</span>
      </div>
      <div className="kpi-value" style={value && value.toString().length > 18 ? { fontSize: '1.5rem' } : {}}>
        {value}
      </div>
      <div className="kpi-sub">{subText}</div>
    </div>
  );
}
