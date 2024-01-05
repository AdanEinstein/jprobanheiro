import { Client, ClientStatus, Message, MessageType } from "../types";
import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import uuid from "react-native-uuid";
import * as Notifications from 'expo-notifications'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Alert } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function useWS() {
  const [wsUrl, setWsUrl] = useState<string>(process.env.EXPO_PUBLIC_WEB_SOCKET_URL)
  const [id, setID] = useState(uuid.v4())
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false)

  const { sendJsonMessage, readyState } = useWebSocket(wsUrl, {
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
  }, [wsUrl])

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

  useEffect(() => {
    const client = clients.find(c => c.id == id)
    const isThisTurn = clients.find((_, i) => i == 0)?.id == id
    if (isThisTurn) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: `Psiu, ${client.name}`,
          body: 'Está na sua vez de ir ao banheiro',
        },
        trigger: null,
      });
    }
  }, [clients, wsUrl])

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = useCallback(({ type, data }) => {
    setWsUrl(data)
    if (showCamera) {
      setShowCamera(false)
      Alert.alert("QRCode escaneado com sucesso!")
    }
  }, [showCamera]);

  return {
    clients, enterQueue, refreshClients, connectionStatus, loading, leaveQueue, id, updateQueue, wsUrl, setWsUrl, handleBarCodeScanned, showCamera, setShowCamera
  }
}