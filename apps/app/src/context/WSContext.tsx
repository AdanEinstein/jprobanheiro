import { Client, ClientStatus } from "../types";
import useWS from "../hooks/useWS";
import { Context, Dispatch, PropsWithChildren, SetStateAction, createContext, useContext } from "react";

interface IWSContext {
  clients: Client[],
  connectionStatus: string,
  enterQueue: (txt: string) => void,
  leaveQueue: () => void,
  loading: boolean,
  refreshClients: () => void,
  updateQueue: (status: ClientStatus) => () => void
  id: string,
  wsUrl: string,
  setWsUrl: Dispatch<SetStateAction<string>>,
  showCamera: boolean,
  setShowCamera: Dispatch<SetStateAction<boolean>>,
  handleBarCodeScanned: ({ type, data }: {
    type: any;
    data: any;
  }) => void
}

const WSContext = createContext({})

export default function WSProvider({ children }: PropsWithChildren) {
  const { clients,
    connectionStatus,
    enterQueue,
    loading,
    refreshClients,
    leaveQueue,
    id,
    updateQueue,
    setWsUrl,
    wsUrl,
    handleBarCodeScanned,
    showCamera,
    setShowCamera } = useWS()

  return (
    <WSContext.Provider value={{
      clients,
      connectionStatus,
      enterQueue,
      loading,
      refreshClients,
      leaveQueue,
      id,
      updateQueue,
      wsUrl,
      setWsUrl,
      handleBarCodeScanned,
      showCamera,
      setShowCamera
    }}>
      {children}
    </WSContext.Provider>
  )
}

export const useWSContext = () => useContext<IWSContext>(WSContext as Context<IWSContext>)