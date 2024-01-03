import { Client, ClientStatus } from "../types";
import useWS from "../hooks/useWS";
import { Context, PropsWithChildren, createContext, useContext } from "react";

interface IWSContext {
  clients: Client[], 
  connectionStatus: string, 
  enterQueue: (txt: string) => void, 
  leaveQueue: () => void, 
  loading: boolean, 
  refreshClients: () => void,
  updateQueue: (status: ClientStatus) => () => void
  id: string
}

const WSContext = createContext({})

export default function WSProvider({ children }: PropsWithChildren) {
  const { clients, connectionStatus, enterQueue, loading, refreshClients, leaveQueue, id, updateQueue } = useWS()
  return (
    <WSContext.Provider value={{
      clients, connectionStatus, enterQueue, loading, refreshClients, leaveQueue, id, updateQueue
    }}>
      {children}
    </WSContext.Provider>
  )
}

export const useWSContext = () => useContext<IWSContext>(WSContext as Context<IWSContext>)