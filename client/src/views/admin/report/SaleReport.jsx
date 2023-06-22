import Card from 'components/card'
import Pagination from 'components/pagination';
import React, {useState, useEffect} from 'react';
import { FiSearch } from 'react-icons/fi';
import { useSelector } from 'react-redux';


export default function SaleReport() {
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ inputDate, setInputDate ] = useState('');
  const [ objQuery, setObjQuery ] = useState('')
  const [ outputDate, setOutputDate ] = useState('');
  console.log('inputDate', inputDate);
  let currentWH = useSelector((state) => state.warehouse.data);
  const [ data, setData ] = useState([])
  const columns = [{
    Header: "Mã hàng",
    accessor: "_id"
  },
  {
    Header: "Tên hàng",
    accessor: "name"
  },
  {
    Header: "Giá trị nhập",
    accessor: "importPrice"
  },
  {
    Header: "Giá trị bán",
    accessor: "price"
  },
  {
    Header: "SL bán",
    accessor: "totalQuantity"
  },
  {
    Header: "Doanh thu thuần",
    accessor: "totalPrices"
  }
]

  useEffect(() => {
    async function getDataImport() {
      const response = await fetch(`http://localhost:5000/api/report/get?warehouseId=${currentWH}&page=${currentPage}&perPage=10&objQuery=${objQuery}`);
      const jsonData = await response.json();
      console.log(jsonData);
      setData(jsonData)
    }
    getDataImport()
  }, [currentPage, currentWH, objQuery]);

  const handleSearchData = async() => {
    setObjQuery(JSON.stringify({inputDate, outputDate}))
  }
  return (
    <div className='mt-5 grid h-full'>
        <Card extra={"w-full sm:overflow-auto p-4"}>
            <header className="relative flex items-center justify-between">
                <div className="text-navy-700 dark:text-white h-full flex">
                    <div className='mr-2'>
                      <label for="date-input">Từ ngày:</label>
                      <input type="date" id="date-input" placeholder="Theo mã phiếu nhập..." className='border-2 h-[35.5px] pr-3 pl-3 rounded ml-2 mr-3' onChange={(e)=> setInputDate(e.target.value) }/>
                      <label for="date-out">Đến ngày:</label>
                      <input type="date" id="date-out" placeholder="Theo mã phiếu nhập..." className='border-2 h-[35.5px] pr-3 pl-3 rounded ml-2' min={`${inputDate}`} onChange={(e)=>setOutputDate(e.target.value)}/>
                    </div>
                    <button className='bg-blue-500 text-white text-[13px] p-2 rounded flex items-center' onClick={handleSearchData}>
                        <FiSearch className="h-4 w-4 mr-1 dark:text-white" />
                        Tìm kiếm
                    </button>
                </div>
            </header> 
            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table
                className="w-full"
                color="gray-500"
                mb="24px"
                >
                <thead>
                    <tr>
                    {columns.map((column, index) => (
                        <th
                            scope="col"
                            className="border-b border-gray-200 p-[10px] text-start dark:!border-navy-700"
                            key={`th_${index}`}
                        >
                            <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                            {column.Header}
                            </div>
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className='p-[10px] text-[16px] text-green-700'>{data.totalQuantitys}</td>
                        <td className='p-[10px] text-[16px] text-green-700'>{data.totalAmount}</td>
                    </tr>
                    {data.data?.map((row, index) => {
                    return (
                        <tr key={`tr_data_${index}`}>
                        {columns.map((cell, index) => {
                            return (
                                <td
                                    key={index}
                                    className={`p-[10px] sm:text-[14px]`}
                                >
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            {cell.accessor == 'importPrice' ? row['product'][0]?.importPrice : row[cell.accessor]}
                                        </p>
                                    </div>
                                </td>
                            );
                        })}
                        </tr>
                    );
                    })}
                </tbody>
                </table>
                <Pagination itemsPerPage={10} totalItems ={data.totalPages * 10} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            </div>
        </Card>
    </div>
  )
}
