import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = "https://hawkama.cbc-api.app/api/reports";
const API_URL2 = "https://cbc-api.app/v4/getAllAccounts";
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
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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
    if (!token) {
      console.error("No token found in localStorage");
      return {};
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchReports = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL2, {
        headers: getAuthHeader(),
        params: {
          page: page,
          q: searchText,
          itemsPerPage: ITEMS_PER_PAGE,
          status: 1,
          orderBy: 'desc',
          sortBy: 'id'
        }
      });

      if (!response.data || !response.data.DataOfTable || !Array.isArray(response.data.DataOfTable)) {
        throw new Error("Invalid data format from server");
      }

      const dataOfTable = response.data.DataOfTable;
      setReports(dataOfTable);
      setFilteredReports(dataOfTable);
      
      const currentItemsCount = dataOfTable.length;
      
      if (currentItemsCount < ITEMS_PER_PAGE) {
        setTotalPages(page);
        setTotalItems((page - 1) * ITEMS_PER_PAGE + currentItemsCount);
      } else {
        setTotalPages(page + 1);
        setTotalItems(page * ITEMS_PER_PAGE);
      }
      
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch data: " + err.message);
      setReports([]);
      setFilteredReports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalCount = async () => {
    try {
      const response = await axios.get(API_URL2, {
        headers: getAuthHeader(),
        params: {
          page: 1,
          q: searchText,
          itemsPerPage: 1,
          status: 1,
          orderBy: 'desc',
          sortBy: 'id'
        }
      });
      console.log(response.data);
      if (response.data.total) {
        setTotalItems(response.data.total);
        setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
      }
    } catch (err) {
      console.log("Could not fetch total count:", err.message);
    }
  };

  useEffect(() => {
    const loadPdfLibraries = async () => {
      try {
        if (typeof window.jspdf === 'undefined') {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }
        
        if (typeof window.html2canvas === 'undefined') {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }
        
        setPdfLibsLoaded(true);
      } catch (error) {
        console.error("Failed to load PDF libraries:", error);
      }
    };

    loadPdfLibraries();
    fetchTotalCount();
    fetchReports();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [startDate, endDate, searchText]);

  const handleSearch = async () => {
    await fetchReports(1);
  };
  
  const renderStatus = (status) => {
    const colors = {
      "فعالة": "bg-green-100 text-green-600",
      "غير فعالة": "bg-red-100 text-red-600",
      "معلقة": "bg-orange-100 text-orange-600",
      "منتهية الصلاحية": "bg-gray-100 text-gray-600",
    };

    return (
      <span className={`px-3 py-1 rounded text-sm ${colors[status] || "bg-gray-100 text-gray-600"}`}>
        {status || "غير محدد"}
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

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      fetchReports(pageNumber);
    }
  };

  const exportToExcel = (data, fileName = "Reports") => {
    if (!Array.isArray(data) || data.length === 0) {
      setError("No data to export");
      return;
    }

    const headers = [
      "اسم الزبون",
      "الاسم الإنجليزي",
      "رقم الهاتف",
      "تاريخ الإنشاء",
      "تاريخ الانتهاء",
      "اسم المندوب",
      "رقم البطاقة",
      "الحالة",
      "العنوان",
      "المبلغ المدفوع",
      "المبلغ المتبقي"
    ];

    const rows = data.map((report) => ({
      "اسم الزبون": report.name_ar || "",
      "الاسم الإنجليزي": report.name_en || "",
      "رقم الهاتف": report.phoneNumber || "",
      "تاريخ الإنشاء": formatDate(report.created_at) || "",
      "تاريخ الانتهاء": report.date || "",
      "اسم المندوب": report.delegateName || "",
      "رقم البطاقة": report.id || "",
      "الحالة": report.status || "",
      "العنوان": report.address || "",
      "المبلغ المدفوع": report.moneyPaid || "0",
      "المبلغ المتبقي": report.moneyRemain || "0"
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    const wscols = [
      {wch: 25}, {wch: 25}, {wch: 20}, {wch: 20}, {wch: 20}, 
      {wch: 25}, {wch: 15}, {wch: 15}, {wch: 30}, {wch: 15}, {wch: 15}
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const exportToPdf = async (data, fileName = "Reports") => {
    if (!Array.isArray(data) || data.length === 0) {
      setError("No data to export");
      return;
    }

    if (!pdfLibsLoaded) {
      setError("PDF libraries are still loading");
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
            <th style="padding: 12px; border: 1px solid #e2e8f0;">اسم المندوب</th>
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
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${formatDate(report.created_at) || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.date || "غير متوفر"}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.delegateName || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.id || ""}</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0;">${report.status || ""}</td>
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
                        if (parts[0].length === 4) {
                            parsedDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
                        } else if (parts[2].length === 4) {
                            parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                            if (isNaN(parsedDate.getTime())) {
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
          payload.createdAt = excelCreationDate.toISOString();
          const { date, card_id } = calculateEndDate(excelCreationDate, payload.cardCategory);
          payload.date = date;
          payload.card_id = payload.card_id || card_id;
      } else if (!payload.createdAt) {
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
      setUploadMessage("Please select an Excel file first");
      setError("Please select an Excel file first");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setUploadMessage("Processing file...");
    let successfulUploads = 0;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 3, raw: false, dateNF:'YYYY-MM-DD' });

        if (jsonData.length === 0) {
          setUploadMessage("File is empty or contains no readable data");
          setLoading(false);
          return;
        }
        
        const payloads = parseExcelData(jsonData);
        const totalRows = payloads.length;
        setUploadMessage(`Uploading ${totalRows} records...`);

        for (const payload of payloads) {
          try {
            await axios.post(API_URL, payload, { headers: getAuthHeader() });
            successfulUploads++;
            setUploadProgress(Math.round((successfulUploads / totalRows) * 100));
          } catch (error) {
            console.error("Error uploading row:", error);
          }
        }

        setLoading(false);
        setUploadMessage(`Successfully uploaded ${successfulUploads} records`);
        fetchReports(currentPage);
      } catch (error) {
        setUploadMessage("Error reading Excel file");
        setError("Error reading Excel file");
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
      setUpdateMessage("Please select at least one report");
      return;
    }

    if (!newCreationDate) {
      setUpdateMessage("Please select a new creation date");
      return;
    }

    setIsUpdatingDate(true);
    setUpdateMessage("Updating...");

    try {
      const updates = selectedReportIds.map(async (reportId) => {
        const reportToUpdate = reports.find(r => r.id === reportId);
        if (!reportToUpdate) return;

        const updatedDate = new Date(newCreationDate);
        const { date: newExpiryDate } = calculateEndDate(updatedDate, reportToUpdate.cardCategory);

        const updateData = {
          created_at: updatedDate.toISOString(),
          date: newExpiryDate,
        };

        await axios.put(`${API_URL}/${reportId}`, updateData, {
          headers: getAuthHeader()
        });
      });

      await Promise.all(updates);

      setUpdateMessage("Update successful");
      fetchReports(currentPage);
    } catch (error) {
      setUpdateMessage("Error during update");
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

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col flex-1">
          <label htmlFor="search" className="text-sm mb-1">ماذا تبحث عن؟</label>
          <input type="text" id="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="الاسم أو رقم الهاتف أو اسم المندوب" className="border px-3 py-2 rounded w-full" />
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
                onClick={() => { exportToExcel(reports, "تقارير-الأرشيف-الصفحة-الحالية"); setShowExportOptions(false); }}
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
                onClick={() => { exportToPdf(reports, "تقارير-الأرشيف-الصفحة-الحالية"); setShowExportOptions(false); }}
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
                      setSelectedReportIds(reports.map(report => report.id));
                    } else {
                      setSelectedReportIds([]);
                    }
                  }}
                  checked={selectedReportIds.length === reports.length && reports.length > 0}
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out cursor-pointer"
                />
              </th>
              <th className="px-4 py-3">اسم الزبون</th>
              <th className="px-4 py-3">الاسم الإنجليزي</th>
              <th className="px-4 py-3">رقم الهاتف</th>
              <th className="px-4 py-3">تاريخ الإنشاء</th>
              <th className="px-4 py-3">تاريخ الانتهاء</th>
              <th className="px-4 py-3">اسم المندوب</th>
              <th className="px-4 py-3">رقم البطاقة</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3">العنوان</th>
              <th className="px-4 py-3">المبلغ المدفوع</th>
              <th className="px-4 py-3">المبلغ المتبقي</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedReportIds.includes(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">{report.name_ar || "غير متوفر"}</td>
                  <td className="px-4 py-3">{report.name_en || "غير متوفر"}</td>
                  <td className="px-4 py-3">{report.phoneNumber || "غير متوفر"}</td>
                  <td className="px-4 py-3">
                    {formatDate(report.created_at)}
                  </td>
                  <td className="px-4 py-3">{report.date || "غير متوفر"}</td>
                  <td className="px-4 py-3">{report.delegateName || "غير متوفر"}</td>
                  <td className="px-4 py-3">{report.id}</td>
                  <td className="px-4 py-3">{renderStatus(report.status)}</td>
                  <td className="px-4 py-3">{report.address || "غير محدد"}</td>
                  <td className="px-4 py-3">{report.moneyPaid || "0"}</td>
                  <td className="px-4 py-3">{report.moneyRemain || "0"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="px-4 py-4 text-center text-gray-500">لا توجد بيانات</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            صفحة {currentPage} من {totalPages} (إجمالي العناصر: {totalItems})
          </div>
          
          <div className="flex justify-center items-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              الأولى
            </button>
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
                  key={`page-${page}`}
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
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {totalPages}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessArchive;