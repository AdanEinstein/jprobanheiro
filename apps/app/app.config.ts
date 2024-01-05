import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  "name": "jPRO.Banheiro",
  "slug": "jPROBanheiro",
  "scheme": "jPRO.Banheiro",
  "version": "1.0.0",
  "userInterfaceStyle": "automatic",
  "assetBundlePatterns": [
    "**/*"
  ],
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#FFF"
  },
  icon: "./assets/icon.png",
  "android": {
    "package": "com.adaneinstein.jPRO.Banheiro",
  },
  "ios": {
    "bundleIdentifier": "com.adaneinstein.jPRO.Banheiro"
  },
  "web": {
    "bundler": "metro"
  },
  "experiments": {
    "tsconfigPaths": false,
    "typedRoutes": true
  },
  "extra": {
    "eas": {
      "projectId": "792da15f-afda-42e8-8646-b40fa29b649a"
    }
  },
  plugins: [
    "expo-router",
    "./plugins/trust-local-certs.js",
    [
      "expo-barcode-scanner",
      {
        "cameraPermission": "Permitir o acesso a câmera"
      }
    ]
  ]
});
