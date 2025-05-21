import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Salas = () => {
  const data = [
    { name: 'بانتظار المراجعة', value: 25, color: '#34B3F1' },
    { name: 'تمت الموافقة', value: 30, color: '#DEECF6' },
    { name: 'مرفوضة', value: 15, color: '#ADD8E6' },
  ];

  const RADIAN = Math.PI / 180;

  const [dimensions, setDimensions] = useState({
    innerRadius: 60,
    outerRadius: 90,
    fontSize: 13,
    lineLength1: 20,
    lineLength2: 30,
    textOffsetY: 14,
    centerTextBigFontSize: 24,
    centerTextSmallFontSize: 14,
  });

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 360) {
        setDimensions({
          innerRadius: 20,
          outerRadius: 40,
          fontSize: 9,
          lineLength1: 10,
          lineLength2: 15,
          textOffsetY: 10,
          centerTextBigFontSize: 14,
          centerTextSmallFontSize: 8,
        });
      } else if (window.innerWidth <= 600) {
        setDimensions({
          innerRadius: 40,
          outerRadius: 70,
          fontSize: 11,
          lineLength1: 15,
          lineLength2: 20,
          textOffsetY: 12,
          centerTextBigFontSize: 18,
          centerTextSmallFontSize: 10,
        });
      } else {
        setDimensions({
          innerRadius: 60,
          outerRadius: 90,
          fontSize: 13,
          lineLength1: 20,
          lineLength2: 30,
          textOffsetY: 14,
          centerTextBigFontSize: 24,
          centerTextSmallFontSize: 14,
        });
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        fontSize={dimensions.fontSize}
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

    const midX1 = isRightSide ? startX + dimensions.lineLength1 : startX - dimensions.lineLength1;
    const midY1 = startY;

    const midX2 = isRightSide ? midX1 + dimensions.lineLength2 : midX1 - dimensions.lineLength2;
    const midY2 = startY;

    const endX = midX2;
    const endY = startY + 10;

    const textX = endX;
    const textY = endY + dimensions.textOffsetY;  
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
          fontSize={dimensions.fontSize}
          fontWeight="500"
        >
          {data[index].name}
        </text>
      </g>
    );
  };

  return (
    <div className="salas-chart-container">
      <h3 className="salas-chart-title">الفواتير</h3>
      <div className="salas-chart-inner">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={dimensions.innerRadius}
              outerRadius={dimensions.outerRadius}
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
              innerRadius={dimensions.innerRadius}
              outerRadius={dimensions.outerRadius}
              dataKey="value"
              labelLine={false}
              label={renderCustomNameLabels}
              fill="transparent"
              isAnimationActive={false}
            />
            {/* النصوص داخل الدائرة */}
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={dimensions.centerTextBigFontSize}
              fontWeight="bold"
              fill="#000"
            >
              74 فاتورة
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={dimensions.centerTextSmallFontSize}
              fill="#666"
            >
              شهر مارس
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <style>{`
        .salas-chart-container {
          width: 600px;
          max-width: 600px;
          min-width: 320px;
          height: 320px;
          background-color: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          margin: 0 auto;
        }
        .salas-chart-title {
          text-align: right;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 16px;
        }
        .salas-chart-inner {
          width: 100%;
          height: calc(100% - 40px);
        }
        @media (max-width: 900px) {
          .salas-chart-container {
            width: 95vw;
            max-width: 95vw;
          }
        }
        @media (max-width: 600px) {
          .salas-chart-container {
            width: 320px;
            max-width: 100vw;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Salas;
