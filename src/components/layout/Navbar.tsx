import React, { useCallback, useMemo } from 'react'
import { HashConnectConnectionState } from 'hashconnect/dist/esm/types'
import useHashConnectContext from '@/hooks/useHashConnectContext'
import Link from 'next/link'
import useIsAdmin from '@/hooks/useIsAdmin'
import useFetch from '@/hooks/useFetch'
import MEBERSHIP_TOKEN_ID from '@/const/MembershipTokenId'
import MirrorNode from '@/services/MirrorNode'
import Button from '../shared/Button'

export default function NavbarComponent() {
  const { connectionState, pairingData, disconnect, connect } = useHashConnectContext()
  const tokenDataFetchMethod = useCallback(async () => (
    await MirrorNode.fetchTokenInfo(MEBERSHIP_TOKEN_ID)
  ), [])
  const [ tokenData ] = useFetch(tokenDataFetchMethod)

  const isAdmin = useIsAdmin(tokenData);

  const buttonOnClick = useCallback(() => {
    if (connectionState === HashConnectConnectionState.Paired && pairingData?.accountIds[0]) {
      return disconnect()
    }

    if (connectionState === HashConnectConnectionState.Connected || !pairingData?.accountIds[0]) {
      return connect()
    }
  }, [connect, connectionState, disconnect, pairingData?.accountIds])

  const buttonContent = useMemo(() => {
    if (connectionState === HashConnectConnectionState.Paired && pairingData?.accountIds[0]) {
      return `Disconnect from ${ pairingData?.accountIds[0] }`
    }

    if (connectionState === HashConnectConnectionState.Connected || !pairingData?.accountIds[0]) {
      return 'Connect'
    }

    return 'Wait...'
  }, [connectionState, pairingData?.accountIds])
  
  return (
    <nav className=" mx-auto">
      <div className="flex flex-wrap w-full items-center justify-center rounded bg-blue-900 border-gray-200 p-2 flex-col md:flex-row md:justify-between mx-auto">
        <span className="self-center text-xl ml-4 font-semibold whitespace-nowrap text-white">
          dAap GYM
        </span>
        <div className="w-full block w-auto mt-4 md:mt-0" id="navbar-default">
          <ul className="flex flex-col sm:flex-row p-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 mt-0 text-sm font-medium border-0 bg-gray-900 border-gray-700">
            <li className='flex items-center px-4 justify-center sm:justify-start'>
              <Link className='block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent' href='/'>Home</Link>
            </li>
            {isAdmin && (
              <li className='flex items-center px-4 justify-center sm:justify-start'>
                <Link className='block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent' href='/admin'>Admin</Link>
              </li>
            )}
            <li className='ml-2'>
              <Button onClick={buttonOnClick}>
                { buttonContent }
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
