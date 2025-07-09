import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding, FaClipboardList, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
// استيراد مكون Link من مكتبة react-router-dom للتنقل الداخلي الصحيح
import { Link } from 'react-router-dom';

const EmployeesWithUnfinishedSurveys = () => {
    const [employeesData, setEmployeesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // محاكاة جلب البيانات من API
        const fetchEmployeesWithSurveys = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const data = [
                        {
                            id: 1,
                            employeeName: 'علياء احمد',
                            contract: {
                                id: 'C001',
                                title: 'عقد توريد مستلزمات مكتبية',
                                storeName: 'متجر الأمل',
                                signatureDate: '2024-05-15',
                                address: 'بغداد، المنصور، شارع 14 رمضان',
                            },
                            survey: {
                                status: 'لم يتم البدء', // أو 'لم يُستكمل', 'لم يتم فتحه'
                                link: '/surveys/add', // تم التأكد من أن هذا المسار هو /surveys/add
                            },
                        },
                        {
                            id: 2,
                            employeeName: 'فاطمة الزهراء',
                            contract: {
                                id: 'C002',
                                title: 'عقد خدمات صيانة دورية',
                                storeName: 'سوبر ماركت الفرح',
                                signatureDate: '2024-06-01',
                                address: 'البصرة، الجمهورية، شارع الكندي',
                            },
                            survey: {
                                status: 'لم يُستكمل',
                                link: '/surveys/add', // تم التأكد من أن هذا المسار هو /surveys/add
                            },
                        },
                        {
                            id: 3,
                            employeeName: 'محمد جاسم',
                            contract: {
                                id: 'C003',
                                title: 'عقد استشارات تسويقية',
                                storeName: 'شركة النجوم للإعلان',
                                signatureDate: '2024-04-20',
                                address: 'أربيل، عينكاوة، مجمع 31',
                            },
                            survey: {
                                status: 'لم يتم فتحه',
                                link: '/surveys/add', // تم التأكد من أن هذا المسار هو /surveys/add
                            },
                        },
                        {
                            id: 4,
                            employeeName: 'ليلى خالد',
                            contract: {
                                id: 'C004',
                                title: 'عقد تصميم داخلي',
                                storeName: 'معرض الفن الحديث',
                                signatureDate: '2024-07-01',
                                address: 'بغداد، الكرادة، شارع أرقام',
                            },
                            survey: {
                                status: 'لم يتم البدء',
                                link: '/surveys/add', // تم التأكد من أن هذا المسار هو /surveys/add
                            },
                        },
                        {
                            id: 5,
                            employeeName: 'أحمد علي',
                            contract: {
                                id: 'C005',
                                title: 'عقد تطوير تطبيقات',
                                storeName: 'مركز التكنولوجيا المتقدمة',
                                signatureDate: '2024-03-10',
                                address: 'الموصل، الحدباء، حي العلماء',
                            },
                            survey: {
                                status: 'لم يُستكمل',
                                link: '/surveys/add', // تم التأكد من أن هذا المسار هو /surveys/add
                            },
                        },
                        {
                            id: 6,
                            employeeName: 'سارة يوسف',
                            contract: {
                                id: 'C006',
                                title: 'عقد توريد أغذية',
                                storeName: 'سلسلة متاجر الخير',
                                signatureDate: '2024-06-25',
                                address: 'ذي قار، الناصرية، سوق الشيوخ',
                            },
                            survey: {
                                status: 'لم يتم فتحه',
                                link: '/surveys/add', // تم التأكد من أن هذا المسار هو /surveys/add
                            },
                        },
                        {
                            id: 7,
                            employeeName: 'مصطفى قاسم',
                            contract: {
                                id: 'C007',
                                title: 'عقد تركيب كاميرات مراقبة',
                                storeName: 'شركة الأمن الذكي',
                                signatureDate: '2024-04-05',
                                address: 'بغداد، زيونة، شارع الربيعي',
                            },
                            survey: {
                                status: 'لم يتم البدء',
                                link: '/surveys/add', // تم التأكد من أن هذا المسار هو /surveys/add
                            },
                        },
                        {
                            id: 8,
                            employeeName: 'زينب هادي',
                            contract: {
                                id: 'C008',
                                title: 'عقد استشارات قانونية',
                                storeName: 'مكتب المحاماة الدولي',
                                signatureDate: '2024-05-30',
                                address: 'بغداد، الأعظمية، شارع الضباط',
                            },
                            survey: {
                                status: 'لم يُستكمل',
                                link: '/surveys/add', // تم التأكد من أن هذا المسار هو /surveys/add
                            },
                        },
                        {
                            id: 9,
                            employeeName: 'علياء احمد',
                            contract: {
                                id: 'C009',
                                title: 'عقد تدريب موظفين',
                                storeName: 'مركز التميز للتدريب',
                                signatureDate: '2024-06-10',
                                address: 'بغداد، اليرموك، شارع بغداد',
                            },
                            survey: {
                                status: 'لم يتم البدء',
                                link: '/surveys/add', // تم التأكد من أن هذا المسار هو /surveys/add
                            },
                        },
                    ];
                    resolve(data);
                }, 1500); // محاكاة تأخير الشبكة
            });
        };

        fetchEmployeesWithSurveys()
            .then(data => {
                // تصفية البيانات لعرض الموظفين الذين لديهم عقود ولكن لم يستكملوا الاستبيان
                const filteredData = data.filter(item =>
                    item.survey.status === 'لم يتم البدء' ||
                    item.survey.status === 'لم يُستكمل' ||
                    item.survey.status === 'لم يتم فتحه'
                );
                setEmployeesData(filteredData);
                setLoading(false);
            })
            .catch(err => {
                setError('فشل في جلب البيانات.');
                setLoading(false);
                console.error(err);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center rtl">
                <p className="text-xl text-gray-700">جاري تحميل بيانات الموظفين...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center rtl">
                <p className="text-xl text-red-600">حدث خطأ: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 rtl" style={{ direction: 'rtl' }}>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    الموظفون ذوو العقود والاستبيانات غير المكتملة
                </h1>

                {employeesData.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
                        <p>لا توجد بيانات عن موظفين لديهم عقود واستبيانات غير مكتملة في الوقت الحالي.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employeesData.map((employee) => (
                            <div key={employee.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FaUser className="ml-2 text-blue-500" />
                                    {employee.employeeName}
                                </h2>

                                <div className="space-y-3 text-gray-700">
                                    {employee.contract && (
                                        <>
                                            <p className="flex items-center">
                                                <FaClipboardList className="ml-2 text-green-500" />
                                                <span className="font-semibold">العقد:</span> {employee.contract.title}
                                            </p>
                                            <p className="flex items-center">
                                                <FaBuilding className="ml-2 text-purple-500" />
                                                <span className="font-semibold">المتجر:</span> {employee.contract.storeName}
                                            </p>
                                            <p className="flex items-center">
                                                <FaCalendarAlt className="ml-2 text-orange-500" />
                                                <span className="font-semibold">تاريخ التوقيع:</span> {employee.contract.signatureDate}
                                            </p>
                                            <p className="flex items-center">
                                                <FaMapMarkerAlt className="ml-2 text-red-500" />
                                                <span className="font-semibold">العنوان:</span> {employee.contract.address}
                                            </p>
                                        </>
                                    )}
                                    {employee.survey && (
                                        <p className="flex items-center">
                                            <FaClipboardList className="ml-2 text-yellow-500" />
                                            <span className="font-semibold">حالة الاستبيان:</span>
                                            <span className="font-bold text-red-500 mr-1">{employee.survey.status}</span>
                                            {/* استخدام مكون Link للتنقل الداخلي بدلاً من <a> */}
                                            <Link
                                                to="/surveys/add" // استخدام 'to' بدلاً من 'href'
                                                className="text-blue-600 hover:underline mr-2"
                                            >
                                                (بدء الاستبيان)
                                            </Link>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeesWithUnfinishedSurveys;