import React from "react";
import { Field, SectionCard } from "./FromComponents";

const BankInformation = ({ register, activeCard}) => {
  const isBankDocRequired = activeCard === "red" || activeCard === "shop";

  return (
    <SectionCard title="Bank Information" tone="yellow">
      <div className="grid md:grid-cols-2 gap-5">
        <Field
          label="Customer Bank Check"
          type="file"
          accept="image/*"
          required={isBankDocRequired}
          {...register("customer_bank_check", {
            required: isBankDocRequired
              ? "Bank check is required for Red / Shop card"
              : false,
          })}
        />

        <Field
          label="Customer Bank Statement"
          type="file"
          accept="image/*"
          required={isBankDocRequired}
          {...register("customer_bank_statement", {
            required: isBankDocRequired
              ? "Bank statement is required for Red / Shop card"
              : false,
          })}
        />
      </div>
    </SectionCard>
  );
};

export default BankInformation;
