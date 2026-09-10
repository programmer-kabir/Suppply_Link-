import React from "react";
import { SectionCard, TextArea } from "./FromComponents";
import CommonPeopleSection from "./CommonPeopleSection";
import CommonProductDealSection from "./CommonProductDealSection";
import BankInformation from "./BankInformation";

const ShopCard = ({ register, errors, watch }) => {
  return (
    <SectionCard title="Shop Card (placeholder)" tone="shop">
      <div className="space-y-5">
        <CommonPeopleSection register={register} errors={errors} />
        <BankInformation
          register={register}
          errors={errors}
          activeCard={"shop"}
        />

        <CommonProductDealSection
          register={register}
          errors={errors}
          watch={watch}
        />

        <TextArea
          label="shop Note"
          rows={3}
          placeholder="Later you will tell details..."
          {...register("shop_note")}
        />
      </div>
    </SectionCard>
  );
};

export default ShopCard;
