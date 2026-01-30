import { View, type ViewProps } from "react-native";
import { useThemeColor } from "../hooks/use-theme-color";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  // Chamada do hook corrigida para buscar a chave "background" do seu Colors
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  // Unimos a cor do tema com os estilos passados via props
  // O backgroundColor do tema vem primeiro, mas o 'style' externo pode sobrescrevê-lo se necessário
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
