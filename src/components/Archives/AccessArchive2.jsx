import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const ExcelImport = () => {
  const [excelData, setExcelData] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const token = localStorage.getItem("token"); // توكن المستخدم

  // قراءة ملف الإكسل
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const formattedData = data.map((row) => ({
        idOfcbc: row["التسلسل"] || row["idOfcbc"],
        name_ar: row["الاسم بالعربي"] || row["name_ar"],
      }));

      setExcelData(formattedData);
      setUploadResults([]); // إعادة تعيين النتائج
    };
    reader.readAsBinaryString(file);
  };

  // رفع البيانات دفعة واحدة
  const handleUpload = async () => {
    if (!excelData.length) return alert("لا يوجد بيانات للرفع");

    const results = [];

    // استخدام Promise.all لتسريع الرفع
    await Promise.all(
      excelData.map(async (row) => {
        try {
          const response = await axios.put(
            `https://hawkama.cbc-api.app/api/reports/update-name/${row.idOfcbc}`,
            { name_ar: row.name_ar },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          results.push({ idOfcbc: row.idOfcbc, status: "نجاح" });
        } catch (err) {
          results.push({ idOfcbc: row.idOfcbc, status: "فشل", error: err.message });
        }
      })
    );

    setUploadResults(results);
    alert("تمت محاولة تحديث كل البيانات");
  };

  return (
    <div className="p-4 border rounded-md shadow-md w-full max-w-md">
      <h2 className="text-lg font-bold mb-2">رفع ملف Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {excelData.length > 0 && (
        <>
          <table className="w-full border mt-3">
            <thead>
              <tr>
                <th className="border px-2">رقم البطاقة</th>
                <th className="border px-2">الاسم بالعربي</th>
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2">{row.idOfcbc}</td>
                  <td className="border px-2">{row.name_ar}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleUpload}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            رفع وتحديث الأسماء
          </button>
        </>
      )}

      {uploadResults.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">نتائج التحديث:</h3>
          <ul>
            {uploadResults.map((res, idx) => (
              <li key={idx}>
                {res.idOfcbc}: {res.status} {res.error ? `- ${res.error}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExcelImport;
