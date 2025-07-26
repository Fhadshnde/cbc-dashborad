import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://hawkama.cbc-api.app/api/reports/all";
const ITEMS_PER_PAGE = 10;

const AccessPrint = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [pdfLibsLoaded, setPdfLibsLoaded] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeader() });
      setReports(response.data);
      setFilteredReports(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        scriptJsPDF.onload = () => {
          setPdfLibsLoaded(true);
        };
        document.head.appendChild(scriptJsPDF);
      };
      document.head.appendChild(scriptHtml2Canvas);
    };

    loadPdfLibraries();
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
        if (start && reportDate.getTime() < start.getTime()) return false;
        if (end && reportDate.getTime() > end.getTime()) return false;
        return true;
      });
    }
    if (searchText.trim()) {
      const search = searchText.trim().toLowerCase();
      result = result.filter(
        (r) =>
          (r.name_ar && r.name_ar.toLowerCase().includes(search)) ||
          (r.phoneNumber && r.phoneNumber.toLowerCase().includes(search)) ||
          (r.admin && r.admin.toLowerCase().includes(search))
      );
    }
    setFilteredReports(result);
    setCurrentPage(1);
  };

  const renderCardCategory = (cat) => {
    if (cat?.oneYear === 1) return "بطاقة سنة واحدة";
    if (cat?.twoYears === 1) return "بطاقة سنتين";
    if (cat?.virtual === 1) return "بطاقة 6 اشهر";
    return "غير معروف";
  };

  const formatNumberWithCommas = (number) => {
    if (number == null) return "";
    const num = typeof number === "number" ? number : Number(number);
    if (isNaN(num)) return number;
    return num.toLocaleString("en-US");
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

  // عداد الصفحات يعرض أول ٥ صفحات وأخير ٥ صفحات مع ... بينهما

  const getPageNumbers = () => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const firstPages = [1, 2, 3, 4, 5];
    const lastPages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

    if (currentPage <= 5) {
      return [...firstPages, "...", ...lastPages];
    } else if (currentPage > totalPages - 5) {
      return [...firstPages, "...", ...lastPages];
    } else {
      const middlePages = [currentPage - 1, currentPage, currentPage + 1];
      return [...firstPages, "...", ...middlePages, "...", ...lastPages];
    }
  };

  const pageNumbers = getPageNumbers();

  const exportToExcel = (data, fileName = "PrintReports") => {
    if (!data || data.length === 0 || typeof window.XLSX === 'undefined') return;

    const headers = [
      "اسم الزبون", "الاسم بالإنجليزية", "رقم الهاتف", "اسم المندوب",
      "المدفوع", "المتبقي", "فئة البطاقة", "العنوان", "ملاحظات"
    ];

    const rows = data.map(r => ([
      r.name_ar,
      r.name_en,
      r.phoneNumber,
      r.admin,
      formatNumberWithCommas(r.moneyPaid),
      formatNumberWithCommas(r.moneyRemain),
      renderCardCategory(r.cardCategory),
      `${r.address || ''} - ${r.ministry || ''}`,
      r.notes || ''
    ]));

    const ws = window.XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wscols = [
      { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 40 }
    ];
    ws['!cols'] = wscols;

    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "PrintReports");
    const wbout = window.XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    link.click();
  };

  const exportToPdf = async (data, fileName = "PrintReports") => {
    if (!data || data.length === 0 || !pdfLibsLoaded) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tempTable = document.createElement('div');
    tempTable.style.position = 'absolute';
    tempTable.style.left = '-9999px';
    tempTable.style.width = 'fit-content';
    tempTable.style.whiteSpace = 'nowrap';

    let tableHtml = `
      <table style="width: auto; border-collapse: collapse; text-align: right; direction: rtl;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ccc;">اسم الزبون</th>
            <th style="padding: 8px; border: 1px solid #ccc;">الاسم بالإنجليزية</th>
            <th style="padding: 8px; border: 1px solid #ccc;">رقم الهاتف</th>
            <th style="padding: 8px; border: 1px solid #ccc;">اسم المندوب</th>
            <th style="padding: 8px; border: 1px solid #ccc;">المدفوع</th>
            <th style="padding: 8px; border: 1px solid #ccc;">المتبقي</th>
            <th style="padding: 8px; border: 1px solid #ccc;">فئة البطاقة</th>
            <th style="padding: 8px; border: 1px solid #ccc;">العنوان</th>
            <th style="padding: 8px; border: 1px solid #ccc;">ملاحظات</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(report => {
      tableHtml += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">${report.name_ar || ""}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${report.name_en || ""}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${report.phoneNumber || ""}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${report.admin || ""}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${formatNumberWithCommas(report.moneyPaid)}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${formatNumberWithCommas(report.moneyRemain)}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${renderCardCategory(report.cardCategory)}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${report.address || ""} - ${report.ministry || ""}</td>
          <td style="padding: 8px; border: 1px solid #ccc; max-width: 300px; white-space: pre-wrap;">${report.notes || ""}</td>
        </tr>
      `;
    });

    tableHtml += `</tbody></table>`;
    tempTable.innerHTML = tableHtml;
    document.body.appendChild(tempTable);

    try {
      const canvas = await window.html2canvas(tempTable, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(`${fileName}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      document.body.removeChild(tempTable);
    }
  };

  return (
    <div className="m-4 sm:m-10 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <h2 className="text-2xl font-bold mb-6">الطباعة</h2>
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col">
          <label className="text-sm mb-1">من تاريخ</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-3 py-2 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">إلى تاريخ</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-3 py-2 rounded" />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-sm mb-1">ماذا تبحث عن؟</label>
          <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="الاسم أو رقم الهاتف أو اسم الموظفة" className="border px-3 py-2 rounded w-full" />
        </div>
        <button onClick={handleSearch} className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition h-[42px] mt-auto">تصفية</button>

        <div className="relative">
          <button onClick={() => setShowExportOptions(!showExportOptions)} className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-green-700 transition h-[42px] mt-auto flex items-center justify-center">
            تصدير
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {showExportOptions && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 text-sm">
              <button onClick={() => { exportToExcel(filteredReports, "تقارير-الطباعة-الكل"); setShowExportOptions(false); }} className="block w-full text-right px-4 py-2 hover:bg-gray-100">تصدير الكل (Excel)</button>
              <button onClick={() => { exportToExcel(currentReports, "تقارير-الطباعة-الصفحة-الحالية"); setShowExportOptions(false); }} className="block w-full text-right px-4 py-2 hover:bg-gray-100">تصدير الصفحة الحالية (Excel)</button>
              <button onClick={() => { exportToPdf(filteredReports, "تقارير-الطباعة-الكل"); setShowExportOptions(false); }} className="block w-full text-right px-4 py-2 hover:bg-gray-100">تصدير الكل (PDF)</button>
              <button onClick={() => { exportToPdf(currentReports, "تقارير-الطباعة-الصفحة-الحالية"); setShowExportOptions(false); }} className="block w-full text-right px-4 py-2 hover:bg-gray-100">تصدير الصفحة الحالية (PDF)</button>
            </div>
          )}
        </div>
      </div>
      {loading && <div className="text-center text-gray-600 py-4">جاري التحميل...</div>}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-right border-collapse min-w-[1000px]">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="px-4 py-3">اسم الزبون</th>
              <th className="px-4 py-3">الاسم بالإنجليزية</th>
              <th className="px-4 py-3">رقم الهاتف</th>
              <th className="px-4 py-3">اسم المندوب</th>
              <th className="px-4 py-3">المبلغ المدفوع</th>
              <th className="px-4 py-3">المبلغ المتبقي</th>
              <th className="px-4 py-3">فئة البطاقة</th>
              <th className="px-4 py-3">العنوان</th>
              <th className="px-4 py-3">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <tr key={report._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{report.name_ar}</td>
                  <td className="px-4 py-3">{report.name_en}</td>
                  <td className="px-4 py-3">{report.phoneNumber}</td>
                  <td className="px-4 py-3">{report.admin}</td>
                  <td className="px-4 py-3">{formatNumberWithCommas(report.moneyPaid)}</td>
                  <td className="px-4 py-3">{formatNumberWithCommas(report.moneyRemain)}</td>
                  <td className="px-4 py-3">{renderCardCategory(report.cardCategory)}</td>
                  <td className="px-4 py-3">{report.address} - {report.ministry}</td>
                  <td className="px-4 py-3">{report.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-4 text-center text-gray-500">لا توجد بيانات</td>
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

          {pageNumbers.map((num, idx) =>
            num === "..." ? (
              <span key={"ellipsis-" + idx} className="px-3 py-2 select-none">...</span>
            ) : (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`px-4 py-2 rounded ${currentPage === num ? "bg-teal-700 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                {num}
              </button>
            )
          )}

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

export default AccessPrint;
