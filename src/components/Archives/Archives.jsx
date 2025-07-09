import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = "https://hawkama.cbc-api.app/api/reports";
const ITEMS_PER_PAGE = 10;

const EXCEL_COLUMN_MAPPINGS = {
  ARABIC_HEADERS_SCHEMA: [
    { excelColumn: "اسم الزبون", apiField: "name_ar", defaultValue: "غير معروف" },
    { excelColumn: "الاسم انكليزي", apiField: "name_en", defaultValue: "" },
    { excelColumn: "رقم الهاتف", apiField: "phoneNumber", defaultValue: "", type: "string" },
    { excelColumn: "الجنس ", apiField: "gender", defaultValue: "" },
    { excelColumn: "المبلغ مقدما", apiField: "moneyPaid", defaultValue: "0", type: "string" },
    { excelColumn: "المبلغ المتبقي", apiField: "moneyRemain", defaultValue: "0", type: "string" },
    { excelColumn: "العنوان ", apiField: "address", defaultValue: "غير محدد" },
    { excelColumn: "الملاحظات", apiField: "notes", defaultValue: "" },
    { excelColumn: "الفئه", apiField: "cardCategory", defaultValue: "", type: "cardCategory" },
    { excelColumn: "اسم المندوب", apiField: "admin", defaultValue: "غير محدد" },
    { excelColumn: "الكمية", apiField: "quantity", defaultValue: 1, type: "number" },
    { excelColumn: "رقم البطاقة", apiField: "card_id", defaultValue: (index) => `GENERATED-${Date.now()}-${index}`, type: "string" },
  ],
  EMPTY_HEADERS_SCHEMA: [
    { excelColumn: "__EMPTY", apiField: "name_ar", defaultValue: "غير معروف" },
    { excelColumn: "__EMPTY_1", apiField: "name_en", defaultValue: "" },
    { excelColumn: "__EMPTY_2", apiField: "phoneNumber", defaultValue: "", type: "string" },
    { excelColumn: "__EMPTY_3", apiField: "gender", defaultValue: "" },
    { excelColumn: "__EMPTY_5", apiField: "moneyPaid", defaultValue: "0", type: "string" },
    { excelColumn: "__EMPTY_6", apiField: "moneyRemain", defaultValue: "0", type: "string" },
    { excelColumn: "__EMPTY_4", apiField: "admin", defaultValue: "غير محدد" },
    { excelColumn: "الملاحظات", apiField: "notes", defaultValue: "" },
    { excelColumn: "__EMPTY_7", apiField: "cardCategory", defaultValue: "", type: "cardCategory" },
    { excelColumn: "__EMPTY_8", apiField: "ministry", defaultValue: "غير محددة" },
    { excelColumn: "الكمية", apiField: "quantity", defaultValue: 1, type: "number" },
    { excelColumn: "رقم البطاقة", apiField: "card_id", defaultValue: (index) => `GENERATED-${Date.now()}-${index}`, type: "string" },
    { excelColumn: "address", apiField: "address", defaultValue: "غير محدد" },
  ],
};

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

  const [excelFile, setExcelFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("لم يتم العثور على توكن المصادقة. قد لا تتمكن من الوصول إلى بعض الميزات.");
      return {};
    }
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
      setError("فشل في جلب البيانات.");
      console.error("خطأ في جلب التقارير:", err);
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
        scriptJsPDF.onerror = () => {
          console.error("فشل تحميل jsPDF.");
          setError("فشل تحميل مكتبة jsPDF. يرجى التحقق من اتصال الإنترنت.");
        };
        document.head.appendChild(scriptJsPDF);
      };
      scriptHtml2Canvas.onerror = () => {
        console.error("فشل تحميل html2canvas.");
        setError("فشل تحميل مكتبة html2canvas. يرجى التحقق من اتصال الإنترنت.");
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
      setError("لا توجد بيانات للتصدير.");
      return;
    }

    if (typeof window.XLSX === 'undefined') {
      setError("مكتبة XLSX غير متوفرة. يرجى التأكد من تضمينها في ملف HTML.");
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
      setError("لا توجد بيانات للتصدير.");
      return;
    }

    if (!pdfLibsLoaded) {
      setError("مكتبات PDF ما زالت قيد التحميل أو فشل تحميلها. يرجى المحاولة مرة أخرى.");
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
      const canvas = await window.html2canvas(tempTable, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 10;

      doc.setFont("helvetica");
      doc.setFontSize(14);
      doc.text("تقارير الأرشيف", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

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
      console.error("خطأ في تصدير PDF:", err);
      setError("فشل في تصدير PDF. يرجى مراجعة وحدة التحكم للمزيد من التفاصيل.");
    } finally {
      document.body.removeChild(tempTable);
    }
  };

  const extractDateFromHeader = (headers) => {
    for (const key of headers) {
      const dateMatch = key.match(/(\d{2}\/\d{2}\/\d{4})/);
      if (dateMatch && dateMatch[1]) {
        const [day, month, year] = dateMatch[1].split('/');
        return `${year}/${month}`;
      }
    }
    return "2025/07";
  };

  const mapCardCategory = (categoryValue) => {
    const lowerCaseCategory = (categoryValue || "").toLowerCase();
    return {
      oneYear: lowerCaseCategory === "سنة" ? 1 : 0,
      twoYears: lowerCaseCategory === "سنتين" ? 1 : 0,
      virtual: lowerCaseCategory === "افتراضي" ? 1 : 0,
    };
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
    setUploadProgress(0);
    setUploadMessage("");
    setError(null);
  };

  const handleUpload = async () => {
    if (!excelFile) {
      setUploadMessage("الرجاء اختيار ملف Excel أولاً.");
      setError("الرجاء اختيار ملف Excel أولاً.");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setUploadMessage("جاري معالجة الملف...");
    let successfulUploads = 0;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || [];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setUploadMessage("الملف فارغ أو لا يحتوي على بيانات.");
          setLoading(false);
          return;
        }

        let activeMappingSchema = EXCEL_COLUMN_MAPPINGS.ARABIC_HEADERS_SCHEMA;
        if (headerRow.includes("اسم الزبون") && headerRow.includes("رقم الهاتف")) {
          activeMappingSchema = EXCEL_COLUMN_MAPPINGS.ARABIC_HEADERS_SCHEMA;
        } else {
          activeMappingSchema = EXCEL_COLUMN_MAPPINGS.EMPTY_HEADERS_SCHEMA;
        }

        const extractedDate = extractDateFromHeader(headerRow);

        const totalRows = jsonData.length;
        setUploadMessage(`جاري رفع ${totalRows} سجل...`);

        const uploadPromises = jsonData.map(async (row, index) => {
          const payload = {};

          activeMappingSchema.forEach(mapping => {
            let value = row[mapping.excelColumn];

            if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
                value = typeof mapping.defaultValue === 'function' ? mapping.defaultValue(index) : mapping.defaultValue;
            }

            if (mapping.type === "string") {
              payload[mapping.apiField] = String(value);
            } else if (mapping.type === "number") {
              payload[mapping.apiField] = Number(value);
            } else if (mapping.type === "cardCategory") {
              payload[mapping.apiField] = mapCardCategory(value);
            } else {
              payload[mapping.apiField] = value;
            }
          });

          payload.date = extractedDate;

          if (!payload.address) {
            payload.address = "غير محدد";
          }

          try {
            await axios.post(API_URL, payload, { headers: getAuthHeader() });
            successfulUploads++;
            setUploadProgress(Math.round((successfulUploads / totalRows) * 100));
            return { status: "fulfilled", value: successfulUploads };
          } catch (innerError) {
            const errorMessage = innerError.response && innerError.response.data && innerError.response.data.message
              ? innerError.response.data.message
              : innerError.message;
            return { status: "rejected", reason: `فشل الخادم: ${errorMessage} للسطر ${index + 2} - البيانات: ${JSON.stringify(row)}` };
          }
        });

        const results = await Promise.allSettled(uploadPromises);

        let suppressibleErrorsCount = 0;
        let otherFailedUploads = [];

        results.forEach(result => {
          if (result.status === "rejected") {
            const errorMessage = result.reason;
            if (errorMessage.includes("Network Error") || errorMessage.includes("phoneNumber: Path `phoneNumber` is required.")) {
              suppressibleErrorsCount++;
            } else {
              otherFailedUploads.push(errorMessage);
            }
          }
        });

        setLoading(false);
        let finalUploadMessage = `تم رفع ${successfulUploads} سجل بنجاح.`;
        let currentError = null;

        if (suppressibleErrorsCount > 0) {
            finalUploadMessage += ` وفشل ${suppressibleErrorsCount} سجلات لأسباب داخلية.`;
        }

        if (otherFailedUploads.length > 0) {
            finalUploadMessage += ` بالإضافة إلى أخطاء أخرى: ${otherFailedUploads.join("; ")}.`;
            currentError = "حدثت أخطاء أخرى أثناء الرفع.";
        } else if (successfulUploads === 0 && totalRows > 0 && suppressibleErrorsCount === 0) {
             finalUploadMessage = "فشل رفع جميع السجلات أو حدث خطأ غير متوقع.";
             currentError = finalUploadMessage;
        }

        setUploadMessage(finalUploadMessage);
        setError(currentError);
        
        fetchReports();
      } catch (fileReadError) {
        setUploadMessage("خطأ في قراءة ملف Excel: " + fileReadError.message);
        setError("خطأ في قراءة ملف Excel: " + fileReadError.message);
        setLoading(false);
        console.error("خطأ في معالجة ملف Excel:", fileReadError);
      }
    };

    reader.readAsBinaryString(excelFile);
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

  return (
    <div className="m-4 sm:m-10 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <h2 className="text-2xl font-bold mb-6">الأرشيف</h2>

      <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">رفع ملف Excel جديد</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="flex-grow border border-gray-300 rounded-md py-2 px-3 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
          />
          <button
            onClick={handleUpload}
            className="bg-teal-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-teal-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            disabled={loading || !excelFile}
          >
            {loading && uploadProgress === 0 ? "جاري التحضير..." : loading ? "جاري الرفع..." : "رفع الملف"}
          </button>
        </div>
        {uploadMessage && <p className={`text-sm mt-3 ${error ? 'text-red-600' : 'text-gray-700'}`}>{uploadMessage}</p>}
        {loading && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-3">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </div>

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

      {loading && reports.length === 0 && !excelFile ? <div className="text-center text-gray-600 py-4">جاري التحميل...</div> : null}
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

export default AccessArchive;