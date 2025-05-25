import React from 'react'
import { FaUsers } from 'react-icons/fa'
import NotificationIcon from '../../assets/NotificationIcon.jpeg'

const TotalBills = () => {
  const data = [
    {
      title: 'فواتير هذا الاسبوع',
      icon: <img src={NotificationIcon} alt="Notification" className="w-12 h-12" />,
      Bills: "666,000 IQ",
      Numberofinvoices: "2",
      titleBills: "#25BC9D"
    },
    {
      title: 'فواتير هذا الشهر',
      icon: <FaUsers className="text-[#b51a00] text-3xl w-12 h-12" />,
      Bills: "1,320,000 IQ",
      Numberofinvoices: "3",
      titleBills: "#b51a00"
    },
    {
      title: 'فواتير مدفوعة',
      icon: <img src={NotificationIcon} alt="Notification" className="w-12 h-12" />,
      Bills: "500,000 IQ",
      Numberofinvoices: "5",
      titleBills: "#25BC9D"
    },
    {
      title: 'فواتير غير مدفوعة',
      icon: <FaUsers className="text-[#b51a00] text-3xl w-12 h-12" />,
      Bills: "800,000 IQ",
      Numberofinvoices: "4",
      titleBills: "#b51a00"
    },
  ]

  return (
    <div className="w-full flex flex-wrap justify-between gap-4 mb-8">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white flex-1 min-w-[200px] h-[150px] rounded-lg p-4 shadow flex flex-col items-center"
        >
          <div className="flex flex-col items-center w-full">
            <div className="mb-2">{item.icon}</div>
            <div className="text-sm text-gray-500 text-center">
              {item.title}
            </div>
            <div className="w-full text-center text-xl mt-2">
              <div className="font-bold" style={{ color: item.titleBills }}>
                {item.Bills}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {item.Numberofinvoices} فواتير
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TotalBills