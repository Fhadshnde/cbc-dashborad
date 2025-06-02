import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const BonusesSection = ({ userId, bonuses }) => {
    const [showAddBonusModal, setShowAddBonusModal] = useState(false);
    const [newBonus, setNewBonus] = useState({ description: '', amount: '', date: moment().format('YYYY-MM-DD') });
    const [addBonusError, setAddBonusError] = useState(null);
    const [addBonusSuccess, setAddBonusSuccess] = useState(false);

    const handleAddBonus = async () => {
        try {
            setAddBonusError(null);
            setAddBonusSuccess(false);
            const token = localStorage.getItem('token');
            if (!token) {
                setAddBonusError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`http://31.97.35.42:5000/api/users/${userId}/bonuses`, newBonus, config);
            console.log('Bonus added successfully:', response.data);
            setAddBonusSuccess(true);
            setShowAddBonusModal(false);

            window.location.reload();
        } catch (err) {
            setAddBonusError(err.response?.data?.message || 'فشل إضافة المكافأة.');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">تفاصيل المكافآت</h3>
                <button
                    style={{
                        background: 'linear-gradient(180deg, #00ACC1 0%, #25BC9D 100%)',
                    }}
                    onClick={() => setShowAddBonusModal(true)}
                    className=" text-white rounded-md px-4 py-2 text-sm hover:bg-green-700 transition-colors duration-200"
                >
                    إضافة مكافأة
                </button>
            </div>

            {bonuses && bonuses.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">الوصف</th>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">المبلغ</th>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bonuses.map((bonus, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-3 text-sm text-gray-800">{bonus.description || 'لا يوجد وصف'}</td>
                                    <td className="py-2 px-3 text-sm text-gray-800">{bonus.amount}</td>
                                    <td className="py-2 px-3 text-sm text-gray-800">{moment(bonus.date).format('YYYY-MM-DD')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">لا توجد مكافآت مسجلة لهذا المستخدم.</p>
            )}

            {showAddBonusModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md rtl text-right">
                        <h3 className="text-lg font-bold mb-4">إضافة مكافأة جديدة</h3>
                        {addBonusError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{addBonusError}</div>}
                        {addBonusSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">تم إضافة المكافأة بنجاح!</div>}
                        <div className="mb-4">
                            <label htmlFor="bonusDescription" className="block text-gray-700 text-sm font-bold mb-2">
                                الوصف:
                            </label>
                            <input
                                type="text"
                                id="bonusDescription"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newBonus.description}
                                onChange={(e) => setNewBonus({ ...newBonus, description: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bonusAmount" className="block text-gray-700 text-sm font-bold mb-2">
                                المبلغ:
                            </label>
                            <input
                                type="number"
                                id="bonusAmount"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newBonus.amount}
                                onChange={(e) => setNewBonus({ ...newBonus, amount: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bonusDate" className="block text-gray-700 text-sm font-bold mb-2">
                                التاريخ:
                            </label>
                            <input
                                type="date"
                                id="bonusDate"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newBonus.date}
                                onChange={(e) => setNewBonus({ ...newBonus, date: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAddBonusModal(false)}
                                className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 text-sm hover:bg-gray-400 transition-colors duration-200 ml-2"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleAddBonus}
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

export default BonusesSection;