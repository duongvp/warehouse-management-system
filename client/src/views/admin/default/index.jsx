import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import Widget from "components/widget/Widget";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  let currentWH = useSelector((state) => state.warehouse.data);
  const [data, setData] = useState([])
  useEffect(() => {
    async function getData() {
      let str = JSON.stringify({proName: '', status:"true"})
      const urls = [ 
        `http://localhost:5000/api/product/get?warehouseId=${currentWH}&page=1&perPage=1000&objQuery=${str}`, 
        "http://localhost:5000/api/warehouse/get",
        "http://localhost:5000/api/user/get",
        "http://localhost:5000/api/warehouseReceipt/getTotal",
        "http://localhost:5000/api/warehouseDelivery/getTotal"
      ]
      const requests = urls.map(url => fetch(url).then(response => response.json()));
      const jsonData =  await Promise.all(requests);
      setData(jsonData)
      console.log(jsonData);
    }
    console.log(data);
    getData()
  }, [])
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"SL sản phẩm đang bán"}
          subtitle={`${data.length && data[0].data.length}`}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"SL kho hàng"}
          subtitle={`${data.length && data[1]?.length}`}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"SL nhân viên"}
          subtitle={`${data.length && data[2]?.length}`}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Tổng vốn đầu tư"}
          subtitle={`${data.length && data[3]?.toLocaleString('en-VN')}`}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Doanh số bán hàng"}
          subtitle={`${data.length && data[4]?.toLocaleString('en-VN')}`}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Lợi nhuận thu về"}
          subtitle={`${data.length && (Number(data[4]-data[3]) > 0 ? data[4]-data[3] : 0)}`}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
        <PieChartCard subRevenue = {data.length ? data[4] : 0}/>
      </div>
    </div>
  );
};

export default Dashboard;
