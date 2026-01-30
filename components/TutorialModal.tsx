import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Tipos permitidos para o cargo
export type UserRole = "admin" | "dbv";

interface TutorialModalProps {
  isVisible: boolean;
  onClose: () => void;
  role: UserRole;
  // A propriedade 'role' aqui é para a lógica de negócio,
  // mas o Modal do RN pode pedir um 'role' de acessibilidade no Web.
}

const tutorialSteps = {
  admin: [
    {
      title: "Bem-vindo, Líder!",
      description:
        "Este é o seu painel administrativo. Aqui você gerencia os desbravadores, unidades e classes.",
      icon: "ribbon-outline",
    },
    {
      title: "Validar Requisitos",
      description:
        "No menu lateral, use 'Validar Requisitos' para dar o visto oficial nas atividades concluídas.",
      icon: "checkbox-outline",
    },
    {
      title: "Fazer Chamada",
      description:
        "Registre a presença da sua unidade rapidamente selecionando quem está presente.",
      icon: "people-outline",
    },
    {
      title: "Lidere com Excelência!",
      description:
        "Tudo pronto para manter o Águia Real organizado. Explore as funções e boa liderança!",
      icon: "rocket-outline",
    },
  ],
  dbv: [
    {
      title: "Olá, Desbravador!",
      description:
        "Este é o seu app! Aqui você acompanha sua evolução em Classes e Especialidades.",
      icon: "shield-checkmark-outline",
    },
    {
      title: "Progresso Real",
      description:
        "Veja quais requisitos já foram assinados e o que falta para sua próxima investidura.",
      icon: "bar-chart-outline",
    },
    {
      title: "Fique por Dentro",
      description:
        "Acompanhe o calendário de acampamentos, reuniões e eventos oficiais do nosso clube.",
      icon: "calendar-outline",
    },
    {
      title: "Sempre Avante!",
      description:
        "Prepare-se para os desafios e estude seus requisitos. Maranata!",
      icon: "medal-outline",
    },
  ],
};

export default function TutorialModal({
  isVisible,
  onClose,
  role = "dbv",
}: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reinicia o passo ao abrir o modal
  useEffect(() => {
    if (isVisible) setCurrentStep(0);
  }, [isVisible]);

  const steps = tutorialSteps[role] || tutorialSteps.dbv;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      // Ajuste para acessibilidade Web
      {...(Platform.OS === "web" ? { ariaModal: true, role: "dialog" } : {})}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Indicador de Progresso em Barras/Pontos */}
          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          <View style={styles.iconContainer}>
            <Ionicons
              name={steps[currentStep].icon as any}
              size={70}
              color="#8B0000"
            />
          </View>

          <Text style={styles.title}>{steps[currentStep].title}</Text>
          <Text style={styles.description}>
            {steps[currentStep].description}
          </Text>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={nextStep}
            >
              <Text style={styles.buttonText}>
                {currentStep === steps.length - 1 ? "COMEÇAR!" : "PRÓXIMO"}
              </Text>
            </TouchableOpacity>

            {currentStep < steps.length - 1 && (
              <TouchableOpacity
                onPress={handleClose}
                style={styles.skipButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.skipText}>Pular tutorial</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: width * 0.85,
    maxWidth: 400, // Previne que fique gigante em tablets/web
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
      web: {
        boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
      },
    }),
  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  activeDot: {
    width: 20,
    backgroundColor: "#8B0000",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#E0E0E0",
  },
  iconContainer: {
    backgroundColor: "#FFF5F5",
    padding: 25,
    borderRadius: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#4A4A4A",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  footer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#8B0000",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  skipButton: {
    marginTop: 18,
  },
  skipText: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "600",
  },
});
