import React, { useCallback, useMemo, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { HashConnectConnectionState } from 'hashconnect/dist/esm/types';
import map from 'lodash/map';
import DEFAULT_MEMBERSHIP_TOKEN_ID from '@/const/DefaultMembershipTokenId';
import DEFAULT_ADMIN_ACCOUNT_ID from '@/const/DefaultAdminAccountId';
import useHashConnectContext from '@/hooks/useHashConnectContext'
import useIsAdmin from '@/hooks/useIsAdmin'
import MirrorNode from '@/services/MirrorNode';
import useFetch from '@/hooks/useFetch';
import MembershipMenageTools from '@/components/views/admin/MembershipMenageTools';
import MembershipAnalytics from '@/components/views/admin/MembershipAnalytics';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal'
import Card from '@/components/shared/Card';

export default function AdminPage() {
  let [isOpen, setIsOpen] = useState(false)
  
  const { pairingData, connectionState } = useHashConnectContext() 
  
  const tokenDataFetchMethod = useCallback(async () => (
    await MirrorNode.fetchTokenInfo(process.env.NEXT_PUBLIC_MEMBERSHIP_TOKEN_ID ?? DEFAULT_MEMBERSHIP_TOKEN_ID)
  ), [])
  
  const [ tokenData, updateTokenData, tokenDataLoading ] = useFetch(tokenDataFetchMethod)
  
  const fetchAllNFTsMethod = useCallback(async () => (
    await MirrorNode.fetchAllNFTs({
      accountIdOrAliasOrEvmAddress: pairingData?.accountIds[0] ?? DEFAULT_ADMIN_ACCOUNT_ID,
      tokenId: tokenData?.token_id ?? process.env.NEXT_PUBLIC_MEMBERSHIP_TOKEN_ID ?? DEFAULT_MEMBERSHIP_TOKEN_ID
    })
  ), [pairingData?.accountIds, tokenData?.token_id])

  const [ allNftData, updateAllNftData, allNftDataLoading ] = useFetch(fetchAllNFTsMethod)
  
  const isAdmin = useIsAdmin(tokenData);

  const serials = useMemo(() => (
    allNftData && map(allNftData, nft => nft.serial_number)
  ), [allNftData])

  const updateData = useCallback(async () => {
    await updateAllNftData()
    await updateTokenData()
  }, [updateAllNftData, updateTokenData])
  
  const pairedAccountContent = useMemo(() => (
    !isAdmin ? (
      <div>
        <Tooltip anchorId="my-element" />
        <Button className='mr-4' id="my-element" onClick={() => setIsOpen(true)} data-tooltip-content="Click to show admin connection data.">
          Admin data
        </Button>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className='flex flex-col gap-2'>
            <Card title='Account ID' >
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                {process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_ID}
              </kbd>
            </Card>
            <Card title='Public key'>
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                {process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_PUBLIC_KEY}
              </kbd>
            </Card>
            <Card title='Private key'>
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                {process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_PRIVATE_KEY}
              </kbd>
            </Card>
          </div>
        </Modal>
        <p>Login as admin first!</p>
      </div>
    ) : (
      <>
        <div className="analytics">
          {tokenDataLoading || allNftDataLoading ? (
            <div className="tokenDataLoading">
              tokenDataLoading...
            </div>
          ) : (
            <MembershipAnalytics
              tokenInfo={tokenData}
              updateTokenData={updateData}
              balance={allNftData?.length ?? 0}
            />
          )}
        </div>

        <div className="mt-8">
          <h3>
            Membership Menage Tools
          </h3>

          <MembershipMenageTools 
            userWalletId={pairingData?.accountIds[0]}
            membershipTokenInfo={tokenData}
            updateTokenData={updateData}
            serials={serials}  
          />

          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        </div>
      </>
    )
  ), [isAdmin, isOpen, tokenDataLoading, allNftDataLoading, tokenData, updateData, allNftData?.length, pairingData?.accountIds, serials])

  return (
    connectionState === HashConnectConnectionState.Paired ? (
      <div>
        {pairedAccountContent}
      </div>
    ) : (
      <div>
        Connect with HashPack first!
      </div>
    )
  )
}
