export const signatures = [
  {
    name: "Mohiuddin",
    signature: "https://management.supplylinkbd.com/uploads/mohiuddin_signatrure.webp",
  },
  {
    name: "Rubel",
    signature: "https://management.supplylinkbd.com/uploads/rubel_signature.webp",
  },
  {
    name: "Kaibr",
    signature: "https://management.supplylinkbd.com/uploads/kabir_signature.webp",
  },
];
export const names = [
  {
    name: "শাহরিয়ার রুবেল",
    signature: "https://management.supplylinkbd.com/uploads/rubel_signature.webp",
  },
  {
    name: "মোঃ মহিউদ্দিন ",
    signature: "https://management.supplylinkbd.com/uploads/mohiuddin_signatrure.webp",
  },
  {
    name: "কবির হোসেন",
    signature: "https://management.supplylinkbd.com/uploads/kabir_signature.webp",
  },
];

export const getSignatureByName = (name) => {
  return signatures.find(
    (item) => item.name.toLowerCase() === name?.toLowerCase(),
  )?.signature;
};
export const getPrintSignatureByName = (name) => {
  if (!name) return null;

  const key = name.trim().toLowerCase();

  const match = names.find((item) => item.name.toLowerCase() === key);

  return match?.signature || null;
};
