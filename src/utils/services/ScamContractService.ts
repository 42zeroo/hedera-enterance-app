

import { ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, Hbar } from "@hashgraph/sdk"

export class ScamContractService {
  static contractId = process.env.NEXT_PUBLIC_SCAM_CONTRACT_ID
  static defaultGas =  50000

  static mint() {
    const transaction = new ContractCallQuery({
      contractId: this.contractId,
      gas: this.defaultGas
    })
      // .setMaxQueryPayment(new Hbar(0.00000001))
      .setFunction('mint', new ContractFunctionParameters())

    return transaction
  }
}