import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const AdvancesSection = ({ userId, salaryAdvances }) => {
    const [showAddAdvanceModal, setShowAddAdvanceModal] = useState(false);
    const [newAdvance, setNewAdvance] = useState({ type: 'salary', amount: '', date: moment().format('YYYY-MM-DD') });
    const [addAdvanceError, setAddAdvanceError] = useState(null);
    const [addAdvanceSuccess, setAddAdvanceSuccess] = useState(false);

    const handleAddAdvance = async () => {
        try {
            setAddAdvanceError(null);
            setAddAdvanceSuccess(false);
            const token = localStorage.getItem('token');
            if (!token) {
                setAddAdvanceError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`https://hawkama.cbc-api.app/api/users/${userId}/salary-advances`, newAdvance, config);
            console.log('Advance added successfully:', response.data);
            setAddAdvanceSuccess(true);
            setShowAddAdvanceModal(false);
            window.location.reload();
        } catch (err) {
            setAddAdvanceError(err.response?.data?.message || 'فشل إضافة السلفة.');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">تفاصيل السلف</h3>
                <button
                    style={{
                        background: 'linear-gradient(180deg, #00ACC1 0%, #25BC9D 100%)',
                    }}
                    onClick={() => setShowAddAdvanceModal(true)}
                    className=" text-white rounded-md px-4 py-2 text-sm hover:bg-green-700 transition-colors duration-200"
                >
                    إضافة سلفة
                </button>
            </div>

            {salaryAdvances && salaryAdvances.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">النوع</th>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">المبلغ</th>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salaryAdvances.map((advance, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-3 text-sm text-gray-800">
                                        {advance.type === 'salary' ? 'على الراتب' : 'بالتقسيط'}
                                    </td>
                                    <td className="py-2 px-3 text-sm text-gray-800">{advance.amount}</td>
                                    <td className="py-2 px-3 text-sm text-gray-800">{moment(advance.date).format('YYYY-MM-DD')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">لا توجد سلف مسجلة لهذا المستخدم.</p>
            )}

            {showAddAdvanceModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md rtl text-right">
                        <h3 className="text-lg font-bold mb-4">إضافة سلفة جديدة</h3>
                        {addAdvanceError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{addAdvanceError}</div>}
                        {addAdvanceSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">تم إضافة السلفة بنجاح!</div>}
                        <div className="mb-4">
                            <label htmlFor="advanceType" className="block text-gray-700 text-sm font-bold mb-2">
                                النوع:
                            </label>
                            <select
                                id="advanceType"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newAdvance.type}
                                onChange={(e) => setNewAdvance({ ...newAdvance, type: e.target.value })}
                            >
                                <option value="salary">على الراتب</option>
                                <option value="installment">بالتقسيط</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="advanceAmount" className="block text-gray-700 text-sm font-bold mb-2">
                                المبلغ:
                            </label>
                            <input
                                type="number"
                                id="advanceAmount"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newAdvance.amount}
                                onChange={(e) => setNewAdvance({ ...newAdvance, amount: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="advanceDate" className="block text-gray-700 text-sm font-bold mb-2">
                                التاريخ:
                            </label>
                            <input
                                type="date"
                                id="advanceDate"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newAdvance.date}
                                onChange={(e) => setNewAdvance({ ...newAdvance, date: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAddAdvanceModal(false)}
                                className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 text-sm hover:bg-gray-400 transition-colors duration-200 ml-2"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleAddAdvance}
                                className="bg-green-600 text-white rounded-md px-4 py-2 text-sm hover:bg-green-700 transition-colors duration-200"
                            >
                                إضافة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancesSection;