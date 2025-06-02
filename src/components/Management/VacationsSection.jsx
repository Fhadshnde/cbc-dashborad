import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const VacationsSection = ({ userId, vacations }) => {
    const [showAddVacationModal, setShowAddVacationModal] = useState(false);
    const [newVacation, setNewVacation] = useState({
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        reason: ''
    });
    const [addVacationError, setAddVacationError] = useState(null);
    const [addVacationSuccess, setAddVacationSuccess] = useState(false);

    const handleAddVacation = async () => {
        try {
            setAddVacationError(null);
            setAddVacationSuccess(false);
            const token = localStorage.getItem('token');
            if (!token) {
                setAddVacationError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (moment(newVacation.startDate).isAfter(moment(newVacation.endDate))) {
                setAddVacationError('تاريخ البدء لا يمكن أن يكون بعد تاريخ الانتهاء.');
                return;
            }

            const response = await axios.post(`https://hawkama.cbc-api.app/api/users/${userId}/vacations`, newVacation, config);
            setAddVacationSuccess(true);
            setShowAddVacationModal(false);
            window.location.reload();
        } catch (err) {
            setAddVacationError(err.response?.data?.message || 'فشل إضافة الإجازة.');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">تفاصيل الإجازات</h3>
                <button
                            style={{
                                background: 'linear-gradient(180deg, #00ACC1 0%, #25BC9D 100%)',
                              }}
                    onClick={() => setShowAddVacationModal(true)}
                    className=" text-white rounded-md px-4 py-2 text-sm hover:bg-blue-700 transition-colors duration-200"
                >
                    إضافة إجازة
                </button>
            </div>

            {vacations && vacations.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">تاريخ البدء</th>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">تاريخ الانتهاء</th>
                                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">السبب</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vacations.map((vacation, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-3 text-sm text-gray-800">{moment(vacation.startDate).format('YYYY-MM-DD')}</td>
                                    <td className="py-2 px-3 text-sm text-gray-800">{moment(vacation.endDate).format('YYYY-MM-DD')}</td>
                                    <td className="py-2 px-3 text-sm text-gray-800">{vacation.reason || 'لا يوجد سبب'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">لا توجد إجازات مسجلة لهذا المستخدم.</p>
            )}

            {showAddVacationModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md rtl text-right">
                        <h3 className="text-lg font-bold mb-4">إضافة إجازة جديدة</h3>
                        {addVacationError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{addVacationError}</div>}
                        {addVacationSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">تم إضافة الإجازة بنجاح!</div>}
                        <div className="mb-4">
                            <label htmlFor="vacationStartDate" className="block text-gray-700 text-sm font-bold mb-2">
                                تاريخ البدء:
                            </label>
                            <input
                                type="date"
                                id="vacationStartDate"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newVacation.startDate}
                                onChange={(e) => setNewVacation({ ...newVacation, startDate: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="vacationEndDate" className="block text-gray-700 text-sm font-bold mb-2">
                                تاريخ الانتهاء:
                            </label>
                            <input
                                type="date"
                                id="vacationEndDate"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newVacation.endDate}
                                onChange={(e) => setNewVacation({ ...newVacation, endDate: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="vacationReason" className="block text-gray-700 text-sm font-bold mb-2">
                                السبب:
                            </label>
                            <input
                                type="text"
                                id="vacationReason"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newVacation.reason}
                                onChange={(e) => setNewVacation({ ...newVacation, reason: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAddVacationModal(false)}
                                className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 text-sm hover:bg-gray-400 transition-colors duration-200 ml-2"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleAddVacation}
                                className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm hover:bg-blue-700 transition-colors duration-200"
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

export default VacationsSection;