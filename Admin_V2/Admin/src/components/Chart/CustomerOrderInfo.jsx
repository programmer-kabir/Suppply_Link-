import {
  HiUser,
  HiPhone,
  HiMapPin,
  HiCube,
  HiCurrencyBangladeshi,
  HiCalendarDays,
} from "react-icons/hi2";
import useUsers from "../../utils/Hooks/useUsers";
import { FaIdCard } from "react-icons/fa";

const CustomerOrderInfo = ({ currentCard }) => {
  const { users } = useUsers();
  const currenUser = users.find((user) => user.id === currentCard.user_id);
  // const { customerInstallmentCards } = useCustomerInstallmentCards();
  return (
    <div
      className="group bg-gradient-to-b from-gray-900 to-gray-950
                         border border-gray-800 rounded-2xl p-4
                         hover:border-blue-500 hover:shadow-xl transition-all flex justify-between"
    >
      {/* Left */}
      <section className="space-y-4">
        <h3 className="text-emerald-400 font-semibold flex items-center gap-2">
          <HiUser className="text-lg" />
          কার্ড মালিকের তথ্য
        </h3>

        <InfoRow icon={<HiUser />} text={currenUser?.name} />
        <InfoRow icon={<HiPhone />} text={currenUser?.mobile} />
        <InfoRow icon={<FaIdCard />} text={currenUser?.id_number} />
        <InfoRow icon={<HiMapPin />} text={currenUser?.address} />
      </section>
      <section className="space-y-4">
        <h3 className="text-emerald-400 font-semibold flex items-center gap-2">
          <HiUser className="text-lg" />
          কার্ড গ্যারান্টার তথ্য
        </h3>

        <InfoRow icon={<HiUser />} text="কাজ চলমান" />
        <InfoRow icon={<HiPhone />} text="************" />
        <InfoRow icon={<HiMapPin />} text="*********" />
      </section>

      {/* Right */}
      <section className="space-y-4">
        <h3 className="text-sky-400 font-semibold flex items-center gap-2">
          <HiCube className="text-lg" />
          পণ্যের বিবরণ
        </h3>

        <InfoRow
          icon={<HiCube />}
          text={`পণ্যের নাম ${currentCard?.product_name}`}
        />
        <InfoRow
          icon={<HiCurrencyBangladeshi />}
          text={`বিক্রয় মূল্য ${currentCard?.sale_price}`}
        />
        <InfoRow
          icon={<HiCurrencyBangladeshi />}
          text={`ক্রয় মূল্য ${currentCard?.purchase_price}`}
        />
        <InfoRow
          icon={<HiCalendarDays />}
          text={`ডেলিভারি তারিখ ${currentCard?.delivery_date}`}
        />
      </section>
    </div>
  );
};
const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-zinc-300">
    <span className="text-zinc-400">{icon}</span>
    <span>{text}</span>
  </div>
);
export default CustomerOrderInfo;
