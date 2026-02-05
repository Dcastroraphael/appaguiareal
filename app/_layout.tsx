import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Slot, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import {
  CheckCircle,
  Coins,
  Home,
  LogOut,
  Wallet
} from "lucide-react-native";
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
  const { usuario } = useUsuario();
  const segments = useSegments() as string[];
  const router = useRouter();

  const isDiretoria = ["Diretor", "Conselheiro", "Diretoria"].includes(
    usuario?.cargo || "",
  );

  useEffect(() => {
    if (!isReady) return;
    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (
      user &&
      (inAuthGroup || segments.length === 0 || segments[0] === "index")
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
          drawerActiveBackgroundColor: "#FDEAEA",
        }}
      >
        {/* --- ITENS VISÍVEIS (O que aparece no menu) --- */}

        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Início",
            title: "Clube Águia Real",
            drawerIcon: ({ color }) => <Home size={22} color={color} />,
          }}
        />

        <Drawer.Screen
          name="(admin)/gerenciar_realitos"
          options={{
            drawerLabel: isDiretoria ? "Banco (Gestão)" : "Meu Saldo",
            title: isDiretoria ? "Tesouraria" : "Extrato",
            drawerIcon: ({ color }) =>
              isDiretoria ? (
                <Coins size={22} color={color} />
              ) : (
                <Wallet size={22} color={color} />
              ),
          }}
        />

        <Drawer.Screen
          name="(admin)/validar_requisitos"
          options={{
            drawerLabel: "Validar Requisitos",
            title: "Assinar Classes",
            drawerItemStyle: { display: isDiretoria ? "flex" : "none" },
            drawerIcon: ({ color }) => <CheckCircle size={22} color={color} />,
          }}
        />

        {/* --- ITENS OCULTOS (Essenciais para o Router não mostrar lixo) --- */}
        <Drawer.Screen
          name="index"
          options={{ drawerItemStyle: { display: "none" }, title: "" }}
        />
        <Drawer.Screen
          name="auth"
          options={{ drawerItemStyle: { display: "none" }, title: "" }}
        />
        <Drawer.Screen
          name="classesStack"
          options={{
            drawerItemStyle: { display: "none" },
            headerShown: false,
            title: "",
          }}
        />

        {/* Telas Admin Ocultas do Menu Principal */}
        <Drawer.Screen
          name="(admin)/unidades"
          options={{ drawerItemStyle: { display: "none" }, title: "Unidades" }}
        />
        <Drawer.Screen
          name="(admin)/novo_evento"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Novo Evento",
          }}
        />
        <Drawer.Screen
          name="(admin)/novo_aviso"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Novo Aviso",
          }}
        />
        <Drawer.Screen
          name="(admin)/membros-unidade"
          options={{ drawerItemStyle: { display: "none" }, title: "Membros" }}
        />
        <Drawer.Screen
          name="(admin)/gerenciar-membros"
          options={{
            drawerItemStyle: { display: "none" },
            title: "Gerenciar Membros",
          }}
        />
        <Drawer.Screen
          name="(admin)/gerenciar_progresso"
          options={{ drawerItemStyle: { display: "none" }, title: "Progresso" }}
        />
        <Drawer.Screen
          name="modal"
          options={{ drawerItemStyle: { display: "none" }, title: "" }}
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
