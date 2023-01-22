import type { NextApiRequest, NextApiResponse } from 'next'
import find from 'lodash/find'
import MirrorNode from '@/services/MirrorNode'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(402).json({
      error: 'Only GET method allowed!'
    })
  }

  const { tokenId, accountId } = req.query

  if (typeof tokenId !== 'string' || typeof accountId !== 'string') {
    return res.status(402).json({
      error: 'You must pass "tokenId" and "accountId" as string query params!'
    })
  }

  const nfts = await MirrorNode.fetchAllNFTs({
    accountIdOrAliasOrEvmAddress: accountId,
    tokenId
  })

  const notExpiredToken = find(nfts, nft => (
    new Date(parseFloat(nft.modified_timestamp) * 1000).getTime() + 60 * 60 * 24 * 30 > Date.now()
  ))

  let expire : false | number = false

  if (notExpiredToken) {
    expire = parseFloat(notExpiredToken?.modified_timestamp) * 1000
  }

  res.status(200).json({
    expired: notExpiredToken ? false : true,
    expire: typeof expire === 'number' ? new Date(expire).getTime() + 60 * 60 * 24 * 30 : expire
  })
}
