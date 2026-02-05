import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Slot, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import { Coins, FileTextIcon, Home, LogOut } from "lucide-react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { UsuarioProvider, useUsuario } from "../context/UsuarioContext";
import { ProgressProvider } from "../hooks/useProgress";

SplashScreen.preventAutoHideAsync();

function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();
  const { usuario } = useUsuario();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const isDiretoria = ["Diretor", "Conselheiro", "Diretoria"].includes(
    usuario?.cargo || "",
  );

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Águia Real</Text>
          <Text style={styles.drawerSubtitle}>
            {isDiretoria ? "Painel Administrativo" : "Área do Desbravador"}
          </Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.footer}>
        <DrawerItem
          label="Sair da Conta"
          labelStyle={{ color: "#8B0000", fontWeight: "bold" }}
          icon={({ size }) => <LogOut size={size} color="#8B0000" />}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

function AppNavigation() {
  const { isReady, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    // Converte para array de strings para evitar o erro "types 1 | 2 and 0 have no overlap"
    const segs = segments as unknown as string[];
    const inAuthGroup = segs[0] === "auth";

    if (!user && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (
      user &&
      (inAuthGroup || segs.length === 0 || segs[0] === "index")
    ) {
      router.replace("/(tabs)");
    }
    SplashScreen.hideAsync();
  }, [user, isReady, segments]);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ffd700" />
      </View>
    );
  }

  if (!user) return <Slot />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: "#8B0000" },
          headerTintColor: "#fff",
          drawerActiveTintColor: "#8B0000",
        }}
      >
        {/* Rota principal das Tabs */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Início",
            title: "Clube Águia Real",
            drawerIcon: ({ color }) => <Home size={22} color={color} />,
          }}
        />
        <Drawer.Screen
          name="extrato_unidade"
          options={{
            drawerLabel: "Financeiro",
            title: "Extrato da Unidade",
            drawerIcon: ({ color }) => <FileTextIcon size={22} color={color} />,
          }}
        />

        {/* Admin/Tesouraria */}
        <Drawer.Screen
          name="(admin)/gerenciar_realitos"
          options={{
            drawerLabel: "Financeiro",
            title: "Tesouraria",
            drawerIcon: ({ color }) => <Coins size={22} color={color} />,
          }}
        />

        {/* REMOÇÃO DAS ROTAS "LIXO": O segredo é mapear exatamente o que aparece na sua imagem */}
        <Drawer.Screen
          name="index"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="auth"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="classesStack"
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="cadastro"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="login"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="recuperar"
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <UsuarioProvider>
        <ProgressProvider>
          <AppNavigation />
        </ProgressProvider>
      </UsuarioProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8B0000",
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: "#8B0000",
    marginBottom: 10,
    paddingTop: 60,
  },
  drawerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  drawerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 4,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 30,
  },
});
