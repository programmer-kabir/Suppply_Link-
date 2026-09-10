import React from "react";
import { Field, SectionCard } from "./FromComponents";

const CommonProductDealSection = ({ register, errors, watch }) => {
  // 👀 MRP observe করা হচ্ছে
  const mrp = watch("mrp");

  return (
    <SectionCard title="Product & Deal Information">
      <Field
        label="Product Name *"
        placeholder="e.g., iPhone 13"
        {...register("product_name", { required: "Product name is required" })}
      />
      {errors?.product_name && (
        <p className="text-xs text-rose-400">{errors.product_name.message}</p>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Field
          label="MRP (BDT) *"
          type="number"
          placeholder="90000"
          {...register("mrp", {
            required: "MRP is required",
            min: { value: 1, message: "MRP must be greater than 0" },
          })}
        />
        {errors?.mrp && (
          <p className="text-xs text-rose-400">{errors.mrp.message}</p>
        )}

        <Field
          label="Sales Price (BDT) *"
          type="number"
          placeholder="85000"
          {...register("sales_price", {
            required: "Sales price is required",
            validate: (value) => {
              if (!mrp) return true; // MRP না থাকলে skip
              return (
                Number(value) <= Number(mrp) ||
                "Sales Price cannot be greater than MRP"
              );
            },
          })}
        />
        {errors?.sales_price && (
          <p className="text-xs text-rose-400">{errors.sales_price.message}</p>
        )}

        <Field
          label="Down Payment (BDT) *"
          type="number"
          placeholder="10000"
          {...register("down_payment", {
            required: "Down payment is required",
            min: { value: 0, message: "Down payment cannot be negative" },
          })}
        />
        {errors?.down_payment && (
          <p className="text-xs text-rose-400">{errors.down_payment.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Field
          label="Installments *"
          type="number"
          placeholder="6"
          {...register("installments", {
            required: "Installments is required",
            min: { value: 1, message: "Installments must be at least 1" },
          })}
        />
        {errors?.installments && (
          <p className="text-xs text-rose-400">{errors.installments.message}</p>
        )}

        <Field
          label="Request Date *"
          type="date"
          {...register("request_date", {
            required: "Request date is required",
          })}
        />
        {errors?.request_date && (
          <p className="text-xs text-rose-400">{errors.request_date.message}</p>
        )}
      </div>
    </SectionCard>
  );
};

export default CommonProductDealSection;
