import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Slot, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import { CalendarPlus, Home, LogOut } from "lucide-react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { UsuarioProvider, useUsuario } from "../context/UsuarioContext";

SplashScreen.preventAutoHideAsync();

// --- MAPEAMENTO DE NOMES E ROTAS ---
const nomesDasTelas: Record<string, string> = {
  // Telas Bases
  index: "Início",
  "auth/login": "Entrar",
  "auth/cadastro": "Criar Conta",
  "auth/recuperar": "Recuperar Senha",

  // Telas Administrativas
  "(admin)/unidades": "Gestão de Unidades",
  "(admin)/novo_evento": "Novo Evento",
  "(admin)/membros-unidade": "Membros da Unidade",
  "(admin)/gerenciar-membros": "Gerenciar Membros",
  "(admin)/gerenciar_progresso": "Progresso de Classes",
  "(admin)/gerenciar_realitos": "Banco dos Realitos",

  // Pastas e Stacks (Ocultar do Menu)
  modal: "Modal",
  classesStack: "Classes",
  auth: "Autenticação",
  "classesStack/index": "Lista de Classes",
  "classesStack/[id]": "Detalhes da Classe",
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
          <Text style={styles.drawerSubtitle}>Menu do Desbravador</Text>
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
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const segmentsList = segments as string[];
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

  const isDiretoria =
    usuario?.cargo === "Diretor" ||
    usuario?.unidade === "Diretoria" ||
    usuario?.cargo === "Conselheiro";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: "#8B0000" },
          headerTintColor: "#fff",
          drawerActiveTintColor: "#8B0000",
          headerTitleAlign: "center",
          overlayColor: "rgba(0,0,0,0.5)", // Melhor feedback visual na web
        }}
      >
        {/* 1. ABA PRINCIPAL (HOME) */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Início",
            title: "Clube Águia Real",
            drawerIcon: ({ color }) => <Home size={22} color={color} />,
          }}
        />

        {/* 2. NOVO EVENTO (SÓ DIRETORIA) */}
        <Drawer.Screen
          name="(admin)/novo_evento"
          options={{
            drawerLabel: "Novo Evento",
            title: "Novo Evento",
            drawerItemStyle: { display: isDiretoria ? "flex" : "none" },
            drawerIcon: ({ color }) => <CalendarPlus size={22} color={color} />,
          }}
        />

        {/* 3. OCULTAR TODO O RESTO DO MENU */}
        {Object.entries(nomesDasTelas).map(([route, label]) => (
          <Drawer.Screen
            key={route}
            name={route}
            options={{
              drawerItemStyle: { display: "none" }, // Esconde nomes como "modal" e "classesStack"
              headerShown: true,
              title: label,
            }}
          />
        ))}
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
    paddingTop: 50,
  },
  drawerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  drawerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 20,
  },
});
