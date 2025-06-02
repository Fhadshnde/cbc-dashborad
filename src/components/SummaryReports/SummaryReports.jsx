import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'; 

const SummaryReports = () => {
  const [adminStats, setAdminStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const navigate = useNavigate();

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: startDate,
          endDate: endDate,
        }
      };

      const response = await axios.get('http://31.97.35.42:5000/api/reports/admins/stats', config);
      setAdminStats(response.data.stats);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch admin stats');
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchAdminStats();
  }, [startDate, endDate]); 

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    let start = '';
    let end = '';
    const now = moment();

    if (period === 'daily') {
      start = now.startOf('day').toISOString();
      end = now.endOf('day').toISOString();
    } else if (period === 'weekly') {
      start = now.startOf('week').toISOString();
      end = now.endOf('week').toISOString();
    } else if (period === 'monthly') {
      start = now.startOf('month').toISOString();
      end = now.endOf('month').toISOString();
    } else if (period === 'halfYearly') {
      start = now.subtract(6, 'months').startOf('month').toISOString();
      end = moment().endOf('month').toISOString();
    } else if (period === 'yearly') {
      start = now.startOf('year').toISOString();
      end = now.endOf('year').toISOString();
    }
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = () => {
    fetchAdminStats();
  };

  const handleExport = () => {
    alert('Export functionality to be implemented!');
  };

  const handleAdminClick = (adminUsername) => {
    navigate(`/reports/admin/${adminUsername}`);
  };

  return (
    <div className="p-5 font-sans rtl text-right">
        
      <div className="flex flex-wrap items-center justify-between mb-5 gap-4">
        <button
          className="bg-gray-100 text-gray-800 border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center hover:bg-gray-200 transition-colors duration-200"
          onClick={handleExport}
        >
          <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V5.5a.5.5 0 0 0-1 0v4.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
          </svg>
          تصدير
        </button>

        <div className="flex flex-wrap items-center gap-2 mr-auto"> 
          <label htmlFor="startDate" className="font-bold text-gray-700 whitespace-nowrap">يبدأ في</label>
          <input
            type="date"
            id="startDate"
            value={startDate ? moment(startDate).format('YYYY-MM-DD') : ''}
            onChange={(e) => setStartDate(moment(e.target.value).startOf('day').toISOString())}
            className="p-2 border border-gray-300 rounded-md text-sm w-40"
          />
          <label htmlFor="endDate" className="font-bold text-gray-700 whitespace-nowrap">ينتهي في</label>
          <input
            type="date"
            id="endDate"
            value={endDate ? moment(endDate).format('YYYY-MM-DD') : ''}
            onChange={(e) => setEndDate(moment(e.target.value).endOf('day').toISOString())}
            className="p-2 border border-gray-300 rounded-md text-sm w-40"
          />
          <button
            className="bg-green-500 text-white rounded-md px-4 py-2 text-sm hover:bg-green-600 transition-colors duration-200"
            onClick={handleSearch}
          >
            بحث
          </button>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0 ml-auto"> 
          <button
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              selectedPeriod === 'daily' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => handlePeriodChange('daily')}
          >
            يومي
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              selectedPeriod === 'weekly' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => handlePeriodChange('weekly')}
          >
            أسبوعي
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              selectedPeriod === 'monthly' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => handlePeriodChange('monthly')}
          >
            شهري
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              selectedPeriod === 'halfYearly' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => handlePeriodChange('halfYearly')}
          >
            نصف سنوي
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              selectedPeriod === 'yearly' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => handlePeriodChange('yearly')}
          >
            سنوي
          </button>
        </div>
      </div>

      {loading && <div className="text-center p-5 text-gray-600">جاري تحميل الإحصائيات...</div>}
      {error && <div className="text-red-500 text-center p-5">خطأ: {error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">اسم موظف المبيعات</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">مجموع البطاقات الكلية</th>
              </tr>
            </thead>
            <tbody>
              {adminStats.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-5 text-gray-500">لا توجد تقارير متاحة لهذه الفترة.</td>
                </tr>
              ) : (
                adminStats.map((stat) => (
                  <tr key={stat.admin} className="border-b border-gray-200 hover:bg-gray-50">
                    <td
                      className="py-3 px-4  font-bold cursor-pointer hover:underline"
                      onClick={() => handleAdminClick(stat.admin)}
                      title={`عرض تقارير ${stat.admin}`}
                    >
                      {stat.admin}
                    </td>
                    <td className="py-3 px-4 text-gray-800">{stat.totalCards}</td>
                  </tr>
                ))
              )}
            </tbody>  
          </table>
        </div>
      )}
    </div>
  );
};

export default SummaryReports;