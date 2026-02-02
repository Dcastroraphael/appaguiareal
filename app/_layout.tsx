import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Slot, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import { Coins, Home, LogOut, Wallet } from "lucide-react-native"; // Adicionado Wallet
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { UsuarioProvider, useUsuario } from "../context/UsuarioContext"; // Import useUsuario
import { ProgressProvider } from "../hooks/useProgress";

SplashScreen.preventAutoHideAsync();

const nomesDasTelas: Record<string, string> = {
  index: "Início",
  "auth/login": "Entrar",
  "auth/cadastro": "Criar Conta",
  "auth/recuperar": "Recuperar Senha",
  "(admin)/unidades": "Gestão de Unidades",
  "(admin)/novo_evento": "Novo Evento",
  "(admin)/novo_aviso": "Novo Aviso",
  "(admin)/membros-unidade": "Membros da Unidade",
  "(admin)/gerenciar-membros": "Gerenciar Membros",
  "(admin)/gerenciar_progresso": "Progresso de Classes",
  "(admin)/gerenciar_realitos": "Banco dos Realitos",
  "classesStack/[id]": "Detalhes da Classe",
  modal: "Modal",
  classesStack: "Classes",
  auth: "Autenticação",
};

function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();
  const { usuario } = useUsuario(); // Pegando dados do usuário
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
          <Text style={styles.drawerSubtitle}>
            {usuario?.cargo === "Diretor" || usuario?.cargo === "Conselheiro"
              ? "Painel Administrativo"
              : "Área do Desbravador"}
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
  const { usuario } = useUsuario(); // Importante para definir o menu
  const segments = useSegments();
  const router = useRouter();

  const isDiretoria =
    usuario?.cargo === "Diretor" ||
    usuario?.cargo === "Conselheiro" ||
    usuario?.cargo === "Diretoria";

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
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Início",
            title: "Clube Águia Real",
            drawerIcon: ({ color }) => <Home size={22} color={color} />,
          }}
        />

        {/* Lógica do Banco de Realitos no Menu */}
        <Drawer.Screen
          name="(admin)/gerenciar_realitos"
          options={{
            // Muda o texto do menu conforme o cargo
            drawerLabel: isDiretoria ? "Banco (Gestão)" : "Meu Saldo",
            title: isDiretoria ? "Tesouraria de Realitos" : "Meu Extrato",
            // Muda o ícone: Moedas para Admin, Carteira para DBV
            drawerIcon: ({ color }) =>
              isDiretoria ? (
                <Coins size={22} color={color} />
              ) : (
                <Wallet size={22} color={color} />
              ),
          }}
        />

        {Object.entries(nomesDasTelas).map(([route, label]) => {
          // Agora removemos o index e as rotas que já definimos acima
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
                drawerItemStyle: { display: "none" },
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
