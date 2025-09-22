import { useState } from "react";
import { ModalProvider } from "@/context/modal/index";
import ModalRoot from "@/components/genericmodal/index";

import EcommerceMetrics from "../../../components/Dashboard/EcommerceMetrics";
import EmployeeList from "../../../components/Dashboard/EmployeeList";
import PosWebshopChart from "../../../components/Dashboard/PosWebshopChart";
import TotalRevenueChart from "../../../components/Dashboard/TotalRevenueChart";

const Dashboard = () => {
  // table state (so AddEmployeeForm can push new rows)
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "Samran Nadeem",
      email: "samranadeem@gmail.com",
      phone: "+0123 456 789",
      posCity: "Bend Oregon",
      posCountry: "United States of America",
      avatar: "https://i.pravatar.cc/64?img=11",
    },
  ]);

  return (
    <ModalProvider>
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
          <EmployeeList
            rows={rows}
            setRows={setRows}
            onViewAll={() => console.log("view all")}
            onEdit={(emp) => console.log("edit", emp)}
            onDelete={(emp) => console.log("delete", emp)}
          />
        </div>
      </div>

      {/* keep this once at the end of the tree */}
      <ModalRoot />
    </ModalProvider>
  );
};

export default Dashboard;
 