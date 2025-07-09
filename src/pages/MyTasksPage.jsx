import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate fetching data from an API
    const fakeRegionalData = {
      baghdad: {
        governorateName: "بغداد",
        areas: [
          {
            areaName: "المنصور",
            contractsExpiringSoon: [
              { id: 1, name: "عقد متجر المنصور أ", expiresInDays: 25 },
              { id: 2, name: "عقد صيانة المنصور ب", expiresInDays: 10 },
            ],
            surveysNeedingFollowUp: [
              { id: 1, title: "استبيان المنصور التجاري", status: "لم يُستكمل" },
              { id: 2, title: "استبيان رضا عملاء المنصور", status: "يحتاج الى متابعة" },
            ],
          },
          {
            areaName: "الكرادة",
            contractsExpiringSoon: [
              { id: 3, name: "عقد مجمع الكرادة السكني", expiresInDays: 45 },
              { id: 4, name: "عقد تجهيز الكرادة ج", expiresInDays: 5 },
            ],
            surveysNeedingFollowUp: [
              { id: 3, title: "استبيان مجمع الكرادة", status: "في الانتظار" },
            ],
          },
          {
            areaName: "زيونة",
            contractsExpiringSoon: [
              { id: 5, name: "عقد شركة زيونة للخدمات", expiresInDays: 15 },
            ],
            surveysNeedingFollowUp: [
              { id: 4, title: "استبيان خدمة زيونة", status: "لم يتم فتحه" },
              { id: 5, title: "استبيان تطوير زيونة", status: "تحت المراجعة" },
            ],
          },
          {
            areaName: "الأعظمية",
            contractsExpiringSoon: [
              { id: 6, name: "عقد مشروع الأعظمية الجديد", expiresInDays: 30 },
              { id: 7, name: "عقد صيانة الأعظمية د", expiresInDays: 2 },
            ],
            surveysNeedingFollowUp: [
              { id: 6, title: "استبيان الأعظمية العقاري", status: "جارٍ التواصل" },
            ],
          },
          {
            areaName: "اليرموك",
            contractsExpiringSoon: [
              { id: 8, name: "عقد متجر اليرموك الترفيهي", expiresInDays: 60 },
            ],
            surveysNeedingFollowUp: [
              { id: 7, title: "استبيان اليرموك للخدمات", status: "بانتظار التوقيع" },
            ],
          },
          {
            areaName: "شارع فلسطين",
            contractsExpiringSoon: [
              { id: 9, name: "عقد مطعم شارع فلسطين", expiresInDays: 7 },
            ],
            surveysNeedingFollowUp: [
              { id: 8, title: "استبيان مطاعم شارع فلسطين", status: "تم إرساله ولم يُرد" },
            ],
          },
          {
            areaName: "الكاظمية",
            contractsExpiringSoon: [
              { id: 10, name: "عقد فندق الكاظمية", expiresInDays: 12 },
            ],
            surveysNeedingFollowUp: [
              { id: 9, title: "استبيان فندق الكاظمية", status: "بانتظار تدقيق الإدارة" },
            ],
          },
        ],
      },
      basra: {
        governorateName: "البصرة",
        areas: [
          {
            areaName: "الزبير",
            contractsExpiringSoon: [
              { id: 11, name: "عقد مصنع الزبير", expiresInDays: 20 },
            ],
            surveysNeedingFollowUp: [
              { id: 10, title: "استبيان مصنع الزبير", status: "لم يتم فتحه" },
            ],
          },
        ],
      },
      erbil: {
        governorateName: "أربيل",
        areas: [
          {
            areaName: "عينكاوة",
            contractsExpiringSoon: [
              { id: 12, name: "عقد مجمع عينكاوة السكني", expiresInDays: 35 },
            ],
            surveysNeedingFollowUp: [
              { id: 11, title: "استبيان مجمع عينكاوة", status: "في الانتظار" },
            ],
          },
        ],
      },
    };

    setTimeout(() => {
      setData(fakeRegionalData);
    }, 1000);
  }, []);

  if (!data) return <div className="p-4 text-center text-gray-700 font-semibold">...جاري تحميل البيانات</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-right">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">لوحة التحكم</h1>

      {Object.keys(data).map((governorateKey) => {
        const governorate = data[governorateKey];
        return (
          <div key={governorateKey} className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-green-500 pb-2">
              المحافظة: {governorate.governorateName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {governorate.areas.map((area) => (
                <div key={area.areaName} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    المنطقة: {area.areaName}
                  </h3>

                  {/* قسم العقود التي ستنتهي قريباً لهذه المنطقة */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3 flex items-center gap-2 text-red-600">
                      <Clock className="w-4 h-4" /> العقود التي ستنتهي قريباً
                    </h4>
                    {area.contractsExpiringSoon.length === 0 ? (
                      <p className="text-gray-500 text-sm">لا توجد عقود ستنتهي قريباً في هذه المنطقة.</p>
                    ) : (
                      <ul className="space-y-3">
                        {area.contractsExpiringSoon.map((contract) => (
                          <li
                            key={contract.id}
                            className="bg-red-50 border border-red-200 p-3 rounded-lg shadow-sm"
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

                  {/* قسم الاستبيانات التي تحتاج متابعة لهذه المنطقة */}
                  <div>
                    <h4 className="text-lg font-medium mb-3 flex items-center gap-2 text-yellow-600">
                      <AlertTriangle className="w-4 h-4" /> الاستبيانات التي تحتاج متابعة
                    </h4>
                    {area.surveysNeedingFollowUp.length === 0 ? (
                      <p className="text-gray-500 text-sm">لا توجد استبيانات تحتاج متابعة في هذه المنطقة.</p>
                    ) : (
                      <ul className="space-y-3">
                        {area.surveysNeedingFollowUp.map((survey) => (
                          <li
                            key={survey.id}
                            className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg shadow-sm"
                          >
                            <div className="font-medium text-gray-800">{survey.title}</div>
                            <div className="text-sm text-yellow-700">الحالة: {survey.status}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;