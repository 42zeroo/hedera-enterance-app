// import { useState, useCallback, useEffect } from 'react'
// import toast from 'react-hot-toast'
// import MirrorNode from '@/services/MirrorNode'
// import { TokenInfo } from '@/entity/NFTInfo'

// export default function useFetchHederaToken(tokenId: string, fetchOnInit = true) {
//   const [tokenData, setTokenData] = useState<TokenInfo | null>(null)
//   const [loading, setLoading] = useState(false)

//   const updateTokenData = useCallback(async () => {
//     setLoading(true)

//     try {
//       const tokenDataResponse = await MirrorNode.fetchTokenInfo(tokenId)

//       if (tokenDataResponse) {
//         setTokenData(tokenDataResponse)
//       }
//     } catch {
//       toast.error('Cannot fetch token data!')
//     }

//     setLoading(false)
//   }, [tokenId])

//   useEffect(() => {
//     if (fetchOnInit) {
//       updateTokenData()
//     }
//   }, [updateTokenData, fetchOnInit])

//   return {
//     tokenData,
//     updateTokenData,
//     loading,
//   }
// }

import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function useFetch<T>(fetchMethod: () => Promise<T>, fetchOnInit = true): [data: T | null, updateData: () => Promise<void>, loading: boolean] {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  const updateData = useCallback(async () => {
    setLoading(true)

    try {
      const dataResponse = await fetchMethod()

      console.log({dataResponse})

      if (dataResponse) {
        setData(dataResponse)
      }
    } catch {
      toast.error('Cannot fetch data!')
      setData(null)
    }

    setLoading(false)
  }, [fetchMethod])

  useEffect(() => {
    // if (fetchOnInit) {
      updateData()
    // }
  }, [updateData])

  return [
    data,
    updateData,
    loading,
  ]
}
