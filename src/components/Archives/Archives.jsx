import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://hawkama.cbc-api.app/api/reports";
const ITEMS_PER_PAGE = 10;

const AccessArchive = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [pdfLibsLoaded, setPdfLibsLoaded] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeader() });
      setReports(response.data);
      setFilteredReports(response.data);
      setCurrentPage(1); 
    } catch (err) {
      setError("فشل في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPdfLibraries = () => {
      // التحقق من تحميل jsPDF و html2canvas
      if (typeof window.jspdf !== 'undefined' && typeof window.html2canvas !== 'undefined') {
        setPdfLibsLoaded(true);
        return;
      }

      const scriptHtml2Canvas = document.createElement('script');
      scriptHtml2Canvas.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      scriptHtml2Canvas.async = true;
      scriptHtml2Canvas.onload = () => {
        const scriptJsPDF = document.createElement('script');
        scriptJsPDF.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        scriptJsPDF.async = true;
        scriptJsPDF.onload = () => {
          setPdfLibsLoaded(true);
        };
        scriptJsPDF.onerror = () => {
          console.error("فشل تحميل jsPDF.");
          alert("فشل تحميل مكتبة jsPDF. يرجى التحقق من اتصال الإنترنت.");
        };
        document.head.appendChild(scriptJsPDF);
      };
      scriptHtml2Canvas.onerror = () => {
        console.error("فشل تحميل html2canvas.");
        alert("فشل تحميل مكتبة html2canvas. يرجى التحقق من اتصال الإنترنت.");
      };
      document.head.appendChild(scriptHtml2Canvas);
    };

    loadPdfLibraries();
  }, []);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    handleSearch(); 
  }, [startDate, endDate, searchText, reports]); 

  const handleSearch = () => {
    let result = reports;

    if (startDate || endDate) {
      result = result.filter((r) => {
        const reportDate = new Date(r.createdAt);
        reportDate.setHours(0, 0, 0, 0); 

        const start = startDate ? new Date(startDate) : null;
        if (start) start.setHours(0, 0, 0, 0); 

        const end = endDate ? new Date(endDate) : null;
        if (end) end.setHours(23, 59, 59, 999); 

        if (start && reportDate.getTime() < start.getTime()) {
          return false;
        }
        if (end && reportDate.getTime() > end.getTime()) {
          return false;
        }
        return true;
      });
    }

    if (searchText.trim()) {
      const search = searchText.trim().toLowerCase();
      result = result.filter(
        (r) =>
          (r.name_ar && r.name_ar.toLowerCase().includes(search)) ||
          (r.phoneNumber && r.phoneNumber.toLowerCase().includes(search)) ||
          (r.admin && r.admin.toLowerCase().includes(search)) ||
          (r.id !== null && r.id !== undefined && String(r.id).toLowerCase().includes(search))
      );
    }

    setFilteredReports(result);
    setCurrentPage(1); 
  };

  const renderStatus = (status) => {
    const colors = {
      pending: "bg-orange-100 text-orange-600",
      rejected: "bg-red-100 text-red-600",
      canceled: "bg-red-100 text-red-600",
      received: "bg-green-100 text-green-600",
      processing: "bg-blue-100 text-blue-600",
      approved: "bg-teal-100 text-teal-600",
    };

    const texts = {
      pending: "قيد الانتظار",
      rejected: "مرفوضة",
      canceled: "تم الغاءها",
      received: "مستلمة",
      processing: "قيد المعالجة",
      approved: "تم القبول",
    };

    return (
      <span className={`px-3 py-1 rounded text-sm ${colors[status] || ""}`}>
        {texts[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const exportToExcel = (data, fileName = "Reports") => {
    if (!data || data.length === 0) {
      alert("لا توجد بيانات للتصدير.");
      return;
    }

    if (typeof window.XLSX === 'undefined') {
      alert("مكتبة XLSX غير متوفرة. يرجى التأكد من تضمينها في ملف HTML.");
      return;
    }

    const headers = [
      "اسم الزبون",
      "رقم الهاتف",
      "التاريخ",
      "الموظفة المسؤولة",
      "رقم البطاقة",
      "الحالة",
    ];

    const rows = data.map((report) => ({
      "اسم الزبون": report.name_ar || "",
      "رقم الهاتف": report.phoneNumber || "",
      "التاريخ": formatDate(report.createdAt) || "",
      "الموظفة المسؤولة": report.admin || "",
      "رقم البطاقة": report.id || "",
      "الحالة": renderStatus(report.status).props.children || "",
    }));

    const ws = window.XLSX.utils.json_to_sheet(rows);
    window.XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    const wscols = [
      {wch: 25},
      {wch: 20},
      {wch: 15},
      {wch: 25},
      {wch: 15},
      {wch: 20}
    ];
    ws['!cols'] = wscols;

    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Reports");

    const wbout = window.XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPdf = async (data, fileName = "Reports") => {
    if (!data || data.length === 0) {
      alert("لا توجد بيانات للتصدير.");
      return;
    }

    if (!pdfLibsLoaded) {
      alert("مكتبات PDF ما زالت قيد التحميل أو فشل تحميلها. يرجى المحاولة مرة أخرى.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // إنشاء جدول مؤقت في الذاكرة لـ html2canvas
    const tempTable = document.createElement('div');
    tempTable.style.position = 'absolute';
    tempTable.style.left = '-9999px'; // إخفاء العنصر عن الشاشة
    tempTable.style.width = 'fit-content'; // السماح للعرض بالتوسع
    tempTable.style.whiteSpace = 'nowrap'; // منع التفاف النص لضمان عرض كامل

    let tableHtml = `
      <table style="width: auto; border-collapse: collapse; text-align: right; direction: rtl; font-family: 'Arial Unicode MS', 'Arial', sans-serif;">
        <thead style="background-color: #f1f5f9; color: #4b5563; font-weight: bold;">
          <tr>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">اسم الزبون</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">رقم الهاتف</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">التاريخ</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">الموظفة المسؤولة</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">رقم البطاقة</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">الحالة</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(report => {
      tableHtml += `
        <tr style="border-top: 1px solid #e2e8f0;">
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.name_ar || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.phoneNumber || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${formatDate(report.createdAt) || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.admin || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.id || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${renderStatus(report.status).props.children || ""}</td>
        </tr>
      `;
    });

    tableHtml += `</tbody></table>`;
    tempTable.innerHTML = tableHtml;
    document.body.appendChild(tempTable);

    try {
      // استخدام html2canvas لالتقاط صورة للجدول
      const canvas = await window.html2canvas(tempTable, {
        scale: 2, // زيادة الدقة
        useCORS: true // قد تحتاجها إذا كانت الصور أو الخطوط من مصادر خارجية
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // عرض الصورة في PDF (تقريبي لحجم A4 مع هوامش 10mm)
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 10; // الموضع الأولي للصورة من الأعلى

      // إضافة العنوان
      doc.setFont("helvetica"); // أو أي خط آخر قياسي لـ jsPDF
      doc.setFontSize(14);
      doc.text("تقارير الأرشيف", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10; // ضبط الموضع للصفحة الجديدة
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      doc.save(`${fileName}.pdf`);
    } catch (err) {
      console.error("خطأ في تصدير PDF:", err);
      alert("فشل في تصدير PDF. يرجى مراجعة وحدة التحكم للمزيد من التفاصيل.");
    } finally {
      document.body.removeChild(tempTable); 
    }
  };

  return (
    <div className="m-4 sm:m-10 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <h2 className="text-2xl font-bold mb-6">الأرشيف</h2>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm mb-1">من تاريخ</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-3 py-2 rounded" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm mb-1">إلى تاريخ</label>
          <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-3 py-2 rounded" />
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="search" className="text-sm mb-1">ماذا تبحث عن؟</label>
          <input type="text" id="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="الاسم أو رقم الهاتف أو اسم الموظفة" className="border px-3 py-2 rounded w-full" />
        </div>
        <button onClick={handleSearch} className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition h-[42px] mt-auto">تصفية</button>

        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-green-700  transition h-[42px] mt-auto flex items-center justify-center"
          >
            تصدير
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {showExportOptions && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 text-sm">
              <button
                onClick={() => { exportToExcel(filteredReports, "تقارير-الأرشيف-الكل"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الكل (Excel)
              </button>
              <button
                onClick={() => { exportToExcel(currentReports, "تقارير-الأرشيف-الصفحة-الحالية"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الصفحة الحالية (Excel)
              </button>
              <button
                onClick={() => { exportToPdf(filteredReports, "تقارير-الأرشيف-الكل"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الكل (PDF)
              </button>
              <button
                onClick={() => { exportToPdf(currentReports, "تقارير-الأرشيف-الصفحة-الحالية"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الصفحة الحالية (PDF)
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && <div className="text-center text-gray-600 py-4">جاري التحميل...</div>}
      {error && <div className="text-center text-red-600 py-4">{error}</div>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-right border-collapse min-w-[1000px]">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="px-4 py-3">اسم الزبون</th>
              <th className="px-4 py-3">رقم الهاتف</th>
              <th className="px-4 py-3">التاريخ</th>
              <th className="px-4 py-3">الموظفة المسؤولة</th>
              <th className="px-4 py-3">رقم البطاقة</th>
              <th className="px-4 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <tr key={report._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{report.name_ar}</td>
                  <td className="px-4 py-3">{report.phoneNumber}</td>
                  <td className="px-4 py-3">{formatDate(report.createdAt)}</td>
                  <td className="px-4 py-3">{report.admin}</td>
                  <td className="px-4 py-3">{report.id}</td>
                  <td className="px-4 py-3">{renderStatus(report.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">لا توجد بيانات</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            السابق
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessArchive;
