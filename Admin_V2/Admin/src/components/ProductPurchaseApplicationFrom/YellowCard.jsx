import React from "react";
import { Field, SectionCard, TextArea } from "./FromComponents";
import CommonPeopleSection from "./CommonPeopleSection";
import CommonProductDealSection from "./CommonProductDealSection";
import BankInformation from "./BankInformation";

const YellowCard = ({ register, errors, watch }) => {
  return (
    <>
      <SectionCard title="Yellow Card (placeholder)" tone="yellow">
        <CommonPeopleSection register={register} errors={errors} />
        <BankInformation
          register={register}
          errors={errors}
          activeCard={"yellow"}
        />

        <CommonProductDealSection
          register={register}
          errors={errors}
          watch={watch}
        />

        <TextArea
          label="Yellow Note"
          rows={3}
          placeholder="Later you will tell details..."
          {...register("yellow_note")}
        />
      </SectionCard>
    </>
  );
};

export default YellowCard;
