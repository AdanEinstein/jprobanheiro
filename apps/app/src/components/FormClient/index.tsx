import { useWSContext } from '../../context/WSContext'
import { RefObject, forwardRef, useImperativeHandle, useState } from 'react'
import { Button } from 'tamagui'
import { H2, Input, Stack, Sheet as TamaguiSheet } from 'tamagui'

export type FormClientAttributes = {
  open: () => void
}

function FormClient({}: any, ref: RefObject<FormClientAttributes>) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const {enterQueue} = useWSContext()

  useImperativeHandle(ref, () => ({
    open: handleOpen
  }))

  const handleOpen = () => setOpen(!open)

  return (
    <TamaguiSheet
      modal
      open={open}
      onOpenChange={setOpen}
      dismissOnSnapToBottom
      animation="medium"
      zIndex={100_000}
    >
      <TamaguiSheet.Overlay />
      <TamaguiSheet.Handle />
      <TamaguiSheet.Frame padding="$4" space="$5">
        <Stack
          f={1}
          borderColor="$blue10Dark"
          borderWidth="$1"
          borderRadius="$5"
          p="$5"
          gap="$3"
        >
          <H2>Nome</H2>
          <Input
            size="$5"
            placeholder="Informe seu nome"
            onChangeText={setName}
          />
          <Button
            color="$blue10Dark"
            onPress={() => {
              enterQueue(name)
              setOpen(false)
            }}
          >
            Entrar na fila
          </Button>
        </Stack>
      </TamaguiSheet.Frame>
    </TamaguiSheet>
  )
}

export default forwardRef(FormClient)