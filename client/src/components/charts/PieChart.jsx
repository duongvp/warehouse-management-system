import Chart from "react-apexcharts";

const PieChart = (props) => {
  const { series, options } = props;

  return (
    <Chart
      options={options}
      type="pie"
      width="150%"
      height="125%"
      series={series}
    />
  );
};

export default PieChart;
