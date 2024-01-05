import { Platform, StyleSheet } from "react-native";
import { Button, Text, YStack } from "tamagui";
import QRCode from 'react-qr-code';
import { useWSContext } from "../../context/WSContext";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera, CameraOff } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Dialog } from "tamagui";

export default function QRCodeConnect() {
  const { wsUrl, handleBarCodeScanned, showCamera, setShowCamera } = useWSContext()

  if (Platform.OS == 'web') {
    return (
      <YStack
        pos="absolute"
        t={10}
        r={10}
        justifyContent="center"
        alignItems="center"
        $md={{
          display: "none"
        }}
      >
        <QRCode
          value={wsUrl}
          size={100}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
        <Text>Conecte-se</Text>
      </YStack>
    )
  }
  return (
    <>
      <Dialog
        modal
        open={showCamera}
        onOpenChange={(open) => {
          setShowCamera(open)
        }}

      >
        <Dialog.Trigger asChild>
          <Button circular={!!showCamera} icon={showCamera ? <CameraOff /> : <Camera />}>
            {!showCamera && "Escanear QRCode"}
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={['transform', 'opacity']}
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4">
            <Dialog.Title>Conecte-se</Dialog.Title>
            <Dialog.Description>Escaneie o QRCode para conectar</Dialog.Description>
            <YStack
              justifyContent="center"
              alignItems="center"
            >
              {showCamera && (
                <BarCodeScanner
                  style={{
                    height: 400,
                    width: 300
                  }}
                  onBarCodeScanned={showCamera && handleBarCodeScanned}
                />
              )}
            </YStack>
            <Dialog.Close displayWhenAdapted asChild>
              <Button>
                Fechar
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

    </>
  )
}