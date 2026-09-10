export const getPaymentOptions = ( paymentMethods ) => {
  const options = [];
  if (paymentMethods?.bank) {
    options.push({
      key: "bank",
      label: `Bank - ${paymentMethods.bank.bank_name} (${paymentMethods.bank.bank_account_number})`,
      value: "bank",
    });
  }

  if (paymentMethods?.mobile_wallet) {
    if (paymentMethods.mobile_wallet.bkash) {
      options.push({
        key: "bkash",
        label: `bKash - ${paymentMethods.mobile_wallet.bkash}`,
        value: "bkash",
      });
    }
    if (paymentMethods.mobile_wallet.nagad) {
      options.push({
        key: "nagad",
        label: `Nagad - ${paymentMethods.mobile_wallet.nagad}`,
        value: "nagad",
      });
    }
    if (paymentMethods.mobile_wallet.rocket) {
      options.push({
        key: "rocket",
        label: `Rocket - ${paymentMethods.mobile_wallet.rocket}`,
        value: "rocket",
      });
    }
  }

  return options;
};
