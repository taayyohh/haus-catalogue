import { NUMBER } from "components/Fields/types"
import * as Yup from "yup"

export const createBidFields = ({ helperText }: any) => {
  return [
    {
      name: "amount",
      type: NUMBER,
      inputLabel: "Amount",
      perma: "ETH",
      helperText: `The minimum bid is ${helperText.toFixed(3)} ETH`,
      step: 0.00000001,
    },
    {
      name: "balance",
      type: NUMBER,
      inputLabel: "Your Balance",
      disabled: true,
      perma: "ETH",
      step: 0.00000001,
    },
  ]
}

export const createBidInitialValues = {
  amount: "",
  balance: "",
}

export const validateCreateBid = (min: number) =>
  Yup.object().shape({
    amount: Yup.number()
      .transform(value => (isNaN(value) ? undefined : value))
      .required("*")
      .min(min, `>= ${min.toFixed(3)} ETH`),
  })
