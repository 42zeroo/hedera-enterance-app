import { NFTMetadata } from '@/entity/NFT-Metadata'

export enum TOKEN_SUPPLY_TYPES {
  INFINITE = 'INFINITE',
  FINITE = 'FINITE',
}

export type Key = {
  type: string
  key: string
}

export interface TokenInfo {
  account_id: string
  admin_key: Key | null
  auto_renew_account: string | null
  auto_renew_period: string | null
  created_timestamp: string
  decimals: string
  expiry_timestamp: string | null
  freeze_default: string | boolean
  fee_schedule_key: Key | null
  freeze_key: Key | null
  initial_supply: string
  kyc_key: Key | null
  modified_timestamp: string
  name: string
  supply_key: Key | null
  symbol: string
  token_id: string
  total_supply: string
  treasury_account_id: string | null
  type: string
  wipe_key: Key | null
  custom_fees: unknown
  pause_key: Key | null
  pause_status: string | null
  supply_type: TOKEN_SUPPLY_TYPES
  max_supply: string
}

export interface NFTInfo {
  account_id: string,
  created_timestamp: string,
  deleted: boolean,
  metadata: string,
  modified_timestamp: string,
  serial_number: number,
  token_id: string,
  meta?: NFTMetadata
  spender: null | string;
}

export interface NFTTransaction {
  consensus_timestamp: string
  is_approval: boolean
  nonce: number
  receiver_account_id: string
  sender_account_id: string
  transaction_id: string
  type: string
}

export interface NFTTransactionHistory {
  id: string
  receiver_account_id?: string
  sender_account_id?: string
  type: string
  token_id: string
  transactions?: NFTTransaction[]
}
