import { useState } from "react";
import { Plus, MoreVertical } from "lucide-react"; // ✅ plus and more vertical icons
import GenericTable from "../Table"; // Assuming this component handles the table structure
import AddEmployeeForm from "../Modals/AddEmployeeForm"; // Reusing the existing form component
import { useModal } from "@/context/modal"; // Use the ModalContext for managing modals

const EmployeeListPage = () => {
  // Dummy static data (no Redux or API calls)
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      role: "Admin",
      posAddress: ["Outlet 1", "Outlet 2"],
      createdAt: "2023-01-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "987-654-3210",
      role: "Manager",
      posAddress: ["Outlet 3"],
      createdAt: "2023-02-15",
    },
  ]);

  const [openMenuId, setOpenMenuId] = useState(null);

  const { openModal } = useModal(); // Getting the openModal function from context

  // Define table columns
  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => <span>{row.name}</span>,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
      sortable: false,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row) => <span className="capitalize">{row.role}</span>,
    },
    {
      key: "posAddress",
      label: "POS Address",
      sortable: false,
      render: (row) => (
        row.posAddress.map((addr, idx) => (
          <span
            key={idx}
            className="inline-block px-2 py-1 mb-1 mr-1 text-xs text-gray-800 bg-gray-100 rounded-full"
          >
            {addr}
          </span>
        ))
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (row) => {
        if (!row.createdAt) return "N/A";
        return new Date(row.createdAt).toLocaleDateString();
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="relative">
          <button
            onClick={() =>
              setOpenMenuId(openMenuId === row.id ? null : row.id)
            }
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {openMenuId === row.id && (
            <div
              className="absolute right-0 top-8 z-50 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            >
              <button
                onClick={() => handleEdit(row)}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row)}
                className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleEdit = (employee) => {
    // Open modal to edit the employee
    openModal(
      <AddEmployeeForm
        data={employee}
        isEdit={true}
        onSubmit={(updatedEmployee) => {
          // Update the employee logic here (for now just log the updated employee)
          console.log("Updated Employee:", updatedEmployee);
          setEmployees(
            employees.map((emp) =>
              emp.id === employee.id ? updatedEmployee : emp
            )
          );
        }}
      />
    );
  };

  const handleDelete = (employee) => {
    // Handle delete employee logic (for now just log it)
    console.log("Deleting employee", employee);
    // Update the state to remove the employee from the list
    setEmployees(employees.filter((emp) => emp.id !== employee.id));
  };

  const handleAddClick = () => {
    // Open modal to add a new employee
    openModal(
      <AddEmployeeForm
        onSubmit={(newEmployee) => {
          // Add the new employee to the list
          setEmployees([
            ...employees,
            { ...newEmployee, id: employees.length + 1 },
          ]);
        }}
      />
    );
  };

  return (
    <div className="relative overflow-visible bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 className="text-[18px] font-semibold text-[#2E2E2E]">
            Employees ({employees.length || 0})
          </h3>
          <p className="mt-1 text-sm text-[#545454]">Manage your employees</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 rounded-full bg-[#1D50AB] px-4 py-2 text-sm text-white hover:brightness-110"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!employees || employees.length === 0 ? (
          <div className="py-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="mb-1 text-sm font-medium text-gray-900">
              No employees yet
            </h4>
            <p className="mb-4 text-sm text-gray-500">
              Get started by adding your first employee
            </p>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 rounded-full bg-[#1D50AB] px-4 py-2 text-sm text-white hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        ) : (
          <GenericTable
            data={employees}
            columns={columns}
            loading={false} // No actual loading logic here
            rowKey={(row) => row.id}
            emptyText="No employees found"
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeListPage;
