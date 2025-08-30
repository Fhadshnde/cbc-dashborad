import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import moment from "moment";

const API_URL = "https://hawkama.cbc-api.app/api/reports";
const EXPIRED_API_URL = `${API_URL}/expired`;
const RENEW_API_URL = `${API_URL}/renew`;
const ITEMS_PER_PAGE = 10;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const formatDate = (dateString) => {
  if (!dateString) return "غير متوفر";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "تاريخ غير صالح";
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ExpiredReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [pdfLibsLoaded, setPdfLibsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState({
    number: "",
    name_ar: "",
    name_en: "",
    phoneNumber: "",
    quantity: 0,
    moneyPaid: "",
    moneyRemain: "",
    address: "",
    ministry: "",
    admin: "",
    cardCategory: { oneYear: 0, twoYears: 0, virtual: 0, renewal: 0 },
    notes: "",
    onPayroll: false,
  });

  const fetchExpiredReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(EXPIRED_API_URL, { headers: getAuthHeader() });
      if (Array.isArray(response.data)) {
        setReports(response.data);
        setFilteredReports(response.data);
      } else {
        setError("بيانات غير صالحة من الخادم. التنسيق المتوقع هو مصفوفة.");
        setReports([]);
        setFilteredReports([]);
      }
    } catch (e) {
      setError("فشل في جلب البيانات من الخادم.");
      setReports([]);
      setFilteredReports([]);
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
        scriptJsPDF.onload = () => setPdfLibsLoaded(true);
        document.head.appendChild(scriptJsPDF);
      };
      document.head.appendChild(scriptHtml2Canvas);
    };
    loadPdfLibraries();
    fetchExpiredReports();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchText, reports]);

  const handleSearch = () => {
    let result = reports;
    if (searchText.trim()) {
      const search = searchText.trim().toLowerCase();
      result = result.filter(
        (r) =>
          (r.name_ar && r.name_ar.toLowerCase().includes(search)) ||
          (r.phoneNumber && r.phoneNumber.toLowerCase().includes(search)) ||
          (r.admin && r.admin.toLowerCase().includes(search)) ||
          (r.idOfcbc !== null && r.idOfcbc !== undefined && String(r.idOfcbc).toLowerCase().includes(search))
      );
    }
    setFilteredReports(result);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((filteredReports?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReports = (filteredReports || []).slice(startIndex, endIndex);

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const exportToExcel = (data, fileName = "ExpiredReports") => {
    if (!data || data.length === 0) {
      setError("لا توجد بيانات للتصدير.");
      return;
    }
    const headers = [
      "اسم الزبون", "رقم الهاتف", "تاريخ الإنشاء", "تاريخ الانتهاء",
      "الموظفة المسؤولة", "رقم البطاقة", "المبلغ المدفوع", "المبلغ المتبقي",
    ];
    const rows = data.map((report) => ({
      "اسم الزبون": report.name_ar || "",
      "رقم الهاتف": report.phoneNumber || "",
      "تاريخ الإنشاء": formatDate(report.createdAt) || "",
      "تاريخ الانتهاء": report.date || "",
      "الموظفة المسؤولة": report.admin || "",
      "رقم البطاقة": report.id || "",
      "المبلغ المدفوع": report.moneyPaid || "",
      "المبلغ المتبقي": report.moneyRemain || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
    const wscols = [
      { wch: 25 }, { wch: 20 }, { wch: 28 }, { wch: 20 },
      { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 20 }
    ];
    ws['!cols'] = wscols;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expired Reports");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const exportToPdf = async (data, fileName = "ExpiredReports") => {
    if (!data || data.length === 0) {
      setError("لا توجد بيانات للتصدير.");
      return;
    }
    if (!pdfLibsLoaded) {
      setError("مكتبات PDF ما زالت قيد التحميل.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const tempTable = document.createElement('div');
    tempTable.style.position = 'absolute';
    tempTable.style.left = '-9999px';
    tempTable.style.width = 'fit-content';
    tempTable.style.whiteSpace = 'nowrap';
    let tableHtml = `
      <table style="width: auto; border-collapse: collapse; text-align: right; direction: rtl;">
        <thead style="background-color: #f1f5f9; color: #4b5563; font-weight: bold;">
          <tr>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">اسم الزبون</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">رقم الهاتف</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">تاريخ الإنشاء</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">تاريخ الانتهاء</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">المبلغ المدفوع</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">المبلغ المتبقي</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">الموظفة المسؤولة</th>
            <th style="padding: 12px; border: 1px solid #e2e8f0;">رقم البطاقة</th>
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
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.date || "غير متوفر"}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.moneyPaid || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.moneyRemain || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.admin || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.id || ""}</td>
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
      doc.setFont("helvetica");
      doc.setFontSize(14);
      doc.text("التقارير منتهية الصلاحية", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
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

  const openRenewalModal = (report) => {
    setSelectedReport(report);
    setEditingReport({ ...report });
    setShowModal(true);
  };

  const closeRenewalModal = () => {
    setSelectedReport(null);
    setEditingReport(null);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("cardCategory.")) {
      const key = name.split(".")[1];
      setEditingReport(prev => ({
        ...prev,
        cardCategory: { ...prev.cardCategory, [key]: Number(value) },
      }));
    } else if (type === "checkbox") {
      setEditingReport(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditingReport(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRenewal = async () => {
    if (!editingReport) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("يرجى تسجيل الدخول أولاً");
        closeRenewalModal();
        return;
      }
      
      const payload = {
        name_ar: editingReport.name_ar,
        name_en: editingReport.name_en,
        phoneNumber: editingReport.phoneNumber,
        quantity: Number(editingReport.quantity) || 0,
        moneyPaid: editingReport.moneyPaid.toString(),
        moneyRemain: editingReport.moneyRemain.toString(),
        address: editingReport.address,
        ministry: editingReport.ministry,
        admin: editingReport.admin,
        cardCategory: {
          oneYear: 0,
          twoYears: 0,
          virtual: 0,
          renewal: 1,
        },
        notes: editingReport.notes,
        onPayroll: editingReport.onPayroll,
        number: editingReport.number
      };
      
      await axios.put(`${RENEW_API_URL}/${editingReport._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("تم تجديد التقرير بنجاح");
      fetchExpiredReports();
      closeRenewalModal();
    } catch (e) {
      console.error("Renewal Error:", e.response?.data || e.message);
      alert("فشل في تجديد التقرير");
    }
  };

  return (
    <div className="m-4 sm:m-10 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <h2 className="text-2xl font-bold mb-6">التقارير منتهية الصلاحية</h2>
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col flex-1">
          <label htmlFor="search" className="text-sm mb-1">ماذا تبحث عن؟</label>
          <input type="text" id="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="الاسم أو رقم الهاتف أو اسم الموظفة" className="border px-3 py-2 rounded w-full" />
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
                onClick={() => { exportToExcel(filteredReports, "تقارير-منتهية-الكل"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الكل (Excel)
              </button>
              <button
                onClick={() => { exportToExcel(currentReports, "تقارير-منتهية-الصفحة-الحالية"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الصفحة الحالية (Excel)
              </button>
              <button
                onClick={() => { exportToPdf(filteredReports, "تقارير-منتهية-الكل"); setShowExportOptions(false); }}
                className="block w-full text-right px-4 py-2 hover:bg-gray-100"
              >
                تصدير الكل (PDF)
              </button>
              <button
                onClick={() => { exportToPdf(currentReports, "تقارير-منتهية-الصفحة-الحالية"); setShowExportOptions(false); }}
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
              <th className="px-4 py-3">اسم الزبون</th>
              <th className="px-4 py-3">رقم الهاتف</th>
              {/* <th className="px-4 py-3">تاريخ الإنشاء</th> */}
              <th className="px-4 py-3">تاريخ الانتهاء</th>
              <th className="px-4 py-3">المبلغ المدفوع</th>
              <th className="px-4 py-3">المبلغ المتبقي</th>
              <th className="px-4 py-3">الموظفة المسؤولة</th>
              <th className="px-4 py-3">رقم البطاقة</th>
              {/* <th className="px-4 py-3">تسلسل الوصل</th> */}
              <th className="px-4 py-3">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {(currentReports || []).length > 0 ? (
              (currentReports || []).map((report) => (
                <tr key={report._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{ report.name_en}</td>
                  <td className="px-4 py-3">{report.phoneNumber}</td>
                  {/* <td className="px-4 py-3">
                    {formatDate(report.createdAt)}
                  </td> */}
                  <td className="px-4 py-3">{report.date || "غير متوفر"}</td>
                  <td className="px-4 py-3">{report.moneyPaid}</td>
                  <td className="px-4 py-3">{report.moneyRemain}</td>
                  <td className="px-4 py-3">{report.admin}</td>
                  <td className="px-4 py-3">{report.idOfcbc}</td>
                  {/* <td className="px-4 py-3">{report.number}</td> */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openRenewalModal(report)}
                      className="px-3 py-1 rounded text-xs bg-blue-500 text-white hover:bg-blue-600"
                    >
                      تجديد
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-4 text-center text-gray-500">لا توجد تقارير منتهية الصلاحية</td>
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
      {showModal && selectedReport && (
        <Modal onClose={closeRenewalModal}>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">تعديل وتجديد الاشتراك</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">تسلسل الوصل:</label>
                <input
                  type="text"
                  name="number"
                  value={editingReport.number}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">الاسم بالعربي:</label>
                <input
                  type="text"
                  name="name_ar"
                  value={editingReport.name_ar}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">الاسم بالإنجليزية:</label>
                <input
                  type="text"
                  name="name_en"
                  value={editingReport.name_en}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">رقم الهاتف:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editingReport.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">المبلغ الكامل:</label>
                <input
                  type="number"
                  name="quantity"
                  value={editingReport.quantity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">المبلغ المدفوع:</label>
                <input
                  type="text"
                  name="moneyPaid"
                  value={editingReport.moneyPaid}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">المبلغ المتبقي:</label>
                <input
                  type="text"
                  name="moneyRemain"
                  value={editingReport.moneyRemain}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">العنوان:</label>
                <input
                  type="text"
                  name="address"
                  value={editingReport.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">الوزارة:</label>
                <input
                  type="text"
                  name="ministry"
                  value={editingReport.ministry}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">المسؤول:</label>
                <input
                  type="text"
                  name="admin"
                  value={editingReport.admin}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <fieldset className="border p-3 rounded">
                <legend className="font-semibold mb-2">فئة البطاقة:</legend>
                <select
                  name="cardCategorySelect"
                  value="renewal"
                  disabled
                  className="border rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                >
                  <option value="renewal">تجديد</option>
                </select>
              </fieldset>
              <div>
                <label className="block text-sm font-semibold mb-1">ملاحظات:</label>
                <textarea
                  name="notes"
                  value={editingReport.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <label>على الراتب:</label>
                <input
                  type="checkbox"
                  name="onPayroll"
                  checked={editingReport.onPayroll}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeRenewalModal}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                إلغاء
              </button>
              <button
                onClick={handleRenewal}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                تجديد وحفظ
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default ExpiredReports;

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
