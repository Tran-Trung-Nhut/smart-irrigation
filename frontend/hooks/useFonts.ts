import { useFonts } from "expo-font";

export default function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
  });

  return fontsLoaded;
}
