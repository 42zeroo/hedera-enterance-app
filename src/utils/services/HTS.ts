import { 
  AccountId,
  TokenId,
  TokenMintTransaction,
  TransactionId,
  TransferTransaction,
  TokenBurnTransaction,
  TokenAssociateTransaction
} from "@hashgraph/sdk";
import { TransferHbarInput, TransferNftInput } from "@hashgraph/sdk/lib/account/TransferTransaction";
import { HashConnectSigner } from "hashconnect/dist/esm/provider/signer";

export type AccountInfo = Response & {
  result?: string;
  key?: {
    key: string;
  };
};

export default class HTS {  
  static mintToken(tokenId: string | TokenId, acc1: string, cids: string[]) {
    const txID = TransactionId.generate(acc1);
    const meta = cids.map((cid) => Buffer.from(`ipfs://${ cid }`));

    const mintTx = new TokenMintTransaction()
      .setTransactionId(txID)
      .setTokenId(tokenId)
      .setNodeAccountIds([new AccountId(3)])
      .setMetadata(meta)
      .freeze();

    return mintTx;
  }

  static burnToken(tokenId: string | TokenId, acc1: string, serials: number[]) {
    const txID = TransactionId.generate(acc1);

    const burnTx = new TokenBurnTransaction()
      .setTransactionId(txID)
      .setTokenId(tokenId)
      .setNodeAccountIds([new AccountId(3)])
      .setSerials(serials)
      .freeze();

    return burnTx;
  }

  static sendNFT(senderAccountId: string, {
    hbarTransfers,
    nftTransfers
  } : {
    hbarTransfers?: TransferHbarInput[]
    nftTransfers?: TransferNftInput[]
  }) {
    const txID = TransactionId.generate(senderAccountId);

    const tx = new TransferTransaction({
      hbarTransfers,
      nftTransfers
    })
      .setTransactionId(txID)
      .setNodeAccountIds([new AccountId(3)])
      .freeze()

    return tx;
  }

  static tokenAssociate(accountIdToAssociate: string, tokenIdToAssociate: string) {
    const txID = TransactionId.generate(accountIdToAssociate);

    const associateTx = new TokenAssociateTransaction()
      .setTransactionId(txID)
      .setNodeAccountIds([new AccountId(3)])
      .setAccountId(accountIdToAssociate)
      .setTokenIds([tokenIdToAssociate])
      .freeze();

    return associateTx
  }
}