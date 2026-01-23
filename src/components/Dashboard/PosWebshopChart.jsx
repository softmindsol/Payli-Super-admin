import { useMemo, useState } from "react";
import Chart from "react-apexcharts";

const Card = ({ title, right, children }) => (
  <div
    className="rounded-xl bg-white border border-[#EFEFEF] p-4 md:p-5"
    style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
  >
    <div className="flex items-center justify-between mb-3">
      <h3
        className="font-bold text-[18px] leading-[1] text-[#2E2E2E]"
        style={{ fontFamily: '"Rethink Sans", sans-serif' }}
      >
        {title}
      </h3>
      {right}
    </div>
    {children}
  </div>
);

const Toggle = ({ value, onChange }) => {
  const items = ["Weekly", "Monthly", "Yearly"];
  return (
    <div className="rounded-full p-1 flex gap-1 bg-[#F1F2F4]">
      {items.map((it) => {
        const v = it.toLowerCase();
        const active = value === v;
        return (
          <button
            key={it}
            onClick={() => onChange(v)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              active
                ? "text-white shadow bg-gradient-to-b from-[#1D50AB] to-[#0A285E]"
                : "text-[#2E2E2E]/80"
            }`}
          >
            {it}
          </button>
        );
      })}
    </div>
  );
};

export default function PosWebshopChart() {
  const [tf, setTf] = useState("weekly");

  const datasets = {
    weekly: {
      categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      pos:     [160,140,260,170,120,250,205,360,300,330,190,220],
      webshop: [130, 70,120,200,100,150,135,210,160,250,130,170],
    },
    monthly: {
      categories: ["Jan","Feb","Mar","Apr","May","Jun"],
      pos:     [320, 450, 380, 520, 470, 430],
      webshop: [210, 260, 240, 290, 310, 300],
    },
    yearly: {
      categories: ["2020","2021","2022","2023","2024"],
      pos:     [1200, 1500, 1750, 2100, 1950],
      webshop: [ 900, 1000, 1200, 1400, 1550],
    },
  };

  const data = datasets[tf];

  const options = useMemo(
    () => ({
      chart: { type: "area", toolbar: { show: false }, parentHeightOffset: 0 },
      colors: ["#4F6BEB", "#22D3EE"],
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 0, opacityFrom: 0.25, opacityTo: 0.05, stops: [0, 100] },
      },
      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      markers: { size: 0, hover: { size: 5 } },
      xaxis: {
        categories: data.categories,
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: {
          style: {
            colors: Array(data.categories.length).fill("#545454"), // Jan, Feb… color
            fontFamily: '"Rethink Sans", sans-serif',
          },
        },
      },
      yaxis: {
        labels: {
          style: { colors: "#8A8A8A", fontFamily: '"Rethink Sans", sans-serif' },
        },
      },
      legend: { show: false },
      tooltip: { theme: "light" },
    }),
    [data.categories]
  );

  const series = useMemo(
    () => [
      { name: "POS", data: data.pos },
      { name: "Webshop", data: data.webshop },
    ],
    [data]
  );

  return (
    <Card title="POS & Webshop" right={<Toggle value={tf} onChange={setTf} />}>
      <Chart options={options} series={series} type="area" height={310} />
    </Card>
  );
}
