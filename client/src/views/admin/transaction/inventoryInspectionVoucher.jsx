import Card from 'components/card'
import Confirm from 'components/confirm/Confirm';
import SearchField from 'components/fields/SearchField';
import Pagination from 'components/pagination';
import React, {useState, useEffect, useCallback} from 'react';
import { MdAdd, MdOutlineDeleteOutline, MdOutlineLocalPrintshop, MdRemoveRedEye } from "react-icons/md";
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

export default function InventoryInspectionVoucher() {
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ confirmStatus, setConfirmStatus ] = useState(false);
  const [ statusOpenCf, setStatusOpenCf] = useState(false);
  const [ idDelete , setIdDelete ] = useState('');
  let currentWH = useSelector((state) => state.warehouse.data);
  const navigate = useNavigate();
  const [ data, setData ] = useState([])
  const columns = [{
    Header: "Mã kiểm kho",
    accessor: "_id"
  },
  {
    Header: "Thời gian",
    accessor: "createdAt"
  },
  {
    Header: "Người tạo",
    accessor: "employId"
  },
  {
    Header: "SL thực tế",
    accessor: "totalAmount"
  },
  {
    Header: "SL lệch",
    accessor: "totalDiffAmount"
  },
  {
    Header: "Tổng giá trị chênh lệch",
    accessor: "totalDiffPrice"
  },
  {
    Header: "Thao tác",
    accessor: "action"
  }     
]

const handleEdit = (id) => {
    navigate(`/admin/inventory-inspection-voucher/edit/${id}`)
}


const handleDelete = useCallback((id) => {
    setStatusOpenCf(true);
    setIdDelete(id);
  },[idDelete, confirmStatus])


  useEffect(() => {
    async function getDataImport() {
      const response = await fetch(`http://localhost:5000/api/warehouseInspection/get?warehouseId=${currentWH}&page=${currentPage}&perPage=10`);
      const jsonData = await response.json();
      console.log(jsonData);
      setData(jsonData)
    }
    getDataImport()
  }, [currentPage, currentWH]);
  return (
    <div className='mt-5 grid h-full'>
        <Card extra={"w-full sm:overflow-auto p-4"}>
            <header className="relative flex justify-between">
                <div></div>
                <button className='bg-blue-500 text-white text-[13px] p-2 rounded flex items-center' onClick={() => navigate(`/admin/inventory-inspection-voucher/create-new`)}><MdAdd className='text-[16px] mr-1'/>Tạo Phiếu</button>
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
                    {data.data?.map((row, index) => {
                    return (
                        <tr key={`tr_data_${index}`}>
                        {columns.map((cell, index) => {
                            let view = ""; 
                            if (cell.accessor === "createdAt") {
                                view = (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            <Moment format='DD/MM/YYYY  HH:mm'>{row[cell.accessor]}</Moment>
                                        </p>
                                    </div>
                                );
                            } else if (cell.accessor == 'action') {
                                view = (
                                  <div className="flex items-center gap-2 text-white">
                                    <button className="bg-teal-600 rounded px-1 py-1 flex items-center" onClick={() => handleEdit(row['_id'])}><MdRemoveRedEye className="h-4 w-4"/></button>
                                    <button className="bg-red-600 rounded px-1 py-1 flex items-center" onClick={() => handleDelete(row['_id'])}><MdOutlineDeleteOutline className="h-4 w-4"/></button>
                                  </div>
                                );
                            } else {
                                view = (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            {cell.accessor == 'employId' ? row.employId?.name : (['totalDiffPrice'].includes(cell.accessor) ? row[cell.accessor]?.toLocaleString('en-VN') :row[cell.accessor])}
                                        </p>
                                    </div>
                                );
                            } 
                            return (
                                <td
                                    key={index}
                                    className={`p-[10px] sm:text-[14px]`}
                                >
                                    {view}
                                </td>
                            );
                        })}
                        </tr>
                    );
                    })}
                </tbody>
                </table>
                <Confirm statusOpenCf={statusOpenCf} setStatusOpenCf={setStatusOpenCf} setConfirmStatus={setConfirmStatus} text={"Bạn chắc chắn muốn phiếu này không?"}/>
                <Pagination itemsPerPage={10} totalItems ={data.totalPages * 10} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            </div>
        </Card>
    </div>
  )
}
