import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Slot, useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import {
  Award,
  CheckCircle,
  Coins,
  Home,
  LogOut,
  Tent,
  Users2,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { UsuarioProvider, useUsuario } from "../context/UsuarioContext";
import { ProgressProvider } from "../hooks/useProgress";

SplashScreen.preventAutoHideAsync();

function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();
  const { usuario } = useUsuario();
  const isDiretoria =
    ["Diretor", "Conselheiro", "Instrutor"].includes(usuario?.cargo || "") ||
    usuario?.unidade === "Diretoria";

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: usuario?.fotoUrl || "https://via.placeholder.com/150",
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.drawerTitle}>{usuario?.nome || "Membro"}</Text>
          <Text style={styles.drawerSubtitle}>
            {isDiretoria ? "Administração" : "Desbravador"}
          </Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.footer}>
        <DrawerItem
          label="Sair"
          icon={() => <LogOut size={20} color="#8B0000" />}
          onPress={() => signOut()}
        />
      </View>
    </View>
  );
}

function AppNavigation() {
  const { isReady, user } = useAuth();
  const { usuario } = useUsuario();
  const segments = useSegments() as any; // Mata os erros de "no overlap" das imagens
  const router = useRouter();

  const isDiretoria =
    ["Diretor", "Conselheiro", "Instrutor"].includes(usuario?.cargo || "") ||
    usuario?.unidade === "Diretoria";

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "auth" || segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/auth/login" as any);
    } else if (
      user &&
      (inAuthGroup || segments.length === 0 || segments[0] === "index")
    ) {
      router.replace("/(tabs)" as any);
    }
    SplashScreen.hideAsync();
  }, [isReady, user, segments]);

  if (!isReady)
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#ffd700" />
      </View>
    );
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
        {/* SÓ AS ROTAS QUE DEVEM APARECER NO MENU */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Início",
            headerTitle: "Clube Águia Real",
            drawerIcon: ({ color }) => <Home size={22} color={color} />,
          }}
        />

        <Drawer.Screen
          name="(admin)/validar_requisitos"
          options={{
            drawerLabel: "Validar Requisitos",
            drawerIcon: ({ color }) => <CheckCircle size={22} color={color} />,
            drawerItemStyle: isDiretoria ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(admin)/gerenciar_progresso"
          options={{
            drawerLabel: "Classes",
            drawerIcon: ({ color }) => <Award size={22} color={color} />,
            drawerItemStyle: isDiretoria ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(admin)/gerenciar_realitos"
          options={{
            drawerLabel: "Banco de Realitos",
            drawerIcon: ({ color }) => <Coins size={22} color={color} />,
            drawerItemStyle: isDiretoria ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(admin)/membros-unidade"
          options={{
            drawerLabel: "Membros",
            drawerIcon: ({ color }) => <Users2 size={22} color={color} />,
            drawerItemStyle: isDiretoria ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(admin)/unidades"
          options={{
            drawerLabel: "Unidades",
            drawerIcon: ({ color }) => <Tent size={22} color={color} />,
            drawerItemStyle: isDiretoria ? {} : { display: "none" },
          }}
        />

        {/* ESCONDE TUDO O QUE SOBROU (ITENS DAS IMAGENS) */}
        <Drawer.Screen
          name="(admin)/novo_aviso"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(admin)/novo_evento"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="modal"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="classesStack"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="index"
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
  drawerHeader: { padding: 20, backgroundColor: "#8B0000", paddingTop: 50 },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginBottom: 10,
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
  drawerTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  drawerSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: "#eee" },
});
