import { useEffect, useRef } from "react";
import { Button, Circle, H1, H2, H3, Separator, Text, XStack, YStack } from "tamagui";
import { Plus, RefreshCcw } from '@tamagui/lucide-icons';
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { RefreshControl } from "react-native";
import FormClient, { FormClientAttributes } from "../components/FormClient";
import { useWSContext } from "../context/WSContext";
import { Swipeable } from "react-native-gesture-handler";
import { ClientStatus } from "../types";
import QRCodeConnect from "../components/QRCode";
import { SafeAreaView } from "react-native-safe-area-context";
import { H6 } from "tamagui";

export default function Index() {
  const { height } = Dimensions.get('window')
  const formRef = useRef<FormClientAttributes>(null)
  const { connectionStatus, clients, loading, refreshClients, leaveQueue, id, updateQueue, wsUrl } = useWSContext()

  return (
    <SafeAreaView>
      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshClients} />
        }
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => item.id == id ? (
              <XStack
                f={1}
                justifyContent="space-between"
                alignItems="center"
                marginHorizontal="$3"
                space
              >
                <XStack f={1}
                  p="$4"
                  bg={item.status == ClientStatus.USING ? "$green10Dark" : "$yellow9Dark"}
                  borderColor={item.status == ClientStatus.USING ? "$green10Dark" : "$yellow9Dark"}
                  borderWidth="$1"
                  justifyContent="center"
                  borderRadius="$5"
                >
                  <TouchableOpacity onPress={updateQueue(item.status == ClientStatus.USING ? ClientStatus.WAITING : ClientStatus.USING)}>
                    <XStack>
                      <Text fontSize="$7" themeInverse>
                        {item.status == ClientStatus.USING ? "UTILIZANDO" : "ESPERANDO"}
                      </Text>
                    </XStack>
                  </TouchableOpacity>
                </XStack>
                <XStack f={1}
                  bg="$red10Dark"
                  borderColor="$red10Dark"
                  borderWidth="$1"
                  borderRadius="$5"
                  p="$4"
                  justifyContent="center"
                >
                  <TouchableOpacity onPress={leaveQueue}>
                    <XStack>
                      <Text fontSize="$7" themeInverse>
                        SAIR
                      </Text>
                    </XStack>
                  </TouchableOpacity>
                </XStack>
              </XStack>
            ) : null}
          >
            <XStack
              bg={item.id == id ? "$blue10Dark" : item.status == ClientStatus.USING ? "$green10Dark" : "$yellow9Dark"}
              borderRadius="$5"
              p="$4"
              marginHorizontal="$3"
            >
              <Text fontSize="$8" ellipsizeMode="tail" numberOfLines={1} themeInverse>{item.name}</Text>
            </XStack>
          </Swipeable>
        )}
        ListHeaderComponent={(
          <YStack mt={20} f={1} space justifyContent="center" alignItems="center" mb="$5">
            <QRCodeConnect />
            <H1 color="$blue10Dark">jPRO.Banheiro</H1>
            <H3>Status da conexão: {connectionStatus}</H3>
            <H6>URL: "{wsUrl}"</H6>
            <Separator />
            {!clients.some(c => c.id == id) && (
              <XStack f={1} paddingHorizontal="$4">
                <Button
                  color="$blue10Dark"
                  f={1}
                  iconAfter={<Plus size={"$size.2"} />}
                  onPress={() => {
                    formRef.current?.open()
                  }}
                >Entrar na fila</Button>
              </XStack>
            )}
            <XStack f={1} justifyContent="space-between" paddingHorizontal="$4" space="$2">
              <XStack space="$2" f={1}>
                <Circle size={"$1"} bg={"$yellow9Dark"} />
                <Text>Esperando</Text>
              </XStack>
              <XStack space="$2" f={1}>
                <Circle size={"$1"} bg={"$green10Dark"} />
                <Text>Utilizando</Text>
              </XStack>
              <XStack space="$2" f={1}>
                <Circle size={"$1"} bg={"$blue10Dark"} />
                <Text>Você</Text>
              </XStack>
            </XStack>
          </YStack>
        )}
        ItemSeparatorComponent={() => (
          <Separator marginVertical="$2" />
        )}
        ListEmptyComponent={() => (
          <YStack h={height - 500} justifyContent="center" alignItems="center">
            <YStack space>
              <H2>Nada para listar</H2>
              <Button icon={<RefreshCcw />}
                onPress={refreshClients}
              >Recarregar</Button>
            </YStack>
          </YStack>
        )}
      />
      <FormClient ref={formRef} />

    </SafeAreaView>
  )
}