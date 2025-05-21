import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Salas = () => {
  const data = [
    { name: 'بانتظار المراجعة', value: 25, color: '#34B3F1' },
    { name: 'تمت الموافقة', value: 30, color: '#DEECF6' },
    { name: 'مرفوضة', value: 15, color: '#ADD8E6' },
  ];

  const RADIAN = Math.PI / 180;

  const renderValueInside = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight="bold"
      >
        {value}%
      </text>
    );
  };

  const renderCustomNameLabels = ({ cx, cy, outerRadius, index }) => {
    const isRightSide = data[index].name !== 'تمت الموافقة';

    const startX = isRightSide ? cx + outerRadius : cx - outerRadius;
    const startY = cy - 40 + index * 40;

    const midX1 = isRightSide ? startX + 20 : startX - 20;
    const midY1 = startY;

    const midX2 = isRightSide ? midX1 + 30 : midX1 - 30;
    const midY2 = startY;

    const endX = midX2;
    const endY = startY + 10;

    const textX = endX;
    const textY = endY + 14;  
    const textAnchor = 'middle';

    return (
      <g>
        <line x1={startX} y1={startY} x2={midX1} y2={midY1} stroke="#888" strokeWidth={1} />
        <line x1={midX1} y1={midY1} x2={midX2} y2={midY2} stroke="#888" strokeWidth={1} />
        <line x1={midX2} y1={midY2} x2={endX} y2={endY} stroke="#888" strokeWidth={1} />

        <text
          x={textX}
          y={textY}
          textAnchor={textAnchor}
          dominantBaseline="hanging"
          fill="#000"
          fontSize={13}
          fontWeight="500"
        >
          {data[index].name}
        </text>
      </g>
    );
  };

  return (
    <div style={{
      width: '600px',
      height: '320px',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: '18px',
        marginBottom: '16px'
      }}>
        الفواتير
      </h3>
      <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              labelLine={false}
              label={renderValueInside}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              labelLine={false}
              label={renderCustomNameLabels}
              fill="transparent"
              isAnimationActive={false}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Salas;
