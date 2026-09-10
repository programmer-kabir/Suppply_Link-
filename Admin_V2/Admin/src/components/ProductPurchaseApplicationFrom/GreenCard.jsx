import React from "react";
import { SectionCard, TextArea } from "./FromComponents";
import CommonPeopleSection from "./CommonPeopleSection";
import CommonProductDealSection from "./CommonProductDealSection";

const GreenCard = ({ register, errors, watch }) => {
  return (
    <>
      <SectionCard title="Green Card (placeholder)" tone="green">
        <CommonPeopleSection register={register} errors={errors} />
        <CommonProductDealSection
          register={register}
          errors={errors}
          watch={watch}
        />

      <TextArea
  label="Green Note *"
  rows={3}
  placeholder="..."
  {...register("green_note", { required: "Green note required" })}
/>

        
      </SectionCard>
    </>
  );
};

export default GreenCard;
