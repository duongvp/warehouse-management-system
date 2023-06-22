import Card from 'components/card'
import Confirm from 'components/confirm/Confirm';
import SearchField from 'components/fields/SearchField';
import Pagination from 'components/pagination';
import React, {useState, useEffect, useCallback} from 'react';
import { MdAdd, MdModeEditOutline, MdOutlineDeleteOutline, MdOutlineLocalPrintshop } from "react-icons/md";
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ComponentToPrint from './componentToPrint';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { FiSearch } from 'react-icons/fi';
import SelectSearchField from 'components/fields/SelectSearchField';

const ComponentWrapper = ({ id, checkComponent }) => {
    const componentRef = useRef();  
    return (
        <div>
            <ReactToPrint
                trigger={() => <button className="bg-teal-500 rounded px-1 py-1 flex items-center"><MdOutlineLocalPrintshop className="h-4 w-4"/></button>}
                content={() => componentRef.current}
            />
            <div style={{ display: "none" }}>
                <ComponentToPrint id={id} checkComponent={checkComponent} ref={componentRef} />
            </div>
        </div>
    );
  };

export default function InventoryReceivingVoucher() {
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ code, setCode ] = useState('');
  const [check, setCheck] = useState(false)
  const [ supplier, setSupplier ] = useState('');
  const [ dataListSuppliers, setDataListSuppliers ] = useState([])
  const [ objQuery, setObjQuery ] = useState('')
  const [ confirmStatus, setConfirmStatus ] = useState(false);
  const [ statusOpenCf, setStatusOpenCf] = useState(false);
  const [ idDelete , setIdDelete ] = useState('');
  let currentWH = useSelector((state) => state.warehouse.data);
  const navigate = useNavigate();
  const [ data, setData ] = useState([])
  const columns = [{
    Header: "Mã nhập hàng",
    accessor: "_id"
  },
  {
    Header: "Thời gian",
    accessor: "createdAt"
  },
  {
    Header: "Nhà cung cấp",
    accessor: "supplierId"
  },
  {
    Header: "Cần trả NCC",
    accessor: "debt"
  },
  {
    Header: "Tổng tiền hàng",
    accessor: "paidSupplier"
  },
  {
    Header: "Thao tác",
    accessor: "action"
  }     
]

const handleEdit = (id) => {
    navigate(`/admin/inventory-receiving-voucher/edit/${id}`)
}


const handleDelete = useCallback((id) => {
    setStatusOpenCf(true);
    setIdDelete(id);
  },[idDelete, confirmStatus])

  useEffect(() => {
    if (confirmStatus) {
        fetch(`http://localhost:5000/api/warehouseReceipt/delete/${idDelete}/${currentWH}`, {
          method: 'DELETE',
        })
        .then(res => {
            setConfirmStatus(false);
            setStatusOpenCf(false);
            setCheck(!check)
            setCurrentPage(1)
        })
    }
  }, [idDelete, confirmStatus]);


  useEffect(() => {
    async function getDataImport() {
      let str = objQuery ? JSON.stringify(objQuery) : ""  
      const response = await fetch(`http://localhost:5000/api/warehouseReceipt/get?warehouseId=${currentWH}&page=${currentPage}&perPage=10&objQuery=${str}`);
      const jsonData = await response.json();
      console.log(jsonData);
      setData(jsonData)
    }
    getDataImport()
  }, [currentPage, currentWH, objQuery, check]);

  useEffect(() => {
    async function getData() {
        const response = await fetch(`http://localhost:5000/api/supplier/get`);
        const jsonData = await response.json();
        setDataListSuppliers(jsonData)
    }
    getData()
  }, []);

  const handleSearchData = async() => {
    setObjQuery({code, supplier})
  }

  return (
    <div className='mt-5 grid h-full'>
        <Card extra={"w-full sm:overflow-auto p-4"}>
            <header className="relative flex items-center justify-between">
                <div className="flex text-navy-700 dark:text-white h-full">
                    <SearchField placeholder="Theo mã phiếu nhập..." value={code} handleChangeValue={setCode}/>
                    <SelectSearchField placeHolder = "Theo nhà cung cấp..." data={dataListSuppliers} setDataValue={setSupplier} extra = "xl-w-[180px]"/>
                    <button className='bg-green-600 text-white text-[13px] p-2 rounded flex items-center' onClick={handleSearchData}>
                        <FiSearch className="h-4 w-5 dark:text-white" />
                    </button>
                </div>
                <button className='bg-blue-500 text-white text-[13px] p-2 rounded flex items-center' onClick={() => navigate(`/admin/inventory-receiving-voucher/create-new`)}><MdAdd className='text-[16px] mr-1'/>Nhập hàng</button>
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
                        <td className='p-[10px] text-[16px] text-red-700'>{data.totalDebt?.toLocaleString('en-VN')}</td>
                        <td className='p-[10px] text-[16px] text-green-700'>{data.totalAmount?.toLocaleString('en-VN')}</td>
                    </tr>
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
                                    <button className="bg-indigo-600 rounded px-1 py-1 flex items-center" onClick={() => handleEdit(row['_id'])}><MdModeEditOutline className="h-4 w-4"/></button>
                                    <ComponentWrapper id = {row['_id']} checkComponent = "Receiving" />
                                    <button className="bg-red-600 rounded px-1 py-1 flex items-center" onClick={() => handleDelete(row['_id'])}><MdOutlineDeleteOutline className="h-4 w-4"/></button>
                                  </div>
                                );
                            } else {
                                view = (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            {cell.accessor == 'supplierId' ? row.supplierId?.name : (['paidSupplier', 'debt'].includes(cell.accessor) ? row[cell.accessor]?.toLocaleString('en-VN') :row[cell.accessor])}
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
