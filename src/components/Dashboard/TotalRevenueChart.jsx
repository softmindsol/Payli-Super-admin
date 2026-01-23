import { useMemo } from "react";
import Chart from "react-apexcharts";

const Card = ({ title, children }) => (
  <div
    className="rounded-xl bg-white border border-[#EFEFEF] p-4 md:p-5"
    style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[17px] font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

export default function TotalRevenueChart() {
  const categories = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const series = [
    { name: "Revenue A", data: [40, 55, 120, 35, 230, 560, 600] },
    { name: "Revenue B", data: [10, -30, 210, 205, 390, 320, 470] },
  ];

  const options = useMemo(
    () => ({
      chart: { type: "line", toolbar: { show: false }, parentHeightOffset: 0 },
      colors: ["#1F4ED8", "#22D3EE"],
      stroke: { curve: "smooth", width: 4 },
      dataLabels: { enabled: false },
      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      markers: { size: 0, hover: { size: 5 } },
      xaxis: {
        categories,
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: { style: { colors: "#6B7280" } },
      },
      yaxis: {
        min: -50,
        max: 650,
        tickAmount: 5,
        labels: { style: { colors: "#6B7280" } },
      },
      legend: { show: false },
      tooltip: { theme: "light" },
    }),
    []
  );

  return (
    <Card title="Total Revenue">
      <Chart options={options} series={series} type="line" height={310} />
    </Card>
  );
}
