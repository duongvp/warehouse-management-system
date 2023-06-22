import React, { useCallback, useEffect, useMemo,useState } from "react";
import Card from "components/card";
import { MdModeEditOutline, MdOutlineDeleteOutline, MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Confirm from "components/confirm/Confirm";
import Pagination from "components/pagination";
import SearchField from "components/fields/SearchField";
import { useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import SelectSearchField from "components/fields/SelectSearchField";

const CheckTable = (props) => {
  const userPermissions = useSelector(state => state.user.permissions);
  const navigate = useNavigate();
  const [ proName, setProName ] = useState('');
  const [ unitName, setUnitName ] = useState('');
  const [ cateName, setCateName ] = useState('');
  const [ status, setStatus ] = useState('');
  const [ dataListUnits, setDataListUnits ] = useState([])
  const [ dataListCats, setDataListCats ] = useState([])
  const { columnsData, tableData, currentPage, setCurrentPage, totalItems, setObjQuery, setCheck, check } = props;
  const [ confirmStatus, setConfirmStatus ] = useState(false);
  const [ statusOpenCf, setStatusOpenCf] = useState(false);
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const [ idDelete , setIdDelete ] = useState('');

  const handleEdit = (id) => {
    navigate(`/admin/product/edit/${id}`)
  }
  
  const handleDelete = useCallback((id) => {
    setStatusOpenCf(true);
    setIdDelete(id);
  },[idDelete, confirmStatus])

  useEffect(() => {
    if (confirmStatus) {
        setConfirmStatus(false);
        fetch('http://localhost:5000/api/product/delete/' + idDelete, {
          method: 'DELETE',
        })
        .then(res => {
            setConfirmStatus(true);
            setStatusOpenCf(false);
            setCheck(!check)
            setCurrentPage(1)
        })
    }
  }, [idDelete, confirmStatus]);

  const handleSearchData = async() => {
      setCurrentPage(1)
      setObjQuery({proName, unitName, cateName, status})
  }

  useEffect(() => {
    async function getDataImport() {
      const urls = [`http://localhost:5000/api/unit/get`, "http://localhost:5000/api/category/get" ]
      const requests = urls.map(url => fetch(url).then(response => response.json()));
      const jsonData =  await Promise.all(requests);
      setDataListUnits(jsonData[0])
      setDataListCats(jsonData[1])
    }
    getDataImport()
  }, []);

  return (
    <Card extra={"w-full sm:overflow-auto p-4"}>
      <header className="relative flex items-center justify-between">
        <div className="flex text-navy-700 dark:text-white h-full">
            <SearchField placeholder="Theo tên sản phẩm..." value={proName} handleChangeValue={setProName}/>
            <SelectSearchField placeHolder = "Theo đơn vị tính" data={dataListUnits} setDataValue={setUnitName}/>
            <SelectSearchField placeHolder = "Theo danh mục" data={dataListCats} setDataValue={setCateName}/>
            <SelectSearchField placeHolder = "Theo trạng thái" data={[{_id:"true",name:"Đang bán"},{_id:"false",name:"Tạm dừng"}]}  setDataValue={setStatus}/>
            <button className='bg-green-600 text-white text-[13px] p-2 rounded flex items-center' onClick={handleSearchData}>
                <FiSearch className="h-4 w-5 dark:text-white" />
            </button>
        </div>
        {userPermissions.includes('createPro') && (<button className='bg-blue-500 text-white text-[13px] p-2 rounded flex items-center' onClick={() => navigate(`/admin/product/create-new`)}><MdAdd className='text-[16px] mr-1'/>Tạo mới</button>)}
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table
          className="w-full"
          color="gray-500"
          mb="24px"
        >
          <thead>
            <tr>
              {columns.map((column, index) => {
                if(column.accessor == 'action' && !userPermissions.includes('deletePro') && !userPermissions.includes('editPro')) return;
                return (
                  <th
                    scope="col"
                    className="border-b border-gray-200 p-[10px] text-start dark:!border-navy-700"
                    key={`th_${index}`}
                  >
                    <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                      {column.Header}
                    </div>
                  </th>
              )})}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              return (
                <tr key={`tr_data_${index}`}>
                  {columns.map((cell, index) => {
                    let data = "";
                    if (cell.accessor === "image") {
                      data = (
                        <div className="flex items-center gap-2">
                          <img className="w-[60px] h-[60px] object-cover" src={row[cell.accessor]} alt="" />
                        </div>
                      );
                    } else if (cell.accessor === "status") {
                      data = (
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-navy-700 dark:text-white">
                            {row[cell.accessor] ? 
                                <span className='status_active'>Đang bán</span> : 
                                <span className='status_pause'>Tạm dừng</span>}
                          </p>
                        </div>
                      );
                    } else if (cell.accessor == 'action') {
                      data = (
                        <div className="flex items-center gap-2 text-white">
                          {userPermissions.includes('editPro') && (<button  className="bg-indigo-600 rounded px-1 py-1 flex items-center" onClick={() => handleEdit(row['_id'])}><MdModeEditOutline className="h-4 w-4"/></button>)}
                          {userPermissions.includes('deletePro') && (<button className="bg-red-600 rounded px-1 py-1 flex items-center" onClick={() => handleDelete(row['_id'])}><MdOutlineDeleteOutline className="h-4 w-4"/></button>)}
                        </div>
                      );
                    } else if (cell.accessor == 'warehouse') {
                      data = (
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                             {row[cell.accessor][0].instock}
                          </p>
                        </div>
                      );
                    } else {
                      data = (
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {(cell.accessor == 'unitId' || cell.accessor == 'categoryId') ?  row[cell.accessor].name : row[cell.accessor]}
                          </p>
                        </div>
                      );
                    } 
                    return (
                      <td
                        key={index}
                        className="p-[10px] sm:text-[14px]"
                      >
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Confirm statusOpenCf={statusOpenCf} setStatusOpenCf={setStatusOpenCf} setConfirmStatus={setConfirmStatus} text={"Bạn chắc chắn muốn xóa sản phẩm này không?"}/>
        <Pagination itemsPerPage={10} totalItems ={totalItems} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
    </Card>
  );
};

export default CheckTable;
