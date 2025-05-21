import React from 'react'
import { FaUsers } from 'react-icons/fa'
import NotificationIcon from '../../assets/NotificationIcon.jpeg'

const TotalBills = () => {
  const data = [
    {
      title: 'فواتير هذا الاسبوع',
      icon: <img src={NotificationIcon} alt="Notification" className="w-16 h-16 mt-[-5px] md:mt-[-20px] mr-[-5px] md:mr-[-12px]" />,
      Bills: "666,000 IQ",
      Numberofinvoices: "2",
      titleBills: "#25BC9D"
    },
    {
      title: 'فواتير هذا الشهر',
      icon: <FaUsers className="text-[#b51a00] text-3xl w-12 h-12 mt-[-5px] md:mt-[-15px]" />,
      Bills: "1,320,000 IQ",
      Numberofinvoices: "3",
      titleBills: "#b51a00"
    },
  ]

  return (
    <div className="total-bills-container w-full sm:w-[70px] flex flex-wrap justify-center  gap-4 mb-8">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white w-full h-[150px]  sm:w-[70px] md:flex-1 rounded-lg p-4 flex flex-col shadow pb-[100px]"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start text-sm text-gray-700 mb-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="mt-2">{item.icon}</div>
              <div className="text-sm mt-4 text-gray-500 text-center md:text-right">
                {item.title}
              </div>
              <div className="w-full text-center md:text-left text-xl flex justify-around mt-2">
                <div className="font-bold" style={{ color: item.titleBills }}>
                  {item.Bills}
                </div>
                <div className="md:mr-[120px]">
                  {item.Numberofinvoices}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        /* حجم الحاوية في اللابتوب */
        @media (min-width: 768px) {
          .total-bills-container {
            width: 600px !important;
            height: 130px !important;
          }
        }

        @media (max-width: 768px) {
          .total-bills-container {
            width: 320px !important;
            height: auto !important;
                margin-right: 36px;

          }
        }

        @media (max-width: 600px) {
          .total-bills-scale {
            transform: scale(0.85);
          }
        }

        @media (max-width: 450px) {
          .total-bills-scale {
            transform: scale(0.75);
          }
        }
      `}</style>
    </div>
  )
}

export default TotalBills
