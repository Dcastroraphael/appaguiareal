import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  useColorScheme,
} from "react-native";
import { Colors } from "../constants/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "success" | "outline";
  loading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  loading,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // Define as cores com base na variante
  const getVariantStyle = () => {
    switch (variant) {
      case "success":
        return { backgroundColor: theme.success };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.tint,
        };
      default:
        return { backgroundColor: theme.tint };
    }
  };

  const getTextStyle = () => {
    if (variant === "outline") return { color: theme.tint };
    return { color: "#ffffff" };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? theme.tint : "#fff"}
        />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginVertical: 8,
    // Sombra leve para destacar
    elevation: 2,
    shadowColor: "#500d0d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
