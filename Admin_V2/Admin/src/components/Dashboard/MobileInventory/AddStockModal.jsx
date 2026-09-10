import React from "react";

const AddStockModal = ({
  setIsOpen,
  handleSubmit,
  handleChange,
  formData,
  setFormData,
  inputClass,
  brandInput,
  setBrandInput,
  showSuggestions,
  setShowSuggestions,
  filteredBrands,
  showVariantSuggestions,
  setShowVariantSuggestions,
  filteredVariants,
  variantInput,
  setVariantInput,
}) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
        {" "}
        <div className="bg-[#020617] p-6 rounded-xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-4">Add Mobile</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label className="text-sm text-gray-400">Purchase Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`${inputClass} w-full date-fix`}
                />
              </div>

              {/* Brand */}
              <div className="relative">
                <label className="text-sm text-gray-400">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={brandInput}
                  placeholder="Enter brand"
                  onChange={(e) => {
                    setBrandInput(e.target.value);
                    setShowSuggestions(true);
                    setFormData({
                      ...formData,
                      brand: e.target.value,
                    });
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  className={`${inputClass} w-full`}
                />

                {showSuggestions && brandInput && (
                  <div className="absolute bg-gray-800 border border-gray-600 w-full mt-1 rounded shadow-lg z-50 max-h-40 overflow-y-auto">
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((b, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setBrandInput(b);
                            setFormData({
                              ...formData,
                              brand: b,
                            });
                            setShowSuggestions(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                        >
                          {b}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-400">No match</div>
                    )}
                  </div>
                )}
              </div>

              {/* Model */}
              <div>
                <label className="text-sm text-gray-400">Model</label>
                <input
                  type="text"
                  name="model"
                  placeholder="Enter model"
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                />
              </div>

              {/* Variant */}
              <div className="relative">
                <label className="text-sm text-gray-400">Variant</label>

                <input
                  type="text"
                  name="variant"
                  value={variantInput}
                  placeholder="e.g. 8GB + 128GB"
                  onChange={(e) => {
                    setVariantInput(e.target.value);
                    setShowVariantSuggestions(true);

                    setFormData({
                      ...formData,
                      variant: e.target.value,
                    });
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowVariantSuggestions(false), 150)
                  }
                  className={`${inputClass} w-full`}
                />

                {showVariantSuggestions && variantInput && (
                  <div className="absolute bg-gray-800 border border-gray-600 w-full mt-1 rounded shadow-lg z-50 max-h-40 overflow-y-auto">
                    {filteredVariants.length > 0 ? (
                      filteredVariants.map((v, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setVariantInput(v);
                            setFormData({
                              ...formData,
                              variant: v,
                            });
                            setShowVariantSuggestions(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                        >
                          {v}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-400">No match</div>
                    )}
                  </div>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="text-sm text-gray-400">Color</label>
                <input
                  type="text"
                  name="color"
                  placeholder="Enter color"
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                />
              </div>

          
              {/* <div>
                <label className="text-sm text-gray-400">IMEI 1</label>
                <input
                  type="text"
                  name="imei1"
                  placeholder="15 digit IMEI"
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                />
              </div>

       
              <div>
                <label className="text-sm text-gray-400">IMEI 2</label>
                <input
                  type="text"
                  name="imei2"
                  placeholder="Optional"
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                />
              </div> */}
<div>
  <label className="text-sm text-gray-400">Mobile Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setFormData({
        ...formData,
        image: e.target.files[0],
      })
    }
    className={`${inputClass} w-full`}
  />
</div>
              {/* Purchase Price */}
              <div>
                <label className="text-sm text-gray-400">Purchase Price</label>
                <input
                  type="number"
                  name="purchase_price"
                  placeholder="৳"
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                />
              </div>

              {/* MRP */}
              <div>
                <label className="text-sm text-gray-400">MRP</label>
                <input
                  type="number"
                  name="mrp"
                  placeholder="৳"
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                />
              </div>

              {/* Supplier */}
              <div>
                <label className="text-sm text-gray-400">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  placeholder="Supplier name"
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <select
                  name="status"
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
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
