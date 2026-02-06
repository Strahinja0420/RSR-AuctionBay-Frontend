import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TopBar from "../../components/layout/TopBar";
import AddAuctionForm from "../../components/auctions/AddAuctionFormModal";
import ProfileModals from "../../components/ProfileModals";
import { useAuctions } from "../../hooks/useAuctions";
import { useCategories } from "../../hooks/useCategories";
import { deleteCategory } from "../../api/categories.api";
import AddCategoryModal from "../../components/admin/AddCategoryModal";
import EditCategoryModal from "../../components/admin/EditCategoryModal";
import type { Category } from "../../types/Category.type";

function AdminCategoriesPage() {
  // STATE MANAGEMENT
  const [openAuction, setOpenAuction] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const { auctions, refetchAuctions } = useAuctions();
  const { categories, refetch: refetchCategories } = useCategories();

  // Pagination & Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // FILTER & SEARCH LOGIC
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const hasActiveAuction = auctions.some(
      (a: any) => a.categoryId === category.id && a.status === "active",
    );

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && hasActiveAuction) ||
      (statusFilter === "Not-Active" && !hasActiveAuction);

    return matchesSearch && matchesStatus;
  });

  // PAGINATION CALCULATION
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setOpenEditModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        refetchCategories();
        refetchAuctions();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar
        onCreateAuction={() => setOpenAuction(true)}
        onOpenProfile={() => setOpenProfile(true)}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search categories..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#7A2E3A]/20 focus:border-[#7A2E3A] transition-all"
                />
              </div>
              <button
                onClick={() => setOpenCategoryModal(true)}
                className="flex items-center gap-2 bg-[#7A2E3A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#63252E] transition-colors whitespace-nowrap"
              >
                <Plus size={18} />
                New Category
              </button>
            </div>
          </div>

          {/* Filters & Content */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setStatusFilter("All");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${statusFilter === "All" ? "bg-[#7A2E3A] text-white shadow-md shadow-[#7A2E3A]/20" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("Active");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${statusFilter === "Active" ? "bg-[#7A2E3A] text-white shadow-md shadow-[#7A2E3A]/20" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Active
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("Not-Active");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${statusFilter === "Not-Active" ? "bg-[#7A2E3A] text-white shadow-md shadow-[#7A2E3A]/20" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Not-Active
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Sort by:</span>
                <select className="text-sm font-medium bg-transparent focus:outline-none cursor-pointer">
                  <option>Recent First</option>
                  <option>Name A-Z</option>
                  <option>Most Auctions</option>
                </select>
              </div>
            </div>

            {/* TABLE SECTION */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                {/* Table Header */}
                <thead className="bg-gray-50 text-[10px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4"># of Auctions</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="divide-y divide-gray-50">
                  {paginatedCategories.map((category) => {
                    // Calculate item count and status for each category row
                    const categoryAuctions = auctions.filter(
                      (a) => a.categoryId === category.id,
                    );
                    const auctionCount = categoryAuctions.length;

                    return (
                      <tr
                        key={category.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Category Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {category.name}
                          </span>
                        </td>
                        {/* Auction Counter */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {auctionCount}
                        </td>
                        {/* Active/Inactive Badge */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {(() => {
                            const hasActiveAuction = categoryAuctions.some(
                              (a) => a.status === "active",
                            );
                            return (
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                  hasActiveAuction
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-rose-50 text-rose-600"
                                }`}
                              >
                                {hasActiveAuction ? "Active" : "Inactive"}
                              </span>
                            );
                          })()}
                        </td>
                        {/* Row Actions (Edit/Delete) */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Edit Category"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-medium">
                  {paginatedCategories.length}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredCategories.length}</span>{" "}
                categories
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className="p-1 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded border text-xs font-bold transition-all ${
                        currentPage === page
                          ? "bg-[#7A2E3A] text-white border-[#7A2E3A] shadow-sm shadow-[#7A2E3A]/30"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 font-medium"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="p-1 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAuctionForm
        isOpen={openAuction}
        onClose={() => {
          (setOpenAuction(false), refetchAuctions());
        }}
      />
      <ProfileModals
        isOpen={openProfile}
        onClose={() => setOpenProfile(false)}
      />
      <AddCategoryModal
        isOpen={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        onSuccess={() => refetchCategories()}
      />
      <EditCategoryModal
        isOpen={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setEditingCategory(null);
        }}
        onSuccess={() => refetchCategories()}
        category={editingCategory}
      />
    </div>
  );
}

export default AdminCategoriesPage;
