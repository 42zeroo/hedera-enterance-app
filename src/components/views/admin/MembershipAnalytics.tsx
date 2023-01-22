import Button from "@/components/shared/Button";
import { TokenInfo } from "@/entity/NFTInfo";
import React, { useMemo } from "react";

type MembershipAnalyticsProps = {
  tokenInfo: TokenInfo | null;
  balance: number;
  updateTokenData: () => Promise<void>;
};

export default function MembershipAnalytics({
  tokenInfo,
  updateTokenData,
  balance,
}: MembershipAnalyticsProps) {
  const soldTokens = useMemo(() => (
    parseInt(tokenInfo?.total_supply ?? '0') - (balance ?? 0)
  ), [balance, tokenInfo?.total_supply])

  return (
    <div className="flex flex-col">
      <div className="mb-4 ml-auto">
        <Button onClick={updateTokenData}>Refresh data</Button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Membership token ID:
              </th>
              <th scope="col" className="px-6 py-3">
                Minted tokens:
              </th>
              <th scope="col" className="px-6 py-3">
                Sold tokens:
              </th>
              <th scope="col" className="px-6 py-3">
                Tokens to be sold
              </th>
              <th scope="col" className="px-6 py-3">
                HBAR earned
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {tokenInfo?.token_id}
              </th>
              <td className="px-6 py-4">{tokenInfo?.total_supply}</td>
              <td className="px-6 py-4">{soldTokens}</td>
              <td className="px-6 py-4">{balance}</td>
              <td className="px-6 py-4">
                {soldTokens *
                  parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE ?? "200")}
                ℏ
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
