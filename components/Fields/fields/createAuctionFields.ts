import { DAYS_HOURS_MINS_SECS, NUMBER, TEXT } from "components/Fields/types"
import * as Yup from "yup"

export const createAuctionFields = () => {
  return [
    {
      name: "duration",
      type: DAYS_HOURS_MINS_SECS,
      inputLabel: "Auction Duration",
    },
    {
      name: "reservePrice",
      type: NUMBER,
      inputLabel: "Reserve Price",
      perma: "ETH",
      step: 0.001,
    },
    {
      name: "sellerFundsRecipient",
      type: TEXT,
      inputLabel: "Seller Funds Recipient",
      placeholder: "0x...",
    },
  ]
}

export const createAuctionInitialValues = {
  duration: "",
  reservePrice: "",
  sellerFundsRecipient: "",
}

export const validateCreateAuction = (min: number) =>
  Yup.object().shape({
    amount: Yup.number()
      .transform(value => (isNaN(value) ? undefined : value))
      .required("*")
      .min(min, `>= ${min.toFixed(3)} ETH`),
  })
