
import { useContext } from 'react'
import { HashConnectContext } from '@/context/HashConnect'

const useHashConnectContext = () => {
  const context = useContext(HashConnectContext)

  return context
}

export default useHashConnectContext