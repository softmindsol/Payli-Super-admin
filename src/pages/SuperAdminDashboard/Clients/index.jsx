import React, { useCallback, useMemo, useState, useEffect } from "react";
import useDebounce from "../../../hooks/useDebounce";
import ViewClientModal from "../../../components/Modals/ViewClientModal";
import WarningModal from "../../../components/Modals/warning";
import TableLayout from "../../../layout/TableLayout";
import { Loader, Search as LucideSearch, X as LucideX } from "lucide-react";
import { CLIENT_COLUMNS } from "./column";
import { useModal } from "@/context/modal";
import AddClientModal from "../../../components/Modals/AddClientModal";
import {
  useGetUsersQuery,
  useRevokeUserMutation,
  useDeleteUserMutation,
} from "../../../features/api/apiSlice";

const GRADIENT = "linear-gradient(90deg, #2196F3 -7.06%, #00338D 100%)";

export default function ClientsList() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const { openModal, closeModal } = useModal();
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery({
    page: currentPage,
    limit: 10,
    search: debouncedSearch,
  });

  const [revokeUser] = useRevokeUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Handle error state
  if (error) {
    console.error("Error fetching users:", error);
  }

  const onAddClient = useCallback(() => {
    openModal(<AddClientModal onClose={closeModal} />, 720);
  }, [openModal, closeModal]);

  const onDelete = useCallback(
    (row) => {
      openModal(
        <WarningModal
          subject="Client"
          title="Delete Client"
          message={`Are you sure you want to delete ${
            row.name || "this client"
          }? This action cannot be undone.`}
          confirmText="Delete Client"
          onConfirm={async () => {
            try {
              await deleteUser(row.id).unwrap();
              refetch();
            } catch (err) {
              console.error("Failed to delete user:", err);
              alert("Failed to delete client. Please try again.");
            }
          }}
          onClose={closeModal}
        />,
        520,
      );
    },
    [deleteUser, refetch, openModal, closeModal],
  );

  const onRevoke = useCallback(
    (row) => {
      openModal(
        <WarningModal
          subject="Client Access"
          title="Revoke Client Access"
          message={`Are you sure you want to revoke access for ${
            row.name || "this client"
          }? They will no longer be able to use the platform.`}
          confirmText="Revoke Access"
          onConfirm={async () => {
            try {
              await revokeUser(row.id).unwrap();
              refetch();
            } catch (err) {
              console.error("Failed to revoke user:", err);
              alert("Failed to revoke client access. Please try again.");
            }
          }}
          onClose={closeModal}
        />,
        520,
      );
    },
    [revokeUser, refetch, openModal, closeModal],
  );

  const onContinueAccess = useCallback(
    (row) => {
      openModal(
        <WarningModal
          subject="Client Access"
          title="Continue Client Access"
          message={`Are you sure you want to continue access for ${
            row.name || "this client"
          }? They will be able to use the platform again.`}
          confirmText="Continue Access"
          onConfirm={async () => {
            try {
              await revokeUser(row.id).unwrap();
              refetch();
            } catch (err) {
              console.error("Failed to continue access:", err);
              alert("Failed to continue client access. Please try again.");
            }
          }}
          onClose={closeModal}
        />,
        520,
      );
    },
    [revokeUser, refetch, openModal, closeModal],
  );

  const onView = useCallback(
    (row) => {
      openModal(<ViewClientModal onClose={closeModal} client={row} />, 720);
    },
    [openModal, closeModal],
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Map API data to expected format
  const mappedData = useMemo(() => {
    if (!usersData?.data?.users) return [];

    return usersData?.data?.users?.map((user, index) => ({
      id: user._id || index + 1,
      name: user.name || `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || user.phoneNumber || "N/A",
      webshop: user.tenant?.name || "N/A",
      service: user.tenant?.service || "N/A",
      webshopDomain: user.tenant?.webshopDomain || "N/A",
      businessRegion:
        user.tenant?.businessRegion ||
        (user.locations?.length > 0 ? user.locations.join(", ") : "N/A"),
      joinedAt: user.joinedAt,
      isActive: user.isActive,
      isVerified: user.isVerified,
      lastLogin: user.lastLogin,
      role: user.role,
      userType: user.userType,
      tenant: user.tenant,
      businessType: user.tenant?.businessType,
      subdomain: user.tenant?.subdomain,
      isTenantActive: user.isActive === true,
    }));
  }, [usersData]);

  const columns = useMemo(
    () => CLIENT_COLUMNS({ onDelete, onView, onRevoke, onContinueAccess }),
    [onDelete, onView, onRevoke, onContinueAccess],
  );

  // With server-side search, mappedData already reflects the search results
  const filtered = mappedData;

  return (
    <>
      {/* Page heading */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#2E2E2E]">Clients</h1>
          <p className="mt-1 text-sm text-[#545454]">
            Here is the list of all Clients
          </p>
        </div>

        {/* Right controls */}
        <div className="flex items-center justify-start w-full gap-3 sm:w-auto sm:justify-end">
          {/*
          <button
            onClick={onAddClient}
            className="inline-flex items-center gap-2 rounded-full bg-[#1E50A2] px-5 py-2.5 text-white shadow-sm hover:opacity-95"
          >
            <span className="text-lg leading-none">＋</span>
            <span className="font-medium">Add Client</span>
          </button>
          */}

          <div className="flex items-center rounded-full border border-[#E6E6E6] bg-white pr-0 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#1E50A2]/30">
            <div className="flex items-center px-3 text-slate-600">
              <LucideSearch className="w-4 h-4" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search something..."
              className="h-10 flex-1 min-w-[200px] rounded-none px-2 text-sm outline-none bg-transparent sm:min-w-[320px]"
            />
            {search ? (
              <button
                type="button"
                className="px-3 py-2 text-sm font-semibold text-[#1E50A2] rounded-r-full border-l border-[#E6E6E6] bg-transparent hover:bg-[#F8FAFC]"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                title="Clear search"
              >
                <LucideX className="w-4 h-4" />
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <TableLayout
        title="Client List"
        columns={columns}
        data={filtered}
        loading={isLoading}
        queryParams={{ page: currentPage }}
        totalPages={usersData?.data?.pagination?.totalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={usersData?.data?.pagination?.totalDocs || 0}
        showSearch={false}
        showCategories={false}
        showSelectOutlet={false}
        entityLabel="clients"
      />
    </>
  );
}
