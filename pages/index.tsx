import { Hbar, Transaction } from '@hashgraph/sdk';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import useValidMembershipChecker from '@/hooks/useValidMembershipChecker';
import HTS from '@/services/HTS';
import MirrorNode from '@/services/MirrorNode';
import useFetch from '@/hooks/useFetch';
import useHashConnectContext from '@/hooks/useHashConnectContext';
import Button from '@/components/shared/Button';
import DEFAULT_ADMIN_ACCOUNT_ID from '@/const/DefaultAdminAccountId';
import DEFAULT_MEMBERSHIP_TOKEN_ID from '@/const/DefaultMembershipTokenId';

const MEMBERSHIP_TOKEN_ID = process.env.NEXT_PUBLIC_MEMBERSHIP_TOKEN_ID ?? DEFAULT_MEMBERSHIP_TOKEN_ID

export default function Home() {
  const { pairingData, sendTransaction, hashConnect } = useHashConnectContext()

  const fetchAvaibleNFTsToMint = useCallback(async () => (
    await MirrorNode.fetchAllNFTs({
      accountIdOrAliasOrEvmAddress: process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_ID ?? DEFAULT_ADMIN_ACCOUNT_ID,
      tokenId: MEMBERSHIP_TOKEN_ID
    })
  ), [])

  const [ avaibleNFTsToMintData, updateAvaibleNFTsToMintData, loadingAvaibleNFTsToMintData ] = useFetch(fetchAvaibleNFTsToMint)
  
  const buyMembership = useCallback(async () => {
    try {
      if (!pairingData?.accountIds[0]) {
        throw new Error('No connected user ID!')
      }

      if (!avaibleNFTsToMintData || avaibleNFTsToMintData.length <= 0) {
        throw new Error('No memberships avaible!')
      }
      
      const provider = hashConnect.getProvider(pairingData.network, pairingData.topic, pairingData?.accountIds[0])
      const signer = hashConnect.getSigner(provider)

      const associationStatus = await MirrorNode.checkAssociationStatus(
        MEMBERSHIP_TOKEN_ID,
        pairingData.accountIds[0]
      )

      if (!associationStatus) {
        const approvalTx = HTS.tokenAssociate(pairingData?.accountIds[0], MEMBERSHIP_TOKEN_ID)
        
        const approvalSignedTransaction = await signer.signTransaction(approvalTx)
        await sendTransaction(approvalSignedTransaction, true)
      }

      const buyTransaction = HTS.sendNFT(pairingData.accountIds[0], {
        hbarTransfers: [
          {
            accountId: pairingData.accountIds[0],
            amount: new Hbar(-parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE ?? '200'))
          },
          {
            accountId: process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_ID ?? DEFAULT_ADMIN_ACCOUNT_ID,
            amount: new Hbar(parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE ?? '200'))
          }
        ],
        nftTransfers: [
          {
            tokenId: MEMBERSHIP_TOKEN_ID,
            sender: process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_ID ?? DEFAULT_ADMIN_ACCOUNT_ID,
            recipient: pairingData.accountIds[0],
            serial: avaibleNFTsToMintData[0].serial_number
          }
        ]
      })

      const { data: { txBytes } } = await axios.post<{ txBytes: { data: Uint8Array, type: string } }>('/api/signTransaction', {
        bytes: Object.values(buyTransaction.toBytes())
      })

      const signed = Transaction.fromBytes(Uint8Array.from(Object.values(txBytes.data)))

      const buyResponse = await sendTransaction(signed, false);

      if (!buyResponse) {
        throw new Error('Token mint failed.');
      } else {
        toast.success(`You have bought membership!`)
        await updateAvaibleNFTsToMintData()
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error('Problem while buying membership!')
      }
    }
  }, [avaibleNFTsToMintData, hashConnect, pairingData?.accountIds, pairingData?.network, pairingData?.topic, sendTransaction, updateAvaibleNFTsToMintData])

  const [isValidMembership,, isValidMembershipLoading] = useValidMembershipChecker(pairingData?.accountIds[0], MEMBERSHIP_TOKEN_ID)

  const pageContent = useMemo(() => (
    loadingAvaibleNFTsToMintData ? (
      <div className="loader">
        Loading...
      </div>
    ) : (
      <>
        <div className="mb-4 ml-auto">
          <Button type='button' onClick={updateAvaibleNFTsToMintData} >
            Refresh data
          </Button>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              Our products
              <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                Browse a list of dApp GYM products designed to help you work and
                play, stay healthy, grow, and more.
              </p>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Memberships to buy
                </th>
                <th scope="col" className="px-6 py-3">
                  Membership price
                </th>
                <th scope="col" className="px-6 py-3">
                  Buy button
                </th>
                <th scope="col" className="px-6 py-3">
                  ---
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {avaibleNFTsToMintData?.length ?? 0}
                </th>
                <td className="px-6 py-4">
                  {parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE ?? "0")}ℏ
                </td>
                <td className="px-6 py-4">
                  {isValidMembershipLoading ? (
                    <p>Checking for active membership...</p>
                  ) : (
                    <Button
                      disabled={!!isValidMembership}
                      onClick={buyMembership}
                      type='button'
                    >
                      {isValidMembership ? "You already has membership" : "Buy"}
                    </Button>
                  )}
                </td>
                <td className="px-6 py-4">
                  {isValidMembership && (
                    <>
                      <Link href="/enterance">
                        <Button>Enterance</Button>
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  ), [loadingAvaibleNFTsToMintData, updateAvaibleNFTsToMintData, avaibleNFTsToMintData?.length, isValidMembershipLoading, isValidMembership, buyMembership])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col'>
        {typeof pairingData?.accountIds[0] !== 'string' || pairingData.accountIds[0] === '' ? (
          <div>
            Connect wallet first!
          </div>
        ) : (
          pageContent
        )}
      </div>
    </>
  )
}
