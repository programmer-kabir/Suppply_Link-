import React from "react";
import { Field, SectionCard, TextArea } from "./FromComponents";

const CommonPeopleSection = ({ register, errors }) => {
  return (
    <SectionCard title="Common People Information">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Customer */}
        <div>
          <Field
            label="Customer Name *"
            placeholder="Customer name"
            {...register("customer_name", {
              required: "Customer name is required",
            })}
          />
          {errors?.customer_name && (
            <p className="text-xs text-rose-400">
              {errors.customer_name.message}
            </p>
          )}

          <Field
            label="Customer Phone *"
            placeholder="01XXXXXXXXX"
            {...register("customer_phone", {
              required: "Customer phone is required",
            })}
          />
          {errors?.customer_phone && (
            <p className="text-xs text-rose-400">
              {errors.customer_phone.message}
            </p>
          )}

          <TextArea
            label="Customer Address *"
            rows={2}
            placeholder="Area, Thana, District"
            {...register("customer_address", {
              required: "Customer address is required",
            })}
          />
          {errors?.customer_address && (
            <p className="text-xs text-rose-400">
              {errors.customer_address.message}
            </p>
          )}

          <Field
            label="Customer NID Front *"
            type="file"
            accept="image/*"
            {...register("customer_nid_front", {
              required: "Customer NID front is required",
            })}
          />
          {errors?.customer_nid_front && (
            <p className="text-xs text-rose-400">
              {errors.customer_nid_front.message}
            </p>
          )}

          <Field
            label="Customer NID Back *"
            type="file"
            accept="image/*"
            {...register("customer_nid_back", {
              required: "Customer NID back is required",
            })}
          />
          {errors?.customer_nid_back && (
            <p className="text-xs text-rose-400">
              {errors.customer_nid_back.message}
            </p>
          )}

          <Field
            label="Customer Photo *"
            type="file"
            accept="image/*"
            {...register("customer_photo", {
              required: "Customer photo is required",
            })}
          />
          {errors?.customer_photo && (
            <p className="text-xs text-rose-400">
              {errors.customer_photo.message}
            </p>
          )}
        </div>
        {/* Guarantor */}
        <div>
          <Field
            label="Guarantor Name *"
            placeholder="Guarantor name"
            {...register("guarantor_name", {
              required: "Guarantor name is required",
            })}
          />
          {errors?.guarantor_name && (
            <p className="text-xs text-rose-400">
              {errors.guarantor_name.message}
            </p>
          )}

          <Field
            label="Guarantor Phone *"
            placeholder="01XXXXXXXXX"
            {...register("guarantor_phone", {
              required: "Guarantor phone is required",
            })}
          />
          {errors?.guarantor_phone && (
            <p className="text-xs text-rose-400">
              {errors.guarantor_phone.message}
            </p>
          )}

          <TextArea
            label="Guarantor Address *"
            rows={2}
            placeholder="Area, Thana, District"
            {...register("guarantor_address", {
              required: "Guarantor address is required",
            })}
          />
          {errors?.guarantor_address && (
            <p className="text-xs text-rose-400">
              {errors.guarantor_address.message}
            </p>
          )}
          <Field
            label="Guarantor NID Front *"
            type="file"
            accept="image/*"
            {...register("guarantor_nid_front", {
              required: "Guarantor NID front is required",
            })}
          />
          {errors?.guarantor_nid_front && (
            <p className="text-xs text-rose-400">
              {errors.guarantor_nid_front.message}
            </p>
          )}

          <Field
            label="Guarantor NID Back *"
            type="file"
            accept="image/*"
            {...register("guarantor_nid_back", {
              required: "Guarantor NID back is required",
            })}
          />
          {errors?.guarantor_nid_back && (
            <p className="text-xs text-rose-400">
              {errors.guarantor_nid_back.message}
            </p>
          )}

          <Field
            label="Guarantor Photo *"
            type="file"
            accept="image/*"
            {...register("guarantor_photo", {
              required: "Guarantor photo is required",
            })}
          />
          {errors?.guarantor_photo && (
            <p className="text-xs text-rose-400">
              {errors.guarantor_photo.message}
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default CommonPeopleSection;
