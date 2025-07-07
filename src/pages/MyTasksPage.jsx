import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fakeData = {
      contractsExpiringSoon: [
        { id: 1, name: "عقد متجر النور", expiresInDays: 31 },
        { id: 2, name: "عقد متجر الراية", expiresInDays: 71 },
        { id: 3, name: "عقد متجر البيان", expiresInDays: 29 },
        { id: 4, name: "عقد متجر الأمل", expiresInDays: 30 },
        { id: 5, name: "عقد متجر النخبة", expiresInDays: 9 },
        { id: 6, name: "عقد متجر التعاون", expiresInDays: 1 },
        { id: 7, name: "عقد متجر السلام", expiresInDays: 14 },
        { id: 8, name: "عقد متجر الشروق", expiresInDays: 3 },
        { id: 9, name: "عقد متجر العاصمة", expiresInDays: 20 },
        { id: 10, name: "عقد متجر الفرات", expiresInDays: 5 },
      ],
      surveysNeedingFollowUp: [
        { id: 1, title: "استبيان متجر النور", status: "لم يُستكمل" },
        { id: 2, title: "استبيان متجر الراية", status: "في الانتظار" },
        { id: 3, title: "استبيان متجر الأمل", status: "يحتاج الى متابعة" },
        { id: 4, title: "استبيان متجر التعاون", status: "لم يتم فتحه" },
        { id: 5, title: "استبيان متجر الفجر", status: "تحت المراجعة" },
        { id: 6, title: "استبيان متجر الإيمان", status: "جارٍ التواصل" },
        { id: 7, title: "استبيان متجر العاصمة", status: "بانتظار التوقيع" },
        { id: 8, title: "استبيان متجر النجمة", status: "تم إرساله ولم يُرد" },
        { id: 9, title: "استبيان متجر الإتقان", status: "بانتظار تدقيق الإدارة" },
        { id: 10, title: "استبيان متجر البركة", status: "بانتظار ملء الحقول" },
      ],
    };

    setTimeout(() => {
      setData(fakeData);
    }, 1000);
  }, []);

  if (!data) return <div className="p-4 text-center">...جاري تحميل البيانات</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-right">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">لوحة التحكم</h1>

      <div className="grid grid-cols-1 h-[900px] md:grid-cols-2 gap-6">
        {/* العقود */}
        <div className="bg-gradient-to-br from-red-200 to-white p-6 rounded-2xl shadow-lg border border-red-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-700">
            <Clock className="w-5 h-5" /> العقود التي ستنتهي قريباً
          </h2>
          {data.contractsExpiringSoon.length === 0 ? (
            <p className="text-gray-600">لا توجد عقود ستنتهي قريباً</p>
          ) : (
            <ul className="space-y-4 max-h-[500px] pr-2">
              {data.contractsExpiringSoon.map((contract) => (
                <li
                  key={contract.id}
                  className="bg-white border border-red-300 p-3 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="font-medium text-gray-800">{contract.name}</div>
                  <div className="text-sm text-red-600">
                    ينتهي خلال {contract.expiresInDays} أيام
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* الاستبيانات */}
        <div className="bg-gradient-to-br h-[900px] from-yellow-50 to-white p-6 rounded-2xl shadow-lg border border-yellow-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-700">
            <AlertTriangle className="w-5 h-5" /> الاستبيانات التي تحتاج متابعة
          </h2>
          {data.surveysNeedingFollowUp.length === 0 ? (
            <p className="text-gray-600">لا توجد استبيانات تحتاج متابعة</p>
          ) : (
            <ul className="space-y-4 max-h-[900px]  pr-2">
              {data.surveysNeedingFollowUp.map((survey) => (
                <li
                  key={survey.id}
                  className="bg-white border border-yellow-100 p-3 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="font-medium text-gray-800">{survey.title}</div>
                  <div className="text-sm text-yellow-700">الحالة: {survey.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
