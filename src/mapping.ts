import { BigInt } from "@graphprotocol/graph-ts"

import { Fund1Commitment } from "../generated/schema"
import { Deposit, Withdraw } from "../generated/GaugeD1/GaugeD1"


let zero = BigInt.fromI32(0)


export function handleDeposit(event: Deposit): void {
  let depositor = event.params.from.toHex()

  if (event.params.amountCommitHard.gt(zero) || event.params.amountCommitSoft.gt(zero)) {
    let fundCommitment = Fund1Commitment.load(depositor)

    if (fundCommitment == null) {
      fundCommitment = new Fund1Commitment(depositor)

      fundCommitment.softAmount = event.params.amountCommitSoft
      fundCommitment.hardAmount = event.params.amountCommitHard
    } else {
      fundCommitment.softAmount = fundCommitment.softAmount.plus(event.params.amountCommitSoft)
      fundCommitment.hardAmount = fundCommitment.hardAmount.plus(event.params.amountCommitHard)
    }

    fundCommitment.save()
  }
}

export function handleWithdraw(event: Withdraw): void {
  let depositor = event.params.to.toHex()

  let fundCommitment = Fund1Commitment.load(depositor)

  if (fundCommitment == null) {
    return
  }

  fundCommitment.softAmount = fundCommitment.softAmount.minus(event.params.amount)

  fundCommitment.save()
}
