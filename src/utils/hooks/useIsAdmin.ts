import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { TokenInfo } from '@/entity/NFTInfo'
import MirrorNode from '@/services/MirrorNode'
import useHashConnect from '@/hooks/useHashConnectContext'

const useIsAdmin = (membershipTokenInfo: TokenInfo | null) => {
  const { pairingData } = useHashConnect()
  const [isAdmin, setIsAdmin] = useState(false)

  const checkIfConnectedWalletHasAdminKeyForMembershipToken = useCallback(async() => {
    if (!pairingData?.accountIds || pairingData.accountIds[0] === '') {
      toast.error('No connected account! Cannot check for admin.')
      setIsAdmin(false)
      return
    }

    if (!membershipTokenInfo) {
      toast.error('No membership token data!')
      return
    }

    try {
      const accountDataResponse = await MirrorNode.fetchAccountInfo(pairingData?.accountIds[0])

      setIsAdmin(membershipTokenInfo.admin_key?.key === accountDataResponse.key.key)
    } catch {
      toast('Try again later.')
    }
  }, [membershipTokenInfo, pairingData?.accountIds])

  useEffect(() => {
    checkIfConnectedWalletHasAdminKeyForMembershipToken()
  }, [checkIfConnectedWalletHasAdminKeyForMembershipToken])

  return (
    isAdmin
  )
}

export default useIsAdmin