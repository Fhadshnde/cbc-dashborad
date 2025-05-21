import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { FaFileInvoiceDollar } from "react-icons/fa";

const SIDEBAR_ITEMS = [
  { 
    icon: () => <FontAwesomeIcon icon={faTableColumns} className="text-black" />, 
    href: "/",
    text: 'لوحة التحكم'
  },
  { icon: FaFileInvoiceDollar, href: "/accessaeports", text: 'التقارير' },
  { icon: FaFileInvoiceDollar, href: "/stores", text: 'المتاجر' },
  { icon: FaFileInvoiceDollar, href: "/employees", text: 'الموظفين' }, 
  { icon: FaFileInvoiceDollar, href: "/Notification", text: 'الإشعارات' },
  { icon: FaFileInvoiceDollar, href: "/requests", text: 'الطلبات' }, 
  { icon: FaFileInvoiceDollar, href: "/invoice", text: 'الفواتير' },
];

const Sidebar = () => {
  return (
    <motion.div
      className="relative z-10 ml-4 flex-shrink-0 bg-white border-r border-gray-300 sidebar-main"
      initial={{ width: 90 }}
      animate={{ width: 90 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex flex-col">
        <div className="text-center py-4 text-black font-bold border-b border-gray-300">
          <h1 className="text-lg">نظام فواتير CBC</h1>
        </div>
        
        <nav className="flex-grow overflow-y-auto">
          {SIDEBAR_ITEMS.map((item, index) => (
            <Link key={index} to={item.href} className="block">
              <motion.div 
                className="flex items-center hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0 mt-10 w-8 h-8 flex items-center justify-center">
                  {item.icon ? (
                    typeof item.icon === 'function' ? (
                      item.icon()
                    ) : (
                      <item.icon size={24} className="text-black" />
                    )
                  ) : (
                    <div className="w-6 h-6" />
                  )}
                </div>
                <span className="sidebar-text mr-1 mt-10 text-sm font-medium text-right flex-grow">
                  {item.text}
                </span>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
      <style>{`
        .sidebar-main {
          width: 90px;
        }
        @media (max-width: 900px) {
          .sidebar-main {
            width: 25px !important;
            min-width: 25px !important;
            max-width: 25px !important;
          }
          .sidebar-text {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Sidebar;