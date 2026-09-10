import { useEffect, useState } from "react";
import { Camera, KeyRound, Loader2, Save, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../Provider/AuthProvider";
import useUsers from "../../../utils/Hooks/useUsers";

const API = import.meta.env.VITE_LOCALHOST_KEY;

const Account = () => {
  const { user, updateUserProfile } = useAuth();
  const { isUsersLoading, refetch, users = [] } = useUsers();

  const currentUser = users.find((u) => String(u?.id) === String(user?.id));

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    photo: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser?.name || "",
        mobile: currentUser?.mobile || "",
        address: currentUser?.address || "",
        photo: currentUser?.photo || "",
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("শুধু image file upload করা যাবে");
      return;
    }

    const uploadForm = new FormData();
    uploadForm.append("photo", file);
    uploadForm.append("user_id", currentUser?.id);

    try {
      const res = await fetch(`${API}/users/uploadProfilePhoto.php`, {
        method: "POST",
        body: uploadForm,
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "ছবি upload করা যায়নি");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        photo: data.photo,
      }));

      toast.success("ছবি upload হয়েছে, এখন Save Profile চাপ দে");
    } catch (error) {
      toast.error("ছবি upload করতে সমস্যা হয়েছে");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return toast.error("নাম দেওয়া লাগবে");
    }

    if (!formData.mobile.trim()) {
      return toast.error("মোবাইল নাম্বার দেওয়া লাগবে");
    }

    setSavingProfile(true);

    try {
      const res = await fetch(`${API}/users/updateProfile.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser?.id,
          name: formData.name,
          mobile: formData.mobile,
          address: formData.address,
          photo: formData.photo,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Profile update করা যায়নি");
        return;
      }

      if (updateUserProfile) {
        await updateUserProfile(formData.name, formData.photo);
      }

      toast.success("Profile successfully updated");
      refetch();
    } catch (error) {
      toast.error("Profile update করতে সমস্যা হয়েছে");
    } finally {
      setSavingProfile(false);
    }
  };

const handlePasswordSubmit = async (e) => {
  e.preventDefault();

  if (!passwordData.currentPassword) {
    return toast.error("বর্তমান password দে");
  }

  if (passwordData.newPassword.length < 6) {
    return toast.error("নতুন password কমপক্ষে 6 character হতে হবে");
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    return toast.error("নতুন password দুইটা মিলেনি");
  }

  setSavingPassword(true);

  try {
    // আগে MySQL-এ password verify + update
    const res = await fetch(
      `${import.meta.env.VITE_LOCALHOST_KEY}/users/changePassword.php`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      return toast.error(data.message || "Password change করা যায়নি");
    }

    toast.success("Password সফলভাবে পরিবর্তন হয়েছে");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    console.error(error);
    toast.error("Password update করতে সমস্যা হয়েছে");
  } finally {
    setSavingPassword(false);
  }
};
  if (isUsersLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-6 text-center text-red-500">
        User information পাওয়া যায়নি
      </div>
    );
  }

  const imageUrl = formData.photo
    ? `${import.meta.env.VITE_IMG_KEY}/${formData.photo}`
    : "https://i.ibb.co/2kR7BfV/default-avatar.png";

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          নিজের profile ও password এখান থেকে পরিবর্তন করতে পারবি।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Summary */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={imageUrl}
                alt={currentUser?.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-orange-100"
              />

              <label className="absolute bottom-0 right-0 w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600">
                <Camera size={17} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-800">
              {currentUser?.name}
            </h2>

            <p className="text-sm text-gray-500">{currentUser?.mobile}</p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {currentUser?.roles?.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-600 capitalize"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <form
            onSubmit={handleProfileSubmit}
            className="bg-white rounded-2xl shadow-sm border p-5 md:p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <UserRound className="text-orange-500" size={22} />
              <h2 className="text-lg font-bold text-gray-800">
                Profile Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2.5 outline-none focus:border-orange-500"
                  placeholder="আপনার নাম"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleProfileChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2.5 outline-none focus:border-orange-500"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  rows="3"
                  name="address"
                  value={formData.address}
                  onChange={handleProfileChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 resize-none"
                  placeholder="আপনার ঠিকানা"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  User ID
                </label>
                <input
                  value={currentUser?.id || ""}
                  disabled
                  className="w-full mt-1 bg-gray-100 border rounded-xl px-4 py-2.5 text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  ID Number
                </label>
                <input
                  value={currentUser?.id_number || ""}
                  disabled
                  className="w-full mt-1 bg-gray-100 border rounded-xl px-4 py-2.5 text-gray-500"
                />
              </div>
            </div>

            <button
              disabled={savingProfile}
              type="submit"
              className="mt-5 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-5 py-2.5 rounded-xl font-semibold"
            >
              {savingProfile ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Save Profile
            </button>
          </form>

          {/* Password Form */}
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white rounded-2xl shadow-sm border p-5 md:p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <KeyRound className="text-orange-500" size={22} />
              <h2 className="text-lg font-bold text-gray-800">
                Change Password
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2.5 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2.5 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2.5 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              disabled={savingPassword}
              type="submit"
              className="mt-5 inline-flex items-center gap-2 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white px-5 py-2.5 rounded-xl font-semibold"
            >
              {savingPassword ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <KeyRound size={18} />
              )}
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;