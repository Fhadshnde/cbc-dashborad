const axios = require("axios");
const AccessReport = require("../models/AccessReport");
const translate = require("translatte");
const moment = require("moment");
const User = require("../models/User");
const xlsx = require("xlsx");
const fs = require('fs');

const ALLOWED_EDIT_HOURS = 6 * 60 * 60 * 1000;

const PREFERRED_NAME_SPELLINGS = {
  "علي": "Ali",
  "محمد": "Mohammed",
  "فهد": "Fahad",
  "وسام": "Wissam",
  "احمد": "Ahmed",
  "محمود": "Mahmoud",
  "حسن": "Hassan",
  "حسين": "Hussein",
  "فاطمة": "Fatima",
  "زينب": "Zainab",
  "مريم": "Maryam",
  "عبد الله": "Abdullah",
  "عبد الرحمن": "Abdulrahman",
  "يوسف": "Youssef",
  "سلمان": "Salman",
  "عبد العزيز": "Abdulaziz",
  "امير": "Ameer",
  "عائشة": "Aisha",
  "سارة": "Sara",
  "ليلى": "Layla",
  "نور": "Noor",
  "جميلة": "Jamila",
  "علياء": "Alya",
  "هالة": "Hala",
  "رنا": "Rana",
  "هند": "Hind",
  "سعاد": "Souad",
  "منى": "Mona",
  "نجلاء": "Najla",
  "سمية": "Sumaya",
  "أسماء": "Asmaa",
  "هبة": "Heba",
  "رغد": "Raghad",
  "دلال": "Dalia",
  "عفاف": "Afaf",
  "أميرة": "Amira",
  "رزان": "Razaan",
  "جنى": "Jana",
  "رؤى": "Ruaa",
  "عزة": "Azza",
  "ليان": "Layan",
  "جود": "Joud",
  "تالا": "Tala",
  "رؤى": "Rawaa",
  "سلمى": "Salma",
  "كاظم": "Kadhim",
  "جاسم": "Jassem",
  "راشد": "Rashed",
  "ملك": "Malak",
  "نورا": "Noura",
  "قمر": "Qamar",
  "شمس": "Shams",
  "وردة": "Warda",
  "زهرة": "Zahra",
  "نجمة": "Najma",
  "فرح": "Farah",
  "سما": "Sama",
  "امل": "Amal",
  "غزال": "Ghazal",
  "بيداء": "Baydaa"
};

async function translateWithRetry(text, from = "ar", to = "en", retries = 2) {
  try {
    if (!text || typeof text !== "string" || text.trim() === "") {
      return text;
    }

    const trimmedText = text.trim();

    if (PREFERRED_NAME_SPELLINGS[trimmedText.toLowerCase()]) {
      return PREFERRED_NAME_SPELLINGS[trimmedText.toLowerCase()];
    }

    const parts = trimmedText.split(' ');
    const translatedParts = await Promise.all(
      parts.map(async (part) => {
        if (PREFERRED_NAME_SPELLINGS[part.toLowerCase()]) {
          return PREFERRED_NAME_SPELLINGS[part.toLowerCase()];
        } else {
          const res = await translate(part, { from: from, to: to });
          return res.text.trim();
        }
      })
    );
    return translatedParts.join(' ');
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 500));
      return translateWithRetry(text, from, to, retries - 1);
    }
    return text;
  }
}

const BAGHDAD_REGIONS = [
    "اليرموك", "الرشيد", "المنصور", "الدورة", "الكرخ", "الكاظمية", 
    "الاسكان", "الغزالية", "البياع", "حي الجامعة", "الحارثية", "حي الجهاد", 
    "العامرية", "الداوودي", "السيدية", "العدل", "العطيفية", "الصالحية", 
    "ابو غريب", "حي العامل", "الدولعي", "الشعلة", "الكرادة", "الجادرية", 
    "الرصافة", "بغداد الجديدة", "الغدير", "الصدر", "الشعب", "البلديات", 
    "البنوك", "الحبيبية", "الزعفرانية", "المستنصرية", "المشتل", "زيونة", 
    "حي أور", "حي تونس", "شارع فلسطين", "عرصات الهندية", "بسماية", "القاهرة", 
    "الاعظمية", "شارع المغرب", "الحسينية", "سبع ابكار", "الصليخ", "الوزيرية"
];

const BASRA_REGIONS = [
    "المدينة", "القرنة", "شط العرب", "البصرة", "ابو الخصيب", "الفاو", 
    "الزبير", "طويسة", "شارع الوفود", "حي الزهراء", "ام قصر", "العشار", 
    "العباسية", "الجمهورية", "الحكيمية", "الجنينة", "البهو", "الجمعيات", 
    "التنومة", "التحسينية", "مناوي باشا"
];

const ALLOWED_REGIONS_BY_GOVERNORATE = {
    "بغداد": BAGHDAD_REGIONS,
    "البصرة": BASRA_REGIONS
};


async function createAccessReportCtrl(req, res) {
  try {
    const cardCategory = req.body.cardCategory || {
      oneYear: 0,
      twoYears: 0,
      virtual: 0,
    };

    let card_id = "5";
    const now = new Date();

    if (cardCategory.oneYear > 0) {
      card_id = "1";
      now.setFullYear(now.getFullYear() + 1);
    } else if (cardCategory.twoYears > 0) {
      card_id = "2";
      now.setFullYear(now.getFullYear() + 2);
    } else if (cardCategory.virtual > 0) {
      card_id = "7";
      now.setMonth(now.getMonth() + 6);
    }

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const expirationDate = `${year}/${month}`;

    const quantity = Number(req.body.quantity) || 0;
    const moneyPaid = (Number(req.body.moneyPaid) || 0).toString();
    const moneyRemain = (Number(req.body.moneyRemain) || 0).toString();

    const { name_test: ignored_name_test, number, ...rest } = req.body;
    const name_ar = req.body.name_ar || "";

    const translatedName = await translateWithRetry(name_ar, "ar", "en");

    const name_en = req.body.name_en;
    const phoneNumber = req.body.phoneNumber;
    const region = req.body.region;

    let excelDate = null;
    if (req.body.excelDate) {
      excelDate = new Date(req.body.excelDate);
      if (isNaN(excelDate.getTime())) {
        excelDate = null;
      }
    }

    if (region !== undefined && region !== null && region !== "") {
      if (!req.user || !req.user.governorate) {
        return res.status(403).json({ message: "معلومات المستخدم أو المحافظة غير متوفرة." });
      }
      const userGovernorate = req.user.governorate;

      const allowedRegionsForUser = ALLOWED_REGIONS_BY_GOVERNORATE[userGovernorate];

      if (!allowedRegionsForUser || !allowedRegionsForUser.includes(region)) {
        let errorMessage = `المنطقة "${region}" غير صالحة.`;
        if (!allowedRegionsForUser) {
          errorMessage += ` المحافظة "${userGovernorate}" غير مدعومة بقوائم مناطق محددة.`;
        } else {
          errorMessage += ` المنطقة يجب أن تكون إحدى: ${allowedRegionsForUser.join(", ")}.`;
        }
        return res.status(400).json({ message: errorMessage });
      }
    }

    if (!req.user || !req.user.username || !req.user._id) {
      return res.status(401).json({ message: "غير مصرح - المستخدم غير مسجل الدخول" });
    }

    const adminUsername = req.user.username;

    const newReport = new AccessReport({
      ...rest,
      name_ar,
      name_en,
      phoneNumber,
      name_test: translatedName,
      quantity,
      moneyPaid,
      moneyRemain,
      cardCategory,
      card_id,
      date: expirationDate,
      status: "pending",
      notes: req.body.notes || "",
      onPayroll: typeof req.body.onPayroll === "boolean" ? req.body.onPayroll : false,
      isEdited: false,
      editedBy: "",
      remainingEditTime: "06:00:00",
      admin: adminUsername,
      region: region,
      excelDate: excelDate,
      createdAt: new Date(),
    });

    const savedReport = await newReport.save();

    const externalData = {
      id: null,
      name_ar: savedReport.name_ar,
      name_en: savedReport.name_en,
      phoneNumber: savedReport.phoneNumber,
      moneyPaid: savedReport.moneyPaid,
      moneyRemain: savedReport.moneyRemain,
      quantity: savedReport.quantity,
      address: savedReport.address,
      ministry: savedReport.ministry,
      card_id: savedReport.card_id,
      date: savedReport.date,
      cardCategory: savedReport.cardCategory,
      status: savedReport.status,
      notes: savedReport.notes,
      onPayroll: savedReport.onPayroll,
      isEdited: savedReport.isEdited,
      editedBy: savedReport.editedBy,
      remainingEditTime: savedReport.remainingEditTime,
      region: savedReport.region,
      admin: savedReport.admin,
    };

    await axios.post("https://cbc-api.app/v4/Dash/saveAccount", externalData);

    const getResponse = await axios.get("https://cbc-api.app/v4/getAllAccounts", {
      params: { page: 1, itemsPerPage: 1, status: 1, orderBy: "desc", sortBy: "id" },
    });

    const accountsList = getResponse.data.DataOfTable || getResponse.data || [];
    const foundAccount = accountsList.find((acc) => {
      const phoneMatch =
        acc.phoneNumber &&
        acc.phoneNumber.trim() !== "" &&
        acc.phoneNumber.trim() === savedReport.phoneNumber.trim();
      const nameMatch =
        acc.name_ar &&
        acc.name_ar.trim().toLowerCase() === savedReport.name_ar.trim().toLowerCase();
      return phoneMatch || nameMatch;
    });

    if (foundAccount && foundAccount.id) {
      savedReport.id = Number(foundAccount.id);
      await savedReport.save();
    }

    return res.status(201).json(savedReport);
  } catch (err) {
    res.status(500).json({
      message: err.message || "An unexpected error occurred",
      details: err.response ? err.response.data : (err.errors || err.message || err.toString()),
    });
  }
}


function calculateRemainingEditTime(createdAt) {
    const ALLOWED_EDIT_MS = 6 * 60 * 60 * 1000;
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    const timeElapsed = now - createdTime;
    const timeLeft = ALLOWED_EDIT_MS - timeElapsed;
  
    if (timeLeft <= 0) {
      return "00:00:00";
    }
  
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  
  async function getAllAccessReportsCtrAll(req, res) {
    try {
      const reports = await AccessReport.find({})
        .sort({ createdAt: -1 }) 
        .lean();
      res.status(200).json(reports);
    } catch (err) {
      res.status(500).json({ message: err.message || err });
    }
  }
  
  async function getAllAccessReportsCtrl(req, res) {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "غير مصرح: بيانات المستخدم غير متوفرة" });
      }
  
      if (req.user.role !== "supervisor") {
        const reports = await AccessReport.find().sort({ createdAt: -1 }).lean();
        const formattedReports = reports.map(report => ({
          ...report,
          remainingEditTime: calculateRemainingEditTime(report.createdAt)
        }));
        return res.status(200).json(formattedReports);
      }
  
      const supervisorGovernorate = req.user.governorate;
      
      if (!supervisorGovernorate) {
        return res.status(400).json({ message: "المحافظة غير محددة في حساب المشرف" });
      }
  
      const adminsInGovernorate = await User.find({
        governorate: supervisorGovernorate,
        role: "admin",
        status: "active"
      }).select('username').lean();
  
      const adminUsernames = adminsInGovernorate.map(admin => admin.username);
  
      const allReports = await AccessReport.find().sort({ createdAt: -1 }).lean();
  
      const classifiedReports = allReports.map(report => {
        const isFromMyGovernorate = adminUsernames.includes(report.admin);
        return {
          ...report,
          isFromMyGovernorate,
          governorate: isFromMyGovernorate ? supervisorGovernorate : "أخرى",
          remainingEditTime: calculateRemainingEditTime(report.createdAt)
        };
      });
  
      const sortedReports = classifiedReports.sort((a, b) => {
        if (a.isFromMyGovernorate && !b.isFromMyGovernorate) return -1;
        if (!a.isFromMyGovernorate && b.isFromMyGovernorate) return 1;
        
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  
      res.status(200).json(sortedReports);
    } catch (err) {
      res.status(500).json({ 
        message: "حدث خطأ في الخادم",
        error: err.message 
      });
    }
  }
  
 async function updateAccessReportCtrl(req, res) {
  const { id } = req.params;
  try {
    const report = await AccessReport.findById(id);
    if (!report) return res.status(404).json({ message: "التقرير غير موجود" });

    const now = Date.now();
    const createdTime = new Date(report.createdAt).getTime();
    if (req.user.role !== "supervisor") {
      if (report.status !== "pending") return res.status(403).json({ message: "لا يمكن تعديل التقرير بعد تغيير حالته" });
      if (now - createdTime > ALLOWED_EDIT_HOURS) return res.status(403).json({ message: "انتهت فترة التعديل (6 ساعات)" });
    }

    const { createdAt, expiredDate, excelDate, editedBy, editedFields, remainingEditTime, admin, ...otherUpdates } = req.body;

    Object.assign(report, otherUpdates);

    if (createdAt !== undefined) {
      report.createdAt = new Date(createdAt);
      report.markModified("createdAt");
    }

    if (expiredDate !== undefined) {
      report.expiredDate = new Date(expiredDate);
      report.markModified("expiredDate");
    }

    if (excelDate !== undefined) {
      report.excelDate = new Date(excelDate);
      report.markModified("excelDate");
    }

    if (report.name_ar !== undefined && report.name_ar !== otherUpdates.name_ar && otherUpdates.name_ar !== undefined) {
      report.name_test = await translateWithRetry(otherUpdates.name_ar, "ar", "en");
      report.markModified("name_test");
    }

    if (otherUpdates.quantity !== undefined) {
      report.quantity = Number(otherUpdates.quantity) || 0;
      report.markModified("quantity");
    }

    if (otherUpdates.moneyPaid !== undefined) {
      report.moneyPaid = (Number(otherUpdates.moneyPaid) || 0).toString();
      report.markModified("moneyPaid");
    }

    if (otherUpdates.moneyRemain !== undefined) {
      report.moneyRemain = (Number(otherUpdates.moneyRemain) || 0).toString();
      report.markModified("moneyRemain");
    }

    if (otherUpdates.date !== undefined) {
      const dateObj = new Date(otherUpdates.date);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      report.date = `${year}/${month}`;
      report.markModified("date");
    }

    if (req.user.role !== "supervisor") {
      if (otherUpdates.cardCategory !== undefined) {
        delete report.cardCategory;
      }
    } else if (otherUpdates.cardCategory !== undefined) {
      report.cardCategory = otherUpdates.cardCategory;
      report.markModified("cardCategory");
    }

    if ("status" in otherUpdates) {
      const newStatus = otherUpdates.status;
      if (req.user.role === "supervisor") {
        const validStatuses = ["pending", "rejected", "canceled", "received", "processing", "approved"];
        if (!validStatuses.includes(newStatus)) {
          return res.status(400).json({ message: "قيمة حالة غير صالحة للمشرف" });
        }
      } else if (req.user.role === "admin") {
        if (newStatus !== "canceled") {
          return res.status(403).json({ message: "موظف المبيعات يمكنه تغيير الحالة إلى 'ملغاة' فقط." });
        }
        if (report.admin !== req.user.username) {
          return res.status(403).json({ message: "ليس لديك صلاحية إلغاء هذه الفاتورة: أنت لست منشئها." });
        }
      } else {
        return res.status(403).json({ message: "غير مصرح لك بتغيير حالة التقرير." });
      }
      report.status = newStatus;
      report.markModified("status");
    } else {
      if (req.user.role !== "supervisor") {
        delete report.status;
        report.markModified("status");
      }
    }

    if (otherUpdates.region !== undefined && otherUpdates.region !== null && otherUpdates.region !== "") {
      if (!req.user || !req.user.governorate) {
        return res.status(403).json({ message: "معلومات المستخدم أو المحافظة غير متوفرة للتحقق من المنطقة." });
      }
      const userGovernorate = req.user.governorate;
      const allowedRegionsForUser = ALLOWED_REGIONS_BY_GOVERNORATE[userGovernorate];
      if (!allowedRegionsForUser || !allowedRegionsForUser.includes(otherUpdates.region)) {
        return res.status(400).json({ message: `المنطقة "${otherUpdates.region}" غير صالحة لمحافظة "${userGovernorate}".` });
      }
      report.region = otherUpdates.region;
      report.markModified("region");
    }

    report.isEdited = true;
    report.markModified("isEdited");
    report.editedBy = req.user.username;
    report.markModified("editedBy");
    report.editedAt = new Date();
    report.markModified("editedAt");
    report.remainingEditTime = calculateRemainingEditTime(report.createdAt);
    report.markModified("remainingEditTime");

    const ignoreKeys = ["_id", "editedFields", "editedAt", "remainingEditTime", "isEdited", "editedBy", "createdAt", "expiredDate", "excelDate", "date", "name_test", "quantity", "moneyPaid", "moneyRemain", "cardCategory", "status", "region"];
    const currentEditedFields = report.editedFields || [];
    const newEditedFields = [];

    for (const key in otherUpdates) {
      if (!ignoreKeys.includes(key) && typeof otherUpdates[key] !== "undefined" && JSON.stringify(otherUpdates[key]) !== JSON.stringify(report[key])) {
        newEditedFields.push(key);
      }
    }

    report.editedFields = Array.from(new Set([...currentEditedFields, ...newEditedFields]));
    report.markModified("editedFields");

    await report.save();

    res.status(200).json(report); // لا حاجة لـ populate هنا
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
}

  
  async function updateReportStatusCtrl(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const report = await AccessReport.findById(id);
      if (!report) return res.status(404).json({ message: "التقرير غير موجود" });
  
      if (req.user.role === "supervisor") {
        const validStatuses = ["pending", "rejected", "canceled", "received", "processing", "approved"];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ message: "قيمة حالة غير صالحة للمشرف" });
        }
      } else if (req.user.role === "admin") {
        if (status !== "canceled") {
          return res.status(403).json({ message: "موظف المبيعات يمكنه تغيير الحالة إلى 'ملغاة' فقط." });
        }
        if (report.admin !== req.user.username) {
          return res.status(403).json({ message: "ليس لديك صلاحية إلغاء هذه الفاتورة: أنت لست منشئها." });
        }
      } else {
        return res.status(403).json({ message: "غير مصرح لك بتغيير حالة التقرير." });
      }
  
      report.status = status;
      report.markModified('status');
      report.isEdited = true;
      report.markModified('isEdited');
      report.editedBy = req.user.username;
      report.markModified('editedBy');
      report.editedAt = new Date();
      report.markModified('editedAt');
      report.remainingEditTime = calculateRemainingEditTime(report.createdAt);
      report.markModified('remainingEditTime');
      report.editedFields = ["status"];
      report.markModified('editedFields');
  
      await report.save();
      res.status(200).json(report);
    } catch (err) {
      res.status(500).json({ message: err.message || err });
    }
  }
  
  async function deleteAccessReportCtrl(req, res) {
    const { id } = req.params;
    try {
      if (req.user.role !== "supervisor") return res.status(403).json({ message: "ليس لديك صلاحية لحذف التقرير." });
      const deletedReport = await AccessReport.findByIdAndDelete(id);
      if (!deletedReport) return res.status(404).json({ message: "التقرير غير موجود" });
      res.status(200).json({ message: "تم حذف التقرير بنجاح" });
    } catch (err) {
      res.status(500).json({ message: err.message || err });
    }
  }
  
  async function getAdminStatsCtrl(req, res) {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const stats = await AccessReport.aggregate([
        {
          $group: {
            _id: "$admin", // التجميع حسب اسم المستخدم
            oneYearCount: { $sum: "$cardCategory.oneYear" },
            twoYearsCount: { $sum: "$cardCategory.twoYears" },
            virtualCount: { $sum: "$cardCategory.virtual" },
            totalAmount: { $sum: { $toDouble: "$quantity" } },
            reportsCount: { $sum: 1 },
            oneYearCountMonthly: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ["$createdAt", startOfMonth] }, { $lte: ["$createdAt", endOfMonth] }] },
                  "$cardCategory.oneYear",
                  0,
                ],
              },
            },
            twoYearsCountMonthly: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ["$createdAt", startOfMonth] }, { $lte: ["$createdAt", endOfMonth] }] },
                  "$cardCategory.twoYears",
                  0,
                ],
              },
            },
            virtualCountMonthly: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ["$createdAt", startOfMonth] }, { $lte: ["$createdAt", endOfMonth] }] },
                  "$cardCategory.virtual",
                  0,
                ],
              },
            },
            monthlyReportCount: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ["$createdAt", startOfMonth] }, { $lte: ["$createdAt", endOfMonth] }] },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id", // هنا سيكون اسم المستخدم (من التجميع)
            foreignField: "username", // يربط مع حقل username في Users
            as: "userInfo",
          },
        },
        { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            admin: "$_id", // اسم المستخدم هو ما تم تجميعه
            oneYearCount: 1,
            twoYearsCount: 1,
            virtualCount: 1,
            totalCards: { $add: ["$oneYearCount", "$twoYearsCount", "$virtualCount"] },
            totalAmount: { $round: ["$totalAmount", 2] },
            reportsCount: 1,
            oneYearCountMonthly: 1,
            twoYearsCountMonthly: 1,
            virtualCountMonthly: 1,
            monthlyReportCount: 1,
            governorate: "$userInfo.governorate", // جلب المحافظة من User
            imageUrl: "$userInfo.imageUrl",       // جلب الصورة من User
            _id: 0,
          },
        },
        { $sort: { admin: 1 } },
      ]);
      const totals = {
        totalOneYear: stats.reduce((sum, admin) => sum + admin.oneYearCount, 0),
        totalTwoYears: stats.reduce((sum, admin) => sum + admin.twoYearsCount, 0),
        totalVirtual: stats.reduce((sum, admin) => sum + admin.virtualCount, 0),
        totalAllCards: stats.reduce((sum, admin) => sum + admin.totalCards, 0),
        totalAllAmount: stats.reduce((sum, admin) => sum + admin.totalAmount, 0),
        totalReports: stats.reduce((sum, admin) => sum + admin.reportsCount, 0),
        totalOneYearMonthly: stats.reduce((sum, admin) => sum + admin.oneYearCountMonthly, 0),
        totalTwoYearsMonthly: stats.reduce((sum, admin) => sum + admin.twoYearsCountMonthly, 0),
        totalVirtualMonthly: stats.reduce((sum, admin) => sum + admin.virtualCountMonthly, 0),
        totalReportsThisMonth: stats.reduce((sum, admin) => sum + admin.monthlyReportCount, 0),
      };
      res.status(200).json({ stats, totals });
    } catch (err) {
      res.status(500).json({ message: err.message || err });
    }
  }
  
  async function getMonthlyAccessReportStatsCtrl(req, res) {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const stats = await AccessReport.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: "$admin",
            monthlyReportCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "username",
            as: "userInfo",
          },
        },
        { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            admin: "$_id",
            monthlyReportCount: 1,
            governorate: "$userInfo.governorate",
            imageUrl: "$userInfo.imageUrl",
            _id: 0,
          },
        },
        { $sort: { monthlyReportCount: -1 } },
      ]);
      const total = stats.reduce((sum, item) => sum + item.monthlyReportCount, 0);
      res.status(200).json({ stats, totalReportsThisMonth: total });
    } catch (err) {
      res.status(500).json({ message: err.message || err });
    }
  }
  
  async function getAccessReportsByAdminCtrl(req, res) {
    const { username } = req.params;
    try {
      const reports = await AccessReport.find({ admin: username }).sort({ createdAt: -1 });
      const formattedReports = reports.map((report) => {
        const remainingEditTime = calculateRemainingEditTime(report.createdAt);
        return { ...report._doc, remainingEditTime };
      });
      res.status(200).json(formattedReports);
    } catch (err) {
      res.status(500).json({ message: err.message || err });
    }
  }
  async function getAccessReportByIdCtrl(req, res) {
    try {
      const report = await AccessReport.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "التقرير غير موجود" });
      }
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ message: "حدث خطأ في الخادم" });
    }
  }
  async function getAccessReportsByUserCtrl(req, res) {
    try {
      const username = req.user.username;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const monthlyReports = await AccessReport.find({
        admin: username,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).sort({ createdAt: -1 });
      const formattedReports = monthlyReports.map((report) => {
        const remainingEditTime = calculateRemainingEditTime(report.createdAt);
        return { ...report._doc, remainingEditTime };
      });
      res.status(200).json(formattedReports);
    } catch (err) {
      res.status(500).json({ message: err.message || err });
    }
  }
  
  async function getMonthlyAccessReportsByUserCtrl(req, res) {
    try {
      const username = req.user.username;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const monthlyReports = await AccessReport.find({
        admin: username,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).sort({ createdAt: -1 });
      const formattedReports = monthlyReports.map((report) => {
        const remainingEditTime = calculateRemainingEditTime(report.createdAt);
        return { ...report._doc, remainingEditTime };
      });
      res.status(200).json(formattedReports);
    } catch (err) {
      res.status(500).json({ message: err.message || err });
    }
  }
  
  async function getPersonalMonthlyReportCountCtrl(req, res) {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
      let query = {
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      };
  
      if (req.user.role === "admin") {
        query.admin = req.user.username;
      } else if (req.user.role !== "supervisor") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول إلى هذه البيانات." });
      }
  
      const monthlyReportCount = await AccessReport.countDocuments(query);
      res.status(200).json({ monthlyReportCount });
    } catch (error) {
      res.status(500).json({ message: error.message || error });
    }
  }
  
  async function searchMyAccessReportsByCustomerNameCtrl(req, res) {
    try {
      const username = req.user.username;
      const { name } = req.query;
      if (!name || name.trim() === "") {
        return res.status(400).json({ message: "يرجى إدخال اسم العميل للبحث" });
      }
      const searchTerm = name.trim().replace(/\s+/g, " ");
      const isPhoneSearch = /^\d+$/.test(searchTerm);
      let query = { admin: username };
      if (isPhoneSearch) {
        const phoneDigits = searchTerm.replace(/\D/g, "");
        query.$or = [{ phoneNumber: { $regex: phoneDigits } }];
      } else {
        query.$or = [{ name_ar: { $regex: searchTerm, $options: "i" } }];
      }
      const reports = await AccessReport.find(query).sort({ createdAt: -1 });
      const formattedReports = reports.map((report) => ({
        ...report._doc,
        remainingEditTime: calculateRemainingEditTime(report.createdAt),
      }));
      res.status(200).json(formattedReports);
    } catch (err) {
      res.status(500).json({ message: "حدث خطأ أثناء البحث" });
    }
  }
  
  async function getStatusPercentageStatsCtrl(req, res) {
    try {
      const range = req.query.range || "all";
  
      let filter = { status: { $in: ["pending", "rejected", "received"] } };
  
      if (range !== "all") {
        const now = moment();
  
        let startDate;
        switch (range) {
          case "daily":
            startDate = now.clone().startOf("day");
            break;
          case "weekly":
            startDate = now.clone().startOf("isoWeek");
            break;
          case "monthly":
            startDate = now.clone().startOf("month");
            break;
          case "half-year":
            startDate = now.clone().subtract(6, "months").startOf("day");
            break;
          case "yearly":
            startDate = now.clone().startOf("year");
            break;
          default:
            startDate = null;
        }
        if (startDate) {
          filter.createdAt = { $gte: startDate.toDate() };
        }
      }
  
      const totalReports = await AccessReport.countDocuments(filter);
  
      if (totalReports === 0) {
        return res.status(200).json({
          totalReports: 0,
          counts: { pending: 0, rejected: 0, received: 0 },
          percentages: { pending: "0.00", rejected: "0.00", received: "0.00" },
        });
      }
  
      const statusCounts = await AccessReport.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);
  
      const counts = { pending: 0, rejected: 0, received: 0 };
      const percentages = { pending: "0.00", rejected: "0.00", received: "0.00"};
  
      statusCounts.forEach(({ _id, count }) => {
        if (counts.hasOwnProperty(_id)) {
          counts[_id] = count;
          percentages[_id] = ((count / totalReports) * 100).toFixed(2);
        }
      });
  
      res.status(200).json({
        totalReports,
        counts,
        percentages,
      });
    } catch (error) {
      res.status(500).json({ message: "حدث خطأ في الخادم" });
    }
  }
const AccessReport = require("../models/AccessReport");
const User = require("../models/User");
const axios = require("axios");
const translate = require("translate");       
const moment = require("moment");
        
  module.exports = {
    createAccessReportCtrl,
    getAllAccessReportsCtrl,
    updateAccessReportCtrl,
    updateReportStatusCtrl,
    deleteAccessReportCtrl,
    getAdminStatsCtrl,
    getAccessReportsByAdminCtrl,
    getAccessReportsByUserCtrl,
    getMonthlyAccessReportStatsCtrl,
    getMonthlyAccessReportsByUserCtrl,
    getPersonalMonthlyReportCountCtrl,
    searchMyAccessReportsByCustomerNameCtrl,
    getAccessReportByIdCtrl,
    getStatusPercentageStatsCtrl,
    getAllAccessReportsCtrAll,
  };
