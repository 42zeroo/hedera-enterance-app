import { useCallback, useEffect } from "react";
import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/esm/types";
import { toast } from "react-hot-toast";

const useHashConnectEvents = (
  hashConnect: HashConnect,
  setFoundExtension: React.Dispatch<React.SetStateAction<HashConnectTypes.WalletMetadata | null>>,
  setPairingData: React.Dispatch<React.SetStateAction<MessageTypes.ApprovePairing | null>>,
  setConnectionState: React.Dispatch<React.SetStateAction<HashConnectConnectionState | null>>,
) => {
  const pairingEvent = useCallback((pairingEvent: MessageTypes.ApprovePairing) => {
    setPairingData(pairingEvent)

    toast.success(`Connected to ${ pairingEvent.pairingData?.accountIds[0] }`)
  }, [setPairingData])
  
  const foundExentsionEvent = useCallback((walletData: HashConnectTypes.WalletMetadata) => {
    setFoundExtension(walletData)
  }, [setFoundExtension])
  
  const connectionStatusChangeEvent = useCallback((connectionState: HashConnectConnectionState) => {
    setConnectionState(connectionState)
  }, [setConnectionState])

  const initEvents = useCallback(() => {
    hashConnect.pairingEvent.on(pairingEvent)
    
    hashConnect.foundIframeEvent.on(foundExentsionEvent)
    hashConnect.foundExtensionEvent.on(foundExentsionEvent)

    hashConnect.connectionStatusChangeEvent.on(connectionStatusChangeEvent)
  }, [
    connectionStatusChangeEvent,
    foundExentsionEvent,
    pairingEvent,
    hashConnect.connectionStatusChangeEvent,
    hashConnect.foundExtensionEvent,
    hashConnect.foundIframeEvent,
    hashConnect.pairingEvent
  ])

  const removeEvents = useCallback(() => {
    hashConnect.pairingEvent.off(pairingEvent)
    
    hashConnect.foundIframeEvent.off(foundExentsionEvent)
    hashConnect.foundExtensionEvent.off(foundExentsionEvent)

    hashConnect.connectionStatusChangeEvent.off(connectionStatusChangeEvent)
  }, [
    connectionStatusChangeEvent,
    foundExentsionEvent,
    pairingEvent,
    hashConnect.connectionStatusChangeEvent,
    hashConnect.foundExtensionEvent,
    hashConnect.foundIframeEvent,
    hashConnect.pairingEvent
  ])
  
  useEffect(() => {
    initEvents()

    return removeEvents
  }, [initEvents, removeEvents])
}

export default useHashConnectEvents