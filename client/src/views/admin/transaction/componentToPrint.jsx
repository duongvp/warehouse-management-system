import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';

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
const ComponentToPrint = React.forwardRef((props, ref) => {
    console.log(ref);
    const {id , checkComponent} = props
    const [db, setDb] = useState({})
    const [productImport, setProductImport] = useState([])
    useEffect(() => {
        const getApiDetail = async () => {
            let url = `http://localhost:5000/api/warehouseDelivery/detail/${id}`
            if (checkComponent) {
                url = `http://localhost:5000/api/warehouseReceipt/detail/${id}`;
            }
            const res =  await fetch(url)
            const data = await res.json();
            const listProductSelected = data.dataLine.map(item => ({
                amount: item.quantity,
                id: item.productId,
                label: item.productName,
                price: item.price,
                totalPrice: item.totalPrice,
                unit: item.unit
            }));
            console.log('listProductSelected',listProductSelected);
            setProductImport(listProductSelected)
            setDb(data.data[0])
            console.log('111', data.data[0]);
        }
        getApiDetail()
    }, [ref, id])
    return (
      <div ref={ref}>
        <div className='text-center text-[30px] pt-3 mb-6 uppercase'>{checkComponent ? "Chi tiết đơn nhập" : "Chi tiết đơn xuất"}</div>
        <div className='ml-6 text-[20px]'>
            <p>
                <span className='pr-2 font-semibold'>Mã đơn hàng:</span> 
                <span>{id}</span>
            </p>
            <p>
                <span className='pr-2 font-semibold'>{checkComponent ? "Người nhập hàng:" : "Người xuất hàng:"}</span>
                <span>{db?.employId?.name}</span>
            </p>
            <p>
                <span className='pr-2 font-semibold'>{checkComponent ? "Nhà cung cấp:" : "Khách hàng:"}</span>
                <span>{checkComponent ? db?.supplierId?.name : db?.customerId?.name}</span>
            </p>
            <p>
                <span className='pr-2 font-semibold'>Kho:</span>
                <span>{db?.warehouseId?.name}</span>
            </p>
            <p>
                <span className='pr-2 font-semibold'>{checkComponent ? "Nội dung nhập hàng:" : "Nội dung xuất hàng:"}</span> 
                <span>{db?.note}</span>
            </p>
            <p>
                <span className='pr-2 font-semibold'>Ngày tạo:</span>
                <span><Moment format='DD/MM/YYYY  HH:mm'>{db?.createdAt}</Moment></span>
            </p>
        </div>
        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table
                className="w-full"
                color="gray-500"
                mb="24px"
                >
                    <thead>
                        <tr>
                        {columns.map((column, index) => {
                            if(column.accessor !== "action") {
                                return (
                                    <th
                                        scope="col"
                                        className={`border-b border-gray-200 p-[10px] text-start dark:!border-navy-700`}
                                        key={`th_${index}`}
                                    >
                                        <div className="text-[18px] font-bold tracking-wide  lg:text-[18px]">
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
                                let view = ""; 
                                if (cell.accessor === 'stt') {
                                    view = (
                                    <div className="flex items-center gap-2">
                                        {indexPro+1}
                                    </div>
                                    );
                                } else if (cell.accessor === 'totalPrice') {
                                    view = (
                                    <div className="flex items-center gap-2">
                                        {Number(row["totalPrice"])}
                                    </div>
                                    );
                                } else {
                                    view = (
                                        <div className="flex items-center gap-2">
                                            <p className="text-[18px] font-bold text-navy-700 dark:text-white">
                                                {row[cell.accessor]}
                                            </p>
                                        </div>
                                    );
                                } 
                                return (
                                    <td
                                        key={index}
                                        className={`p-[10px] sm:text-[18px] ${(cell.accessor === "supplierDebt") ? "flex justify-end" : ""} `}
                                    >
                                        {view}
                                    </td>
                                );
                            })}
                            </tr>
                        );
                        })}
                    </tbody>
                    <tfoot className='text-[20px]'>
                        <tr>
                            <td colSpan={6} className='text-center'>Giảm giá:</td>
                            <td className='text-center'>{db?.discountMount?.toLocaleString('en-VN')}</td>
                        </tr>
                        <tr>
                            <td colSpan={6} className='text-center bg-gray-500'>Tổng giá trị xuất hàng:</td>
                            <td className='text-center bg-gray-500'>{checkComponent ? db?.paidSupplier?.toLocaleString('en-VN') : db?.customerPaid?.toLocaleString('en-VN')}</td>
                        </tr>
                    </tfoot>
                </table>
        </div>
        <div className='pt-7 text-right mr-6'>
            <p className='text-[19px]'>{checkComponent ? "Người nhập hóa đơn" : "Người xuất hóa đơn"}</p>
            <p className='text-[18px] mr-4'>(Ký rõ họ và tên)</p>
        </div>
      </div>
    );
});
export default ComponentToPrint;
