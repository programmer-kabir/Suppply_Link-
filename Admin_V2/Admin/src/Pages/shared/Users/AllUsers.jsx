import React, { useMemo, useState } from "react";
import useUsers from "../../../utils/Hooks/useUsers";
import Loader from "../../../components/Loader/Loader";

import { FaPhoneAlt, FaIdCard, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import NoDataFound from "../../../components/NoData/NoDataFound";
import BackButton from "../../../components/BackButton/BackButton";
import { toast } from "react-toastify";

const AllUsers = () => {
  const { isUsersLoading, users, isUsersError,refetch } = useUsers();
  const [search, setSearch] = useState("");
const [editUser, setEditUser] = useState(null);
const [openModal, setOpenModal] = useState(false);
const [isUpdating, setIsUpdating] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const keyword = search.toLowerCase();

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(keyword) ||
        user.mobile?.toLowerCase().includes(keyword) ||
        user.roles?.join(",").toLowerCase().includes(keyword)
    );
  }, [users, search]);

  const handleEdit = (user) => {
    setEditUser(user);
    setOpenModal(true);
  };

  if (isUsersLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  if (isUsersError) {
    return <NoDataFound />;
  }

  const handleUpdateUser = async () => {
    if (!editUser?.name || !editUser?.mobile) {
      toast.error("Name and Mobile are required");
      return;
    }
    try {
      setIsUpdating(true);
      const formData = new FormData();

      formData.append("id", editUser.id);
      formData.append("name", editUser.name);
      formData.append("mobile", editUser.mobile);
      formData.append("id_number", editUser.id_number || "");
      formData.append("address", editUser.address || "");

      if (editUser.photo instanceof File) {
        formData.append("photo", editUser.photo);
      }

      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/users/update_user.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Updated successfully!");
        setOpenModal(false);
        refetch();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Server Error");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="mx-auto text-gray-200 max-w-[1600px]">
      <BackButton />
      {/* ===== Header ===== */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">All Users</h2>
          <p className="text-sm text-gray-400">
            Total users: {filteredUsers.length}
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by name, mobile, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full md:w-96
                     text-gray-200 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ===== Cards ===== */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-4">😕</span>
          <h3 className="text-lg font-semibold text-gray-300">
            No users found
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search keywords
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group bg-gradient-to-b from-gray-900 to-gray-950
                         border border-gray-800 rounded-2xl p-4
                         hover:border-blue-500 hover:shadow-xl transition-all"
            >
              {/* ===== Top ===== */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    user.photo
                      ? `https://management.supplylinkbd.com/${user.photo}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name || "User"
                        )}&background=1f2937&color=fff`
                  }
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover
                             border border-gray-700 group-hover:border-blue-500"
                />

                <div className="flex-1">
                  <h3 className="text-white font-semibold truncate">
                    {user.name || "No Name"}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <FaPhoneAlt className="text-gray-500" size={12} />
                    {user.mobile || "N/A"}
                  </p>
                </div>

                <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  ID {user.id}
                </span>
              </div>

              {/* ===== Extra Info ===== */}
              <div className="space-y-2 text-sm text-gray-400">
                {user.id_number && (
                  <p className="flex items-center gap-2">
                    <FaIdCard className="text-gray-500" size={14} />
                    {user.id_number}
                  </p>
                )}

                {user.address && (
                  <p className="flex items-center gap-2 line-clamp-2">
                    <FaMapMarkerAlt className="text-gray-500" size={14} />
                    {user.address}
                  </p>
                )}
              </div>

              {/* ===== Roles ===== */}
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  {user.roles?.length > 0 ? (
                  user.roles.map((role, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full
                                 bg-blue-900/30 text-blue-300"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">No role</span>
                )}
                </div>
                <button onClick={()=>handleEdit(user)} className="px-3 py-0.5 text-sm rounded-md border border-gray-600">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {openModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
      
      <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
        Edit User
      </h2>

      <div className="space-y-3">

        {/* Name */}
        <div>
          <label className="text-sm text-gray-400">Name</label>
          <input
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg"
            value={editUser?.name || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, name: e.target.value })
            }
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="text-sm text-gray-400">Mobile</label>
          <input
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg"
            value={editUser?.mobile || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, mobile: e.target.value })
            }
          />
        </div>

        {/* ID Number */}
        <div>
          <label className="text-sm text-gray-400">ID Number</label>
          <input
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg"
            value={editUser?.id_number || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, id_number: e.target.value })
            }
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm text-gray-400">Address</label>
          <input
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg"
            value={editUser?.address || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, address: e.target.value })
            }
          />
        </div>

<div>
  <label className="text-sm text-gray-400 mb-2 block">Photo</label>

  <div className="flex items-center gap-4">

    {/* Preview */}
    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-700">
      <img
        src={
          editUser?.photo instanceof File
            ? URL.createObjectURL(editUser.photo)
            : editUser?.photo
              ? `https://management.supplylinkbd.com/${editUser.photo}`
              : "https://ui-avatars.com/api/?name=User&background=1f2937&color=fff"
        }
        alt="preview"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Upload Button */}
    <label className="cursor-pointer">
      <input
        type="file"
        className="hidden"
        onChange={(e) =>
          setEditUser({ ...editUser, photo: e.target.files[0] })
        }
      />

      <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-700 transition text-sm text-gray-300">
        Choose Photo
      </div>
    </label>

  </div>

  <p className="text-xs text-gray-500 mt-1">
    JPG, PNG, WEBP (max 2MB)
  </p>
</div>

      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setOpenModal(false)}
          disabled={isUpdating}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-xl disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdateUser}
          disabled={isUpdating}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-xl text-white disabled:opacity-50 font-medium"
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AllUsers;
