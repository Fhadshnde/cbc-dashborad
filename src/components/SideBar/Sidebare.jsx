import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Home,
  Store,
  Bell,
} from "lucide-react";
import { TbUsersGroup } from "react-icons/tb";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineRequestPage } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';

const SIDEBAR_ITEMS = [
  { 
    icon: () => <FontAwesomeIcon icon={faTableColumns} style={{ color: "#000000" }} />, 
    href: "/",
     text : 'لوحة التحكم'
  },
  { icon: FaFileInvoiceDollar, href: "/accessaeports",     text : 'لوحة التحكم'  },
  { icon: FaFileInvoiceDollar, href: "/stores",     text : 'لوحة التحكم'  },
  { icon: FaFileInvoiceDollar, href: "/employees",     text : 'لوحة التحكم'  }, 
  { icon: FaFileInvoiceDollar, href: "/Notification",     text : 'لوحة التحكم'  },
  { icon: FaFileInvoiceDollar, href: "/requests",     text : 'لوحة التحكم'  }, 
  { icon: FaFileInvoiceDollar, href: "/invoice" ,     text : 'لوحة التحكم'  },
];

const Sidebar = () => {
  return (
    <motion.div
      className="relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 w-24"
      animate={{ width: 90 }}
    >
      <div
        className="h-full flex flex-col border-r border-gray-300"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="text-center mt-4 text-black font-bold">
          <h1>نظام فواتير CBC</h1>
        </div>
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item, index) => (
            <Link key={index} to={item.href}>
              <motion.div className="flex justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors mb-2 text-black">
                {item.icon ? (
                  typeof item.icon === 'function' ? (
                    item.icon()
                  ) : (
                    <item.icon size={32} style={{ color: "#000000" }} />

                  )
                ) : (
                  <div style={{ width: 24, height: 24 }} />
                )}
                <span className="mr-4 text-sm font-medium">
                  {item.text}
                </span>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;