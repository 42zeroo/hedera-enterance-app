import { AdminMembershipContext } from '@/context/AdminMembershipContext'
import { useContext } from 'react'

const useAdminMembershipContext = () => {
  const adminMembershipContext = useContext(AdminMembershipContext)

  return (
    adminMembershipContext
  )
}

export default useAdminMembershipContext
