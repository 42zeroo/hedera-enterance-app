import { PrivateKey, PublicKey, Transaction } from '@hashgraph/sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.NEXT_PUBLIC_MEMBERSHIP_TOKEN_ID) {
    return res.status(405).json({ error: 'No TokenID!' })
  }

  if (!process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_PRIVATE_KEY) {
    return res.status(405).json({ error: 'No private key!' })
  }

  if (!process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_PUBLIC_KEY) {
    return res.status(405).json({ error: 'No public key!' })
  }

  const transaction = Transaction.fromBytes(Uint8Array.from(Object.values(req.body.bytes)))

  transaction.addSignature(PublicKey.fromString(process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_PUBLIC_KEY), PrivateKey.fromString(process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_PRIVATE_KEY).signTransaction(transaction))

  console.log({transaction: transaction})

  res.status(200).json({
    txBytes: transaction.toBytes()
  })
}
