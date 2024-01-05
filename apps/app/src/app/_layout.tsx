import { Slot } from 'expo-router';
import { useFonts } from "expo-font";
import { TamaguiProvider } from 'tamagui';
import config from '../../tamagui.config';
import WSProvider from '../context/WSContext';

export default function Layout() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  return (
    <TamaguiProvider config={config}>
      <WSProvider>
        <Slot />
      </WSProvider>
    </TamaguiProvider>
  )
}