import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = "https://hawkama.cbc-api.app/api/reports";
const ITEMS_PER_PAGE = 10;

const calculateEndDate = (creationDate, cardCategory) => {
  const newDate = new Date(creationDate);
  const cardCategoryTemp = cardCategory || { oneYear: 0, twoYears: 0, virtual: 0 };
  let card_id_temp = "5";

  if (cardCategoryTemp.oneYear > 0) {
    card_id_temp = "1";
    newDate.setFullYear(newDate.getFullYear() + 1);
  } else if (cardCategoryTemp.twoYears > 0) {
    card_id_temp = "2";
    newDate.setFullYear(newDate.getFullYear() + 2);
  } else if (cardCategoryTemp.virtual > 0) {
    card_id_temp = "7";
    newDate.setMonth(newDate.getMonth() + 6);
  }
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
  return { date: `${year}/${month}`, card_id: card_id_temp };
};

const mapCardCategory = (categoryValue) => {
  const lowerCaseCategory = (categoryValue || "").toLowerCase();
  return {
    oneYear: lowerCaseCategory === "سنة" ? 1 : 0,
    twoYears: lowerCaseCategory === "سنتين" ? 1 : 0,
    virtual: lowerCaseCategory === "افتراضي" ? 1 : 0,
  };
};

const EXCEL_COLUMN_MAPPINGS = {
  ARABIC_HEADERS_SCHEMA: [
    { excelColumn: "اسم الزبون", apiField: "name_ar", defaultValue: "غير معروف" },
    { excelColumn: "الاسم انكليزي", apiField: "name_en", defaultValue: "Unknown" },
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
    { excelColumn: "تاريخ الإنشاء", apiField: "excelDate", defaultValue: null, type: "date" },
  ],
  EMPTY_HEADERS_SCHEMA: [
    { excelColumn: "__EMPTY", apiField: "name_ar", defaultValue: "غير معروف" },
    { excelColumn: "__EMPTY_1", apiField: "name_en", defaultValue: "Unknown" },
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
    { excelColumn: "تاريخ الإنشاء", apiField: "excelDate", defaultValue: null, type: "date" },
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
  const [selectedReportIds, setSelectedReportIds] = useState([]);
  const [newCreationDate, setNewCreationDate] = useState("");
  const [isUpdatingDate, setIsUpdatingDate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  };

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/all`, { headers: getAuthHeader() });
      setReports(response.data);
      setFilteredReports(response.data);
      setCurrentPage(1);
    } catch (err) {
      setError("فشل في جلب البيانات.");
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
    if (!dateString) return "غير متوفر";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "تاريخ غير صالح";
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

    const headers = [
      "اسم الزبون",
      "رقم الهاتف",
      "تاريخ الإنشاء",
      "تاريخ الانتهاء",
      "الموظفة المسؤولة",
      "رقم البطاقة",
      "الحالة",
    ];

    const rows = data.map((report) => ({
      "اسم الزبون": report.name_ar || "",
      "رقم الهاتف": report.phoneNumber || "",
      "تاريخ الإنشاء": formatDate(report.createdAt) || "",
      "تاريخ الانتهاء": report.date || "",
      "الموظفة المسؤولة": report.admin || "",
      "رقم البطاقة": report.id || "",
      "الحالة": renderStatus(report.status).props.children || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    const wscols = [
      {wch: 25},
      {wch: 20},
      {wch: 28},
      {wch: 20},
      {wch: 25},
      {wch: 15},
      {wch: 20}
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const exportToPdf = async (data, fileName = "Reports") => {
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
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.date || "غير متوفر"}</td>
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
    } finally {
      document.body.removeChild(tempTable);
    }
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
    setUploadProgress(0);
    setUploadMessage("");
    setError(null);
  };

  const parseExcelData = (jsonData) => {
    let activeMappingSchema = EXCEL_COLUMN_MAPPINGS.ARABIC_HEADERS_SCHEMA;
    const firstRowKeys = Object.keys(jsonData[0] || {});
    if (firstRowKeys.includes("__EMPTY") && firstRowKeys.includes("__EMPTY_1")) {
      activeMappingSchema = EXCEL_COLUMN_MAPPINGS.EMPTY_HEADERS_SCHEMA;
    }

    return jsonData.map((row, index) => {
      const payload = {};
      let excelCreationDate = null;

      activeMappingSchema.forEach(mapping => {
        let value = row[mapping.excelColumn];

        if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
            value = typeof mapping.defaultValue === 'function' ? mapping.defaultValue(index) : mapping.defaultValue;
        }

        if (mapping.apiField === "excelDate" && value !== null) {
            if (typeof value === 'number') {
                const excelDate = XLSX.SSF.parse_date_code(value);
                excelCreationDate = new Date(Date.UTC(excelDate.y, excelDate.m - 1, excelDate.d));
            } else if (typeof value === 'string') {
                let parsedDate = new Date(value);
                if (isNaN(parsedDate.getTime())) {
                    const parts = value.split(/[\/\-]/);
                    if (parts.length === 3) {
                        // Try YYYY-MM-DD
                        if (parts[0].length === 4) {
                            parsedDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
                        } else if (parts[2].length === 4) {
                            // Try DD-MM-YYYY or MM-DD-YYYY
                            parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                            if (isNaN(parsedDate.getTime())) { // If DD-MM-YYYY fails, try MM-DD-YYYY
                                parsedDate = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
                            }
                        }
                    }
                }
                if (!isNaN(parsedDate.getTime())) {
                    excelCreationDate = parsedDate;
                }
            }
        } else if (mapping.type === "string") {
          payload[mapping.apiField] = String(value);
        } else if (mapping.type === "number") {
          payload[mapping.apiField] = Number(value);
        } else if (mapping.type === "cardCategory") {
          payload[mapping.apiField] = mapCardCategory(value);
        } else {
          payload[mapping.apiField] = value;
        }
      });

      if (excelCreationDate) {
          payload.createdAt = excelCreationDate.toISOString(); // حفظ تاريخ Excel كتاريخ إنشاء
          const { date, card_id } = calculateEndDate(excelCreationDate, payload.cardCategory);
          payload.date = date;
          // Use generated card_id only if not already present from excel
          payload.card_id = payload.card_id || card_id;
      } else if (!payload.createdAt) { // If no excel date and no default createdAt
          const now = new Date();
          payload.createdAt = now.toISOString();
          const { date, card_id } = calculateEndDate(now, payload.cardCategory);
          payload.date = date;
          payload.card_id = payload.card_id || card_id;
      }

      if (!payload.address) {
        payload.address = "غير محدد";
      }
      return payload;
    });
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

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 3, raw: false, dateNF:'YYYY-MM-DD' }); // raw: false to get formatted values, dateNF for date formatting

        if (jsonData.length === 0) {
          setUploadMessage("الملف فارغ أو لا يحتوي على بيانات يمكن قراءتها.");
          setLoading(false);
          return;
        }
        
        const payloads = parseExcelData(jsonData);
        const totalRows = payloads.length;
        setUploadMessage(`جاري رفع ${totalRows} سجل...`);

        for (const payload of payloads) {
          try {
            await axios.post(API_URL, payload, { headers: getAuthHeader() });
            successfulUploads++;
            setUploadProgress(Math.round((successfulUploads / totalRows) * 100));
          } catch (error) {
            console.error("Error uploading row:", error);
            // Optionally, log or display which row failed
          }
        }

        setLoading(false);
        setUploadMessage(`تم رفع ${successfulUploads} سجل بنجاح.`);
        fetchReports();
      } catch (error) {
        setUploadMessage("خطأ في قراءة ملف Excel.");
        setError("خطأ في قراءة ملف Excel.");
        setLoading(false);
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

  const handleSelectReport = (reportId) => {
    setSelectedReportIds((prevSelected) =>
      prevSelected.includes(reportId)
        ? prevSelected.filter((id) => id !== reportId)
        : [...prevSelected, reportId]
    );
  };

  const handleApplyNewDate = async () => {
    if (selectedReportIds.length === 0) {
      setUpdateMessage("الرجاء تحديد تقرير واحد على الأقل.");
      return;
    }

    if (!newCreationDate) {
      setUpdateMessage("الرجاء اختيار تاريخ الإنشاء الجديد.");
      return;
    }

    setIsUpdatingDate(true);
    setUpdateMessage("جاري التحديث...");

    try {
      const updates = selectedReportIds.map(async (reportId) => {
        const reportToUpdate = reports.find(r => r._id === reportId);
        if (!reportToUpdate) return;

        const updatedDate = new Date(newCreationDate);
        const { date: newExpiryDate } = calculateEndDate(updatedDate, reportToUpdate.cardCategory);

        const updateData = {
          createdAt: updatedDate.toISOString(), // تحديث حقل createdAt في الـ API
          date: newExpiryDate,
        };

        await axios.put(`${API_URL}/${reportId}`, updateData, {
          headers: getAuthHeader()
        });
      });

      await Promise.all(updates);

      setUpdateMessage("تم التحديث بنجاح.");
      fetchReports();
    } catch (error) {
      setUpdateMessage("حدث خطأ أثناء التحديث.");
      console.error("Update error:", error);
    } finally {
      setIsUpdatingDate(false);
      setSelectedReportIds([]);
      setNewCreationDate("");
    }
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
            {loading ? "جاري الرفع..." : "رفع الملف"}
          </button>
        </div>
        {uploadMessage && <p className={`text-sm mt-3 ${error ? 'text-red-600' : 'text-gray-700'}`}>{uploadMessage}</p>}
        {loading && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-3">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </div>

      <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">تعديل تاريخ الإنشاء</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">التاريخ الجديد</label>
            <input
              type="date"
              value={newCreationDate}
              onChange={(e) => setNewCreationDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleApplyNewDate}
            disabled={isUpdatingDate || !newCreationDate || selectedReportIds.length === 0}
            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdatingDate ? "جاري التطبيق..." : `تطبيق على ${selectedReportIds.length} تقارير`}
          </button>
        </div>
        {updateMessage && (
          <div className={`mt-3 p-2 rounded ${
            updateMessage.includes("خطأ") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {updateMessage}
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
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedReportIds(currentReports.map(report => report._id));
                    } else {
                      setSelectedReportIds([]);
                    }
                  }}
                  checked={selectedReportIds.length === currentReports.length && currentReports.length > 0}
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out cursor-pointer"
                />
              </th>
              <th className="px-4 py-3">اسم الزبون</th>
              <th className="px-4 py-3">رقم الهاتف</th>
              <th className="px-4 py-3">تاريخ الإنشاء</th>
              <th className="px-4 py-3">تاريخ الانتهاء</th>
              <th className="px-4 py-3">الموظفة المسؤولة</th>
              <th className="px-4 py-3">رقم البطاقة</th>
              <th className="px-4 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <tr key={report._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedReportIds.includes(report._id)}
                      onChange={() => handleSelectReport(report._id)}
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">{report.name_en}</td>
                  <td className="px-4 py-3">{report.phoneNumber}</td>
                  <td className="px-4 py-3">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-4 py-3">{report.date || "غير متوفر"}</td>
                  <td className="px-4 py-3">{report.admin}</td>
                  <td className="px-4 py-3">{report.id}</td>
                  <td className="px-4 py-3">{renderStatus(report.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">لا توجد بيانات</td>
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