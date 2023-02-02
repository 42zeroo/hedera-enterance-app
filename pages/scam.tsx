import Button from '@/components/shared/Button'
import useHashConnectContext from '@/hooks/useHashConnectContext'
import { ScamContractService } from '@/services/ScamContractService'
import { TransactionReceipt } from '@hashgraph/sdk'
import React, { useCallback } from 'react'
import toast from 'react-hot-toast'

export default function Scam() {
  const { pairingData, sendTransaction } = useHashConnectContext() 

  const scamMint = useCallback(async () => {
    try {   
      if (!pairingData?.accountIds[0]) {
        throw new Error('No to connected user ID!')
      }
      const scamContractTransaction = ScamContractService.mint()

      const scamContractTransactionResponse = await sendTransaction(scamContractTransaction);

      if (!scamContractTransactionResponse) {
        throw new Error('Scam mint failed.');
      } else {
        toast.success(`You have minted scam NFT!`)

        console.log({scamContractTransaction: TransactionReceipt.fromBytes(scamContractTransactionResponse.receipt)})
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error('Problem while minting NFTS!')
      }
    }
  }, [pairingData?.accountIds, sendTransaction])

  return (
    <div>
      <h1>
        Scam
      </h1>
      <div className='py-8'>
        {pairingData?.accountIds[0] ? (
          <Button onClick={scamMint} >
            Scam mint
          </Button>
        ) : (
          <p>Connect account first!</p>
        )}
      </div>
    </div>
  )
}
