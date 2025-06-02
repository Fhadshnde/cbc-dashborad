import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const DeductionsSection = ({ userId, deductions }) => {
    const [showAddDeductionModal, setShowAddDeductionModal] = useState(false);
    const [newDeduction, setNewDeduction] = useState({ reason: '', amount: '', date: moment().format('YYYY-MM-DD') });
    const [addDeductionError, setAddDeductionError] = useState(null);
    const [addDeductionSuccess, setAddDeductionSuccess] = useState(false);

    const handleAddDeduction = async () => {
        try {
            setAddDeductionError(null);
            setAddDeductionSuccess(false);
            const token = localStorage.getItem('token');
            if (!token) {
                setAddDeductionError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`https://hawkama.cbc-api.app/api/users/${userId}/deductions`, newDeduction, config);
            console.log('Deduction added successfully:', response.data);
            setAddDeductionSuccess(true);
            setShowAddDeductionModal(false);
            window.location.reload();
        } catch (err) {
            setAddDeductionError(err.response?.data?.message || 'فشل إضافة الخصم.');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">تفاصيل الخصومات</h3>
                <button
                    style={{
                        background: 'linear-gradient(180deg, #00ACC1 0%, #25BC9D 100%)',
                    }}
                    onClick={() => setShowAddDeductionModal(true)}
                    className=" text-white rounded-md px-4 py-2 text-sm hover:bg-green-700 transition-colors duration-200"
                >
                    إضافة خصم
                </button>
            </div>

            {deductions && deductions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">السبب</th>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">المبلغ</th>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {deductions.map((deduction, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-3 text-sm text-gray-800">{deduction.reason || 'لا يوجد سبب'}</td>
                                    <td className="py-2 px-3 text-sm text-gray-800">{deduction.amount}</td>
                                    <td className="py-2 px-3 text-sm text-gray-800">{moment(deduction.date).format('YYYY-MM-DD')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">لا توجد خصومات مسجلة لهذا المستخدم.</p>
            )}

            {showAddDeductionModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md rtl text-right">
                        <h3 className="text-lg font-bold mb-4">إضافة خصم جديد</h3>
                        {addDeductionError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{addDeductionError}</div>}
                        {addDeductionSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">تم إضافة الخصم بنجاح!</div>}
                        <div className="mb-4">
                            <label htmlFor="deductionReason" className="block text-gray-700 text-sm font-bold mb-2">
                                السبب:
                            </label>
                            <input
                                type="text"
                                id="deductionReason"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newDeduction.reason}
                                onChange={(e) => setNewDeduction({ ...newDeduction, reason: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="deductionAmount" className="block text-gray-700 text-sm font-bold mb-2">
                                المبلغ:
                            </label>
                            <input
                                type="number"
                                id="deductionAmount"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newDeduction.amount}
                                onChange={(e) => setNewDeduction({ ...newDeduction, amount: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="deductionDate" className="block text-gray-700 text-sm font-bold mb-2">
                                التاريخ:
                            </label>
                            <input
                                type="date"
                                id="deductionDate"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newDeduction.date}
                                onChange={(e) => setNewDeduction({ ...newDeduction, date: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAddDeductionModal(false)}
                                className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 text-sm hover:bg-gray-400 transition-colors duration-200 ml-2"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleAddDeduction}
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

export default DeductionsSection;