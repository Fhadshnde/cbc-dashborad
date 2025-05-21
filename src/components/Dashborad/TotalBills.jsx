import React from 'react'
import { FaUsers } from 'react-icons/fa'
import NotificationIcon from '../../assets/NotificationIcon.jpeg'

const TotalBills = () => {
  const data = [
    {
      title: 'فواتير هذا الاسبوع',
      icon: <img src={NotificationIcon} alt="Notification" style={{ width: 60, height: 60, marginTop: -20, marginRight: -12 }} />,
      Bills: "666,000 IQ",
      Numberofinvoices: "2",
      titleBills: "#25BC9D"
    },
    {
      title: 'فواتير هذا الشهر',
      icon: <FaUsers style={{ color: "#b51a00", fontSize: 30, width: 50, height: 50, marginTop: -15 }} />,
      Bills: "1,320,000 IQ",
      Numberofinvoices: "3",
      titleBills: "#b51a00"
    }
  ]

  return (
    <div className='flex gap-4 mb-8' style={{ width: '600px',height: '130px' }}>
      {data.map((item, index) => (
        <div
          key={index}
          className='bg-white flex-1 rounded-lg p-4 flex flex-col shadow pb-[100px]'
        >
          <div className='flex w-full text-sm text-gray-700 mb-3'>
            <div>
              <div className='mt-2'>{item.icon}</div>
              <div className='text-sm mt-4 text-gray-500'>
                {item.title}
              </div >
              <div className='w-full text-left text-xl flex justify-around'>
          <div style={{ color: item.titleBills, fontWeight: 'bold'}}>
                {item.Bills}
              </div >
              <div style={{marginRight:"120px"}}>
              {item.Numberofinvoices}

              </div>
          </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  )
}

export default TotalBills
