import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

// نقطة النهاية الخاصة بسجلات التجديد
const RENEWAL_API_URL = "https://hawkama.cbc-api.app/api/reports/renewals";
const ITEMS_PER_PAGE = 10;

// دالة لجلب عنوان المصادقة من التخزين المحلي
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// دالة لتنسيق التاريخ إلى صيغة يوم/شهر/سنة
const formatDate = (dateString) => {
  if (!dateString) return "غير متوفر";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "تاريخ غير صالح";
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// دالة لعرض حالة التقرير بأسلوب جميل
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

// المكون الرئيسي لصفحة أرشيف الفواتير المجددة
const RenewalArchive = () => {
  const [renewalRecords, setRenewalRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [pdfLibsLoaded, setPdfLibsLoaded] = useState(false);

  // جلب سجلات التجديد من الخادم
  const fetchRenewalRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(RENEWAL_API_URL, { headers: getAuthHeader() });
      if (Array.isArray(response.data)) {
        setRenewalRecords(response.data);
        setFilteredRecords(response.data);
      } else {
        setError("بيانات غير صالحة من الخادم. التنسيق المتوقع هو مصفوفة.");
        setRenewalRecords([]);
        setFilteredRecords([]);
      }
    } catch (e) {
      setError("فشل في جلب البيانات من الخادم.");
      setRenewalRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // تأثير جانبي لجلب البيانات وتحميل مكتبات PDF عند تحميل المكون
  useEffect(() => {
    const loadPdfLibraries = () => {
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
        scriptJsPDF.onload = () => setPdfLibsLoaded(true);
        document.head.appendChild(scriptJsPDF);
      };
      document.head.appendChild(scriptHtml2Canvas);
    };
    loadPdfLibraries();
    fetchRenewalRecords();
  }, []);

  // تأثير جانبي لتحديث السجلات المفلترة عند تغيير شروط البحث
  useEffect(() => {
    handleSearch();
  }, [startDate, endDate, searchText, renewalRecords]);

  // دالة البحث والتصفية
  const handleSearch = () => {
    let result = renewalRecords;
    if (startDate || endDate) {
      result = result.filter((r) => {
        const recordDate = new Date(r.renewalDate);
        recordDate.setHours(0, 0, 0, 0);
        const start = startDate ? new Date(startDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        const end = endDate ? new Date(endDate) : null;
        if (end) end.setHours(23, 59, 59, 999);
        if (start && recordDate.getTime() < start.getTime()) return false;
        if (end && recordDate.getTime() > end.getTime()) return false;
        return true;
      });
    }
    if (searchText.trim()) {
      const search = searchText.trim().toLowerCase();
      result = result.filter(
        (r) =>
          (r.originalReportId?.name_ar && r.originalReportId.name_ar.toLowerCase().includes(search)) ||
          (r.originalReportId?.phoneNumber && r.originalReportId.phoneNumber.toLowerCase().includes(search)) ||
          (r.renewedByUserId?.username && r.renewedByUserId.username.toLowerCase().includes(search)) ||
          (r.originalReportId?.id !== null && r.originalReportId?.id !== undefined && String(r.originalReportId.id).toLowerCase().includes(search)) ||
          (r.originalReportId?.number !== null && r.originalReportId?.number !== undefined && String(r.originalReportId.number).toLowerCase().includes(search))
      );
    }
    setFilteredRecords(result);
    setCurrentPage(1);
  };

  // حسابات Pagination
  const totalPages = Math.ceil((filteredRecords?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecords = (filteredRecords || []).slice(startIndex, endIndex);

  // دالة الانتقال إلى صفحة معينة
  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // دالة تصدير البيانات إلى Excel
  const exportToExcel = (data, fileName = "RenewalReports") => {
    if (!data || data.length === 0) {
      setError("لا توجد بيانات للتصدير.");
      return;
    }
    const headers = [
      "اسم العميل", "رقم الهاتف", "تاريخ التجديد", "المجدد بواسطة",
      "رقم التقرير الأصلي", "تسلسل التقرير الأصلي", "حالة التقرير الأصلي"
    ];
    const rows = data.map((record) => ({
      "اسم العميل": record.originalReportId?.name_ar || record.originalReportId?.name_en || "",
      "رقم الهاتف": record.originalReportId?.phoneNumber || "",
      "تاريخ التجديد": formatDate(record.renewalDate) || "",
      "المجدد بواسطة": record.renewedByUserId?.username || "",
      "رقم التقرير الأصلي": record.originalReportId?.id || "",
      "تسلسل التقرير الأصلي": record.originalReportId?.number || "",
      "حالة التقرير الأصلي": renderStatus(record.originalReportId?.status).props.children || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
    const wscols = [
      { wch: 25 }, { wch: 20 }, { wch: 28 }, { wch: 20 },
      { wch: 25 }, { wch: 15 }, { wch: 20 }
    ];
    ws['!cols'] = wscols;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Renewal Reports");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // دالة تصدير البيانات إلى PDF
  const exportToPdf = async (data, fileName = "RenewalReports") => {
    if (!data || data.length === 0) {
      setError("لا توجد بيانات للتصدير.");
      return;
    }
    if (!pdfLibsLoaded) {
      setError("مكتبات PDF ما زالت قيد التحميل.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    const tempTable = document.createElement('div');
    tempTable.style.position = 'absolute';
    tempTable.style.left = '-9999px';
    tempTable.style.width = 'fit-content';
    tempTable.style.whiteSpace = 'nowrap';
    let tableHtml = `
      <table style="width: auto; border-collapse: collapse; text-align: right; direction: rtl;">
        <thead style="background-color: #f1f5f9; color: #4b5563; font-weight: bold;">
          <tr>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">اسم العميل</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">رقم الهاتف</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">تاريخ التجديد</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">المجدد بواسطة</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">رقم التقرير الأصلي</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">تسلسل التقرير الأصلي</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">حالة التقرير الأصلي</th>
          </tr>
        </thead>
        <tbody>
    `;
    data.forEach(record => {
      tableHtml += `
        <tr style="border-top: 1px solid #e2e8f0;">
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${record.originalReportId?.name_ar || record.originalReportId?.name_en || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${record.originalReportId?.phoneNumber || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${formatDate(record.renewalDate) || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${record.renewedByUserId?.username || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${record.originalReportId?.id || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${record.originalReportId?.number || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${renderStatus(record.originalReportId?.status).props.children || ""}</td>
        </tr>
      `;
    });
    tableHtml += `</tbody></table>`;
    tempTable.innerHTML = tableHtml;
    document.body.appendChild(tempTable);
    try {
      const canvas = await window.html2canvas(tempTable, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 280;
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      doc.setFont("helvetica");
      doc.setFontSize(14);
      doc.text("أرشيف الفواتير المجددة", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(`${fileName}.pdf`);
    } finally {
      document.body.removeChild(tempTable);
    }
  };

  // دالة مساعدة لإنشاء أرقام الصفحات
  const getPaginationNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;
    let lastAddedPage = 0;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        if (lastAddedPage + 1 !== i) {
          pageNumbers.push('...');
        }
        pageNumbers.push(i);
        lastAddedPage = i;
      }
    }
    return pageNumbers;
  };

  return (
    <div className="m-4 sm:m-10 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <h2 className="text-2xl font-bold mb-6">أرشيف الفواتير المجددة</h2>
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col flex-1">
          <label htmlFor="search" className="text-sm mb-1">ماذا تبحث عن؟</label>
          <input type="text" id="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="الاسم أو رقم الهاتف أو اسم المجدد أو رقم التقرير" className="border px-3 py-2 rounded w-full" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm mb-1">تاريخ البدء:</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-3 py-2 rounded w-full" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm mb-1">تاريخ الانتهاء:</label>
          <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-3 py-2 rounded w-full" />
        </div>
        <button onClick={handleSearch} className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition h-[42px] mt-auto">تصفية</button>
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition h-[42px] mt-auto flex items-center justify-center"
          >
            تصدير
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {showExportOptions && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 text-sm">
              <button
                onClick={() => { exportToExcel(filteredRecords, "فواتير-مجددة-الكل"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الكل (Excel)
              </button>
              <button
                onClick={() => { exportToExcel(currentRecords, "فواتير-مجددة-الصفحة-الحالية"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الصفحة الحالية (Excel)
              </button>
              <button
                onClick={() => { exportToPdf(filteredRecords, "فواتير-مجددة-الكل"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الكل (PDF)
              </button>
              <button
                onClick={() => { exportToPdf(currentRecords, "فواتير-مجددة-الصفحة-الحالية"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الصفحة الحالية (PDF)
              </button>
            </div>
          )}
        </div>
      </div>
      {loading ? <div className="text-center text-gray-600 py-4">جاري تحميل البيانات...</div> : null}
      {error && <div className="text-center text-red-600 py-4">{error}</div>}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-right border-collapse min-w-[1000px]">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="px-4 py-3">اسم العميل</th>
              <th className="px-4 py-3">رقم الهاتف</th>
              <th className="px-4 py-3">تاريخ التجديد</th>
              <th className="px-4 py-3">المجدد بواسطة</th>
              <th className="px-4 py-3">رقم التقرير الأصلي</th>
              <th className="px-4 py-3">حالة التقرير الأصلي</th>
            </tr>
          </thead>
          <tbody>
            {(currentRecords || []).length > 0 ? (
              (currentRecords || []).map((record) => (
                <tr key={record._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{record.originalReportId?.name_ar || record.originalReportId?.name_en || "غير متوفر"}</td>
                  <td className="px-4 py-3">{record.originalReportId?.phoneNumber || "غير متوفر"}</td>
                  <td className="px-4 py-3">{formatDate(record.renewalDate)}</td>
                  <td className="px-4 py-3">{record.renewedByUserId?.username || "غير متوفر"}</td>
                  <td className="px-4 py-3">{record.originalReportId?.id || "غير متوفر"}</td>
                  <td className="px-4 py-3">{renderStatus(record.originalReportId?.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">لا توجد سجلات تجديد</td>
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
          {getPaginationNumbers(currentPage, totalPages).map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-700">...</span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-teal-700 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            )
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
export default RenewalArchive;
