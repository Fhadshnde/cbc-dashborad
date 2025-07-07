import React, { useState } from 'react';
import { FaDownload, FaChartBar, FaChevronDown } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ReportsAndAnalytics = () => {
  // State for dropdowns
  const [selectedRegionPerformance, setSelectedRegionPerformance] = useState('');
  const [selectedStoreResponse, setSelectedStoreResponse] = useState('');
  const [selectedRegionRevenue, setSelectedRegionRevenue] = useState('');

  // Dummy data for charts
  const employeePerformanceData = {
    labels: ['علياء', 'ولاء', 'صفيه', 'ساره', 'نور الهدى', 'علياء'],
    datasets: [
      {
        data: [1250, 3250, 2250, 1250, 1000, 3500],
        backgroundColor: ['#F6D060', '#63B3ED', '#A0D995', '#63B3ED', '#63B3ED', '#25BC9D'],
        barThickness: 40, // Adjust bar thickness as needed
        borderRadius: 8, // Rounded corners for bars
      },
    ],
  };

  const storeResponseData = {
    labels: ['متجر رصافة', 'متجر 2', 'متجر 3'],
    datasets: [
      {
        data: [50, 60, 35],
        backgroundColor: ['#6CC7B2', '#25BC9D', '#63B3ED'],
        borderColor: ['#6CC7B2', '#25BC9D', '#63B3ED'],
        borderWidth: 1,
      },
    ],
  };

  const revenueBySubscriptionsData = {
    labels: ['شركه 1', 'شركه 1', 'شركه 1', 'شركه 1', 'شركه 1'],
    datasets: [
      {
        data: [2450, 3250, 2250, 1250, 3500],
        backgroundColor: ['#F6D060', '#63B3ED', '#A0D995', '#63B3ED', '#25BC9D'],
        barThickness: 40,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend for these specific charts if not needed
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            if (context.dataset.label) {
              label = context.dataset.label + ': ' + label;
            }
            // For pie chart, show percentage
            if (context.chart.config.type === 'pie') {
              const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(0) + '%';
              return `${context.label}: ${percentage}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          color: '#6B7280', // Text color for x-axis labels
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB', // Y-axis grid line color
        },
        ticks: {
          color: '#6B7280', // Text color for y-axis labels
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right', // Position legend to the right
        labels: {
          boxWidth: 12,
          padding: 20,
          color: '#4B5563', // Legend text color
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(0);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" style={{ direction: 'rtl' }}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg text-[#25BC9D] ml-3">
            <FaChartBar className="text-xl" />
          </div>
          التقارير والتحليلات
        </h2>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition flex items-center">
          <FaDownload className="ml-2 text-[#25BC9D]" />
          تصدير
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Response Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">تجاوب المتاجر</h3>
            <div className="relative inline-block text-right">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedStoreResponse}
                onChange={(e) => setSelectedStoreResponse(e.target.value)}
              >
                <option value="">اختر المتجر</option>
                <option value="متجر 1">متجر 1</option>
                <option value="متجر 2">متجر 2</option>
                <option value="متجر 3">متجر 3</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="text-xs" />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center h-80">
            <Pie data={storeResponseData} options={pieChartOptions} />
          </div>
        </div>

        {/* Employee Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">أداء الموظفات</h3>
            <div className="relative inline-block text-right">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedRegionPerformance}
                onChange={(e) => setSelectedRegionPerformance(e.target.value)}
              >
                <option value="">اختر المحافظة</option>
                <option value="بغداد">بغداد</option>
                <option value="البصرة">البصرة</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="text-xs" />
              </div>
            </div>
          </div>
          <div className="h-80 flex items-end"> {/* Use flex items-end to align bars to bottom */}
            <Bar data={employeePerformanceData} options={chartOptions} />
          </div>
        </div>

        {/* Revenue by Subscriptions Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2"> {/* Span full width for this chart */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">الإيرادات حسب الاشتراكات</h3>
            <div className="relative inline-block text-right">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedRegionRevenue}
                onChange={(e) => setSelectedRegionRevenue(e.target.value)}
              >
                <option value="">اختر المحافظة</option>
                <option value="بغداد">بغداد</option>
                <option value="البصرة">البصرة</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="text-xs" />
              </div>
            </div>
          </div>
          <div className="h-80 flex items-end"> {/* Use flex items-end to align bars to bottom */}
            <Bar data={revenueBySubscriptionsData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAndAnalytics;