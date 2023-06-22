import Card from 'components/card'
import {useState, useEffect, useCallback} from 'react'
import { MdDone, MdOutlineDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';

const columns = [{
    Header: "STT",
    accessor: "stt"
},
{
    Header: "Mã hàng",
    accessor: "id"
},
{
    Header: "Tên hàng",
    accessor: "label"
},
{
    Header: "ĐVT",
    accessor: "unit"
},
{
    Header: "Tồn kho",
    accessor: "instock"
},
{
    Header: "Thực tế",
    accessor: "amount"
},
{
    Header: "SL lệch",
    accessor: "diffAmount"
},
{
    Header: "Giá trị lệch",
    accessor: "diffPrice"
},
{
    Header: "TT",
    accessor: "action"
}
];

const Option = ({ innerRef, innerProps, data }) => (
  <div ref={innerRef} {...innerProps} className="flex py-2 px-3 hover:bg-sky-700">
    <img className="w-[60px] h-[60px] rounded" src={data.image} name={data.label} alt={data.label}/>
    <div className='ml-2 text-[13px]'>
        <p>
            <span className='mr-2 font-bold'>
                {data.label}
            </span>
            {data.unit}
        </p>
        <p>
            <span className='mr-2'>
                {data.id}
            </span>
            <span>
               Giá: {data.price}
            </span>
        </p>
        <p>
            <span className='mr-2'>
               Tồn: {data.instock}
            </span>
        </p>
    </div>
  </div>
);

export default function CreateInspectionVoucher(props) {
  const {context} = props
  const params = useParams();
  const [loading, setLoading] = useState(false)
  let currentWH = useSelector((state) => state.warehouse.data);
  let user = useSelector((state) => state.user.data);  
  const [idInspection, setIdInspection] = useState("")
  const [selectedOption, setSelectedOption] = useState(null);
  const [note, setNote] = useState('');
  const [productImport, setProductImport] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiffAmount, setTotalDiffAmount] = useState(0);
  const [totalDiffPrice, setTotalDiffPrice] = useState(0);
  const [options, setOptions] = useState([]); 
  useEffect(() => {
    async function getData() {
      const urls = [`http://localhost:5000/api/product/get?warehouseId=${currentWH}&page=1&perPage=1000`]
      const requests = urls.map(url => fetch(url).then(response => response.json()));
      const jsonData =  await Promise.all(requests);
      setOptions(jsonData[0].data?.map(item => {return {
        value:item._id,
        label:item.name,
        image:item.image,
        price:item.importPrice,
        unit: item.unitId.name,
        instock: item.warehouse[0].instock || 0,
        id: item._id,
        amount: item.warehouse[0].instock || 0,
      }}))
    }
    getData()
    if(params.id) {
        const getApiDetail = async (id) => {
            const res =  await fetch(`http://localhost:5000/api/warehouseInspection/detail/${id}`)
            const data = await res.json();
            const listProductSelected = data.dataLine.map(item => ({
                amount: item.actualAmount,
                instock: item.instock,
                id: item.productId,
                label: item.productName,
                price: item.price,
                unit: item.unit,
                diffAmount: item.diffAmount,
                diffPrice: item.diffPrice
            }));
            setProductImport(listProductSelected)
            const dataOrder = data.data[0];
            setIdInspection(dataOrder._id)
            setNote(dataOrder.note || "")
            setTotalAmount(dataOrder.totalAmount)
        }
        getApiDetail(params.id); 
        getData();
    } else {
        getData();
    }
  }, [currentWH, params.id]);
  useEffect(() => {
    if(selectedOption) {
        let indexProImport = 0;
        let totalAmount = 0;
        let totalInstock = 0;
        let totalDiffP = 0;
        let myEmptyObj = productImport.find((item,index) => {
            indexProImport = index;
            return item.id == selectedOption.id
        })
        if (myEmptyObj && Object.keys(myEmptyObj).length  && myEmptyObj.constructor === Object) {
            productImport[indexProImport].amount +=1;
            productImport[indexProImport].diffAmount =productImport[indexProImport].amount - productImport[indexProImport].instock;
            productImport[indexProImport].diffPrice = productImport[indexProImport].diffAmount * productImport[indexProImport].price
            totalAmount = productImport.reduce((acc, obj) => acc + (Number(obj["amount"])), 0);
            totalInstock = productImport.reduce((acc, obj) => acc + (Number(obj["diffAmount"])), 0); 
            totalDiffP = productImport.reduce((acc, obj) => acc + (Number(obj["diffPrice"])), 0); 
            setProductImport([...productImport])
        } else {
            totalAmount = [...productImport, selectedOption].reduce((acc, obj) => acc + (Number(obj["amount"])), 0);
            totalInstock =  [...productImport, selectedOption].reduce((acc, obj) => acc + (Number(obj["diffAmount"])), 0);
            totalDiffP =  [...productImport, selectedOption].reduce((acc, obj) => acc + (Number(obj["diffPrice"])), 0);
            const {id, value, label, unit, instock, price, amount} = selectedOption
            setProductImport([...productImport, {
                value, 
                label, 
                unit, 
                instock, 
                price, 
                id,
                amount,
                diffAmount: amount - instock,
                diffPrice: Number(amount - instock)*price
            }])
        }
        setTotalAmount(totalAmount);
        setTotalDiffAmount(totalInstock)
        setTotalDiffPrice(totalDiffP)
    }  
  }, [selectedOption]);
  const handleDeleteOptionSelected = (id) => {
    setProductImport(productImport.filter(item => item.id != id))
  }
  const handleChangeAmountPro = (id, value) => {
    productImport?.forEach(item => {
        if(item.id == id) {
            item.amount = Number(value);
            item.diffAmount =  item.amount - item.instock;
            item.diffPrice = Number(item.diffAmount) * Number(item.price)   
        }
    })
    setProductImport([...productImport]);
    const totalAmount = productImport.reduce((acc, obj) => acc + Number(obj["amount"]), 0);
    const totalInstock = productImport.reduce((acc, obj) => acc + Number(obj["diffAmount"]), 0);
    const totalDiffP = productImport.reduce((acc, obj) => acc + Number(obj["diffPrice"]), 0);
    setTotalAmount(totalAmount);
    setTotalDiffAmount(totalInstock)
    setTotalDiffPrice(totalDiffP)
  }
  const handleSaveData = async () => {
    let url = 'http://localhost:5000/api/warehouseInspection/create'
    let data = {
        idInspection,
        productImport,
        totalDiffAmount,
        totalDiffPrice,
        totalAmount,
        note,
        status: true,
        warehouseId: currentWH,
        employId: user._id
    }
    let method = 'POST';
    let textAlert = 'Tạo mới thành công';
    console.log(data);
    // if (params.id) {
    //     url ='http://localhost:5000/api/warehouseInspection/edit'
    //     data = {
    //         idInspection,
    //     }
    //     method = 'PUT';
    //     textAlert = "Thanh toán thành công"
    // }
    const response = await fetch(url, {
        method: method, 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
      });
      if (response.ok) {
        setLoading(false)
        toast.success(textAlert , {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
    }
  }
  return (
    <div className="mt-5 grid h-full grid-cols-1 gap-3 md:grid-cols-7">
         <Card extra={"w-full pb-10 p-4 h-[490px] col-span-5 max-h-[490px] overscroll-y-auto"}>
            <header className="relative flex items-center justify-between">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        {context}
                    </div>
                    {!params.id &&
                            (<div className="text-navy-700 dark:text-white h-full w-3/6 text-[14px]">
                                <Select
                                    defaultValue={selectedOption}
                                    onChange={(choice) => setSelectedOption(choice)}
                                    options={options}
                                    components={{ Option }}
                                    name="HangHoa"
                                    placeholder="Tìm hàng hóa theo mã hoặc tên"
                                />
                            </div>)
                    }
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
                        if(!params.id || (params.id && column.accessor !== "action")) {
                            return (
                                <th
                                    scope="col"
                                    className={`border-b border-gray-200 p-[10px] text-start dark:!border-navy-700`}
                                    key={`th_${index}`}
                                >
                                    <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                                    {column.Header}
                                    </div>
                                </th>
                            ) 
                        }   
                    })}
                    </tr>
                </thead>
                <tbody>
                    {productImport?.map((row, indexPro) => {
                    return (
                        <tr key={`tr_data_${indexPro}`}>
                        {columns.map((cell, index) => {
                            let data = ""; 
                            if (cell.accessor === "amount") {
                                data = (
                                    <div className="flex items-center gap-2">
                                        <input type="number" className='w-[50px] border-b outline-0' value={row["amount"]} onChange={(e) => handleChangeAmountPro(row["id"], e.target.value)}  disabled = {params.id ? true : false}/> 
                                    </div>
                                );
                            } else if (cell.accessor === 'action'  && !params.id) {
                                data = (
                                  <div className="flex items-center gap-2 text-white">
                                    <button className="bg-red-500 rounded px-1 py-1 flex items-center" onClick={() => handleDeleteOptionSelected(row['id'])}><MdOutlineDelete className="h-4 w-4"/></button>
                                  </div>
                                );
                            } else if (cell.accessor === 'stt') {
                                data = (
                                  <div className="flex items-center gap-2">
                                    {indexPro+1}
                                  </div>
                                );
                            }  else {
                                data = (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            {row[cell.accessor]}
                                        </p>
                                    </div>
                                );
                            } 
                            return (
                                <td
                                    key={index}
                                    className={`p-[10px] sm:text-[14px] ${(cell.accessor === "supplierDebt") ? "flex justify-end" : ""} `}
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
            </div>
        </Card>
        <Card extra={"w-full pb-5 p-4 h-full col-span-2 relative"}>
            <div className="text-navy-700 dark:text-white text-[14px] mt-8">
                <div className='grid w-full md:grid-cols-2'>
                    <div><span>Mã phiếu kiểm kho</span></div>
                    <div>
                        <input type="text" className='w-full border-b outline-0' placeholder='Mã phiếu tự động' value={idInspection} onChange={(e) => setIdInspection(e.target.value)} disabled = {params.id ? true : false}/>
                    </div>
                </div>   
                <div className='grid w-full md:grid-cols-2 mt-5'>
                    <div><span>Tổng số lượng hàng</span></div>
                    <div className='text-right'>
                        <span>{totalAmount}</span>
                    </div>
                </div>
                <div className='grid w-full md:grid-cols-1 mt-8'>
                    <input type="text" className='w-full border-b outline-0' placeholder='Ghi chú' value={note} onChange={(e) => setNote(e.target.value)} />
                </div> 
                {!params.id && (
                     <div className='bottom-[15px] absolute inset-x-[16px]'>
                        <button className='bg-green-500 text-white rounded-[2px] py-2 flex justify-center items-center w-full' onClick={handleSaveData}><MdDone className='text-[20px] mr-1'/>Hoàn thành</button>
                         <div className={loading && "loading"}></div>                   
                    </div>
                )}
                <ToastContainer />
            </div>
        </Card>
    </div>
  )
}


