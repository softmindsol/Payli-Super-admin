import { useState } from "react";
import { ModalProvider } from "../../../context/modal/index";
import ModalRoot from "../../../components/genericmodal/index";

import EcommerceMetrics from "../../../components/Dashboard/EcommerceMetrics";
import PosWebshopChart from "../../../components/Dashboard/PosWebshopChart";
import TotalRevenueChart from "../../../components/Dashboard/TotalRevenueChart";
import EmployeeListPage from "../../../components/Dashboard/EmployeeListPage"; // Import EmployeeListPage

const Dashboard = () => {
  const [search, setSearch] = useState(""); // Search query state

  return (
    <ModalProvider>
     {/* Page heading */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#2E2E2E]">
            Welcome Back, Json Taylor!
          </h1>
          <p className="mt-1 text-sm text-[#545454]">
            Track your sales activity, leads and deals here
          </p>
        </div>

        {/* Right controls */}
        <div className="flex items-center justify-start w-full gap-3 sm:w-auto sm:justify-end">
          <div className="flex items-stretch rounded-full border border-[#E6E6E6] bg-white pl-3 pr-1 shadow-sm">
            <div className="flex items-center pr-1 text-slate-600">🔍</div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search something..."
              className="h-10 w-[240px] rounded-full px-2 text-sm outline-none sm:w-[320px]"
            />
            <button
              type="button"
              className="px-5 py-2 text-sm font-semibold text-white rounded-full"
              style={{ background: "linear-gradient(90deg, #2196F3 -7.06%, #00338D 100%)" }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <EcommerceMetrics />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <PosWebshopChart />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <TotalRevenueChart />
        </div>

        <div className="col-span-12">
          {/* Replace EmployeeList with EmployeeListPage */}
          <EmployeeListPage search={search} />
        </div>
      </div>

      {/* keep this once at the end of the tree */}
      <ModalRoot />
    </ModalProvider>
  );
};

export default Dashboard;
