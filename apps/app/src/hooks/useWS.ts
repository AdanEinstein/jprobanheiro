import { Client, ClientStatus, Message, MessageType } from "../types";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import uuid from "react-native-uuid";

export default function useWS() {
  const [id, setID] = useState(uuid.v4())
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)

  const { sendJsonMessage, readyState } = useWebSocket(process.env.EXPO_PUBLIC_WEB_SOCKET_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    onMessage(event) {
      const clientsResp: Client[] = JSON.parse(event.data)
      setClients(clientsResp)
    },
    onClose(event) {
      console.log({ event });
      setClients([])
    },
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    refreshClients()
  }, [])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Conectando',
    [ReadyState.OPEN]: 'Aberta',
    [ReadyState.CLOSING]: 'Fechando',
    [ReadyState.CLOSED]: 'Fechada',
    [ReadyState.UNINSTANTIATED]: 'Não estabelecida',
  }[readyState];

  const refreshClients = () => {
    try {
      setLoading(true)
      sendJsonMessage({
        type: MessageType.REFRESH,
      })
    } finally {
      setLoading(false)
    }
  }

  const enterQueue = useCallback((txt: string) => {
    sendJsonMessage({
      type: MessageType.ENTER,
      client: {
        id: id,
        name: txt,
        status: ClientStatus.WAITING
      } as Client
    })
  }, [id, clients])

  const leaveQueue = useCallback(() => {
    sendJsonMessage({
      type: MessageType.LEAVE,
      client: {
        id
      }
    } as Message)
  }, [id, clients])

  const updateQueue = useCallback((status: ClientStatus) => {
    return () => {
      const client = clients.find(c => c.id == id) as Client
      sendJsonMessage({
        type: MessageType.UPDATE,
        client: {
          ...client,
          status: status
        }
      } as Message)
    }
  }, [id, clients])


  return {
    clients, enterQueue, refreshClients, connectionStatus, loading, leaveQueue, id, updateQueue
  }
}