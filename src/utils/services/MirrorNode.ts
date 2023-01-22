import axios from 'axios'
import { TokenInfo, NFTInfo } from '@/entity/NFTInfo'
import { concat } from 'lodash'

interface Token {
  token_id: string
  balance: number
}

interface AccountBalance {
  timestamp: string
  balance: number
  tokens: Token[]
}

interface BalanceResponse {
  balance: AccountBalance[]
  timestamp: string
}

export interface AccountResponse {
  account: string
  balance: AccountBalance
  timestamp: string
  key: { _type: string; key: string }
}

interface ResponseLinks {
  next: null | string
}

interface FetchAllNFTsResponse {
  nfts: NFTInfo[];
  links: ResponseLinks;
}

export default class MirrorNode {
  static url = `https://${
    process.env.NEXT_PUBLIC_HEDERA_NETWORK === 'mainnet' ? 'mainnet-public' : process.env.NEXT_PUBLIC_HEDERA_NETWORK
  }.mirrornode.hedera.com/api/${process.env.NEXT_PUBLIC_HEDERA_MIRROR_NODE_API_VERSION}`
  static readonly instance = axios.create({
    baseURL: MirrorNode.url,
  })
  static async fetchAccountInfo(accountId: string) {
    const { data } = await this.instance.get<AccountResponse>(
      `/accounts/${ accountId }`
    )

    return data
  }

  static async fetchTokenInfo(tokenId: string): Promise<TokenInfo> {
    const { data } = await this.instance.get(`/tokens/${ tokenId }`)

    return data
  }

  static async fetchTokenBalance(tokenId: string, accountId?: string): Promise<TokenInfo> {
    const accountQuery = typeof accountId === 'string' ? `?account.id=${ accountId }` : ''
    
    const { data } = await this.instance.get(`/tokens/${ tokenId }/balances${ accountQuery }`)

    return data
  }

  static async fetchNft(tokenId: string, serialNumber: number): Promise<NFTInfo> {
    const { data } = await this.instance.get(`/tokens/${ tokenId }/nfts/${ serialNumber }`)

    return data
  }

  
  static async fetchAllNFTs({
    accountIdOrAliasOrEvmAddress,
    nextLink,
    tokenId
  } : {
    accountIdOrAliasOrEvmAddress?: string
    nextLink?: string
    tokenId?: string
  }) {
    if (!accountIdOrAliasOrEvmAddress) {
      throw new Error('No Account ID or alias or Evm Address!')
    }

    const tokenIdQuery = typeof tokenId === 'string' ? `?token.id=${ tokenId }` : ''

    const { data } = await this.instance.get<FetchAllNFTsResponse>(
      nextLink
        ? nextLink.split(`api/${ process.env.NEXT_PUBLIC_HEDERA_MIRROR_NODE_API_VERSION }/`)[1]
        : `/accounts/${ accountIdOrAliasOrEvmAddress }/nfts${ tokenIdQuery }`
    );

    nextLink = undefined;

    let nfts : NFTInfo[] = data.nfts

    if (data.links.next) {
      nextLink = data.links.next
    }

    if (nextLink) {
      const nextLinkNfts = await this.fetchAllNFTs({
        accountIdOrAliasOrEvmAddress,
        nextLink,
        tokenId
      });

      nfts = concat(nfts, nextLinkNfts)
    }

    return nfts
  }

  static async checkAssociationStatus(tokenId: string, accountId: string) {
    const { data } = await this.instance.get(`tokens/${ tokenId }/balances?account.id=${ accountId }`)

    return data.balances.length > 0
  }
}
