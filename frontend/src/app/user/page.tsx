"use client";

import { Search, UserPlus } from "lucide-react";
import { useState } from "react";

export default function UserPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">User Management</h1>
          <p className="text-[#64748B]">Manage system access and roles.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#0A2540] text-white px-5 py-2 rounded-lg hover:bg-[#1E293B]"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-3 text-[#64748B]" />
        <input
          placeholder="Search users..."
          className="w-full border border-[#E2E8F0] rounded-lg pl-10 pr-4 py-3 bg-white"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-[#64748B] text-sm">
            <tr>
              <th className="p-4 text-left">FULL NAME</th>
              <th className="p-4 text-left">USERNAME</th>
              <th className="p-4 text-left">ROLE</th>
              <th className="p-4 text-left">CREATED AT</th>
              <th className="p-4 text-left">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-4 font-medium text-[#0F172A]">System Administrator</td>
              <td className="p-4 text-[#64748B]">admin</td>
              <td className="p-4">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-[#0F172A]">
                  ADMIN
                </span>
              </td>
              <td className="p-4 text-[#64748B]">2/23/2026</td>
              <td className="p-4 text-[#0A2540] cursor-pointer">Edit</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-[420px]">
            <h2 className="text-xl font-bold mb-6">Add New User</h2>

            {/* INPUTS */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#64748B]">Full Name</label>
                <input className="w-full border border-[#E2E8F0] rounded-lg p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-[#64748B]">Username</label>
                <input className="w-full border border-[#E2E8F0] rounded-lg p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-[#64748B]">Password</label>
                <input
                  type="password"
                  className="w-full border border-[#E2E8F0] rounded-lg p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-[#64748B]">Role</label>
                <select className="w-full border border-[#E2E8F0] rounded-lg p-2 mt-1">
                  <option>Cashier</option>
                  <option>Admin</option>
                  <option>Store Keeper</option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-[#E2E8F0] rounded-lg"
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-[#0A2540] text-white rounded-lg">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
