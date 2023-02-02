import { createContext, useCallback, useEffect, useState } from "react"
import { ContractCallQuery, Query, Transaction, TransactionReceipt, TransactionResponse } from "@hashgraph/sdk";
import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/esm/types";
import last from "lodash/last";
import toast from "react-hot-toast";
import { SigningService } from "@/services/SigningService";
import { appMetadata } from "@/const/HashConnectData";
import useHashConnectEvents from "@/hooks/useHashConnectEvents";

const HEDERA_API_VERSION = 'testnet'
const HASH_CONNECT_DEBUG_MODE = true

const hashConnect = new HashConnect(HASH_CONNECT_DEBUG_MODE);

interface HashConnectContextProps {
  foundExtension: HashConnectTypes.WalletMetadata | null
  connectionState: HashConnectConnectionState | null
  pairingData: MessageTypes.ApprovePairing | null
  hashConnect: HashConnect
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  sendTransaction: (tx: Transaction | ContractCallQuery, signWithHashPack?: boolean) => Promise<TransactionReceipt | null>
}

export const HashConnectContext = createContext<HashConnectContextProps>({
  foundExtension: null,
  connectionState: null,
  pairingData: null,
  hashConnect: hashConnect,
  connect: async () => {},
  disconnect: async () => {},
  sendTransaction: async () => null
})

const useHashConnect = () => {
  const [foundExtension, setFoundExtension] = useState<HashConnectTypes.WalletMetadata | null>(null)
  const [pairingData, setPairingData] = useState<MessageTypes.ApprovePairing | null>(null)
  const [connectionState, setConnectionState] = useState<HashConnectConnectionState | null>(null)

  useHashConnectEvents(
    hashConnect,
    setFoundExtension,
    setPairingData,
    setConnectionState
  )

  const initializeHashConnect = useCallback(async () => {
    try {
      const initData = await hashConnect.init(appMetadata, HEDERA_API_VERSION, false);

      const lastInitializedPairingData = last(initData.savedPairings)

      if (lastInitializedPairingData) {
        setPairingData(lastInitializedPairingData)
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
  }, [])

  const connect = useCallback(async () => {
    try {
      hashConnect.connectToLocalWallet()
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      if (pairingData?.topic) {
        await hashConnect.disconnect(pairingData?.topic)
        setPairingData(null)

        toast('See you next time! Wallet disconnected from dApp.', {
          icon: '👋',
        });
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
  }, [pairingData?.topic])

  const sendTransaction = useCallback(async (tx: Transaction | ContractCallQuery, signWithHashPack = true) => {
    if (!pairingData) {
      throw new Error('Loading logged Hedera account id Error.');
    }

    if (!signWithHashPack && tx instanceof ContractCallQuery) {
      throw new Error('You have to sign ContractCallQuery with HashPack!')
    }

    let response:
      | MessageTypes.TransactionResponse
      | TransactionResponse
      | undefined;

    let hashConnectTxBytes;

    if (!pairingData.topic) {
      throw new Error('Loading topic Error.');
    }

    console.log({tx, response:
      {
        topic: pairingData.topic,
        byteArray: hashConnectTxBytes,
        metadata: {
          accountToSign: pairingData.accountIds[0],
          returnTransaction: false,
        },
      }})

      hashConnectTxBytes = !signWithHashPack && tx instanceof Transaction ? (
        SigningService.makeBytes(tx, pairingData.accountIds[0])
      ) : (
        await tx.toBytes()
      );


    response = await hashConnect?.sendTransaction(
      pairingData.topic,
      {
        topic: pairingData.topic,
        byteArray: hashConnectTxBytes,
        metadata: {
          accountToSign: pairingData.accountIds[0],
          returnTransaction: false,
        },
      }
    );

    if (response?.receipt) {
      console.log({response})
      return TransactionReceipt.fromBytes(
        response.receipt as Uint8Array
      );
    } else {
      throw new Error('No transaction receipt found!');
    }
  }, [pairingData]);


  useEffect(() => {
    initializeHashConnect()
  }, [initializeHashConnect])

  return {
    foundExtension,
    connectionState,
    pairingData,
    hashConnect,
    connect,
    disconnect,
    sendTransaction
  }
}

export const HashConnectProvider = ({ children }: { children: React.ReactElement }) => {
  const hashConnectValues = useHashConnect()

  return (
    <HashConnectContext.Provider value={hashConnectValues} >
      {children}
    </HashConnectContext.Provider>
  )
}