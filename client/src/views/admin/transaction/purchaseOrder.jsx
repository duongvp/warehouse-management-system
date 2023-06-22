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
    Header: "Số lượng",
    accessor: "amount"
},
{
    Header: "Đơn giá",
    accessor: "price"
},
{
    Header: "Thành tiền",
    accessor: "totalPrice"
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

const SupplierOption= ({ innerRef, innerProps, data }) => (
    <div ref={innerRef} {...innerProps} className="flex py-2 px-3 hover:bg-sky-700">
        <div className='ml-2 text-[13px] flex justify-between'>
            <span className='mr-2 font-bold'>
                {data.label} 
            </span>
            <span className='mr-2 font-bold'>  
                {data.phone}
            </span>
        </div>
    </div>
  )


export default function PurchaseOrder(props) {
  const [loading, setLoading] = useState(false)
  const {context} = props; 
  const params = useParams();
  let currentWH = useSelector((state) => state.warehouse.data); 
  let user = useSelector((state) => state.user.data); 
  const [idReceipt, setIdReceipt] = useState("")
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSupplierOption, setSelectedSupplierOption] = useState(null);
  const [totalPricePro, setTotalPricePro] = useState(0);
  const [needPaySupplier, setNeedPaySupplier] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paidSupplier, setPaidSupplier] = useState(0)
  const [debt, setDebt] = useState(0);
  const [note, setNote] = useState('');
  const [productImport, setProductImport] = useState([]);
  const [options, setOptions] = useState([]); 
  const [supplierOptions, setSupplierOptions] = useState([]); 
  console.log('productImport', productImport);  
  useEffect(() => {
    async function getData() {
      const urls = [`http://localhost:5000/api/product/get?warehouseId=${currentWH}&page=1&perPage=1000`, "http://localhost:5000/api/supplier/get" ]
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
        amount: 1,
        totalPrice: item.importPrice
      }}))
      setSupplierOptions(jsonData[1].map(item => ({
        value:item._id,
        label:item.name,
        phone:item.phone,
        id: item._id,
      })))
    }
    if(params.id) {
        const getApiDetail = async (id) => {
            const res =  await fetch(`http://localhost:5000/api/warehouseReceipt/detail/${id}`)
            const data = await res.json();
            const listProductSelected = data.dataLine.map(item => ({
                amount: item.quantity,
                id: item.productId,
                label: item.productName,
                price: item.price,
                totalPrice: item.totalPrice,
                unit: item.unit
            }));
            setProductImport(listProductSelected)
            const dataOrder = data.data[0];
            setDebt(dataOrder.debt)
            setIdReceipt(dataOrder._id)
            setNeedPaySupplier(dataOrder.paidSupplier)
            setNote(dataOrder.note || "")
            setDiscount(dataOrder.discountMount)
            setTotalPricePro(dataOrder.totalPrice)
            setPaidSupplier(dataOrder.debt + dataOrder.paidSupplier)
            setSelectedSupplierOption({
                id: dataOrder.supplierId._id,
                label: dataOrder.supplierId.name,
                phone: dataOrder.supplierId.phone,
                value: dataOrder.supplierId._id
            })
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
        let sum = 0;
        let myEmptyObj = productImport.find((item,index) => {
            indexProImport = index;
            return item.id == selectedOption.id
        })
        if (myEmptyObj && Object.keys(myEmptyObj).length  && myEmptyObj.constructor === Object) {
            productImport[indexProImport].amount +=1;
            productImport[indexProImport].totalPrice = productImport[indexProImport].amount * productImport[indexProImport].price
            sum = productImport.reduce((acc, obj) => acc + (Number(obj["amount"])*Number(obj["price"])), 0);
            setProductImport([...productImport])
        } else {
            sum = [...productImport, selectedOption].reduce((acc, obj) => acc + (Number(obj["amount"])*Number(obj["price"])), 0);
            setProductImport([...productImport, selectedOption])
        }
        setTotalPricePro(sum);
        setNeedPaySupplier(sum);
        setDebt(-sum);
    }  
  }, [selectedOption]);

  const handleDeleteOptionSelected = (id) => {
    setProductImport(productImport.filter(item => item.id != id))
  }
  const handleChangeAmountPro = (id, value) => {
    productImport?.forEach(item => {
        if(item.id == id) {
            item.amount = Number(value)
            item.totalPrice = Number(value) * Number(item.price)
        }
    })
    setProductImport([...productImport]);
    const sum = productImport.reduce((acc, obj) => acc + (Number(obj["amount"])*Number(obj["price"])), 0);
    setTotalPricePro(sum);
    setNeedPaySupplier(sum);
    setDebt(-sum);
  }
  const handleChangePaidSuppiler =  useCallback((e) => {
    setDebt(Number(e.target.value) - Number(needPaySupplier))
    setPaidSupplier(e.target.value)
  }, [paidSupplier])
  const handleChangeDiscount = useCallback((e) => {
    setNeedPaySupplier(Number(totalPricePro) - Number(e.target.value))
    setDiscount(e.target.value)
  }, [discount])
  const handleSaveData = async () => {
    let url = 'http://localhost:5000/api/warehouseReceipt/create'
    let data = {
        idReceipt,
        productImport,
        selectedSupplierOption: selectedSupplierOption?.value,
        totalPricePro,
        discount,
        needPaySupplier,
        paidSupplier,
        debt,
        note,
        status: true,
        warehouseId: currentWH,
        employId: user._id
    }
    let method = 'POST';
    let textAlert = 'Tạo mới thành công';
    if (params.id) {
        url ='http://localhost:5000/api/warehouseReceipt/edit'
        data = {
            idReceipt,
            discount,
            needPaySupplier,
            debt
        }
        method = 'PUT';
        textAlert = "Thanh toán thành công"
    } else if (!selectedSupplierOption?.value) {
        return alert("Vui long nhap du thong tin!")
    }
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
    <div className="mt-5 grid h-full grid-cols-1 gap-3 md:grid-cols-3">
         <Card extra={"w-full pb-10 p-4 h-full col-span-2"}>
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
                                        <input type="number" className='w-[50px] border-b outline-0' value={row["amount"]} onChange={(e) => handleChangeAmountPro(row["id"], e.target.value)} disabled = {params.id ? true : false}/> 
                                    </div>
                                );
                            } else if (cell.accessor === 'action' && !params.id) {
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
                            } else if (cell.accessor === 'totalPrice') {
                                data = (
                                  <div className="flex items-center gap-2">
                                    {Number(row["totalPrice"])}
                                  </div>
                                );
                            } else {
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
        <Card extra={"w-full pb-10 p-4 h-full"}>
            <header className="relative flex items-center justify-between">
                <div className="text-navy-700 dark:text-white h-full w-full text-[14px]">
                    <Select
                        defaultValue={selectedSupplierOption}
                        value={selectedSupplierOption}
                        onChange={(choice) => setSelectedSupplierOption(choice)}
                        options={supplierOptions}
                        components={{ Option: SupplierOption }}
                        name="NCC"
                        isDisabled = {params.id ? true : false}
                        placeholder="Tìm nhà cung cấp theo tên hoặc sdt..."
                    />
                </div>
            </header>
            <div className="text-navy-700 dark:text-white text-[14px] mt-8">
                <div className='grid w-full md:grid-cols-2'>
                    <div><span>Mã Phiếu nhập</span></div>
                    <div>
                        <input type="text" className='w-full border-b outline-0' placeholder='Mã phiếu tự động' value={idReceipt} onChange={(e) => setIdReceipt(e.target.value)} disabled = {params.id ? true : false}/>
                    </div>
                </div>   
                <div className='grid w-full md:grid-cols-2 mt-5'>
                    <div><span>Tổng tiền hàng</span></div>
                    <div className='text-right'>
                        <span>{totalPricePro}</span>
                    </div>
                </div> 
                <div className='grid w-full md:grid-cols-3 mt-5'>
                    <div className='col-span-2'><span>Giảm giá</span></div>
                    <div>
                        <input type="number" className='w-full border-b outline-0 text-right'  value={discount} onChange={handleChangeDiscount}/>
                    </div>
                </div> 
                <div className='grid w-full md:grid-cols-2 mt-5'>
                    <div><span>Cần trả nhà cung cấp</span></div>
                    <div className='text-right'>
                        <span>{needPaySupplier}</span>
                    </div>
                </div> 
                <div className='grid w-full md:grid-cols-3 mt-5'>
                    <div className='col-span-2'><span>Tiền trả nhà cung cấp</span></div>
                    <div>
                        <input type="number" className='w-full border-b outline-0 text-right'  value={paidSupplier} onChange={handleChangePaidSuppiler}/>
                    </div>
                </div> 
                <div className='grid w-full md:grid-cols-2 mt-5'>
                    <div><span>Tính vào công nợ</span></div>
                    <div className='text-right'>
                        <span>{debt}</span>
                    </div>
                </div> 
                <div className='grid w-full md:grid-cols-1 mt-8'>
                    <input type="text" className='w-full border-b outline-0' placeholder='Ghi chú' value={note} onChange={(e) => setNote(e.target.value)} />
                </div> 
                <div className='grid w-full md:grid-cols-1 mt-8'>
                    <button className='bg-green-500 text-white rounded-[2px] py-2 flex justify-center items-center' onClick={handleSaveData}><MdDone className='text-[20px] mr-1'/>{params.id ? "Thanh toán" :  "Hoàn thành"}</button>
                    <div className={loading && "loading"}></div>                   
                </div> 
                <ToastContainer />
            </div>
        </Card>
    </div>
  )
}
