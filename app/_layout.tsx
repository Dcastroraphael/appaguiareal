import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Slot, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import {
  Coins,
  Home,
  LogOut
} from "lucide-react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { UsuarioProvider } from "../context/UsuarioContext";

SplashScreen.preventAutoHideAsync();

// Mapeamento para títulos das páginas e controle de exibição
const nomesDasTelas: Record<string, string> = {
  index: "Início",
  "auth/login": "Entrar",
  "auth/cadastro": "Criar Conta",
  "auth/recuperar": "Recuperar Senha",
  "(admin)/unidades": "Gestão de Unidades",
  "(admin)/novo_evento": "Novo Evento",
  "(admin)/membros-unidade": "Membros da Unidade",
  "(admin)/gerenciar-membros": "Gerenciar Membros",
  "(admin)/gerenciar_progresso": "Progresso de Classes",
  "(admin)/gerenciar_realitos": "Banco dos Realitos",
  modal: "Modal",
  classesStack: "Classes",
  auth: "Autenticação",
};

function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Águia Real</Text>
          <Text style={styles.drawerSubtitle}>Painel Administrativo</Text>
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

    const segmentsList = (segments as string[]) || [];
    const isAuthRoute = segmentsList.some((s) =>
      ["auth", "login", "cadastro", "recuperar"].includes(s),
    );

    if (!user && !isAuthRoute) {
      router.replace("/auth/login");
    } else if (user && isAuthRoute) {
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
          headerTitleAlign: "center",
          overlayColor: "rgba(0,0,0,0.5)",
          drawerLabelStyle: { fontWeight: "600" },
        }}
      >
        {/* 1. Início (Aba principal do App) */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Início",
            title: "Clube Águia Real",
            drawerIcon: ({ color }) => <Home size={22} color={color} />,
          }}
        />

        {/* 2. Banco dos Realitos (Visível no Menu para Gestão) */}
        <Drawer.Screen
          name="(admin)/gerenciar_realitos"
          options={{
            drawerLabel: "Banco dos Realitos",
            title: "Tesouraria de Realitos",
            drawerIcon: ({ color }) => <Coins size={22} color={color} />,
          }}
        />

        {/* 3. Mapeamento Automático (Oculta do menu o que não for Início ou Realitos) */}
        {Object.entries(nomesDasTelas).map(([route, label]) => {
          // Evita duplicar o Início e o Banco que já definimos manualmente
          if (
            route === "(tabs)" ||
            route === "(admin)/gerenciar_realitos" ||
            route === "index"
          )
            return null;

          return (
            <Drawer.Screen
              key={route}
              name={route}
              options={{
                drawerItemStyle: { display: "none" }, // Fica oculto no menu lateral
                headerShown: true,
                title: label,
              }}
            />
          );
        })}
      </Drawer>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <UsuarioProvider>
        <AppNavigation />
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
    paddingTop: 60, // Ajuste para não bater no entalhe do celular
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
