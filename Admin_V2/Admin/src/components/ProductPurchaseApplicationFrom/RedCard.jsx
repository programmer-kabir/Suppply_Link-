import React from "react";
import { SectionCard, TextArea } from "./FromComponents";
import CommonPeopleSection from "./CommonPeopleSection";
import CommonProductDealSection from "./CommonProductDealSection";
import BankInformation from "./BankInformation";

const RedCard = ({ register, errors, watch }) => {
  return (
    <SectionCard title="red Card (placeholder)" tone="red">
      <div className="space-y-5">
        <CommonPeopleSection register={register} errors={errors} />
        <BankInformation
          register={register}
          errors={errors}
          activeCard={"red"}
        />

        <CommonProductDealSection
          register={register}
          errors={errors}
          watch={watch}
        />

        <TextArea
          label="red Note"
          rows={3}
          placeholder="Later you will tell details..."
          {...register("red_note")}
        />
      </div>
    </SectionCard>
  );
};

export default RedCard;
