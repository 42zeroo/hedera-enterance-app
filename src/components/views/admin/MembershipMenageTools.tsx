import React, { useCallback } from "react";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import { reverse, slice } from "lodash";
import { toast } from "react-hot-toast";
import Button from "@/components/shared/Button";
import { InputWithField } from "@/components/shared/Input";
import { TokenInfo } from "@/entity/NFTInfo";
import useHashConnectContext from "@/hooks/useHashConnectContext";
import HTS from "@/services/HTS";
import MirrorNode from "@/services/MirrorNode";
import Card from "@/components/shared/Card";

type MembershipMenageToolsProps = {
  userWalletId?: string;
  membershipTokenInfo: TokenInfo | null
  updateTokenData: () => Promise<void>
  serials: number[] | null
};

const MembershipMenageTools = ({
  userWalletId,
  membershipTokenInfo,
  updateTokenData,
  serials
}: MembershipMenageToolsProps) => {
  const { sendTransaction } = useHashConnectContext()
  
  const handleBurn = useCallback(async (values: FormikValues, { resetForm }: FormikHelpers<{ burn_amount: number }>) => {
    try {   
      if (!membershipTokenInfo?.token_id || !userWalletId) {
        throw new Error('No token ID or connected user ID!')
      }
      
      if (parseInt(values.burn_amount) <= 0) {
        throw new Error('You can only burn more than 1 token!')
      }

      const serialsToRemove = slice(reverse(serials || []), 0, values.burn_amount)
      
      const mintTransaction = HTS.burnToken(membershipTokenInfo?.token_id, userWalletId, serialsToRemove)

      const tokenMintResponse = await sendTransaction(mintTransaction);

      if (!tokenMintResponse) {
        throw new Error('Token mint failed.');
      } else {
        toast.success(`You have burned ${ values.mint_amount } NFT(s)!`)
        resetForm()
        await updateTokenData()
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error('Problem while minting NFTS!')
      }
    }
  }, [membershipTokenInfo?.token_id, sendTransaction, serials, updateTokenData, userWalletId]);

  const handleMint = useCallback(async (values: FormikValues, { resetForm }: FormikHelpers<{ mint_amount: number }>) => {
    try {
      if (!membershipTokenInfo?.token_id || !userWalletId) {
        throw new Error('No token ID or connected user ID!')
      }
  
      if (parseInt(values.mint_amount) <= 0) {
        throw new Error('You can only mint more than 1 token!')
      }

      const nft = await MirrorNode.fetchNft(membershipTokenInfo?.token_id, 1)
      const cid = nft.metadata.replace('ipfs://', '')

      // copy uploaded metadata CID to have same length as minting NFT qty
      const metaCIDs = Array.from(new Array(parseInt(values.mint_amount))).map(() =>
        cid
      )
      
      const mintTransaction = HTS.mintToken(membershipTokenInfo?.token_id, userWalletId, metaCIDs)
      
      const tokenMintResponse = await sendTransaction(mintTransaction);

      if (!tokenMintResponse) {
        throw new Error('Token mint failed.');
      } else {
        toast.success(`You have minted ${ values.mint_amount } NFT(s)!`)
        resetForm()
        await updateTokenData()
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error('Problem while minting NFTS!')
      }
    }
  }, [membershipTokenInfo?.token_id, updateTokenData, sendTransaction, userWalletId]);

  return !userWalletId ? (
    <div>No connected user id!</div>
  ) : (
    <div className='flex flex-col md:flex-row gap-4'>
      <div className="flex align-end">
        <Formik initialValues={{ mint_amount: 0 }} onSubmit={handleMint}>
          <Form>
            <Card title='Mint'>
              <div className='flex'>
                <div>
                  <label
                    htmlFor="burn_amount"
                    className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Mint more membership tokens:
                  </label>
                  <InputWithField
                    name="mint_amount"
                    id="burn_amount"
                    type="number"
                  />
                </div>
                <Button className='ml-2' type='submit'>Mint</Button>
              </div>
            </Card>
          </Form>
        </Formik>
      </div>
      <div className="flex align-end">
        <Formik initialValues={{ burn_amount: 0 }} onSubmit={handleBurn}>
          <Form>
            <Card title='Burn'>
              <div className='flex'>
                <div>
                  <label
                    htmlFor="burn_amount"
                    className="block mb-2 text-sm font-medium text-gray-700"
                    >
                    Burn membership tokens:
                  </label>
                  <InputWithField name="burn_amount" id="burn_amount" type="number" />
                </div>
                <Button className='ml-2' type='submit'>Burn</Button>
              </div>
            </Card>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default MembershipMenageTools;
