import React from 'react'
import { FaUsers } from 'react-icons/fa'
import NotificationIcon from '../../assets/NotificationIcon.jpeg'

const TotalBills = () => {
  const data = [
    {
      title: 'فواتير هذا الاسبوع',
      icon: <img src={NotificationIcon} alt="Notification" className="w-[60px] h-[60px] mt-[-20px] mr-[-12px]" />,
      Bills: "666,000 IQ",
      Numberofinvoices: "2",
      titleBills: "#25BC9D"
    },
    {
      title: 'فواتير هذا الشهر',
      icon: <FaUsers className="text-[#b51a00] text-[30px] w-[50px] h-[50px] mt-[-15px]" />,
      Bills: "1,320,000 IQ",
      Numberofinvoices: "3",
      titleBills: "#b51a00"
    }
  ]

  return (
    <div className='total-bills-container flex gap-4 mb-8 w-[600px] h-[130px]'>
      {data.map((item, index) => (
        <div
          key={index}
          className='bg-white flex-1 rounded-lg p-4 flex flex-col shadow pb-[100px] total-bill-card'
        >
          <div className='flex w-full text-sm text-gray-700 mb-3'>
            <div>
              <div className='mt-2'>{item.icon}</div>
              <div className='text-sm mt-4 text-gray-500'>
                {item.title}
              </div>
              <div className='w-full text-left text-xl flex justify-around items-center total-bill-row'>
                <div style={{ color: item.titleBills, fontWeight: 'bold'}}>
                  {item.Bills}
                </div>
                <div className="total-bill-number" style={{marginRight:"120px"}}>
                  {item.Numberofinvoices}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <style>{`
        .total-bills-container {
          width: 600px;
          height: 130px;
        }
        .total-bill-card {
          min-width: 0;
        }
        .total-bill-row {
          flex-wrap: wrap;
        }
        .total-bill-number {
          margin-right: 120px;
        }
        @media (max-width: 700px) {
          .total-bills-container {
            width: 100vw !important;
            min-width: 0;
            height: auto;
            gap: 8px;
            flex-direction: column;
          }
          .total-bill-card {
            width: 100%;
            min-width: 0;
            height: auto;
            padding: 10px;
            margin-bottom: 8px;
            box-sizing: border-box;
          }
          .total-bill-row {
            flex-direction: row;
            justify-content: space-between;
          }
          .total-bill-number {
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default TotalBills