import { NUMBER } from "components/Fields/types"
import * as Yup from "yup"

export const updateReservePriceFields = [
  {
    name: "reservePrice",
    type: NUMBER,
    inputLabel: "Reserve Price",
    perma: "ETH",
    helperText: `The minimum value in ETH that a bid must meet in order to start the auction.`,
    step: 0.00001,
  },
]

export const reservePriceInitialValues = {
  amount: "",
  balance: "",
}

export const validateUpdateReservePrice = (min: number) =>
  Yup.object().shape({
    amount: Yup.number()
      .transform(value => (isNaN(value) ? undefined : value))
      .required("*")
      .min(min, `>= ${min.toFixed(3)} ETH`),
  })
