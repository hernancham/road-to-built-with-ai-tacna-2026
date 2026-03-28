export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type SeverityLevel = "LOW" | "MODERATE" | "HIGH";

export interface Medication {
  id: string;
  trade_name: string;
  active_ingredient: string;
  description: string;
}

export interface Interaction {
  id: string;
  item_a_id: string;
  item_b_id: string;
  severity: SeverityLevel;
  warning_message: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
}

export interface Inventory {
  pharmacy_id: string;
  medication_id: string;
  stock_status: StockStatus;
}

// ─── DATA ─────────────────────────────────────────────────────────────────

export const mockMedications: Medication[] = [
  {
    id: "med_1",
    trade_name: "Aspirina",
    active_ingredient: "Ácido Acetilsalicílico",
    description: "Analgésico, antipirético y antiinflamatorio no esteroideo.",
  },
  {
    id: "med_2",
    trade_name: "Ibuprofeno",
    active_ingredient: "Ibuprofeno",
    description: "Antiinflamatorio no esteroideo (AINE).",
  },
  {
    id: "med_3",
    trade_name: "Lisinopril",
    active_ingredient: "Lisinopril",
    description: "Inhibidor de la ECA, usado para hipertensión.",
  },
  {
    id: "med_4",
    trade_name: "Clorfenamina",
    active_ingredient: "Clorfenamina maleato",
    description: "Antihistamínico para alergias.",
  },
  {
    id: "med_5",
    trade_name: "Warfarina",
    active_ingredient: "Warfarina",
    description: "Anticoagulante oral.",
  },
  {
    id: "med_6",
    trade_name: "Amoxicilina",
    active_ingredient: "Amoxicilina",
    description: "Antibiótico derivado de la penicilina.",
  },
  {
    id: "med_7",
    trade_name: "Sintrom",
    active_ingredient: "Acenocumarol",
    description: "Anticoagulante oral (antagonista de vitamina K).",
  },
  {
    id: "med_8",
    trade_name: "Paracetamol",
    active_ingredient: "Paracetamol",
    description: "Analgésico y antipirético.",
  },
];

export const mockInteractions: Interaction[] = [
  {
    id: "int_1",
    item_a_id: "med_1", // Aspirina
    item_b_id: "med_2", // Ibuprofeno
    severity: "MODERATE",
    warning_message:
      "El uso concurrente de Aspirina e Ibuprofeno puede reducir el efecto cardioprotector de la aspirina y aumentar el riesgo de sangrado gastrointestinal.",
  },
  {
    id: "int_2",
    item_a_id: "med_1", // Aspirina
    item_b_id: "med_5", // Warfarina
    severity: "HIGH",
    warning_message:
      "🚨 ALTO RIESGO: Combinar Aspirina con Warfarina aumenta significativamente el riesgo de hemorragia severa. Evitar su uso conjunto a menos que lo indique el médico.",
  },
  {
    id: "int_3",
    item_a_id: "med_7", // Sintrom
    item_b_id: "med_1", // Aspirina
    severity: "HIGH",
    warning_message:
      "🚨 ALTO RIESGO: Fuerte sinergia anticoagulante. Alta probabilidad de sangrado crítico.",
  },
  {
    id: "int_4",
    item_a_id: "med_3", // Lisinopril
    item_b_id: "med_2", // Ibuprofeno
    severity: "MODERATE",
    warning_message:
      "⚠️ PRECAUCIÓN: El Ibuprofeno puede disminuir el efecto antihipertensivo del Lisinopril y generar posible daño renal a largo plazo.",
  },
];

// Opcional: Relacionar una condición (alergia) del perfil del usuario con un medicamento
export const mockConditionsInteractions: Record<string, Interaction[]> = {
  penicilina: [
    {
      id: "int_cond_1",
      item_a_id: "cond_penicilina",
      item_b_id: "med_6", // Amoxicilina
      severity: "HIGH",
      warning_message:
        "🚨 ALTO RIESGO: El paciente es alérgico a la Penicilina. El consumo de Amoxicilina puede provocar shock anafiláctico.",
    },
  ],
};

export const mockPharmacies: Pharmacy[] = [
  {
    id: "pharm_1",
    name: "Inkafarma Principal",
    address: "Av. Central 123",
  },
  {
    id: "pharm_2",
    name: "Mifarma Plaza",
    address: "C.C. Plaza Mayor",
  },
  {
    id: "pharm_3",
    name: "Boticas Perú Salud",
    address: "Av. Norte 450",
  },
];

export const mockInventory: Inventory[] = [
  // Inkafarma (Le falta Warfarina y Aspirina)
  { pharmacy_id: "pharm_1", medication_id: "med_2", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_1", medication_id: "med_3", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_1", medication_id: "med_4", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_1", medication_id: "med_6", stock_status: "LOW_STOCK" },
  { pharmacy_id: "pharm_1", medication_id: "med_8", stock_status: "IN_STOCK" },
  
  // Mifarma (Lo tiene casi todo pero se le acabó la Amoxicilina)
  { pharmacy_id: "pharm_2", medication_id: "med_1", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_2", medication_id: "med_2", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_2", medication_id: "med_3", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_2", medication_id: "med_4", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_2", medication_id: "med_5", stock_status: "LOW_STOCK" },
  { pharmacy_id: "pharm_2", medication_id: "med_6", stock_status: "OUT_OF_STOCK" },
  { pharmacy_id: "pharm_2", medication_id: "med_7", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_2", medication_id: "med_8", stock_status: "IN_STOCK" },

  // Boticas Perú (Lo tiene todo)
  { pharmacy_id: "pharm_3", medication_id: "med_1", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_3", medication_id: "med_2", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_3", medication_id: "med_3", stock_status: "LOW_STOCK" },
  { pharmacy_id: "pharm_3", medication_id: "med_4", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_3", medication_id: "med_5", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_3", medication_id: "med_6", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_3", medication_id: "med_7", stock_status: "IN_STOCK" },
  { pharmacy_id: "pharm_3", medication_id: "med_8", stock_status: "IN_STOCK" },
];
