import { Tabs } from "expo-router";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Home,
  Medal,
} from "lucide-react-native";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8B0000", // Vermelho escuro para o item ativo
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          height: Platform.OS === "web" ? 70 : 65,
          paddingBottom: Platform.OS === "web" ? 15 : 10,
          paddingTop: 5,
          borderTopWidth: 1,
          borderTopColor: "#eee",
          backgroundColor: "#fff",
          // Sombra leve para mobile
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      {/* Tela de Início / Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {/* Tela de Chamada / Presença */}
      <Tabs.Screen
        name="presenca"
        options={{
          title: "Presença",
          tabBarIcon: ({ color }) => <CheckCircle2 size={24} color={color} />,
        }}
      />

      {/* Tela de Progresso em Classes */}
      <Tabs.Screen
        name="classes"
        options={{
          title: "Classes",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />

      {/* Tela de Especialidades Concluídas */}
      <Tabs.Screen
        name="especialidades"
        options={{
          title: "Especialidades",
          tabBarIcon: ({ color }) => <Medal size={24} color={color} />,
        }}
      />

      {/* Tela de Calendário / Agenda de Eventos */}
      <Tabs.Screen
        name="calendario"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} />,
        }}
      />

      {/* Rotas ocultas da Tab Bar (Acessadas via código, não pelo menu inferior) */}
      <Tabs.Screen
        name="perfil"
        options={{
          href: null, // Impede que o botão apareça no menu
          tabBarButton: () => null, // Garante que não ocupará espaço físico
        }}
      />

      <Tabs.Screen
        name="extrato_unidade"
        options={{
          href: null,
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
