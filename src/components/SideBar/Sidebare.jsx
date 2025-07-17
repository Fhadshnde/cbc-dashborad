import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableColumns, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FaFileInvoiceDollar } from "react-icons/fa";

const SALES_ITEMS = [
  { icon: () => <FontAwesomeIcon icon={faTableColumns} className="text-black" />, href: "/", text: 'لوحة التحكم' },
  { icon: FaFileInvoiceDollar, href: "/accessreports", text: 'قسم المحاسبة' },
  { icon: FaFileInvoiceDollar, href: "/archives", text: 'الارشيف' },
  { icon: FaFileInvoiceDollar, href: "/summary-reports", text: 'ملخص تقارير المبيعات' },
  { icon: FaFileInvoiceDollar, href: "/accessreports/print", text: 'قسم الطباعة' },
  { icon: FaFileInvoiceDollar, href: "/management", text: 'إدارة المستخدمين' },
  { icon: FaFileInvoiceDollar, href: "/supervisor", text: 'قسم الذاتية' },
  { icon: FaFileInvoiceDollar, href: "/admin", text: ' المستخدمين' },
  

];

const FOLLOWUP_ITEMS = [
  { icon: FaFileInvoiceDollar, href: "/dashboard", text: 'الصفحة الرئيسية' },
  { icon: FaFileInvoiceDollar, href: "/contracts", text: 'العقود' },
  { icon: FaFileInvoiceDollar, href: "/Stores", text: 'المتاجر' },
  { icon: FaFileInvoiceDollar, href: "/surveys", text: 'الاستبيانات' },
  { icon: FaFileInvoiceDollar, href: "/employees", text: 'الموظفات' },
  { icon: FaFileInvoiceDollar, href: "/reports-and-analytics", text: 'التقارير والتحليلات' },
  { icon: FaFileInvoiceDollar, href: "/MyTasksPage", text: 'مهامي' },
  { icon: FaFileInvoiceDollar, href: "/my-account", text: 'حسابي' },
  { icon: FaFileInvoiceDollar, href: "/employees-with-unfinished-surveys", text: 'الموظفات مع الاستبيانات غير المكتملة' },
];

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const department = localStorage.getItem("selectedDepartment");
    setSelectedDepartment(department);
  }, []);

  const handleClose = () => setOpen(false);

  const sidebarItems =
    selectedDepartment === "sales"
      ? SALES_ITEMS
      : selectedDepartment === "followup"
      ? FOLLOWUP_ITEMS
      : [];

  return (
    <>
      {isMobile ? (
        <>
          <div className="fixed top-0 right-0 w-full bg-white p-4 flex justify-end z-50 border-b border-gray-300">
            <button onClick={() => setOpen(true)} aria-label="فتح القائمة">
              <FontAwesomeIcon icon={faBars} size="2x" />
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                exit={{ x: -200 }}
                transition={{ duration: 0.3 }}
                className="fixed top-[56px] right-0 bg-white z-50 shadow-lg border-l overflow-y-auto rounded-bl-lg rounded-tl-lg"
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <h1 className="font-bold text-lg text-black">القائمة</h1>
                  <button onClick={handleClose} aria-label="إغلاق القائمة">
                    <FontAwesomeIcon icon={faXmark} size="lg" />
                  </button>
                </div>

                <nav className="p-4 space-y-4">
                  {sidebarItems.map((item, index) => (
                    <Link key={index} to={item.href} onClick={handleClose}>
                      <div className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded transition cursor-pointer">
                        <div className="text-xl">
                          {typeof item.icon === 'function' ? item.icon() : <item.icon size={20} />}
                        </div>
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          className="relative z-10 ml-4 flex-shrink-0 bg-white border-r border-gray-300 sidebar-main"
          initial={{ width: 100 }}
          animate={{ width: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-full flex flex-col">
            <div className="text-center py-4 text-black font-bold border-b border-gray-300">
              <h1 className="text-lg">نظام فواتير CBC</h1>
            </div>

            <nav className="flex-grow overflow-y-auto">
              {sidebarItems.map((item, index) => (
                <Link key={index} to={item.href} className="block">
                  <motion.div
                    className="flex items-center hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex-shrink-0 mt-10 w-8 h-8 flex items-center justify-center">
                      {typeof item.icon === 'function' ? item.icon() : <item.icon size={24} className="text-black" />}
                    </div>
                    <span className="sidebar-text mr-1 mt-10 text-sm font-medium text-right flex-grow">
                      {item.text}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
