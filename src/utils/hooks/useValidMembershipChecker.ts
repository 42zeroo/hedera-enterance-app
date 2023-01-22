import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

export default function useValidMembershipChecker(accountId: string | undefined, tokenId: string | undefined ) {
  const [validMembership, setValidMembership] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [expireDate, setExpireDate] = useState<false | string>(false)

  const checkForValidMembership = useCallback(async() => {
    setLoading(true)

    if (!accountId || !tokenId) {
      setValidMembership(false)
      setLoading(false)
      return
    }

    const { data: { expire, expired } } = await axios.get<{ expired: boolean, expire: false | string }>(`/api/chechForValidMembership?accountId=${ accountId }&tokenId=${ tokenId }`)
    
    setValidMembership(expired)
    setExpireDate(expire)
    setLoading(false)
  }, [accountId, tokenId])
  
  useEffect(() => {
    checkForValidMembership()
  }, [checkForValidMembership])
  

  return [validMembership, expireDate, loading]
}
