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
  FileTextIcon,
  Home,
  LogOut,
  MapPin,
  Users,
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
  const router = useRouter();

  const isDiretoria = ["Diretor", "Conselheiro", "Diretoria"].includes(
    usuario?.cargo || "",
  );

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
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: usuario?.fotoUrl || "https://via.placeholder.com/150",
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.drawerTitle}>{usuario?.nome || "Membro"}</Text>
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
  const segments = useSegments();
  const router = useRouter();

  const isDiretoria = ["Diretor", "Conselheiro", "Diretoria"].includes(
    usuario?.cargo || "",
  );

  useEffect(() => {
    if (!isReady) return;
    const segs = segments as unknown as string[];
    const inAuthGroup = segs[0] === "auth" || segs[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (user && (inAuthGroup || segs.length === 0)) {
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
          headerTitle: "Clube Águia Real",
        }}
      >
        {/* 1. TELAS VISÍVEIS - SEMPRE NO TOPO */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Início",
            drawerIcon: ({ color }) => <Home size={22} color={color} />,
          }}
        />

        {/* 2. TELAS DA DIRETORIA (Só aparecem para Admin) */}
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
            drawerLabel: "Vistos de Classes",
            drawerIcon: ({ color }) => <Award size={22} color={color} />,
            drawerItemStyle: isDiretoria ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(admin)/unidades"
          options={{
            drawerLabel: "Unidades",
            drawerIcon: ({ color }) => <MapPin size={22} color={color} />,
            drawerItemStyle: isDiretoria ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(admin)/gerenciar_membros"
          options={{
            drawerLabel: "Membros",
            drawerIcon: ({ color }) => <Users size={22} color={color} />,
            drawerItemStyle: isDiretoria ? {} : { display: "none" },
          }}
        />

        <Drawer.Screen
          name="(admin)/gerenciar_realitos"
          options={{
            drawerLabel: "Tesouraria",
            drawerIcon: ({ color }) => <Coins size={22} color={color} />,
            drawerItemStyle: isDiretoria ? {} : { display: "none" },
          }}
        />

        {/* 3. TELA FINANCEIRO (Só aparece para Desbravador) */}
        <Drawer.Screen
          name="(tabs)/extrato_unidade"
          options={{
            drawerLabel: "Financeiro",
            drawerIcon: ({ color }) => <FileTextIcon size={22} color={color} />,
            drawerItemStyle: isDiretoria ? { display: "none" } : {},
          }}
        />

        {/* 4. LIMPEZA TOTAL - ESCONDENDO TUDO QUE SOBROU NA ESTRUTURA */}

        {/* Escondendo a pasta (tabs) para não duplicar o "index" */}
        <Drawer.Screen
          name="(tabs)/index"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(tabs)/perfil"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(tabs)/calendario"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(tabs)/classes"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(tabs)/especialidades"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(tabs)/_layout"
          options={{ drawerItemStyle: { display: "none" } }}
        />

        {/* Escondendo arquivos avulsos da (admin) */}
        <Drawer.Screen
          name="(admin)/membros-unidade"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(admin)/novo_aviso"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(admin)/novo_evento"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(admin)/gerenciar_realitos.tsx"
          options={{ drawerItemStyle: { display: "none" } }}
        />

        {/* Escondendo Stacks e Auth */}
        <Drawer.Screen
          name="index"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="auth/login"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="auth/cadastro"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="auth/recuperar"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="classesStack/index"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="classesStack/[id]"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="classesStack/_layout"
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
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ffd700",
  },
  avatar: { width: "100%", height: "100%" },
  drawerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
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
