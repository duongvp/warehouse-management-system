import { useSelector } from "react-redux";
import CheckTable from "./components/CheckTable";

import { columnsDataCheck } from "./variables/columnsData";
import React, { useState, useEffect } from "react";

const Product = () => {
  const [check, setCheck] = useState(false)
   let currentWH = useSelector((state) => state.warehouse.data);
   const [ currentPage, setCurrentPage ] = useState(1);
   const [ dataProducts, setDataProducts ] = useState([]); 
   const [ totalItems, setTotalItems ] = useState(10)
   const [ objQuery, setObjQuery ] = useState('')
    useEffect(() => {
      async function getProducts() {
        let str = JSON.stringify(objQuery)
        const response = await fetch(`http://localhost:5000/api/product/get?warehouseId=${currentWH}&page=${currentPage}&perPage=10&objQuery=${str}`);
        const jsonData = await response.json();
        setDataProducts(jsonData.data)
        setTotalItems(jsonData.totalPages*10)
      }
      getProducts()
    }, [currentPage, currentWH, objQuery, check]);
  return (
    <div className="mt-5 grid h-full">
      <CheckTable columnsData={columnsDataCheck} tableData={dataProducts} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={totalItems} setObjQuery={setObjQuery} setCheck = {setCheck} check = {check} />
    </div>
  );
};

export default Product;
