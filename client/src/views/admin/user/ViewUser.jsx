import Card from 'components/card'
import Confirm from 'components/confirm/Confirm';
import SearchField from 'components/fields/SearchField';
import React, {useState, useEffect, useCallback} from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdAdd, MdModeEditOutline, MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function ViewUser() {
  const navigate = useNavigate();
  const [ userName, setUserName ] = useState('');
  const [ confirmStatus, setConfirmStatus ] = useState(false);
  const [ statusOpenCf, setStatusOpenCf] = useState(false);
  const [ idDelete , setIdDelete ] = useState('');
  const [ data, setData ] = useState([])
  const columns = [{
    Header: "STT",
    accessor: "stt"
  },
  {
    Header: "Tên người dùng",
    accessor: "name"
  },
  {
    Header: "SĐT",
    accessor: "phone"
  },
  {
    Header: "Email",
    accessor: "email"
  },
  {
    Header: "Vai trò",
    accessor: "role"
  },
  {
    Header: "Trạng thái",
    accessor: "status"
  },
  {
    Header: "Thao tác",
    accessor: "action"
  }]
  useEffect(() => {
    async function getDataImport() {
      const response = await fetch(`http://localhost:5000/api/user/get`);
      const jsonData = await response.json();
      console.log(jsonData);
      setData(jsonData)
    }
    if (confirmStatus) {
      setConfirmStatus(false);
      fetch('http://localhost:5000/api/user/delete/' + idDelete, {
        method: 'DELETE',
      })
      .then(res => {
          setConfirmStatus(true);
          setStatusOpenCf(false);
      })
  }
    getDataImport()
  }, [idDelete, confirmStatus]);

  const handleEdit = (id) => {
    navigate(`/admin/administrators/edit/${id}`)
  }

  const handleDelete = useCallback((id) => {
    setStatusOpenCf(true);
    setIdDelete(id);
  },[idDelete, confirmStatus])

  const handleSearchData = async() => {
    const response = await fetch(`http://localhost:5000/api/user/get?name=${userName}`);
    const jsonData = await response.json();
    setData(jsonData);
  }


  return (
    <div className='mt-5 grid h-full'>
        <Card extra={"w-full sm:overflow-auto p-4"}>
            <header className="relative flex items-center justify-between">
            <div className="flex text-navy-700 dark:text-white h-full">
                    <SearchField placeholder="Theo tên người dùng..." value={userName} handleChangeValue={setUserName}/>
                    <button className='bg-green-600 text-white text-[13px] p-2 rounded flex items-center' onClick={handleSearchData}>
                        <FiSearch className="h-4 w-5 dark:text-white" />
                    </button>
                </div>
                <button className='bg-blue-500 text-white text-[13px] p-2 rounded flex items-center' onClick={() => navigate(`/admin/administrators/create-new`)}><MdAdd className='text-[16px] mr-1'/>Thêm mới</button>
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
                    {data.map((row, index) => {
                    return (
                        <tr key={`tr_data_${index}`}>
                        {columns.map((cell) => {
                            let view = ""; 
                            if (cell.accessor === "stt") {
                                view = (
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-navy-700 dark:text-white">
                                            {index + 1}
                                        </p>
                                    </div>
                                );
                            } else if (cell.accessor === "status") {
                                view = (
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-navy-700 dark:text-white">
                                      {row[cell.accessor] ? 
                                          <span className='status_active'>Đang hoạt động</span> : 
                                          <span className='status_pause'>Tạm dừng</span>}
                                    </p>
                                  </div>
                                );
                              } else if (cell.accessor == 'action') {
                                view = (
                                  <div className="flex items-center gap-2 text-white">
                                    <button className="bg-indigo-600 rounded px-1 py-1 flex items-center" onClick={() => handleEdit(row['_id'])}><MdModeEditOutline className="h-4 w-4"/></button>
                                    <button className="bg-red-600 rounded px-1 py-1 flex items-center" onClick={() => handleDelete(row['_id'])}><MdOutlineDeleteOutline className="h-4 w-4"/></button>
                                  </div>
                                );
                            }  else {
                                view = (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            {(cell.accessor == 'role') ? row[cell.accessor].name : row[cell.accessor]}
                                        </p>
                                    </div>
                                );
                            } 
                            return (
                                <td
                                    key={index}
                                    className={`p-[10px] sm:text-[14px] ${(cell.accessor === "permissions") ? "w-[380px]" : ""} `}
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
            </div>
            <Confirm statusOpenCf={statusOpenCf} setStatusOpenCf={setStatusOpenCf} setConfirmStatus={setConfirmStatus} text={"Bạn chắc chắn muốn xóa người dùng này không?"}/>
        </Card>
    </div>
  )
}
