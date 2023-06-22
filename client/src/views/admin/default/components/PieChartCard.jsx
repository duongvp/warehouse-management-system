import PieChart from "components/charts/PieChart";
import Card from "components/card";
import { useEffect, useState } from "react";

const PieChartCard = ({subRevenue}) => {
  const [chartData, setChartData] = useState([])
  const [data, setData] = useState([]);
  const [chartOption, setChartOption] = useState({
    labels: [],
    colors: ["#4318FF", "#6AD2FF", "#36b736", "#ccc"],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ["#4318FF", "#6AD2FF", "#36b736", "#ccc"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#000000"
      },
    },
  });
  
  useEffect(() => {
    async function getDataImport() {
      const response = await fetch(`http://localhost:5000/api/warehouseDelivery/getRevenue`);
      const jsonData = await response.json();
      setData(jsonData);
      setChartOption({
        ...chartOption,
        labels: jsonData.map(item => item.name),
        ...(jsonData.length > 4 && {
          colors: jsonData.map(item => item.color),
          fill: {
            colors: jsonData.map(item => item.color),
          }
        }),
      })
      setChartData(jsonData.map(item => item.totalRevenue))
    }
    getDataImport()
  }, [])

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Doanh số theo chi nhánh
          </h4>
        </div>

        {/* <div className="mb-6 flex items-center justify-center">
          <select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div> */}
      </div>

      <div className="mb-auto flex h-[200px] w-full items-center justify-center">
        <PieChart options={chartOption} series={chartData} />
      </div>
      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        {
          data.length && data.map(((item, index) => {
            return (
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full" style={{backgroundColor: `${chartOption.colors[index]}`}} />
                  <p className="ml-1 text-sm font-normal text-gray-600">{item.name}</p>
                </div>
                <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
                    {(Number(item.totalRevenue)/Number(subRevenue)).toFixed(2)*100}%
                </p>
              </div>
            )
          }))       
        
        }
      </div>
    </Card>
  );
};

export default PieChartCard;
