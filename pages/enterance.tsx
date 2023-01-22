import React, { useCallback, useMemo } from 'react'
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { HashConnectConnectionState } from 'hashconnect/dist/esm/types';
import MEBERSHIP_TOKEN_ID from '@/const/MembershipTokenId';
import MirrorNode from '@/services/MirrorNode';
import useHashConnectContext from '@/hooks/useHashConnectContext'
import useIsAdmin from '@/hooks/useIsAdmin'
import useFetch from '@/hooks/useFetch';
import useValidMembershipChecker from '@/hooks/useValidMembershipChecker';

export default function EnterancePage() {
  const { pairingData, connectionState } = useHashConnectContext()

  const [isValidMembership, membrshipExpireDate, isValidMembershipLoading] = useValidMembershipChecker(pairingData?.accountIds[0], MEBERSHIP_TOKEN_ID)
  
  const tokenDataFetchMethod = useCallback(async () => (
    MEBERSHIP_TOKEN_ID ? await MirrorNode.fetchTokenInfo(MEBERSHIP_TOKEN_ID) : null
  ), [])
  
  const [ tokenData, , tokenDataLoading ] = useFetch(tokenDataFetchMethod)

  const isAdmin = useIsAdmin(tokenData);

  const activeMembershipContent = useMemo(() => (
    tokenDataLoading || isValidMembershipLoading ? (
      <div>
        Loading...
      </div>
    ) : (
      <div>
        <p>
          You have active membership!
          {isAdmin ? (
            <p>
              You are entered as admin.
            </p>
          ) : (
            null
          )}
        </p>
        <p>
          {isValidMembership && typeof membrshipExpireDate === 'string' && (
            <>
              <p>
                You are already active member until {new Date(membrshipExpireDate).toUTCString()}
              </p>
              <p>
                Your QR code to entry:
              </p>
              <QRCode value={`${ pairingData?.accountIds[0] }.${ tokenData?.token_id }.${ tokenData?.modified_timestamp }`} />
            </>
          )}
        </p>
      </div>
    )
  ), [isAdmin, isValidMembership, isValidMembershipLoading, membrshipExpireDate, pairingData?.accountIds, tokenData?.modified_timestamp, tokenData?.token_id, tokenDataLoading])

  const membershipContent = useMemo(() => (
    !isValidMembership || (!isValidMembership && !isAdmin) ? (
      <div>
        <p>No active membership!</p>
        <Link href='/'>Back to main page</Link> to buy membership if avaible.
      </div>
    ) : (
      <>
        {activeMembershipContent}
      </>
    )
  ), [activeMembershipContent, isAdmin, isValidMembership])
  
  const pairedAccountContent = useMemo(() => (
    isValidMembershipLoading ? (
      <p>
        Checking for membership. Please wait...
      </p>
    ) : (
      membershipContent
    )
  ), [isValidMembershipLoading, membershipContent])

  return (
    connectionState === HashConnectConnectionState.Paired && pairingData?.accountIds[0] ? (
      <div>
        {pairedAccountContent}
        
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      </div>
    ) : (
      <div>
        Connect with HashPack first!
      </div>
    )
  )
}
