import { useEffect } from "react";

const EditStockModal = ({
  setIsEditOpen,
  handleUpdate,
  editData,
  setEditData,
  inputClass,

  brandInput,
  setBrandInput,
  showSuggestions,
  setShowSuggestions,
  filteredBrands,

  variantInput,
  setVariantInput,
  showVariantSuggestions,
  setShowVariantSuggestions,
  filteredVariants,
}) => {

  // 🔥 sync edit data → input
  useEffect(() => {
    if (editData) {
      setBrandInput(editData.brand || "");
      setVariantInput(editData.variant || "");
    }
  }, [editData]);

  // 🔥 common change
  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  return (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">      <div
  className="bg-[#020617] p-6 rounded-xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
  onClick={(e) => e.stopPropagation()}
>
        <h2 className="text-xl font-bold text-white mb-4">
          Edit Mobile
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">

          <div className="grid md:grid-cols-2 gap-5">

            {/* Date */}
            <div>
              <label className="text-sm text-gray-400">Purchase Date</label>
              <input
                type="date"
                name="date"
                value={editData?.date || ""}
                onChange={handleChange}
                className={`${inputClass} w-full date-fix`}
              />
            </div>

            {/* Brand with suggestion */}
            <div className="relative">
              <label className="text-sm text-gray-400">Brand</label>
              <input
                value={brandInput}
                onChange={(e) => {
                  setBrandInput(e.target.value);
                  setShowSuggestions(true);
                  setEditData({
                    ...editData,
                    brand: e.target.value,
                  });
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className={`${inputClass} w-full`}
              />

              {showSuggestions && brandInput && (
                <div className="absolute bg-gray-800 border border-gray-600 w-full mt-1 rounded z-50 max-h-40 overflow-y-auto">
                  {filteredBrands.map((b, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setBrandInput(b);
                        setEditData({ ...editData, brand: b });
                        setShowSuggestions(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Model */}
            <div>
              <label className="text-sm text-gray-400">Model</label>
              <input
                name="model"
                value={editData?.model || ""}
                onChange={handleChange}
                className={`${inputClass} w-full`}
              />
            </div>

            {/* Variant with suggestion */}
            <div className="relative">
              <label className="text-sm text-gray-400">Variant</label>
              <input
                value={variantInput}
                onChange={(e) => {
                  setVariantInput(e.target.value);
                  setShowVariantSuggestions(true);
                  setEditData({
                    ...editData,
                    variant: e.target.value,
                  });
                }}
                onBlur={() => setTimeout(() => setShowVariantSuggestions(false), 150)}
                className={`${inputClass} w-full`}
              />

              {showVariantSuggestions && variantInput && (
                <div className="absolute bg-gray-800 border border-gray-600 w-full mt-1 rounded z-50 max-h-40 overflow-y-auto">
                  {filteredVariants.map((v, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setVariantInput(v);
                        setEditData({ ...editData, variant: v });
                        setShowVariantSuggestions(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                    >
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="text-sm text-gray-400">Color</label>
              <input
                name="color"
                value={editData?.color || ""}
                onChange={handleChange}
                className={`${inputClass} w-full`}
              />
            </div>

          <div className="col-span-2">
  <label className="text-sm text-gray-400 mb-2 block">
    Mobile Image
  </label>

  <div className="flex items-center gap-4">

    {/* Preview */}
    <div className="w-20 h-20 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
      {editData?.image ? (
        typeof editData.image === "string" ? (
          <img src={editData.image} className="w-full h-full object-cover" />
        ) : (
          <img
            src={URL.createObjectURL(editData.image)}
            className="w-full h-full object-cover"
          />
        )
      ) : (
        <span className="text-gray-500 text-xs">No Image</span>
      )}
    </div>

    {/* Upload Button */}
    <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
      Change Image
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) =>
          setEditData({
            ...editData,
            image: e.target.files[0],
          })
        }
      />
    </label>
  </div>
</div>

            {/* Purchase */}
            <div>
              <label className="text-sm text-gray-400">Purchase Price</label>
              <input
                name="purchase_price"
                value={editData?.purchase_price || ""}
                onChange={handleChange}
                className={`${inputClass} w-full`}
              />
            </div>

            {/* MRP */}
            <div>
              <label className="text-sm text-gray-400">MRP</label>
              <input
                name="mrp"
                value={editData?.mrp || ""}
                onChange={handleChange}
                className={`${inputClass} w-full`}
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="text-sm text-gray-400">Supplier</label>
              <input
                name="supplier"
                value={editData?.supplier || ""}
                onChange={handleChange}
                className={`${inputClass} w-full`}
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <select
                name="status"
                value={editData?.status}
                onChange={handleChange}
                className={`${inputClass} w-full`}
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded bg-gray-600 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditStockModal;