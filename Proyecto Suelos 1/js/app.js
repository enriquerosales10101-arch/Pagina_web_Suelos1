// ===================================================================
// GEOLAB - SISTEMA GEOTÉCNICO DE LABORATORIO 1
// Lógica de cálculo y emisión de informes según normas ASTM D2216 / D7263 / D854 y NTP 339
// ===================================================================

// Tabla ASTM D854 de Densidad del Agua (g/mL) y Coeficiente de Corrección K
const WATER_DENSITY_TABLE = [
  { t: 15.0, rho: 0.99911, k: 1.00090 },
  { t: 15.1, rho: 0.99909, k: 1.00088 },
  { t: 15.2, rho: 0.99907, k: 1.00086 },
  { t: 15.3, rho: 0.99906, k: 1.00085 },
  { t: 15.4, rho: 0.99904, k: 1.00083 },
  { t: 15.5, rho: 0.99903, k: 1.00082 },
  { t: 15.6, rho: 0.99901, k: 1.00080 },
  { t: 15.7, rho: 0.99899, k: 1.00078 },
  { t: 15.8, rho: 0.99898, k: 1.00077 },
  { t: 15.9, rho: 0.99896, k: 1.00075 },
  { t: 16.0, rho: 0.99894, k: 1.00073 },
  { t: 16.1, rho: 0.99893, k: 1.00072 },
  { t: 16.2, rho: 0.99891, k: 1.00070 },
  { t: 16.3, rho: 0.99889, k: 1.00068 },
  { t: 16.4, rho: 0.99888, k: 1.00067 },
  { t: 16.5, rho: 0.99886, k: 1.00065 },
  { t: 16.6, rho: 0.99884, k: 1.00063 },
  { t: 16.7, rho: 0.99883, k: 1.00062 },
  { t: 16.8, rho: 0.99881, k: 1.00060 },
  { t: 16.9, rho: 0.99879, k: 1.00058 },
  { t: 17.0, rho: 0.99877, k: 1.00056 },
  { t: 17.1, rho: 0.99876, k: 1.00055 },
  { t: 17.2, rho: 0.99874, k: 1.00053 },
  { t: 17.3, rho: 0.99872, k: 1.00051 },
  { t: 17.4, rho: 0.99870, k: 1.00049 },
  { t: 17.5, rho: 0.99868, k: 1.00047 },
  { t: 17.6, rho: 0.99867, k: 1.00046 },
  { t: 17.7, rho: 0.99865, k: 1.00044 },
  { t: 17.8, rho: 0.99863, k: 1.00042 },
  { t: 17.9, rho: 0.99861, k: 1.00040 },
  { t: 18.0, rho: 0.99859, k: 1.00038 },
  { t: 18.1, rho: 0.99857, k: 1.00036 },
  { t: 18.2, rho: 0.99855, k: 1.00034 },
  { t: 18.3, rho: 0.99854, k: 1.00033 },
  { t: 18.4, rho: 0.99852, k: 1.00031 },
  { t: 18.5, rho: 0.99850, k: 1.00029 },
  { t: 18.6, rho: 0.99848, k: 1.00027 },
  { t: 18.7, rho: 0.99846, k: 1.00025 },
  { t: 18.8, rho: 0.99844, k: 1.00023 },
  { t: 18.9, rho: 0.99842, k: 1.00021 },
  { t: 19.0, rho: 0.99840, k: 1.00019 },
  { t: 19.1, rho: 0.99838, k: 1.00017 },
  { t: 19.2, rho: 0.99836, k: 1.00015 },
  { t: 19.3, rho: 0.99834, k: 1.00013 },
  { t: 19.4, rho: 0.99832, k: 1.00011 },
  { t: 19.5, rho: 0.99830, k: 1.00009 },
  { t: 19.6, rho: 0.99828, k: 1.00007 },
  { t: 19.7, rho: 0.99826, k: 1.00005 },
  { t: 19.8, rho: 0.99824, k: 1.00003 },
  { t: 19.9, rho: 0.99822, k: 1.00001 },
  { t: 20.0, rho: 0.99820, k: 0.99999 },
  { t: 20.1, rho: 0.99818, k: 0.99997 },
  { t: 20.2, rho: 0.99816, k: 0.99995 },
  { t: 20.3, rho: 0.99814, k: 0.99993 },
  { t: 20.4, rho: 0.99812, k: 0.99991 },
  { t: 20.5, rho: 0.99810, k: 0.99989 },
  { t: 20.6, rho: 0.99807, k: 0.99986 },
  { t: 20.7, rho: 0.99805, k: 0.99984 },
  { t: 20.8, rho: 0.99803, k: 0.99982 },
  { t: 20.9, rho: 0.99801, k: 0.99980 },
  { t: 21.0, rho: 0.99799, k: 0.99978 },
  { t: 21.1, rho: 0.99797, k: 0.99976 },
  { t: 21.2, rho: 0.99795, k: 0.99974 },
  { t: 21.3, rho: 0.99792, k: 0.99971 },
  { t: 21.4, rho: 0.99790, k: 0.99969 },
  { t: 21.5, rho: 0.99788, k: 0.99967 },
  { t: 21.6, rho: 0.99786, k: 0.99965 },
  { t: 21.7, rho: 0.99784, k: 0.99963 },
  { t: 21.8, rho: 0.99781, k: 0.99960 },
  { t: 21.9, rho: 0.99779, k: 0.99958 },
  { t: 22.0, rho: 0.99777, k: 0.99956 },
  { t: 22.1, rho: 0.99775, k: 0.99954 },
  { t: 22.2, rho: 0.99772, k: 0.99951 },
  { t: 22.3, rho: 0.99770, k: 0.99949 },
  { t: 22.4, rho: 0.99768, k: 0.99947 },
  { t: 22.5, rho: 0.99765, k: 0.99944 },
  { t: 22.6, rho: 0.99763, k: 0.99942 },
  { t: 22.7, rho: 0.99761, k: 0.99940 },
  { t: 22.8, rho: 0.99759, k: 0.99938 },
  { t: 22.9, rho: 0.99756, k: 0.99935 },
  { t: 23.0, rho: 0.99754, k: 0.99933 },
  { t: 23.1, rho: 0.99751, k: 0.99930 },
  { t: 23.2, rho: 0.99749, k: 0.99928 },
  { t: 23.3, rho: 0.99747, k: 0.99926 },
  { t: 23.4, rho: 0.99744, k: 0.99923 },
  { t: 23.5, rho: 0.99742, k: 0.99921 },
  { t: 23.6, rho: 0.99740, k: 0.99919 },
  { t: 23.7, rho: 0.99737, k: 0.99916 },
  { t: 23.8, rho: 0.99735, k: 0.99914 },
  { t: 23.9, rho: 0.99732, k: 0.99911 },
  { t: 24.0, rho: 0.99730, k: 0.99909 },
  { t: 24.1, rho: 0.99727, k: 0.99906 },
  { t: 24.2, rho: 0.99725, k: 0.99904 },
  { t: 24.3, rho: 0.99722, k: 0.99901 },
  { t: 24.4, rho: 0.99720, k: 0.99899 },
  { t: 24.5, rho: 0.99717, k: 0.99896 },
  { t: 24.6, rho: 0.99715, k: 0.99894 },
  { t: 24.7, rho: 0.99712, k: 0.99891 },
  { t: 24.8, rho: 0.99710, k: 0.99889 },
  { t: 24.9, rho: 0.99707, k: 0.99886 },
  { t: 25.0, rho: 0.99705, k: 0.99884 },
  { t: 25.1, rho: 0.99702, k: 0.99881 },
  { t: 25.2, rho: 0.99700, k: 0.99879 },
  { t: 25.3, rho: 0.99697, k: 0.99876 },
  { t: 25.4, rho: 0.99694, k: 0.99873 },
  { t: 25.5, rho: 0.99692, k: 0.99871 },
  { t: 25.6, rho: 0.99689, k: 0.99868 },
  { t: 25.7, rho: 0.99687, k: 0.99866 },
  { t: 25.8, rho: 0.99684, k: 0.99863 },
  { t: 25.9, rho: 0.99681, k: 0.99860 },
  { t: 26.0, rho: 0.99679, k: 0.99858 },
  { t: 26.1, rho: 0.99676, k: 0.99855 },
  { t: 26.2, rho: 0.99673, k: 0.99852 },
  { t: 26.3, rho: 0.99671, k: 0.99850 },
  { t: 26.4, rho: 0.99668, k: 0.99847 },
  { t: 26.5, rho: 0.99665, k: 0.99844 },
  { t: 26.6, rho: 0.99663, k: 0.99842 },
  { t: 26.7, rho: 0.99660, k: 0.99839 },
  { t: 26.8, rho: 0.99657, k: 0.99836 },
  { t: 26.9, rho: 0.99654, k: 0.99833 },
  { t: 27.0, rho: 0.99652, k: 0.99831 },
  { t: 27.1, rho: 0.99649, k: 0.99828 },
  { t: 27.2, rho: 0.99646, k: 0.99825 },
  { t: 27.3, rho: 0.99643, k: 0.99822 },
  { t: 27.4, rho: 0.99641, k: 0.99820 },
  { t: 27.5, rho: 0.99638, k: 0.99817 },
  { t: 27.6, rho: 0.99635, k: 0.99814 },
  { t: 27.7, rho: 0.99632, k: 0.99811 },
  { t: 27.8, rho: 0.99629, k: 0.99808 },
  { t: 27.9, rho: 0.99627, k: 0.99806 },
  { t: 28.0, rho: 0.99624, k: 0.99803 },
  { t: 28.1, rho: 0.99621, k: 0.99800 },
  { t: 28.2, rho: 0.99618, k: 0.99797 },
  { t: 28.3, rho: 0.99615, k: 0.99794 },
  { t: 28.4, rho: 0.99612, k: 0.99791 },
  { t: 28.5, rho: 0.99610, k: 0.99789 },
  { t: 28.6, rho: 0.99607, k: 0.99786 },
  { t: 28.7, rho: 0.99604, k: 0.99783 },
  { t: 28.8, rho: 0.99601, k: 0.99780 },
  { t: 28.9, rho: 0.99598, k: 0.99777 },
  { t: 29.0, rho: 0.99595, k: 0.99773 },
  { t: 29.1, rho: 0.99592, k: 0.99770 },
  { t: 29.2, rho: 0.99589, k: 0.99767 },
  { t: 29.3, rho: 0.99586, k: 0.99764 },
  { t: 29.4, rho: 0.99583, k: 0.99761 },
  { t: 29.5, rho: 0.99580, k: 0.99758 },
  { t: 29.6, rho: 0.99577, k: 0.99755 },
  { t: 29.7, rho: 0.99574, k: 0.99752 },
  { t: 29.8, rho: 0.99571, k: 0.99749 },
  { t: 29.9, rho: 0.99568, k: 0.99746 },
  { t: 30.0, rho: 0.99565, k: 0.99743 }
];

function getWaterProperties(temp) {
  // Si el usuario ingresa 210, 236 en lugar de 21.0, 23.6, lo corregimos
  let t = temp;
  if (t >= 100 && t <= 500) {
    t = t / 10.0;
  }

  t = Math.min(Math.max(t, 0.0), 50.0);
  const roundedT = Math.round(t * 10) / 10;

  // Buscar en tabla primero (rango 15 a 30 es exacto según ASTM D854)
  const match = WATER_DENSITY_TABLE.find(item => Math.abs(item.t - roundedT) < 0.001);
  if (match) {
    return { rho: match.rho, rho_w: match.rho, k: match.k };
  }

  // Interpolación o extrapolación si está fuera de la tabla
  // Fórmula aproximada de densidad del agua:
  const rho = 1 - Math.pow(t - 3.98, 2) * (t + 283) / (503570 * (t + 67.26));
  const k = rho / 0.99820; // referenciado a 20°C

  return { rho, rho_w: rho, k };
}

// SERIE OFICIAL DE TAMICES ASTM E11 / ASTM D6913 (UNI FIC LMS)
const ASTM_SIEVES = [
  { id: '3in', nombre: '3"', abertura: 75.000, desc: '75.0 mm' },
  { id: '2in', nombre: '2"', abertura: 50.000, desc: '50.0 mm' },
  { id: '1_5in', nombre: '1 1/2"', abertura: 37.500, desc: '37.5 mm' },
  { id: '1in', nombre: '1"', abertura: 25.000, desc: '25.0 mm' },
  { id: '3_4in', nombre: '3/4"', abertura: 19.000, desc: '19.0 mm' },
  { id: '1_2in', nombre: '1/2"', abertura: 12.500, desc: '12.5 mm' },
  { id: '3_8in', nombre: '3/8"', abertura: 9.500, desc: '9.5 mm' },
  { id: '1_4in', nombre: '1/4"', abertura: 6.350, desc: '6.35 mm' },
  { id: 'n4', nombre: 'N° 4', abertura: 4.750, desc: '4.75 mm' },
  { id: 'n10', nombre: 'N° 10', abertura: 2.000, desc: '2.00 mm' },
  { id: 'n20', nombre: 'N° 20', abertura: 0.850, desc: '850 µm' },
  { id: 'n30', nombre: 'N° 30', abertura: 0.600, desc: '600 µm' },
  { id: 'n40', nombre: 'N° 40', abertura: 0.425, desc: '425 µm' },
  { id: 'n60', nombre: 'N° 60', abertura: 0.250, desc: '250 µm' },
  { id: 'n100', nombre: 'N° 100', abertura: 0.150, desc: '150 µm' },
  { id: 'n140', nombre: 'N° 140', abertura: 0.106, desc: '106 µm' },
  { id: 'n200', nombre: 'N° 200', abertura: 0.075, desc: '75 µm' },
  { id: 'pan', nombre: 'Platillo / Fondo', abertura: 0.000, desc: 'Fondo' }
];

// ESTADO GLOBAL DE LA APLICACIÓN
const GeoState = {
  proyecto: {
    nombre: "Carretera Central Km 45",
    muestra: "M-01",
    procedencia: "Calicata C-01 (1.50 m)",
    material: "Arcilla limosa marrón de media plasticidad",
    ensayado: "Ing. Laboratorista",
    fecha: new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" })
  },
  ensayos: {
    humedad: {
      calculado: false,
      temp: 110.0,
      tiempo: 24.0,
      determinaciones: [],
      promedio: null,
      observaciones: ""
    },
    volumetrico: {
      calculado: false,
      metodo: "parafina", // "parafina" (NTP 339.139) o "cilindro" (ASTM D7263)
      rho_parafina: 0.87,
      pruebas: [],
      humedad: null,
      rho_humeda: null,
      rho_kg_m3: null,
      gamma_kn_m3: null,
      gamma_gf_cm3: null,
      rho_seca: null,
      rho_seca_kg_m3: null,
      gamma_seca: null,
      observaciones: ""
    },
    gravedad: {
      calculado: false,
      temp: 16.5,
      rho_w: 0.99886,
      k: 1.00065,
      pruebas: [],
      gs: null, // Gs a 20°C promedio
      gt: null, // Gt a T° promedio
      observaciones: ""
    },
    granulometria: {
      calculado: false,
      metodo: "simple", // "simple" (Anexo II) o "compuesto" (Anexo I)
      masa_total: 2900.0, // W1
      masa_lavada: 2708.0, // W0
      perdida_lavado: 192.0, // W1 - W0
      porc_perdida_lavado: 6.62,
      tamices: [],
      suma_retenido: 0,
      error_gramos: 0,
      porc_error: 0,
      grava: null,
      arena: null,
      finos: null,
      d10: null,
      d30: null,
      d60: null,
      d85: null,
      cu: null,
      cc: null,
      sucs_simbolo: "",
      sucs_descripcion: "",
      observaciones: ""
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initThemeToggle();
  initProjectMetaModal();
  initHumedadEvents();
  initVolumetricoEvents();
  initGravedadEvents();
  initGranulometriaEvents();
  initDashboardEvents();
  initDashboardLab2Events();
  updateStripUI();
  updateDashboardPills();
  updateDashboardLab2Summary();
});

// 1. NAVEGACIÓN Y PESTAÑAS (dos niveles: Laboratorio → Ensayo)

// A qué laboratorio pertenece cada vista (null = Panel General, sin sub-barra)
const VIEW_LAB = {
  "view-dashboard": null,
  "view-humedad": "lab1",
  "view-volumetrico": "lab1",
  "view-gravedad": "lab1",
  "view-granulometria": "lab2",
};

// Primer ensayo que se abre al pulsar cada laboratorio
const LAB_FIRST_VIEW = {
  lab1: "view-humedad",
  lab2: "view-granulometria",
};

const LAB_LABEL = {
  lab1: "Laboratorio 1",
  lab2: "Laboratorio 2",
};

function initNavigation() {
  const views = document.querySelectorAll(".view");
  const primaryBtns = document.querySelectorAll(".nav-btn");
  const subBtns = document.querySelectorAll(".subnav-btn");
  const subNavBar = document.getElementById("sub-nav-bar");
  const subNavLabel = document.getElementById("sub-nav-label");

  // Muestra/oculta la segunda fila según el laboratorio activo
  function updateSubNav(lab) {
    document.querySelectorAll(".sub-nav-group").forEach(g => g.classList.remove("active"));
    if (lab) {
      const group = document.getElementById(`subnav-${lab}`);
      if (group) group.classList.add("active");
      if (subNavLabel) subNavLabel.textContent = LAB_LABEL[lab] || "Ensayos";
      subNavBar.classList.remove("hidden");
    } else {
      subNavBar.classList.add("hidden");
    }
  }

  function switchView(targetId) {
    views.forEach(v => v.classList.remove("active"));
    const activeView = document.getElementById(targetId);
    if (activeView) activeView.classList.add("active");

    const lab = VIEW_LAB[targetId] ?? null;

    // Resaltado de la barra principal (laboratorio o panel general)
    primaryBtns.forEach(b => b.classList.remove("active"));
    if (targetId === "view-dashboard") {
      document.getElementById("btn-nav-dashboard").classList.add("active");
    } else if (lab) {
      const labBtn = document.getElementById(`btn-nav-${lab}`);
      if (labBtn) labBtn.classList.add("active");
    }

    // Segunda fila: mostrar el grupo correcto y resaltar el ensayo activo
    updateSubNav(lab);
    subBtns.forEach(b => b.classList.toggle("active", b.getAttribute("data-target") === targetId));

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Panel General
  document.getElementById("btn-nav-dashboard").addEventListener("click", () => switchView("view-dashboard"));

  // Botones de laboratorio → abren el primer ensayo del lab y despliegan su fila
  document.querySelectorAll(".nav-btn[data-lab]").forEach(btn => {
    btn.addEventListener("click", () => {
      const lab = btn.getAttribute("data-lab");
      if (LAB_FIRST_VIEW[lab]) switchView(LAB_FIRST_VIEW[lab]);
    });
  });

  // Botones de la segunda fila (ensayos)
  subBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target) switchView(target);
    });
  });

  // Marca / logo y tarjetas del panel
  document.getElementById("nav-brand-btn").addEventListener("click", () => switchView("view-dashboard"));
  document.getElementById("btn-goto-humedad").addEventListener("click", () => switchView("view-humedad"));
  document.getElementById("btn-goto-volumetrico").addEventListener("click", () => switchView("view-volumetrico"));
  document.getElementById("btn-goto-gravedad").addEventListener("click", () => switchView("view-gravedad"));

  // Tarjeta única Lab 2 → vista Granulometría
  const btnGotoGranu = document.getElementById("btn-goto-granulometria");
  if (btnGotoGranu) btnGotoGranu.addEventListener("click", () => switchView("view-granulometria"));

  // Botones "Volver al Panel" (vuelven siempre al dashboard principal)
  document.querySelectorAll(".btn-back-dashboard").forEach(btn => {
    btn.addEventListener("click", () => switchView("view-dashboard"));
  });
}

// 2. CONTROL DE TEMA (CLARO / OSCURO)
function initThemeToggle() {
  const toggleBtn = document.getElementById("btn-toggle-theme");
  const icon = toggleBtn.querySelector(".theme-icon");

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      icon.textContent = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      icon.textContent = "☀️";
    }
  });
}

// 3. METADATOS DEL PROYECTO Y MODAL
function initProjectMetaModal() {
  const modal = document.getElementById("modal-project");
  const btnOpen = document.getElementById("btn-open-meta-modal");
  const btnEditStrip = document.getElementById("btn-edit-strip");
  const btnClose = document.getElementById("btn-close-modal");
  const btnCancel = document.getElementById("btn-cancel-modal");
  const btnSave = document.getElementById("btn-save-modal");

  function openModal() {
    document.getElementById("meta-proyecto").value = GeoState.proyecto.nombre;
    document.getElementById("meta-muestra").value = GeoState.proyecto.muestra;
    document.getElementById("meta-procedencia").value = GeoState.proyecto.procedencia;
    document.getElementById("meta-material").value = GeoState.proyecto.material;
    document.getElementById("meta-ensayado").value = GeoState.proyecto.ensayado;
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  btnOpen.addEventListener("click", openModal);
  btnEditStrip.addEventListener("click", openModal);
  btnClose.addEventListener("click", closeModal);
  btnCancel.addEventListener("click", closeModal);

  btnSave.addEventListener("click", () => {
    GeoState.proyecto.nombre = document.getElementById("meta-proyecto").value.trim() || "Proyecto sin título";
    GeoState.proyecto.muestra = document.getElementById("meta-muestra").value.trim() || "M-01";
    GeoState.proyecto.procedencia = document.getElementById("meta-procedencia").value.trim() || "—";
    GeoState.proyecto.material = document.getElementById("meta-material").value.trim() || "—";
    GeoState.proyecto.ensayado = document.getElementById("meta-ensayado").value.trim() || "—";

    updateStripUI();
    closeModal();
    showToast("Datos del proyecto actualizados y sincronizados.");
  });
}

function updateStripUI() {
  document.getElementById("strip-val-proyecto").textContent = GeoState.proyecto.nombre;
  document.getElementById("strip-val-muestra").textContent = GeoState.proyecto.muestra;
  document.getElementById("strip-val-procedencia").textContent = GeoState.proyecto.procedencia;
  document.getElementById("strip-val-material").textContent = GeoState.proyecto.material;
  document.getElementById("strip-val-ensayado").textContent = GeoState.proyecto.ensayado;
}

// ===================================================================
// 4. LÓGICA DE ENSAYO 01: CONTENIDO DE HUMEDAD (ASTM D2216 / NTP 339.127)
// ===================================================================
function initHumedadEvents() {
  const humCantSelect = document.getElementById("hum-cant");
  if (humCantSelect) {
    humCantSelect.addEventListener("change", renderHumedadTable);
    renderHumedadTable(); // Initial render
  }

  document.getElementById("btn-calcular-humedad").addEventListener("click", calcularHumedad);
  document.getElementById("btn-limpiar-humedad").addEventListener("click", limpiarHumedad);
  document.getElementById("btn-fill-demo-humedad").addEventListener("click", cargarDemoHumedad);

  document.getElementById("btn-exportar-pdf-humedad").addEventListener("click", () => {
    if (!GeoState.ensayos.humedad.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular'.");
      return;
    }
    generarPDFIndividual("humedad");
  });
}

function renderHumedadTable() {
  const select = document.getElementById("hum-cant");
  const cant = parseInt(select.value) || 3;
  const tbody = document.getElementById("tbody-humedad-inputs");
  if (!tbody) return;

  let html = "";
  for (let i = 1; i <= cant; i++) {
    html += `
      <tr>
        <td class="text-center font-bold text-accent">${i}</td>
        <td><input type="text" class="input-control text-center" id="hum-id-${i}" value="C-${i}" placeholder="ID"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="hum-mr-${i}" placeholder="Ej. 25.40"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="hum-mh-${i}" placeholder="Ej. 105.40"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="hum-ms-${i}" placeholder="Ej. 92.80"></td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function calcularHumedad() {
  try {
    const determinaciones = [];
    const cant = parseInt(document.getElementById("hum-cant").value) || 3;

    for (let i = 1; i <= cant; i++) {
      const id = document.getElementById(`hum-id-${i}`).value.trim();
      const mrVal = document.getElementById(`hum-mr-${i}`).value.trim();
      const mhVal = document.getElementById(`hum-mh-${i}`).value.trim();
      const msVal = document.getElementById(`hum-ms-${i}`).value.trim();

      if (!mrVal && !mhVal && !msVal) continue;

      if (!mrVal || !mhVal || !msVal) {
        throw new Error(`En la fila ${i}, complete las 3 masas (Cápsula, Cáp.+Húmedo, Cáp.+Seco) o déjela vacía.`);
      }

      const mr = parseFloat(mrVal);
      const mh = parseFloat(mhVal);
      const ms = parseFloat(msVal);

      if (isNaN(mr) || isNaN(mh) || isNaN(ms)) {
        throw new Error(`Las masas en la fila ${i} deben ser números válidos.`);
      }
      if (mr < 0 || mh < 0 || ms < 0) {
        throw new Error(`Las masas en la fila ${i} no pueden ser negativas.`);
      }
      if (mh <= mr) {
        throw new Error(`En la fila ${i}, la masa de suelo húmedo + cápsula (M1) debe ser mayor a la masa de la cápsula (Mt).`);
      }
      if (ms <= mr) {
        throw new Error(`En la fila ${i}, la masa de suelo seco + cápsula (M2) debe ser mayor a la masa de la cápsula (Mt).`);
      }
      if (mh < ms) {
        throw new Error(`En la fila ${i}, la masa húmeda (${mh}g) no puede ser menor a la masa seca (${ms}g).`);
      }

      const mw = mh - ms;
      const mss = ms - mr;
      const w = (mw / mss) * 100.0;

      determinaciones.push({
        num: i,
        id: id || `C-${i}`,
        mr,
        mh,
        ms,
        mw,
        mss,
        w
      });
    }

    if (determinaciones.length === 0) {
      throw new Error("Ingrese al menos una determinación de contenido de humedad para calcular.");
    }

    const temp = parseFloat(document.getElementById("hum-temp").value) || 110.0;
    const tiempo = parseFloat(document.getElementById("hum-tiempo").value) || 24.0;
    const obs = document.getElementById("hum-obs").value.trim();

    const sumW = determinaciones.reduce((acc, d) => acc + d.w, 0);
    const promedio = sumW / determinaciones.length;

    GeoState.ensayos.humedad = {
      calculado: true,
      temp,
      tiempo,
      determinaciones,
      promedio,
      observaciones: obs
    };

    renderResultadosHumedad();
    updateDashboardSummary();
    showToast("Cálculo de contenido de humedad completado con éxito.");

  } catch (err) {
    alert("Error en los datos de humedad:\n" + err.message);
  }
}

function renderResultadosHumedad() {
  const h = GeoState.ensayos.humedad;
  if (!h.calculado) return;

  document.getElementById("hum-results-placeholder").classList.add("hidden");
  document.getElementById("hum-results-content").classList.remove("hidden");

  document.getElementById("hum-res-promedio").textContent = `${h.promedio.toFixed(2)} %`;
  document.getElementById("hum-res-ndeterminaciones").textContent = `Basado en ${h.determinaciones.length} determinación(es) • Horno a ${h.temp.toFixed(1)} °C (${h.tiempo.toFixed(1)} h)`;

  const tbody = document.getElementById("tbody-hum-breakdown");
  tbody.innerHTML = "";

  h.determinaciones.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-center font-bold text-accent">${d.num}</td>
      <td class="text-center font-bold">${d.id}</td>
      <td class="font-mono text-right">${d.mw.toFixed(2)}</td>
      <td class="font-mono text-right">${d.mss.toFixed(2)}</td>
      <td class="font-mono text-right font-bold text-primary">${d.w.toFixed(2)} %</td>
    `;
    tbody.appendChild(tr);
  });
}

function limpiarHumedad() {
  const cant = parseInt(document.getElementById("hum-cant").value) || 3;
  for (let i = 1; i <= cant; i++) {
    document.getElementById(`hum-mr-${i}`).value = "";
    document.getElementById(`hum-mh-${i}`).value = "";
    document.getElementById(`hum-ms-${i}`).value = "";
  }
  document.getElementById("hum-obs").value = "";
  GeoState.ensayos.humedad.calculado = false;
  GeoState.ensayos.humedad.determinaciones = [];
  GeoState.ensayos.humedad.promedio = null;

  document.getElementById("hum-results-content").classList.add("hidden");
  document.getElementById("hum-results-placeholder").classList.remove("hidden");
  updateDashboardSummary();
  showToast("Datos de humedad reiniciados.");
}

function cargarDemoHumedad() {
  document.getElementById("hum-cant").value = "2";
  renderHumedadTable();

  document.getElementById("hum-id-1").value = "T2-91";
  document.getElementById("hum-mr-1").value = "79.10";
  document.getElementById("hum-mh-1").value = "637.00";
  document.getElementById("hum-ms-1").value = "582.60";

  document.getElementById("hum-id-2").value = "T2-92";
  document.getElementById("hum-mr-2").value = "113.30";
  document.getElementById("hum-mh-2").value = "742.00";
  document.getElementById("hum-ms-2").value = "682.00";

  document.getElementById("hum-obs").value = "Muestra ensayada según ASTM D2216. Secado estándar de 24 horas a 110 ± 5 °C.";

  calcularHumedad();
}

// ===================================================================
// 5. LÓGICA DE ENSAYO 02: PESO VOLUMÉTRICO Y DENSIDAD (NTP 339.139 / ASTM D7263)
// ===================================================================
function initVolumetricoEvents() {
  const volCantSelect = document.getElementById("vol-cant");
  if (volCantSelect) {
    volCantSelect.addEventListener("change", renderVolumetricoTable);
    renderVolumetricoTable();
  }

  const btnParafina = document.getElementById("btn-method-parafina");
  const btnCilindro = document.getElementById("btn-method-cilindro");
  const cardParafina = document.getElementById("card-vol-parafina");
  const cardCilindro = document.getElementById("card-vol-cilindro");
  const cardCantParafina = document.getElementById("card-vol-cant-parafina");

  btnParafina.addEventListener("click", () => {
    btnParafina.classList.add("active");
    btnCilindro.classList.remove("active");
    cardParafina.classList.remove("hidden");
    if (cardCantParafina) cardCantParafina.classList.remove("hidden");
    cardCilindro.classList.add("hidden");
    GeoState.ensayos.volumetrico.metodo = "parafina";
  });

  btnCilindro.addEventListener("click", () => {
    btnCilindro.classList.add("active");
    btnParafina.classList.remove("active");
    cardCilindro.classList.remove("hidden");
    cardParafina.classList.add("hidden");
    if (cardCantParafina) cardCantParafina.classList.add("hidden");
    GeoState.ensayos.volumetrico.metodo = "cilindro";
  });

  document.getElementById("btn-calcular-vol").addEventListener("click", calcularVolumetrico);
  document.getElementById("btn-limpiar-vol").addEventListener("click", limpiarVolumetrico);
  document.getElementById("btn-fill-demo-vol").addEventListener("click", cargarDemoVolumetrico);

  document.getElementById("btn-copiar-humedad-calculada").addEventListener("click", () => {
    if (GeoState.ensayos.humedad.calculado && GeoState.ensayos.humedad.promedio !== null) {
      document.getElementById("vol-humedad").value = GeoState.ensayos.humedad.promedio.toFixed(2);
      showToast(`Humedad sincronizada desde Ensayo 01: ${GeoState.ensayos.humedad.promedio.toFixed(2)} %`);
    } else {
      alert("Aún no se ha calculado el Ensayo 01 (Contenido de Humedad). Ingréselo manualmente o calcule primero el Ensayo 01.");
    }
  });

  document.getElementById("btn-exportar-pdf-vol").addEventListener("click", () => {
    if (!GeoState.ensayos.volumetrico.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular'.");
      return;
    }
    generarPDFIndividual("volumetrico");
  });
}

function renderVolumetricoTable() {
  const select = document.getElementById("vol-cant");
  const cant = parseInt(select.value) || 3;
  const tbody = document.getElementById("tbody-vol-parafina-inputs");
  if (!tbody) return;

  let html = "";
  for (let i = 1; i <= cant; i++) {
    html += `
      <tr>
        <td class="text-center font-bold text-accent">${i}</td>
        <td><input type="number" step="0.1" class="input-control font-mono" id="vol-par-mm-${i}" placeholder="Ej. 123.8"></td>
        <td><input type="number" step="0.1" class="input-control font-mono" id="vol-par-mmp-${i}" placeholder="Ej. 131.2"></td>
        <td><input type="number" step="0.1" class="input-control font-mono" id="vol-par-msum-${i}" placeholder="Ej. 58.2"></td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function calcularVolumetrico() {
  try {
    const metodo = GeoState.ensayos.volumetrico.metodo;
    const wVal = document.getElementById("vol-humedad").value.trim();
    const w = wVal ? parseFloat(wVal) : null;
    const obs = document.getElementById("vol-obs").value.trim();

    if (w !== null && (isNaN(w) || w < 0)) {
      throw new Error("El contenido de humedad no puede ser un valor negativo.");
    }

    let pruebas = [];
    let prom_rho_humeda = 0;
    let prom_gamma_kn_m3 = 0;
    let prom_rho_seca = null;
    let prom_gamma_seca = null;

    if (metodo === "parafina") {
      const rhoP = parseFloat(document.getElementById("vol-rho-parafina").value) || 0.87;
      if (rhoP <= 0) throw new Error("La densidad de la parafina debe ser mayor que cero.");

      const cant = parseInt(document.getElementById("vol-cant").value) || 3;
      for (let i = 1; i <= cant; i++) {
        const mmVal = document.getElementById(`vol-par-mm-${i}`).value.trim();
        const mmpVal = document.getElementById(`vol-par-mmp-${i}`).value.trim();
        const msumVal = document.getElementById(`vol-par-msum-${i}`).value.trim();

        if (!mmVal && !mmpVal && !msumVal) continue;
        if (!mmVal || !mmpVal || !msumVal) {
          throw new Error(`En la Prueba ${i}, complete Masa Suelo (Mm), Masa Suelo+Parafina (Mm+p) y Masa Sumergida.`);
        }

        const mm = parseFloat(mmVal);
        const mmp = parseFloat(mmpVal);
        const msum = parseFloat(msumVal);

        if (isNaN(mm) || isNaN(mmp) || isNaN(msum)) throw new Error(`Los datos de la Prueba ${i} deben ser numéricos.`);
        if (mm <= 0 || msum < 0) throw new Error(`La masa de suelo y masa sumergida en Prueba ${i} deben ser válidas.`);
        if (mmp <= mm) throw new Error(`En la Prueba ${i}, la masa del suelo parafinado (Mm+p = ${mmp}g) debe ser mayor a la masa del suelo (Mm = ${mm}g).`);

        const vmp = mmp - msum;
        const mp = mmp - mm;
        const vp = mp / rhoP;
        const vm = vmp - vp;

        if (vm <= 0) throw new Error(`El volumen del suelo calculado en Prueba ${i} (${vm.toFixed(2)} cm³) es inválido.`);

        const gamma_m_gf = mm / vm; // g/cm³ o gf/cm³
        const gamma_m_kn = gamma_m_gf * 9.80665; // kN/m³

        let gamma_d_gf = null;
        let gamma_d_kn = null;
        if (w !== null) {
          gamma_d_gf = gamma_m_gf / (1.0 + w / 100.0);
          gamma_d_kn = gamma_m_kn / (1.0 + w / 100.0);
        }

        pruebas.push({
          num: i,
          mm,
          mmp,
          mp,
          vmp,
          vp,
          vm,
          gamma_m_gf,
          gamma_m_kn,
          gamma_d_gf,
          gamma_d_kn
        });
      }

      if (pruebas.length === 0) {
        throw new Error("Ingrese al menos una prueba válida para el ensayo de Muestra Parafinada (NTP 339.139).");
      }

      const n = pruebas.length;
      prom_rho_humeda = pruebas.reduce((acc, p) => acc + p.gamma_m_gf, 0) / n;
      prom_gamma_kn_m3 = pruebas.reduce((acc, p) => acc + p.gamma_m_kn, 0) / n;

      if (w !== null) {
        prom_rho_seca = prom_rho_humeda / (1.0 + w / 100.0);
        prom_gamma_seca = prom_gamma_kn_m3 / (1.0 + w / 100.0);
      }

    } else {
      // Método B: Cilindro
      const mmVal = document.getElementById("vol-molde").value.trim();
      const mtsVal = document.getElementById("vol-molde-suelo").value.trim();
      const vVal = document.getElementById("vol-volumen").value.trim();

      if (!mmVal || !mtsVal || !vVal) {
        throw new Error("Complete los campos requeridos: Masa del molde (Mm), Masa molde + suelo (Mts) y Volumen (V).");
      }

      const mm = parseFloat(mmVal);
      const mts = parseFloat(mtsVal);
      const v = parseFloat(vVal);

      if (isNaN(mm) || isNaN(mts) || isNaN(v)) throw new Error("Los valores medidos deben ser números válidos.");
      if (mm <= 0 || mts <= 0 || v <= 0) throw new Error("Las masas y el volumen deben ser mayores que cero.");
      if (mts <= mm) throw new Error("La masa recipiente + suelo húmedo debe ser mayor a la del recipiente vacío.");

      const masa_suelo = mts - mm;
      prom_rho_humeda = masa_suelo / v;
      prom_gamma_kn_m3 = prom_rho_humeda * 9.80665;

      if (w !== null) {
        prom_rho_seca = prom_rho_humeda / (1.0 + w / 100.0);
        prom_gamma_seca = prom_gamma_kn_m3 / (1.0 + w / 100.0);
      }

      pruebas.push({
        num: 1,
        mm,
        mts,
        masa_suelo,
        v,
        gamma_m_gf: prom_rho_humeda,
        gamma_m_kn: prom_gamma_kn_m3,
        gamma_d_gf: prom_rho_seca,
        gamma_d_kn: prom_gamma_seca
      });
    }

    GeoState.ensayos.volumetrico = {
      calculado: true,
      metodo,
      rho_parafina: document.getElementById("vol-rho-parafina") ? parseFloat(document.getElementById("vol-rho-parafina").value) : 0.87,
      pruebas,
      humedad: w,
      rho_humeda: prom_rho_humeda,
      rho_kg_m3: prom_rho_humeda * 1000.0,
      gamma_kn_m3: prom_gamma_kn_m3,
      gamma_gf_cm3: prom_rho_humeda,
      rho_seca: prom_rho_seca,
      rho_seca_kg_m3: prom_rho_seca ? prom_rho_seca * 1000.0 : null,
      gamma_seca: prom_gamma_seca,
      observaciones: obs
    };

    renderResultadosVolumetrico();
    updateDashboardSummary();
    showToast("Cálculo de peso volumétrico y densidad completado.");

  } catch (err) {
    alert("Error en datos de Peso Volumétrico:\n" + err.message);
  }
}

function renderResultadosVolumetrico() {
  const v = GeoState.ensayos.volumetrico;
  if (!v.calculado) return;

  document.getElementById("vol-results-placeholder").classList.add("hidden");
  document.getElementById("vol-results-content").classList.remove("hidden");

  document.getElementById("vol-res-rho").textContent = `${v.rho_humeda.toFixed(3)} g/cm³`;
  document.getElementById("vol-res-rho-kg").textContent = `${v.rho_kg_m3.toFixed(1)} kg/m³`;

  document.getElementById("vol-res-gamma").textContent = `${v.gamma_kn_m3.toFixed(3)} kN/m³`;
  document.getElementById("vol-res-gamma-gf").textContent = `${v.gamma_gf_cm3.toFixed(3)} gf/cm³`;

  const drySection = document.getElementById("vol-dry-section");
  if (v.humedad !== null && v.rho_seca !== null) {
    drySection.classList.remove("hidden");
    document.getElementById("vol-res-rhod").textContent = `${v.rho_seca.toFixed(3)} g/cm³`;
    document.getElementById("vol-res-rhod-kg").textContent = `${v.rho_seca_kg_m3.toFixed(1)} kg/m³`;
    document.getElementById("vol-res-gammad").textContent = `${v.gamma_seca.toFixed(3)} kN/m³`;
    document.getElementById("vol-res-w-applied").textContent = `Con w = ${v.humedad.toFixed(2)} %`;
  } else {
    drySection.classList.add("hidden");
  }

  const tbody = document.getElementById("tbody-vol-breakdown");
  const thead = document.getElementById("thead-vol-breakdown");
  tbody.innerHTML = "";

  if (v.metodo === "parafina") {
    thead.innerHTML = `
      <tr>
        <th>Prueba</th>
        <th>Masa Suelo (Mm) [g]</th>
        <th>Vol. Parafina (Vp) [cm³]</th>
        <th>Vol. Suelo (Vm) [cm³]</th>
        <th>γm [g/cm³]</th>
        <th>γm [kN/m³]</th>
      </tr>
    `;
    v.pruebas.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-center font-bold text-accent">${p.num}</td>
        <td class="font-mono text-right">${p.mm.toFixed(1)}</td>
        <td class="font-mono text-right">${p.vp.toFixed(2)}</td>
        <td class="font-mono text-right font-bold">${p.vm.toFixed(2)}</td>
        <td class="font-mono text-right font-bold text-primary">${p.gamma_m_gf.toFixed(3)}</td>
        <td class="font-mono text-right font-bold text-accent">${p.gamma_m_kn.toFixed(3)}</td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    thead.innerHTML = `
      <tr>
        <th>Molde</th>
        <th>Masa Molde (Mm) [g]</th>
        <th>Masa Neta (M) [g]</th>
        <th>Volumen (V) [cm³]</th>
        <th>ρm [g/cm³]</th>
        <th>γm [kN/m³]</th>
      </tr>
    `;
    const p = v.pruebas[0];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-center font-bold text-accent">1</td>
      <td class="font-mono text-right">${p.mm.toFixed(2)}</td>
      <td class="font-mono text-right font-bold">${p.masa_suelo.toFixed(2)}</td>
      <td class="font-mono text-right">${p.v.toFixed(1)}</td>
      <td class="font-mono text-right font-bold text-primary">${p.gamma_m_gf.toFixed(3)}</td>
      <td class="font-mono text-right font-bold text-accent">${p.gamma_m_kn.toFixed(3)}</td>
    `;
    tbody.appendChild(tr);
  }
}

function limpiarVolumetrico() {
  const cant = parseInt(document.getElementById("vol-cant").value) || 3;
  for (let i = 1; i <= cant; i++) {
    const el1 = document.getElementById(`vol-par-mm-${i}`);
    if (el1) el1.value = "";
    const el2 = document.getElementById(`vol-par-mmp-${i}`);
    if (el2) el2.value = "";
    const el3 = document.getElementById(`vol-par-msum-${i}`);
    if (el3) el3.value = "";
  }
  document.getElementById("vol-molde").value = "";
  document.getElementById("vol-molde-suelo").value = "";
  document.getElementById("vol-volumen").value = "944.0";
  document.getElementById("vol-humedad").value = "";
  document.getElementById("vol-obs").value = "";

  GeoState.ensayos.volumetrico.calculado = false;
  document.getElementById("vol-results-content").classList.add("hidden");
  document.getElementById("vol-results-placeholder").classList.remove("hidden");
  updateDashboardSummary();
  showToast("Datos de peso volumétrico reiniciados.");
}

function cargarDemoVolumetrico() {
  document.getElementById("vol-cant").value = "3";
  renderVolumetricoTable();

  // Cargar según datos oficiales de la guía UNI FIC (Anexo AT-PR.2-F1)
  document.getElementById("vol-par-mm-1").value = "123.8";
  document.getElementById("vol-par-mmp-1").value = "131.2";
  document.getElementById("vol-par-msum-1").value = (131.2 - 73.0).toFixed(1);

  document.getElementById("vol-par-mm-2").value = "105.4";
  document.getElementById("vol-par-mmp-2").value = "112.6";
  document.getElementById("vol-par-msum-2").value = (112.6 - 63.0).toFixed(1);

  document.getElementById("vol-par-mm-3").value = "104.9";
  document.getElementById("vol-par-mmp-3").value = "111.4";
  document.getElementById("vol-par-msum-3").value = (111.4 - 62.0).toFixed(1);

  document.getElementById("vol-rho-parafina").value = "0.87";

  if (GeoState.ensayos.humedad.calculado && GeoState.ensayos.humedad.promedio !== null) {
    document.getElementById("vol-humedad").value = GeoState.ensayos.humedad.promedio.toFixed(2);
  } else {
    document.getElementById("vol-humedad").value = "11.00";
  }

  document.getElementById("vol-obs").value = "Muestra inalterada de suelo cohesivo ensayada por el método de la parafina según NTP 339.139.";
  calcularVolumetrico();
}

// ===================================================================
// 6. LÓGICA DE ENSAYO 03: GRAVEDAD ESPECÍFICA DE SÓLIDOS (ASTM D854 / NTP 339.131)
// ===================================================================
function initGravedadEvents() {
  const gsCantSelect = document.getElementById("gs-cant");
  if (gsCantSelect) {
    gsCantSelect.addEventListener("change", renderGravedadTable);
    renderGravedadTable();
  }

  const tempInput = document.getElementById("gs-temp");
  const rhoInput = document.getElementById("gs-rho-w");

  if (tempInput && rhoInput) {
    tempInput.addEventListener("input", () => {
      const t = parseFloat(tempInput.value);
      if (!isNaN(t)) {
        const props = getWaterProperties(t);
        rhoInput.value = props.rho.toFixed(5);
      }
    });
  }

  document.getElementById("btn-calcular-gs").addEventListener("click", calcularGravedad);
  document.getElementById("btn-limpiar-gs").addEventListener("click", limpiarGravedad);
  document.getElementById("btn-fill-demo-gs").addEventListener("click", cargarDemoGravedad);

  document.getElementById("btn-exportar-pdf-gs").addEventListener("click", () => {
    if (!GeoState.ensayos.gravedad.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular'.");
      return;
    }
    generarPDFIndividual("gravedad");
  });
}

function renderGravedadTable() {
  const select = document.getElementById("gs-cant");
  const cant = parseInt(select.value) || 2;
  const tbody = document.getElementById("tbody-gs-inputs");
  if (!tbody) return;

  let html = "";
  for (let i = 1; i <= cant; i++) {
    html += `
      <tr>
        <td class="text-center font-bold text-accent">${i}</td>
        <td><input type="number" step="0.1" class="input-control font-mono" id="gs-temp-${i}" value="16.5" placeholder="°C"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="gs-mpsw-${i}" value="320.60" placeholder="Ej. 320.60"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="gs-ms-${i}" value="60.00" placeholder="Ej. 60.00"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="gs-mpw-${i}" value="282.20" placeholder="Ej. 282.20"></td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function calcularGravedad() {
  try {
    const obs = document.getElementById("gs-obs").value.trim();

    const pruebas = [];
    const cant = parseInt(document.getElementById("gs-cant").value) || 2;

    for (let i = 1; i <= cant; i++) {
      const tempVal = document.getElementById(`gs-temp-${i}`).value.trim();
      const mpwVal = document.getElementById(`gs-mpw-${i}`).value.trim();
      const msVal = document.getElementById(`gs-ms-${i}`).value.trim();
      const mpswVal = document.getElementById(`gs-mpsw-${i}`).value.trim();

      if (!tempVal && !mpwVal && !msVal && !mpswVal) continue;

      if (!tempVal || !mpwVal || !msVal || !mpswVal) {
        throw new Error(`En la Prueba ${i}, complete Temperatura, Mpw,t, Ms y Mpws,t.`);
      }

      let temp = parseFloat(tempVal);
      if (temp >= 100 && temp <= 500) {
        temp = temp / 10.0; // Corrección para ingresos como 210 -> 21.0
      }

      if (isNaN(temp) || temp < 0 || temp > 50) {
        throw new Error(`La temperatura en la Prueba ${i} debe estar entre 0 y 50 °C.`);
      }

      const waterProps = getWaterProperties(temp);
      const rho_w = waterProps.rho || waterProps.rho_w;
      const k = waterProps.k;

      const mp = 0; // Mp is no longer used, we only use Mpw directly
      const vp = null;
      const mpw = parseFloat(mpwVal);
      const ms = parseFloat(msVal);
      const mpsw = parseFloat(mpswVal);

      if (isNaN(mpw) || isNaN(ms) || isNaN(mpsw)) {
        throw new Error(`Las pesadas de la Prueba ${i} deben ser numéricas.`);
      }
      if (ms <= 0 || mpw <= 0 || mpsw <= 0) {
        throw new Error(`Las masas en Prueba ${i} deben ser mayores que cero.`);
      }

      // Masa de agua desalojada equivalente al volumen de sólidos:
      // V_s * rho_w = M_s + M_pw,t - M_pws,t
      const desalojada = ms + mpw - mpsw;

      if (desalojada <= 0) {
        throw new Error(
          `En la Prueba ${i}, la masa de agua desalojada es inválida (${desalojada.toFixed(2)} g).\n` +
          "Verifique que la masa con suelo y agua (Mpws,t = " + mpsw + "g) sea coherente con Ms y Mpw."
        );
      }

      const gt = ms / desalojada; // Gt a T° de ensayo
      const g20 = k * gt; // Gs corregido a 20°C

      pruebas.push({
        num: i,
        temp,
        rho_w,
        k,
        mp,
        vp,
        mpw,
        ms,
        mpsw,
        desalojada,
        gt,
        g20
      });
    }

    if (pruebas.length === 0) {
      throw new Error("Ingrese al menos una prueba picnométrica para calcular la Gravedad Específica.");
    }

    const n = pruebas.length;
    const prom_gt = pruebas.reduce((acc, p) => acc + p.gt, 0) / n;
    const prom_g20 = pruebas.reduce((acc, p) => acc + p.g20, 0) / n;
    const prom_temp = pruebas.reduce((acc, p) => acc + p.temp, 0) / n;
    const prom_rho_w = pruebas.reduce((acc, p) => acc + p.rho_w, 0) / n;
    const prom_k = pruebas.reduce((acc, p) => acc + p.k, 0) / n;

    GeoState.ensayos.gravedad = {
      calculado: true,
      temp: prom_temp,
      rho_w: prom_rho_w,
      k: prom_k,
      pruebas,
      gt: prom_gt,
      gs: prom_g20, // Gs final a 20°C
      observaciones: obs
    };

    renderResultadosGravedad();
    updateDashboardSummary();
    showToast(`Gravedad Específica completada: Gs @ 20°C = ${prom_g20.toFixed(3)}`);

  } catch (err) {
    alert("Error en datos de Gravedad Específica:\n" + err.message);
  }
}

function renderResultadosGravedad() {
  const g = GeoState.ensayos.gravedad;
  if (!g.calculado) return;

  document.getElementById("gs-results-placeholder").classList.add("hidden");
  document.getElementById("gs-results-content").classList.remove("hidden");

  document.getElementById("gs-res-gs").textContent = g.gs.toFixed(3);
  document.getElementById("gs-res-gt").textContent = g.gt.toFixed(3);
  document.getElementById("gs-res-k").textContent = g.k.toFixed(5);
  document.getElementById("gs-res-temp-label").textContent = `A Tt = ${g.temp.toFixed(1)} °C`;
  document.getElementById("gs-res-rho-label").textContent = `ρw,t = ${g.rho_w.toFixed(5)} g/mL`;

  let interpretacion = "Rango normal para suelos minerales";
  if (g.gs < 2.5) {
    interpretacion = "Valor bajo (posible presencia de materia orgánica o cenizas)";
  } else if (g.gs > 2.8) {
    interpretacion = "Valor alto (posible presencia de minerales de hierro pesados o basalto)";
  } else {
    interpretacion = "Rango geotécnico típico (suelos arcillosos / limosos / cuarzosos)";
  }
  document.getElementById("gs-res-interpretacion").textContent = interpretacion;

  const tbody = document.getElementById("tbody-gs-breakdown");
  tbody.innerHTML = "";

  g.pruebas.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-center font-bold text-accent">${p.num}</td>
      <td class="font-mono text-right">${p.ms.toFixed(2)}</td>
      <td class="font-mono text-right">${p.desalojada.toFixed(2)}</td>
      <td class="font-mono text-right font-bold text-primary">${p.gt.toFixed(3)}</td>
      <td class="font-mono text-right font-bold text-accent">${p.g20.toFixed(3)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function limpiarGravedad() {
  const cant = parseInt(document.getElementById("gs-cant").value) || 2;
  for (let i = 1; i <= cant; i++) {
    const t = document.getElementById(`gs-temp-${i}`);
    if (t) t.value = "";
    const w1 = document.getElementById(`gs-mpw-${i}`);
    if (w1) w1.value = "";
    const w2 = document.getElementById(`gs-ms-${i}`);
    if (w2) w2.value = "";
    const w3 = document.getElementById(`gs-mpsw-${i}`);
    if (w3) w3.value = "";
  }
  document.getElementById("gs-obs").value = "";

  GeoState.ensayos.gravedad.calculado = false;
  document.getElementById("gs-results-content").classList.add("hidden");
  document.getElementById("gs-results-placeholder").classList.remove("hidden");
  updateDashboardSummary();
  showToast("Datos de gravedad específica reiniciados.");
}

function cargarDemoGravedad() {
  document.getElementById("gs-cant").value = "2";
  renderGravedadTable();

  // Cargar según datos oficiales de la guía UNI FIC (Anexo AT-PR.3-F1 - Página 12)
  document.getElementById("gs-temp-1").value = "16.5";
  document.getElementById("gs-mpw-1").value = "282.20";
  document.getElementById("gs-ms-1").value = "60.00";
  document.getElementById("gs-mpsw-1").value = "320.60";

  document.getElementById("gs-temp-2").value = "16.5";
  document.getElementById("gs-mpw-2").value = "278.70";
  document.getElementById("gs-ms-2").value = "63.00";
  document.getElementById("gs-mpsw-2").value = "319.00";

  document.getElementById("gs-obs").value = "Picnómetro calibrado a 16.5 °C con agua destilada y desairado por vacío durante 2 horas según ASTM D854.";
  calcularGravedad();
}

// ===================================================================
// 7. DASHBOARD, RESUMEN CONSOLIDADO Y BOTÓN EXTERIOR DE PDF GENERAL
// ===================================================================
function initDashboardEvents() {
  document.getElementById("btn-exportar-consolidado-dashboard").addEventListener("click", () => {
    const { humedad, volumetrico, gravedad } = GeoState.ensayos;
    const algunoCalculado = humedad.calculado || volumetrico.calculado || gravedad.calculado;

    if (!algunoCalculado) {
      alert("Aún no se ha calculado ningún ensayo.\n\nPara emitir el Informe General Consolidado, debe ingresar datos y presionar '⚡ Calcular' en al menos uno de los tres ensayos de Laboratorio 1.");
      return;
    }

    const todosCalculados = humedad.calculado && volumetrico.calculado && gravedad.calculado;
    if (!todosCalculados) {
      const confirmacion = confirm(
        "No todos los 3 ensayos han sido calculados aún:\n\n" +
        `• 01. Humedad: ${humedad.calculado ? '✅ Calculado' : '⏳ Pendiente'}\n` +
        `• 02. Peso Volumétrico: ${volumetrico.calculado ? '✅ Calculado' : '⏳ Pendiente'}\n` +
        `• 03. Gravedad Específica: ${gravedad.calculado ? '✅ Calculado' : '⏳ Pendiente'}\n\n` +
        "¿Desea generar el Informe General Consolidado incluyendo los ensayos disponibles?"
      );
      if (!confirmacion) return;
    }

    generarPDFConsolidado();
  });

  document.getElementById("btn-cargar-todo-ejemplo").addEventListener("click", () => {
    cargarDemoHumedad();
    cargarDemoVolumetrico();
    cargarDemoGravedad();
    showToast("Datos de demostración completos cargados en los 3 ensayos.");
  });

  document.getElementById("btn-sync-all").addEventListener("click", () => {
    updateDashboardSummary();
    showToast("Cálculos y relaciones geotécnicas sincronizadas.");
  });
}

function updateDashboardPills() {
  const { humedad, volumetrico, gravedad } = GeoState.ensayos;

  const setBadge = (elId, status, text) => {
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = text;
      el.className = status ? "badge badge-success" : "badge badge-pending";
    }
  };

  setBadge("pill-summary-humedad", humedad.calculado, `01. Humedad: ${humedad.calculado ? '✅' : '⏳'}`);
  setBadge("pill-summary-vol", volumetrico.calculado, `02. Volumétrico: ${volumetrico.calculado ? '✅' : '⏳'}`);
  setBadge("pill-summary-gs", gravedad.calculado, `03. Gs: ${gravedad.calculado ? '✅' : '⏳'}`);

  const setCardBadge = (elId, status) => {
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = status ? "Calculado" : "Sin calcular";
      el.className = status ? "card-status calculated" : "card-status";
    }
  };

  setCardBadge("badge-card-humedad", humedad.calculado);
  setCardBadge("badge-card-vol", volumetrico.calculado);
  setCardBadge("badge-card-gs", gravedad.calculado);

  document.getElementById("check-humedad").textContent = humedad.calculado ? "✅ Humedad por secado" : "⏳ Humedad por secado";
  document.getElementById("check-vol").textContent = volumetrico.calculado ? "✅ Densidad y pesos volumétricos" : "⏳ Densidad y pesos volumétricos";
  document.getElementById("check-gs").textContent = gravedad.calculado ? "✅ Gravedad específica de sólidos" : "⏳ Gravedad específica de sólidos";
}

function updateDashboardSummary() {
  updateDashboardPills();
  const { humedad, volumetrico, gravedad } = GeoState.ensayos;

  if (humedad.calculado && humedad.promedio !== null) {
    document.getElementById("val-preview-w").textContent = `${humedad.promedio.toFixed(2)} %`;
    document.getElementById("td-sum-w").textContent = `${humedad.promedio.toFixed(2)}`;
    document.getElementById("td-status-w").innerHTML = `<span class="badge badge-success">Completado</span>`;
  } else {
    document.getElementById("val-preview-w").textContent = "—";
    document.getElementById("td-sum-w").textContent = "—";
    document.getElementById("td-status-w").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
  }

  if (volumetrico.calculado) {
    document.getElementById("val-preview-gamma").textContent = `${volumetrico.gamma_kn_m3.toFixed(3)} kN/m³`;
    document.getElementById("val-preview-gammad").textContent = volumetrico.gamma_seca !== null ? `${volumetrico.gamma_seca.toFixed(3)} kN/m³` : "N/A";

    document.getElementById("td-sum-rho").textContent = volumetrico.rho_humeda.toFixed(3);
    document.getElementById("td-status-vol-1").innerHTML = `<span class="badge badge-success">Completado</span>`;

    document.getElementById("td-sum-gamma").textContent = volumetrico.gamma_kn_m3.toFixed(3);
    document.getElementById("td-status-vol-2").innerHTML = `<span class="badge badge-success">Completado</span>`;

    if (volumetrico.rho_seca !== null) {
      document.getElementById("td-sum-rhod").textContent = volumetrico.rho_seca.toFixed(3);
      document.getElementById("td-status-vol-3").innerHTML = `<span class="badge badge-success">Completado</span>`;
      document.getElementById("td-sum-gammad").textContent = volumetrico.gamma_seca.toFixed(3);
      document.getElementById("td-status-vol-4").innerHTML = `<span class="badge badge-success">Completado</span>`;
    } else {
      document.getElementById("td-sum-rhod").textContent = "—";
      document.getElementById("td-status-vol-3").innerHTML = `<span class="badge badge-pending">Requiere w</span>`;
      document.getElementById("td-sum-gammad").textContent = "—";
      document.getElementById("td-status-vol-4").innerHTML = `<span class="badge badge-pending">Requiere w</span>`;
    }
  } else {
    document.getElementById("val-preview-gamma").textContent = "—";
    document.getElementById("val-preview-gammad").textContent = "—";
    document.getElementById("td-sum-rho").textContent = "—";
    document.getElementById("td-sum-gamma").textContent = "—";
    document.getElementById("td-sum-rhod").textContent = "—";
    document.getElementById("td-sum-gammad").textContent = "—";
    document.getElementById("td-status-vol-1").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
    document.getElementById("td-status-vol-2").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
    document.getElementById("td-status-vol-3").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
    document.getElementById("td-status-vol-4").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
  }

  if (gravedad.calculado && gravedad.gs !== null) {
    document.getElementById("val-preview-gs").textContent = gravedad.gs.toFixed(3);
    document.getElementById("td-sum-gs").textContent = gravedad.gs.toFixed(3);
    document.getElementById("td-status-gs").innerHTML = `<span class="badge badge-success">Completado</span>`;
  } else {
    document.getElementById("val-preview-gs").textContent = "—";
    document.getElementById("td-sum-gs").textContent = "—";
    document.getElementById("td-status-gs").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
  }

  // Relaciones Geotécnicas Derivadas (e0, n, Sr)
  const gamma_w = 9.80665;
  if (volumetrico.calculado && volumetrico.gamma_seca !== null && gravedad.calculado && gravedad.gs !== null) {
    const e0 = (gravedad.gs * gamma_w) / volumetrico.gamma_seca - 1.0;
    if (e0 > 0) {
      const n = (e0 / (1.0 + e0)) * 100.0;
      document.getElementById("td-sum-e").textContent = e0.toFixed(3);
      document.getElementById("td-status-e").innerHTML = `<span class="badge badge-success">Calculado</span>`;

      document.getElementById("td-sum-n").textContent = `${n.toFixed(2)} %`;
      document.getElementById("td-status-n").innerHTML = `<span class="badge badge-success">Calculado</span>`;

      const wEfectivo = volumetrico.humedad !== null ? volumetrico.humedad : (humedad.promedio !== null ? humedad.promedio : null);
      if (wEfectivo !== null) {
        const sr = (wEfectivo * gravedad.gs) / e0;
        document.getElementById("td-sum-sr").textContent = `${sr.toFixed(2)} %`;
        document.getElementById("td-status-sr").innerHTML = `<span class="badge badge-success">Calculado</span>`;
      } else {
        document.getElementById("td-sum-sr").textContent = "—";
        document.getElementById("td-status-sr").innerHTML = `<span class="badge badge-pending">Requiere w</span>`;
      }
    } else {
      document.getElementById("td-sum-e").textContent = "Incoherente";
      document.getElementById("td-status-e").innerHTML = `<span class="badge badge-pending">Verificar datos</span>`;
    }
  } else {
    document.getElementById("td-sum-e").textContent = "—";
    document.getElementById("td-status-e").innerHTML = `<span class="badge badge-pending">Requiere γd y Gs</span>`;
    document.getElementById("td-sum-n").textContent = "—";
    document.getElementById("td-status-n").innerHTML = `<span class="badge badge-pending">Requiere e₀</span>`;
    document.getElementById("td-sum-sr").textContent = "—";
    document.getElementById("td-status-sr").innerHTML = `<span class="badge badge-pending">Requiere w, Gs, e₀</span>`;
  }
}

// ===================================================================
// 8. DASHBOARD LABORATORIO 2 Y SÍNTESIS
// ===================================================================
function initDashboardLab2Events() {
  const btnExportar = document.getElementById("btn-exportar-consolidado-lab2");
  if (btnExportar) {
    btnExportar.addEventListener("click", () => {
      const g = GeoState.ensayos.granulometria;
      if (!g.calculado) {
        alert("Para emitir el Informe General de Laboratorio 2, primero ingrese las pesadas y presione '⚡ Calcular Granulometría'.");
        return;
      }
      generarPDFConsolidadoLab2();
    });
  }

  const btnCargarDemoDash = document.getElementById("btn-cargar-demo-lab2-dash");
  if (btnCargarDemoDash) {
    btnCargarDemoDash.addEventListener("click", () => {
      cargarDemoGranuSimple();
      showToast("Datos de demostración UNI FIC cargados en Laboratorio 2.");
    });
  }

  const btnSyncLab2 = document.getElementById("btn-sync-lab2");
  if (btnSyncLab2) {
    btnSyncLab2.addEventListener("click", () => {
      updateDashboardLab2Summary();
      showToast("Resultados de Laboratorio 2 sincronizados.");
    });
  }
}

function updateDashboardLab2Summary() {
  const g = GeoState.ensayos.granulometria;

  const setBadge = (elId, status, text) => {
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = text;
      el.className = status ? "badge badge-success" : "badge badge-pending";
    }
  };

  setBadge("pill-lab2-tamizado", g.calculado, `Tamizado: ${g.calculado ? '✅' : '⏳'}`);
  setBadge("pill-lab2-curva", g.calculado, `Curva: ${g.calculado ? '✅' : '⏳'}`);
  setBadge("pill-lab2-sucs", g.calculado, `SUCS: ${g.calculado ? (g.sucs_simbolo || '✅') : '⏳'}`);

  const checkLavado = document.getElementById("check-lab2-lavado");
  if (checkLavado) checkLavado.textContent = g.calculado ? "✅ Tamizado con lavado en malla N°200" : "⏳ Tamizado con lavado en malla N°200";
  const checkCurva = document.getElementById("check-lab2-curva");
  if (checkCurva) checkCurva.textContent = g.calculado ? "✅ Curva granulométrica semilogarítmica" : "⏳ Curva granulométrica semilogarítmica";
  const checkGrad = document.getElementById("check-lab2-gradacion");
  if (checkGrad) checkGrad.textContent = g.calculado ? `✅ Coeficientes (${g.sucs_simbolo || 'SUCS'})` : "⏳ Coeficientes Cu, Cc y SUCS";

  const setCardBadge = (elId, status) => {
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = status ? "Calculado" : "Sin calcular";
      el.className = status ? "card-status calculated" : "card-status";
    }
  };

  setCardBadge("badge-card-lab2-masas", g.calculado);
  setCardBadge("badge-card-lab2-fracciones", g.calculado);
  setCardBadge("badge-card-lab2-sucs", g.calculado);

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  if (g.calculado) {
    setEl("val-preview-granu-mtotal", `${g.masa_total.toFixed(1)} g`);
    setEl("val-preview-granu-plavado", `${g.perdida_lavado.toFixed(1)} g (${g.porc_perdida_lavado.toFixed(1)}%)`);
    setEl("val-preview-lab2-grava", `${g.grava.toFixed(1)} %`);
    setEl("val-preview-lab2-arena", `${g.arena.toFixed(1)} %`);
    setEl("val-preview-lab2-finos", `${g.finos.toFixed(1)} %`);
    setEl("val-preview-lab2-cu-cc", `Cu=${g.cu ? g.cu.toFixed(1) : '—'} | Cc=${g.cc ? g.cc.toFixed(2) : '—'}`);
    setEl("val-preview-lab2-sucs", g.sucs_simbolo || '—');

    // Tabla de resumen de Lab 2
    setEl("td-lab2-w1", `${g.masa_total.toFixed(2)}`);
    setHtml("td-status-lab2-w1", '<span class="badge badge-success">Completado</span>');

    setEl("td-lab2-w0", `${g.masa_lavada.toFixed(2)}`);
    setHtml("td-status-lab2-w0", '<span class="badge badge-success">Completado</span>');

    setEl("td-lab2-perdidaw", `${g.perdida_lavado.toFixed(2)} g (${g.porc_perdida_lavado.toFixed(2)}%)`);
    setHtml("td-status-lab2-perdidaw", '<span class="badge badge-success">Completado</span>');

    const errOk = g.porc_error <= 1.0;
    setEl("td-lab2-error", `${g.porc_error.toFixed(2)} % (${g.error_gramos.toFixed(2)} g)`);
    setHtml("td-status-lab2-error", errOk ? '<span class="badge badge-success">Aceptado (&le; 1%)</span>' : '<span class="badge badge-pending">Revisar (&gt; 1%)</span>');

    setEl("td-lab2-grava", `${g.grava.toFixed(2)} %`);
    setHtml("td-status-lab2-grava", '<span class="badge badge-success">Calculado</span>');

    setEl("td-lab2-arena", `${g.arena.toFixed(2)} %`);
    setHtml("td-status-lab2-arena", '<span class="badge badge-success">Calculado</span>');

    setEl("td-lab2-finos", `${g.finos.toFixed(2)} %`);
    setHtml("td-status-lab2-finos", '<span class="badge badge-success">Calculado</span>');

    const dStr = `${g.d10 ? g.d10.toFixed(3) : '—'} / ${g.d30 ? g.d30.toFixed(3) : '—'} / ${g.d60 ? g.d60.toFixed(3) : '—'}`;
    setEl("td-lab2-diametros", dStr);
    setHtml("td-status-lab2-diametros", '<span class="badge badge-success">Calculado</span>');

    setEl("td-lab2-cu", g.cu ? g.cu.toFixed(2) : '—');
    setHtml("td-status-lab2-cu", g.cu ? '<span class="badge badge-success">Calculado</span>' : '<span class="badge badge-pending">N/A</span>');

    setEl("td-lab2-cc", g.cc ? g.cc.toFixed(2) : '—');
    setHtml("td-status-lab2-cc", g.cc ? '<span class="badge badge-success">Calculado</span>' : '<span class="badge badge-pending">N/A</span>');

    setEl("td-lab2-sucs", `${g.sucs_simbolo} (${g.sucs_descripcion})`);
    setHtml("td-status-lab2-sucs-badge", '<span class="badge badge-success">Clasificado</span>');
  } else {
    setEl("val-preview-granu-mtotal", "—");
    setEl("val-preview-granu-plavado", "—");
    setEl("val-preview-lab2-grava", "—");
    setEl("val-preview-lab2-arena", "—");
    setEl("val-preview-lab2-finos", "—");
    setEl("val-preview-lab2-cu-cc", "—");
    setEl("val-preview-lab2-sucs", "—");

    setEl("td-lab2-w1", "—");
    setEl("td-lab2-w0", "—");
    setEl("td-lab2-perdidaw", "—");
    setEl("td-lab2-error", "—");
    setEl("td-lab2-grava", "—");
    setEl("td-lab2-arena", "—");
    setEl("td-lab2-finos", "—");
    setEl("td-lab2-diametros", "—");
    setEl("td-lab2-cu", "—");
    setEl("td-lab2-cc", "—");
    setEl("td-lab2-sucs", "—");

    ["w1", "w0", "perdidaw", "error", "grava", "arena", "finos", "diametros", "cu", "cc", "sucs-badge"].forEach(suffix => {
      setHtml(`td-status-lab2-${suffix}`, '<span class="badge badge-pending">Sin procesar</span>');
    });
  }
}

// ===================================================================
// 9. LÓGICA DE ENSAYO 04: ANÁLISIS GRANULOMÉTRICO (ASTM D6913 / NTP 339.128)
// ===================================================================
let granuChartInstance = null;

function initGranulometriaEvents() {
  renderGranulometriaTable();

  const w1Input = document.getElementById("granu-masa-total");
  const w0Input = document.getElementById("granu-masa-lavada");
  const updatePerdidaLive = () => {
    const w1 = parseFloat(w1Input ? w1Input.value : 0) || 0;
    const w0 = parseFloat(w0Input ? w0Input.value : 0) || 0;
    const perdida = w1 > 0 && w0 > 0 && w1 >= w0 ? (w1 - w0) : 0;
    const pct = w1 > 0 ? ((perdida / w1) * 100) : 0;
    const el = document.getElementById("granu-live-perdida");
    if (el) {
      el.textContent = `${perdida.toFixed(2)} g (${pct.toFixed(2)} %)`;
    }
  };
  if (w1Input) w1Input.addEventListener("input", updatePerdidaLive);
  if (w0Input) w0Input.addEventListener("input", updatePerdidaLive);

  document.getElementById("btn-calcular-granu").addEventListener("click", calcularGranulometria);
  document.getElementById("btn-limpiar-granu").addEventListener("click", limpiarGranulometria);
  document.getElementById("btn-fill-demo-granu-simple").addEventListener("click", cargarDemoGranuSimple);
  document.getElementById("btn-fill-demo-granu-compuesto").addEventListener("click", cargarDemoGranuCompuesto);

  document.getElementById("btn-exportar-pdf-granu").addEventListener("click", () => {
    if (!GeoState.ensayos.granulometria.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular Granulometría'.");
      return;
    }
    generarPDFIndividual("granulometria");
  });
}

function renderGranulometriaTable() {
  const tbody = document.getElementById("tbody-granu-inputs");
  if (!tbody) return;

  let html = "";
  ASTM_SIEVES.forEach((s, idx) => {
    html += `
      <tr>
        <td class="text-center font-bold text-accent">${idx + 1}</td>
        <td><strong>${s.nombre}</strong> <span style="font-size:0.75rem; color:var(--neutral-muted);">(${s.desc})</span></td>
        <td class="font-mono text-center">${s.abertura > 0 ? s.abertura.toFixed(3) : '—'}</td>
        <td>
          <input type="number" step="0.01" class="input-control font-mono" id="granu-ret-${s.id}" placeholder="0.00" value="0.00">
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function calcularGranulometria() {
  try {
    const w1Val = document.getElementById("granu-masa-total").value.trim();
    const w0Val = document.getElementById("granu-masa-lavada").value.trim();
    const obs = document.getElementById("granu-obs").value.trim();

    if (!w1Val) throw new Error("Ingrese la Masa Seca Inicial de la muestra (W1).");
    if (!w0Val) throw new Error("Ingrese la Masa Seca Lavada por tamiz N°200 (W0).");

    const w1 = parseFloat(w1Val);
    const w0 = parseFloat(w0Val);

    if (isNaN(w1) || w1 <= 0) throw new Error("La masa seca inicial (W1) debe ser un número mayor a cero.");
    if (isNaN(w0) || w0 <= 0) throw new Error("La masa seca lavada (W0) debe ser un número mayor a cero.");
    if (w0 > w1) throw new Error(`La masa seca lavada (W0 = ${w0}g) no puede ser mayor a la masa seca inicial (W1 = ${w1}g).`);

    const perdida_lavado = w1 - w0;
    const porc_perdida_lavado = (perdida_lavado / w1) * 100.0;

    let suma_retenido = 0;
    const items = [];

    ASTM_SIEVES.forEach(s => {
      const input = document.getElementById(`granu-ret-${s.id}`);
      const val = input ? parseFloat(input.value) : 0;
      const ret = isNaN(val) || val < 0 ? 0 : val;
      suma_retenido += ret;
      items.push({
        id: s.id,
        nombre: s.nombre,
        abertura: s.abertura,
        desc: s.desc,
        retenido: ret
      });
    });

    if (suma_retenido <= 0) {
      throw new Error("Ingrese los valores de masa retenida en los tamices.");
    }

    const error_gramos = w0 - suma_retenido;
    const porc_error = (Math.abs(error_gramos) / w0) * 100.0;

    let maxRetIdx = -1;
    let maxRetVal = -1;
    items.forEach((item, idx) => {
      if (item.abertura > 0 && item.retenido > maxRetVal) {
        maxRetVal = item.retenido;
        maxRetIdx = idx;
      }
    });

    let acumulado_retenido = 0;
    const tamicesResultado = items.map((item, idx) => {
      let corregido = item.retenido;
      if (porc_error <= 1.0 && idx === maxRetIdx) {
        corregido += error_gramos;
      }
      const porc_parcial = (corregido / w1) * 100.0;
      acumulado_retenido += porc_parcial;
      let porc_pasa = 100.0 - acumulado_retenido;
      if (porc_pasa < 0) porc_pasa = 0;

      return {
        ...item,
        corregido,
        porc_parcial,
        porc_acumulado: acumulado_retenido,
        porc_pasa
      };
    });

    const itemN4 = tamicesResultado.find(t => t.id === 'n4') || { porc_pasa: 40 };
    const itemN200 = tamicesResultado.find(t => t.id === 'n200') || { porc_pasa: 10 };

    const grava = 100.0 - itemN4.porc_pasa;
    const finos = itemN200.porc_pasa;
    const arena = Math.max(0, 100.0 - grava - finos);

    const puntosCurva = tamicesResultado.filter(t => t.abertura > 0);
    puntosCurva.sort((a, b) => b.abertura - a.abertura);

    function findDiameter(pctTarget) {
      for (let i = 0; i < puntosCurva.length - 1; i++) {
        const p1 = puntosCurva[i];
        const p2 = puntosCurva[i + 1];
        if ((p1.porc_pasa >= pctTarget && p2.porc_pasa <= pctTarget) ||
          (p1.porc_pasa <= pctTarget && p2.porc_pasa >= pctTarget)) {
          if (p1.porc_pasa === p2.porc_pasa) return p1.abertura;
          if (p1.abertura <= 0 || p2.abertura <= 0) return null;
          const logD1 = Math.log10(p1.abertura);
          const logD2 = Math.log10(p2.abertura);
          const logDx = logD1 + ((pctTarget - p1.porc_pasa) / (p2.porc_pasa - p1.porc_pasa)) * (logD2 - logD1);
          return Math.pow(10, logDx);
        }
      }
      return null;
    }

    const d10 = findDiameter(10.0);
    const d30 = findDiameter(30.0);
    const d60 = findDiameter(60.0);
    const d85 = findDiameter(85.0);

    let cu = (d60 && d10 && d10 > 0) ? (d60 / d10) : null;
    let cc = (d30 && d10 && d60 && d10 > 0 && d60 > 0) ? (Math.pow(d30, 2) / (d10 * d60)) : null;

    let sucs_simbolo = "—";
    let sucs_desc = "Suelo granular";

    if (finos >= 50.0) {
      sucs_simbolo = "FINO";
      sucs_desc = "Suelo de grano fino (Limo / Arcilla)";
    } else {
      const predominaGrava = grava > arena;
      if (predominaGrava) {
        if (finos < 5.0) {
          if (cu && cu >= 4.0 && cc && cc >= 1.0 && cc <= 3.0) {
            sucs_simbolo = "GW";
            sucs_desc = "Grava bien graduada con arena";
          } else {
            sucs_simbolo = "GP";
            sucs_desc = "Grava pobremente graduada con arena";
          }
        } else if (finos > 12.0) {
          sucs_simbolo = "GM";
          sucs_desc = "Grava limosa con arena";
        } else {
          sucs_simbolo = (cu && cu >= 4.0 && cc && cc >= 1.0 && cc <= 3.0) ? "GW-GM" : "GP-GM";
          sucs_desc = "Grava con finos limosos (doble símbolo)";
        }
      } else {
        if (finos < 5.0) {
          if (cu && cu >= 6.0 && cc && cc >= 1.0 && cc <= 3.0) {
            sucs_simbolo = "SW";
            sucs_desc = "Arena bien graduada con gravas";
          } else {
            sucs_simbolo = "SP";
            sucs_desc = "Arena pobremente graduada con gravas";
          }
        } else if (finos > 12.0) {
          sucs_simbolo = "SM";
          sucs_desc = "Arena limosa con gravas";
        } else {
          sucs_simbolo = (cu && cu >= 6.0 && cc && cc >= 1.0 && cc <= 3.0) ? "SW-SM" : "SP-SM";
          sucs_desc = "Arena bien graduada con limo y gravas";
        }
      }
    }

    GeoState.ensayos.granulometria = {
      calculado: true,
      metodo: "simple",
      masa_total: w1,
      masa_lavada: w0,
      perdida_lavado,
      porc_perdida_lavado,
      tamices: tamicesResultado,
      suma_retenido,
      error_gramos,
      porc_error,
      grava,
      arena,
      finos,
      d10,
      d30,
      d60,
      d85,
      cu,
      cc,
      sucs_simbolo,
      sucs_descripcion: sucs_desc,
      observaciones: obs,
      encabezado: capturarEncabezadoGranu()
    };

    sincronizarEncabezadoGranuAProyecto(GeoState.ensayos.granulometria.encabezado);
    renderResultadosGranulometria();
    updateDashboardLab2Summary();
    showToast(`Granulometría calculada: ${sucs_simbolo} (${sucs_desc})`);

  } catch (err) {
    alert("Error en datos de Granulometría:\n" + err.message);
  }
}

function renderResultadosGranulometria() {
  const g = GeoState.ensayos.granulometria;
  if (!g.calculado) return;

  document.getElementById("granu-results-placeholder").classList.add("hidden");
  document.getElementById("granu-results-content").classList.remove("hidden");

  document.getElementById("granu-res-sucs-symbol").textContent = g.sucs_simbolo;
  document.getElementById("granu-res-sucs-desc").textContent = g.sucs_descripcion;

  document.getElementById("granu-res-grava").textContent = `${g.grava.toFixed(1)} %`;
  document.getElementById("granu-res-arena").textContent = `${g.arena.toFixed(1)} %`;
  document.getElementById("granu-res-finos").textContent = `${g.finos.toFixed(1)} %`;

  const d10Str = g.d10 ? `D10: ${g.d10.toFixed(3)} mm` : 'D10: —';
  const d30Str = g.d30 ? `D30: ${g.d30.toFixed(3)} mm` : 'D30: —';
  const d60Str = g.d60 ? `D60: ${g.d60.toFixed(3)} mm` : 'D60: —';
  const d85Str = g.d85 ? `D85: ${g.d85.toFixed(3)} mm` : 'D85: —';
  document.getElementById("granu-res-d-values").textContent = `${d10Str} • ${d30Str} • ${d60Str}`;
  document.getElementById("granu-res-d85").textContent = d85Str;

  const cuStr = g.cu ? `Cu = ${g.cu.toFixed(2)}` : 'Cu = —';
  const ccStr = g.cc ? `Cc = ${g.cc.toFixed(2)}` : 'Cc = —';
  document.getElementById("granu-res-cu-cc").textContent = `${cuStr} | ${ccStr}`;

  let evalGrad = "Gradación por evaluar";
  if (g.cu && g.cc) {
    if ((g.grava > g.arena && g.cu >= 4 && g.cc >= 1 && g.cc <= 3) ||
      (g.arena >= g.grava && g.cu >= 6 && g.cc >= 1 && g.cc <= 3)) {
      evalGrad = "✅ Suelo bien graduado (buena distribución)";
    } else {
      evalGrad = "⚠️ Suelo pobremente / uniformemente graduado";
    }
  }
  document.getElementById("granu-res-gradacion-eval").textContent = evalGrad;

  const errStatus = g.porc_error <= 1.0 ? '✅ Conforme (&le; 1.0%)' : '⚠️ No conforme (&gt; 1.0%)';
  document.getElementById("granu-res-error-text").textContent =
    `ΔError = ${g.porc_error.toFixed(2)} % (${g.error_gramos.toFixed(2)} g) • Retenido sumado: ${g.suma_retenido.toFixed(2)} g • Tolerancia ASTM D6913: ${errStatus}`;

  const tbody = document.getElementById("tbody-granu-breakdown");
  tbody.innerHTML = "";
  g.tamices.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${t.nombre}</strong></td>
      <td class="font-mono text-center">${t.abertura > 0 ? t.abertura.toFixed(3) : '—'}</td>
      <td class="font-mono text-right">${t.retenido.toFixed(2)}</td>
      <td class="font-mono text-right font-bold">${t.corregido.toFixed(2)}</td>
      <td class="font-mono text-right">${t.porc_parcial.toFixed(2)} %</td>
      <td class="font-mono text-right">${t.porc_acumulado.toFixed(2)} %</td>
      <td class="font-mono text-right font-bold text-primary">${t.porc_pasa.toFixed(2)} %</td>
    `;
    tbody.appendChild(tr);
  });

  renderGraficoGranulometria(g.tamices);
}

function renderGraficoGranulometria(puntos) {
  const canvas = document.getElementById("granu-chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (granuChartInstance) {
    granuChartInstance.destroy();
  }

  const dataPoints = puntos
    .filter(p => p.abertura > 0)
    .sort((a, b) => b.abertura - a.abertura)
    .map(p => ({ x: p.abertura, y: p.porc_pasa, name: p.nombre }));

  granuChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: '% Que Pasa (ASTM D6913)',
        data: dataPoints,
        borderColor: '#1565c0',
        backgroundColor: 'rgba(21, 101, 192, 0.1)',
        borderWidth: 2.5,
        pointBackgroundColor: '#b71c1c',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 4.5,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.15
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'logarithmic',
          min: 0.01,
          max: 100,
          reverse: true,
          title: {
            display: true,
            text: 'Abertura del Tamiz (mm) [Escala Logarítmica]',
            font: { weight: 'bold', size: 12 }
          },
          grid: {
            color: '#e2e8f0'
          }
        },
        y: {
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Porcentaje Acumulado Que Pasa (%)',
            font: { weight: 'bold', size: 12 }
          },
          ticks: {
            stepSize: 10
          },
          grid: {
            color: '#e2e8f0'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const pt = context.raw;
              return `${pt.name || ''}: Abertura = ${pt.x.toFixed(3)} mm | Pasa = ${pt.y.toFixed(2)} %`;
            }
          }
        }
      }
    }
  });
}

function limpiarGranulometria() {
  document.getElementById("granu-masa-total").value = "";
  document.getElementById("granu-masa-lavada").value = "";
  document.getElementById("granu-obs").value = "";

  ASTM_SIEVES.forEach(s => {
    const input = document.getElementById(`granu-ret-${s.id}`);
    if (input) input.value = "0.00";
  });

  const perdidaEl = document.getElementById("granu-live-perdida");
  if (perdidaEl) perdidaEl.textContent = "0.00 g (0.00 %)";

  GeoState.ensayos.granulometria.calculado = false;
  document.getElementById("granu-results-content").classList.add("hidden");
  document.getElementById("granu-results-placeholder").classList.remove("hidden");

  if (granuChartInstance) {
    granuChartInstance.destroy();
    granuChartInstance = null;
  }

  updateDashboardLab2Summary();
  showToast("Datos de granulometría reiniciados.");
}

function cargarDemoGranuSimple() {
  document.getElementById("granu-masa-total").value = "2900.00";
  document.getElementById("granu-masa-lavada").value = "2708.00";

  const demoRetenidos = {
    '3in': '0.00',
    '2in': '233.10',
    '1_5in': '346.80',
    '1in': '517.50',
    '3_4in': '289.30',
    '1_2in': '46.50',
    '3_8in': '22.20',
    '1_4in': '195.00',
    'n4': '121.50',
    'n10': '342.10',
    'n20': '171.60',
    'n30': '32.60',
    'n40': '42.50',
    'n60': '61.10',
    'n100': '78.30',
    'n140': '0.00',
    'n200': '199.60',
    'pan': '6.60'
  };

  ASTM_SIEVES.forEach(s => {
    const input = document.getElementById(`granu-ret-${s.id}`);
    if (input) {
      input.value = demoRetenidos[s.id] || '0.00';
    }
  });

  const perdidaEl = document.getElementById("granu-live-perdida");
  if (perdidaEl) perdidaEl.textContent = "192.00 g (6.62 %)";

  document.getElementById("granu-obs").value = "Muestra ensayada por Tamizado Simple con lavado en malla N°200 según Norma ASTM D6913 / Guía Oficial UNI FIC (Anexo II - Formato AT-PR.4-F1).";
  calcularGranulometria();
}

function cargarDemoGranuCompuesto() {
  document.getElementById("granu-masa-total").value = "12443.90";
  document.getElementById("granu-masa-lavada").value = "11718.00";

  const demoCompuesto = {
    '3in': '0.00',
    '2in': '236.00',
    '1_5in': '912.00',
    '1in': '1144.00',
    '3_4in': '528.00',
    '1_2in': '793.00',
    '3_8in': '553.00',
    '1_4in': '948.00',
    'n4': '632.00',
    'n10': '299.00',
    'n20': '270.00',
    'n30': '180.00',
    'n40': '138.00',
    'n60': '165.00',
    'n100': '105.00',
    'n140': '42.00',
    'n200': '40.50',
    'pan': '12.00'
  };

  ASTM_SIEVES.forEach(s => {
    const input = document.getElementById(`granu-ret-${s.id}`);
    if (input) {
      input.value = demoCompuesto[s.id] || '0.00';
    }
  });

  const perdidaEl = document.getElementById("granu-live-perdida");
  if (perdidaEl) perdidaEl.textContent = "725.90 g (5.83 %)";

  document.getElementById("granu-obs").value = "Muestra de suelo granular ensayada por Tamizado Compuesto según Norma ASTM D6913 / Guía Oficial UNI FIC (Anexo I - Formato AT-PR.4-F1).";
  calcularGranulometria();
}

// ===================================================================
// 10. GENERADOR DE INFORMES PDF (INDIVIDUALES Y CONSOLIDADOS POR PANEL)
// ===================================================================
// Lee los campos opcionales del "Encabezado del Ensayo" de granulometría
function capturarEncabezadoGranu() {
  const val = id => (document.getElementById(id)?.value || "").trim();
  return {
    solicitado: val("granu-hdr-solicitado"),
    fecha: val("granu-hdr-fecha"),
    proyecto: val("granu-hdr-proyecto"),
    pozo: val("granu-hdr-pozo"),
    muestra: val("granu-hdr-muestra"),
    profundidad: val("granu-hdr-profundidad"),
    peso_muestra: val("granu-hdr-peso-muestra"),
    peso_aire: val("granu-hdr-peso-aire"),
  };
}

// Vuelca Proyecto / Muestra / Fecha del encabezado hacia el proyecto global (solo si se llenaron)
function sincronizarEncabezadoGranuAProyecto(enc) {
  if (!enc) return;
  let cambio = false;
  if (enc.proyecto) { GeoState.proyecto.nombre = enc.proyecto; cambio = true; }
  if (enc.muestra) { GeoState.proyecto.muestra = enc.muestra; cambio = true; }
  if (enc.fecha) {
    const partes = enc.fecha.split("-"); // yyyy-mm-dd -> dd/mm/yyyy
    GeoState.proyecto.fecha = partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : enc.fecha;
    cambio = true;
  }
  if (cambio) updateStripUI();
}

// Bloque extra para el PDF con los campos propios del formato (los que no están en la metadata estándar)
function getPlantillaEncabezadoGranuHTML() {
  const enc = GeoState.ensayos.granulometria && GeoState.ensayos.granulometria.encabezado;
  if (!enc) return "";
  const campos = [
    ["Solicitado por", enc.solicitado],
    ["Pozo N°", enc.pozo],
    ["Profundidad", enc.profundidad ? `${enc.profundidad} m` : ""],
    ["Peso de Muestra", enc.peso_muestra ? `${enc.peso_muestra} g` : ""],
    ["Peso de Muestra Secado al Aire", enc.peso_aire ? `${enc.peso_aire} g` : ""],
  ].filter(([, v]) => v);
  if (!campos.length) return "";
  let filas = "";
  for (let i = 0; i < campos.length; i += 2) {
    const [l1, v1] = campos[i];
    const par = campos[i + 1];
    const l2 = par ? par[0] : "";
    const v2 = par ? par[1] : "";
    filas += `<tr>
      <td class="pdf-meta-label">${l1}:</td><td>${v1}</td>
      <td class="pdf-meta-label">${l2 ? l2 + ":" : ""}</td><td>${v2}</td>
    </tr>`;
  }
  return `<table class="pdf-table-meta" style="margin-top:4px;">${filas}</table>`;
}

function getPlantillaMetadatosHTML() {
  const p = GeoState.proyecto;
  return `
    <table class="pdf-table-meta">
      <tr>
        <td class="pdf-meta-label">Proyecto:</td>
        <td><strong>${p.nombre}</strong></td>
        <td class="pdf-meta-label">N.º Muestra:</td>
        <td><strong>${p.muestra}</strong></td>
      </tr>
      <tr>
        <td class="pdf-meta-label">Procedencia:</td>
        <td>${p.procedencia}</td>
        <td class="pdf-meta-label">Material:</td>
        <td>${p.material}</td>
      </tr>
      <tr>
        <td class="pdf-meta-label">Ensayado por:</td>
        <td>${p.ensayado}</td>
        <td class="pdf-meta-label">Fecha emisión:</td>
        <td>${p.fecha}</td>
      </tr>
    </table>
  `;
}

function getPlantillaFirmasHTML() {
  return `
    <div class="pdf-signatures">
      <div class="pdf-sig-box">
        <div class="pdf-sig-line"></div>
        <div class="pdf-sig-title">Responsable del Ensayo</div>
        <div style="font-size: 7.5pt; color: #666;">Técnico / Laboratorista Geotécnico</div>
      </div>
      <div class="pdf-sig-box">
        <div class="pdf-sig-line"></div>
        <div class="pdf-sig-title">Supervisor / Jefe de Laboratorio</div>
        <div style="font-size: 7.5pt; color: #666;">Ingeniero Civil Colegiado</div>
      </div>
    </div>
  `;
}

function generarPDFIndividual(tipo) {
  const printContainer = document.getElementById("print-container");
  let contentHTML = "";
  let filename = "";

  if (tipo === "humedad") {
    const h = GeoState.ensayos.humedad;
    filename = `Informe_Humedad_${GeoState.proyecto.muestra}.pdf`;

    let filasHTML = h.determinaciones.map(d => `
      <tr>
        <td style="text-align: center;">${d.num}</td>
        <td style="text-align: center; font-weight: bold;">${d.id}</td>
        <td style="text-align: right;">${d.mr.toFixed(2)}</td>
        <td style="text-align: right;">${d.mh.toFixed(2)}</td>
        <td style="text-align: right;">${d.ms.toFixed(2)}</td>
        <td style="text-align: right;">${d.mw.toFixed(2)}</td>
        <td style="text-align: right;">${d.mss.toFixed(2)}</td>
        <td style="text-align: right; font-weight: bold; color: #1565c0;">${d.w.toFixed(2)} %</td>
      </tr>
    `).join("");

    contentHTML = `
      <div class="pdf-report-page">
        <div class="pdf-header">
          <div class="pdf-title-main">SOFTWARE DE MECÁNICA DE SUELOS</div>
          <div class="pdf-title-sub">INFORME TÉCNICO: DETERMINACIÓN DEL CONTENIDO DE HUMEDAD</div>
          <div class="pdf-norm-ref">Normas de referencia: ASTM D2216 / NTP 339.127 / MTC E108</div>
        </div>

        ${getPlantillaMetadatosHTML()}

        <div style="margin-bottom: 8px; font-size: 8.5pt;">
          <strong>Condiciones de Ensayo:</strong> Horno de secado a ${h.temp.toFixed(1)} °C durante ${h.tiempo.toFixed(1)} horas.
        </div>

        <div class="pdf-section-title">REGISTRO DE PESADAS Y RESULTADOS</div>
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Det.</th>
              <th>Recipiente</th>
              <th>M. Recipiente (Mt) [g]</th>
              <th>M. Rec.+Húm. (M1) [g]</th>
              <th>M. Rec.+Seco (M2) [g]</th>
              <th>Masa Agua (Mw) [g]</th>
              <th>Masa Seca (Ms) [g]</th>
              <th>Humedad (w) [%]</th>
            </tr>
          </thead>
          <tbody>
            ${filasHTML}
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="7" style="text-align: right; padding-right: 10px;">PROMEDIO DE CONTENIDO DE HUMEDAD (w):</td>
              <td style="text-align: right; font-size: 9.5pt; color: #b71c1c;">${h.promedio.toFixed(2)} %</td>
            </tr>
          </tbody>
        </table>

        ${h.observaciones ? `
          <div class="pdf-section-title">OBSERVACIONES</div>
          <p style="font-size: 8.5pt; margin-bottom: 12px;">${h.observaciones}</p>
        ` : ''}

        ${getPlantillaFirmasHTML()}
      </div>
    `;

  } else if (tipo === "volumetrico") {
    const v = GeoState.ensayos.volumetrico;
    filename = `Informe_Peso_Volumetrico_${GeoState.proyecto.muestra}.pdf`;

    let tablaPruebasHTML = "";
    if (v.metodo === "parafina") {
      let filas = v.pruebas.map(p => `
        <tr>
          <td style="text-align: center;">${p.num}</td>
          <td style="text-align: right;">${p.mm.toFixed(1)}</td>
          <td style="text-align: right;">${p.mmp.toFixed(1)}</td>
          <td style="text-align: right;">${p.mp.toFixed(1)}</td>
          <td style="text-align: right;">${p.vmp.toFixed(1)}</td>
          <td style="text-align: right;">${p.vp.toFixed(2)}</td>
          <td style="text-align: right; font-weight: bold;">${p.vm.toFixed(2)}</td>
          <td style="text-align: right; font-weight: bold; color: #1565c0;">${p.gamma_m_gf.toFixed(3)}</td>
          <td style="text-align: right; font-weight: bold; color: #b71c1c;">${p.gamma_m_kn.toFixed(3)}</td>
        </tr>
      `).join("");

      tablaPruebasHTML = `
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Prueba</th>
              <th>M. Suelo (Mm) [g]</th>
              <th>M. Suelo+Paraf [g]</th>
              <th>M. Parafina [g]</th>
              <th>Vol. Total [cm³]</th>
              <th>Vol. Paraf [cm³]</th>
              <th>Vol. Suelo (Vm) [cm³]</th>
              <th>γm [g/cm³]</th>
              <th>γm [kN/m³]</th>
            </tr>
          </thead>
          <tbody>
            ${filas}
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="7" style="text-align: right; padding-right: 10px;">PROMEDIO DE PESO VOLUMÉTRICO DE MASA (γm):</td>
              <td style="text-align: right; color: #1565c0;">${v.rho_humeda.toFixed(3)}</td>
              <td style="text-align: right; color: #b71c1c;">${v.gamma_kn_m3.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>
      `;
    } else {
      const p = v.pruebas[0];
      tablaPruebasHTML = `
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Símbolo</th>
              <th>Valor Obtenido</th>
              <th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Masa del molde / recipiente vacío</td>
              <td>Mm</td>
              <td style="text-align: right;">${p.mm.toFixed(2)}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Masa recipiente + suelo húmedo</td>
              <td>Mts</td>
              <td style="text-align: right;">${p.mts.toFixed(2)}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Volumen del molde calibrado</td>
              <td>V</td>
              <td style="text-align: right;">${p.v.toFixed(1)}</td>
              <td>cm³</td>
            </tr>
            <tr style="background: #f8fafc; font-weight: bold;">
              <td>Masa neta del suelo húmedo</td>
              <td>M</td>
              <td style="text-align: right;">${p.masa_suelo.toFixed(2)}</td>
              <td>g</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    contentHTML = `
      <div class="pdf-report-page">
        <div class="pdf-header">
          <div class="pdf-title-main">SOFTWARE DE MECÁNICA DE SUELOS</div>
          <div class="pdf-title-sub">INFORME TÉCNICO: PESO VOLUMÉTRICO Y DENSIDAD</div>
          <div class="pdf-norm-ref">Normas de referencia: ${v.metodo === "parafina" ? "NTP 339.139 (Muestra Parafinada)" : "ASTM D7263 (Molde Calibrado)"} / MTC E110</div>
        </div>

        ${getPlantillaMetadatosHTML()}

        <div class="pdf-section-title">REGISTRO DE ENSAYO Y RESULTADOS</div>
        ${tablaPruebasHTML}

        <div class="pdf-section-title">RESUMEN DE DENSIDAD Y PESOS VOLUMÉTRICOS</div>
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Propiedad Física</th>
              <th>Símbolo</th>
              <th>Valor Húmedo</th>
              <th>Valor Seco (w = ${v.humedad !== null ? v.humedad.toFixed(2) + '%' : 'N/A'})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Densidad de Masa (g/cm³)</td>
              <td>ρ</td>
              <td style="text-align: right; font-weight: bold;">${v.rho_humeda.toFixed(3)}</td>
              <td style="text-align: right; font-weight: bold;">${v.rho_seca ? v.rho_seca.toFixed(3) : '—'}</td>
            </tr>
            <tr>
              <td>Peso Volumétrico (kN/m³)</td>
              <td>γ</td>
              <td style="text-align: right; font-weight: bold; color: #b71c1c;">${v.gamma_kn_m3.toFixed(3)}</td>
              <td style="text-align: right; font-weight: bold; color: #b71c1c;">${v.gamma_seca ? v.gamma_seca.toFixed(3) : '—'}</td>
            </tr>
          </tbody>
        </table>

        ${v.observaciones ? `
          <div class="pdf-section-title">OBSERVACIONES</div>
          <p style="font-size: 8.5pt; margin-bottom: 12px;">${v.observaciones}</p>
        ` : ''}

        ${getPlantillaFirmasHTML()}
      </div>
    `;

  } else if (tipo === "gravedad") {
    const g = GeoState.ensayos.gravedad;
    filename = `Informe_Gravedad_Especifica_${GeoState.proyecto.muestra}.pdf`;

    let filasPruebas = g.pruebas.map(p => `
      <tr>
        <td style="text-align: center;">${p.num}</td>
        <td style="text-align: right;">${p.mpw.toFixed(2)}</td>
        <td style="text-align: right;">${p.ms.toFixed(2)}</td>
        <td style="text-align: right;">${p.mpsw.toFixed(2)}</td>
        <td style="text-align: right;">${p.desalojada.toFixed(2)}</td>
        <td style="text-align: right; font-weight: bold;">${p.gt.toFixed(3)}</td>
        <td style="text-align: right; font-weight: bold; color: #1565c0;">${p.g20.toFixed(3)}</td>
      </tr>
    `).join("");

    contentHTML = `
      <div class="pdf-report-page">
        <div class="pdf-header">
          <div class="pdf-title-main">SOFTWARE DE MECÁNICA DE SUELOS</div>
          <div class="pdf-title-sub">INFORME TÉCNICO: GRAVEDAD ESPECÍFICA DE LOS SÓLIDOS (Gs)</div>
          <div class="pdf-norm-ref">Normas de referencia: ASTM D854 / NTP 339.131 / MTC E107</div>
        </div>

        ${getPlantillaMetadatosHTML()}

        <div style="margin-bottom: 8px; font-size: 8.5pt;">
          <strong>Condiciones del Picnómetro:</strong> Temperatura de ensayo Tt = ${g.temp.toFixed(1)} °C | Densidad del agua ρw,t = ${g.rho_w.toFixed(5)} g/mL | Factor K = ${g.k.toFixed(5)}
        </div>

        <div class="pdf-section-title">REGISTRO DE ENSAYO CON PICNÓMETRO</div>
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Prueba</th>
              <th>Mpw,t [g]</th>
              <th>Ms [g]</th>
              <th>Mpws,t [g]</th>
              <th>Vol. Desal. [g]</th>
              <th>Gt (Tt)</th>
              <th>G20°C</th>
            </tr>
          </thead>
          <tbody>
            ${filasPruebas}
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="6" style="text-align: right; padding-right: 10px;">PROMEDIO GRAVEDAD ESPECÍFICA A 20°C (Gs @ 20°C):</td>
              <td style="text-align: right; font-size: 9.5pt; color: #b71c1c;">${g.gs.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>

        ${g.observaciones ? `
          <div class="pdf-section-title">OBSERVACIONES</div>
          <p style="font-size: 8.5pt; margin-bottom: 12px;">${g.observaciones}</p>
        ` : ''}

        ${getPlantillaFirmasHTML()}
      </div>
    `;
  } else if (tipo === "granulometria") {
    generarPDFConsolidadoLab2();
    return;
  }

  printContainer.innerHTML = contentHTML;
  ejecutarDescargaPDF(filename);
}

function generarPDFConsolidado() {
  const printContainer = document.getElementById("print-container");
  const { humedad, volumetrico, gravedad } = GeoState.ensayos;
  const filename = `Informe_General_Laboratorio_1_${GeoState.proyecto.muestra}.pdf`;

  let seccionHumedadHTML = "";
  if (humedad.calculado) {
    let filas = humedad.determinaciones.map(d => `
      <tr>
        <td style="text-align: center;">${d.id}</td>
        <td style="text-align: right;">${d.mr.toFixed(2)}</td>
        <td style="text-align: right;">${d.mh.toFixed(2)}</td>
        <td style="text-align: right;">${d.ms.toFixed(2)}</td>
        <td style="text-align: right;">${d.mw.toFixed(2)}</td>
        <td style="text-align: right;">${d.mss.toFixed(2)}</td>
        <td style="text-align: right; font-weight: bold;">${d.w.toFixed(2)} %</td>
      </tr>
    `).join("");

    seccionHumedadHTML = `
      <div class="pdf-section-title">1. DETERMINACIÓN DEL CONTENIDO DE HUMEDAD (ASTM D2216 / NTP 339.127)</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Recipiente</th>
            <th>Mt [g]</th>
            <th>M1 (Húmedo) [g]</th>
            <th>M2 (Seco) [g]</th>
            <th>Mw (Agua) [g]</th>
            <th>Ms (Seco) [g]</th>
            <th>Humedad (w)</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
          <tr style="background: #f1f5f9; font-weight: bold;">
            <td colspan="6" style="text-align: right;">PROMEDIO DE CONTENIDO DE HUMEDAD:</td>
            <td style="text-align: right; color: #b71c1c;">${humedad.promedio.toFixed(2)} %</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  let seccionVolumetricoHTML = "";
  if (volumetrico.calculado) {
    seccionVolumetricoHTML = `
      <div class="pdf-section-title">2. DETERMINACIÓN DE DENSIDAD Y PESO VOLUMÉTRICO (${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263 Cilindro"})</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Parámetro Húmedo</th>
            <th>Símbolo</th>
            <th>Valor</th>
            <th>Unidad</th>
            <th>Parámetro Seco</th>
            <th>Símbolo</th>
            <th>Valor</th>
            <th>Unidad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Densidad Natural Húmeda</td>
            <td>ρm</td>
            <td style="text-align: right; font-weight: bold;">${volumetrico.rho_humeda.toFixed(3)}</td>
            <td>g/cm³</td>
            <td>Densidad Seca</td>
            <td>ρd</td>
            <td style="text-align: right; font-weight: bold;">${volumetrico.rho_seca ? volumetrico.rho_seca.toFixed(3) : '—'}</td>
            <td>g/cm³</td>
          </tr>
          <tr>
            <td>Peso Volumétrico Húmedo</td>
            <td>γm</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${volumetrico.gamma_kn_m3.toFixed(3)}</td>
            <td>kN/m³</td>
            <td>Peso Volumétrico Seco</td>
            <td>γd</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${volumetrico.gamma_seca ? volumetrico.gamma_seca.toFixed(3) : '—'}</td>
            <td>kN/m³</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  let seccionGravedadHTML = "";
  if (gravedad.calculado) {
    seccionGravedadHTML = `
      <div class="pdf-section-title">3. DETERMINACIÓN DE GRAVEDAD ESPECÍFICA DE SÓLIDOS (ASTM D854 / NTP 339.131)</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Temp. Ensayo (Tt)</th>
            <th>Densidad Agua (ρw,t)</th>
            <th>Factor Temp. (K)</th>
            <th>Gt (a Tt)</th>
            <th>Gravedad Específica (Gs @ 20°C)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center;">${gravedad.temp.toFixed(1)} °C</td>
            <td style="text-align: center;">${gravedad.rho_w.toFixed(5)} g/mL</td>
            <td style="text-align: center;">${gravedad.k.toFixed(5)}</td>
            <td style="text-align: center; font-weight: bold;">${gravedad.gt.toFixed(3)}</td>
            <td style="text-align: center; font-weight: bold; color: #1565c0; font-size: 9.5pt;">${gravedad.gs.toFixed(3)}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  const gamma_w = 9.80665;
  let e0Str = "—";
  let nStr = "—";
  let srStr = "—";

  if (volumetrico.calculado && volumetrico.gamma_seca && gravedad.calculado && gravedad.gs) {
    const e0 = (gravedad.gs * gamma_w) / volumetrico.gamma_seca - 1.0;
    if (e0 > 0) {
      e0Str = e0.toFixed(3);
      nStr = `${((e0 / (1.0 + e0)) * 100).toFixed(2)} %`;
      const wEff = volumetrico.humedad !== null ? volumetrico.humedad : (humedad.promedio !== null ? humedad.promedio : null);
      if (wEff !== null) {
        srStr = `${((wEff * gravedad.gs) / e0).toFixed(2)} %`;
      }
    }
  }

  const contentHTML = `
    <div class="pdf-report-page">
      <div class="pdf-header">
        <div class="pdf-title-main">SOFTWARE DE MECÁNICA DE SUELOS</div>
        <div class="pdf-title-sub">INFORME GENERAL CONSOLIDADO – LABORATORIO N.º 1</div>
        <div class="pdf-norm-ref">Propiedades Índice y Relaciones Físicas Fundamentales (ASTM D2216 / D854 / NTP 339)</div>
      </div>

      ${getPlantillaMetadatosHTML()}

      <div class="pdf-section-title">CUADRO RESUMEN: SÍNTESIS DE PROPIEDADES FÍSICAS OBTENIDAS</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Parámetro Geotécnico</th>
            <th>Símbolo</th>
            <th>Valor Obtenido</th>
            <th>Unidad</th>
            <th>Norma / Método</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Contenido de Humedad Natural</td>
            <td><strong>w</strong></td>
            <td style="text-align: right; font-weight: bold; color: #1565c0;">${humedad.calculado ? humedad.promedio.toFixed(2) : '—'}</td>
            <td>%</td>
            <td>ASTM D2216 / NTP 339.127</td>
          </tr>
          <tr>
            <td>Densidad Natural Húmeda</td>
            <td><strong>ρm</strong></td>
            <td style="text-align: right; font-weight: bold;">${volumetrico.calculado ? volumetrico.rho_humeda.toFixed(3) : '—'}</td>
            <td>g/cm³</td>
            <td>${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263"}</td>
          </tr>
          <tr>
            <td>Peso Volumétrico Natural Húmedo</td>
            <td><strong>γm</strong></td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${volumetrico.calculado ? volumetrico.gamma_kn_m3.toFixed(3) : '—'}</td>
            <td>kN/m³</td>
            <td>${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263"}</td>
          </tr>
          <tr>
            <td>Densidad Seca</td>
            <td><strong>ρd</strong></td>
            <td style="text-align: right; font-weight: bold;">${(volumetrico.calculado && volumetrico.rho_seca) ? volumetrico.rho_seca.toFixed(3) : '—'}</td>
            <td>g/cm³</td>
            <td>${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263"}</td>
          </tr>
          <tr>
            <td>Peso Volumétrico Seco</td>
            <td><strong>γd</strong></td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${(volumetrico.calculado && volumetrico.gamma_seca) ? volumetrico.gamma_seca.toFixed(3) : '—'}</td>
            <td>kN/m³</td>
            <td>${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263"}</td>
          </tr>
          <tr>
            <td>Gravedad Específica de Sólidos</td>
            <td><strong>Gs (@ 20°C)</strong></td>
            <td style="text-align: right; font-weight: bold; color: #1565c0;">${gravedad.calculado ? gravedad.gs.toFixed(3) : '—'}</td>
            <td>adimensional</td>
            <td>ASTM D854 / NTP 339.131</td>
          </tr>
          <tr>
            <td>Relación de Vacíos Inicial (Estimada)</td>
            <td><strong>e₀</strong></td>
            <td style="text-align: right; font-weight: bold;">${e0Str}</td>
            <td>adimensional</td>
            <td>Relaciones volumétricas</td>
          </tr>
          <tr>
            <td>Porosidad (Estimada)</td>
            <td><strong>n</strong></td>
            <td style="text-align: right; font-weight: bold;">${nStr}</td>
            <td>%</td>
            <td>Relaciones volumétricas</td>
          </tr>
          <tr>
            <td>Grado de Saturación (Estimado)</td>
            <td><strong>Sr</strong></td>
            <td style="text-align: right; font-weight: bold;">${srStr}</td>
            <td>%</td>
            <td>Relaciones volumétricas</td>
          </tr>
        </tbody>
      </table>

      ${seccionHumedadHTML}
      ${seccionVolumetricoHTML}
      ${seccionGravedadHTML}

      ${getPlantillaFirmasHTML()}
    </div>
  `;

  printContainer.innerHTML = contentHTML;
  ejecutarDescargaPDF(filename);
}

function generarPDFConsolidadoLab2() {
  const printContainer = document.getElementById("print-container");
  const g = GeoState.ensayos.granulometria;
  const filename = `Informe_General_Laboratorio_2_${GeoState.proyecto.muestra}.pdf`;

  let filasHTML = g.tamices.map(t => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${t.nombre}</td>
      <td style="text-align: center;">${t.abertura > 0 ? t.abertura.toFixed(3) : '—'}</td>
      <td style="text-align: right;">${t.retenido.toFixed(2)}</td>
      <td style="text-align: right; font-weight: bold;">${t.corregido.toFixed(2)}</td>
      <td style="text-align: right;">${t.porc_parcial.toFixed(2)} %</td>
      <td style="text-align: right;">${t.porc_acumulado.toFixed(2)} %</td>
      <td style="text-align: right; font-weight: bold; color: #1565c0;">${t.porc_pasa.toFixed(2)} %</td>
    </tr>
  `).join("");

  let chartImgHTML = "";
  if (granuChartInstance) {
    try {
      const dataUrl = granuChartInstance.toBase64Image();
      chartImgHTML = `
        <div class="pdf-section-title">CURVA GRANULOMÉTRICA SEMILOGARÍTMICA (ASTM D6913)</div>
        <div style="text-align: center; margin-bottom: 12px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px;">
          <img src="${dataUrl}" style="max-width: 100%; height: auto; max-height: 230px;" />
        </div>
      `;
    } catch (e) {
      console.warn("No se pudo exportar la imagen de Chart.js:", e);
    }
  }

  const contentHTML = `
    <div class="pdf-report-page">
      <div class="pdf-header">
        <div class="pdf-title-main">SOFTWARE DE MECÁNICA DE SUELOS • GEOLOGÍA FIGMM</div>
        <div class="pdf-title-sub">INFORME TÉCNICO OFICIAL – LABORATORIO N.º 2: ANÁLISIS GRANULOMÉTRICO</div>
        <div class="pdf-norm-ref">Normas de referencia: ASTM D6913 / D6913M • NTP 339.128 • Formato Oficial UNI FIC</div>
      </div>

      ${getPlantillaMetadatosHTML()}
      ${getPlantillaEncabezadoGranuHTML()}

      <div class="pdf-section-title">CONTROL DE MASAS Y PÉRDIDA POR LAVADO EN MALLA N.° 200</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Masa Seca Inicial (W₁)</th>
            <th>Masa Seca Lavada (W₀)</th>
            <th>Pérdida por Lavado (W₁ - W₀)</th>
            <th>% Pérdida Finos</th>
            <th>Error de Tamizado (ΔError)</th>
            <th>Criterio Tolerancia</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: right; font-weight: bold;">${g.masa_total.toFixed(2)} g</td>
            <td style="text-align: right; font-weight: bold;">${g.masa_lavada.toFixed(2)} g</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${g.perdida_lavado.toFixed(2)} g</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${g.porc_perdida_lavado.toFixed(2)} %</td>
            <td style="text-align: right; font-weight: bold;">${g.porc_error.toFixed(2)} %</td>
            <td style="text-align: center; color: ${g.porc_error <= 1.0 ? '#16a34a' : '#b71c1c'}; font-weight: bold;">
              ${g.porc_error <= 1.0 ? 'Conforme (≤ 1.0%)' : 'Revisar (> 1.0%)'}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pdf-section-title">REGISTRO DE TAMIZADO POR SERIE ASTM E11</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Tamiz</th>
            <th>Abertura (mm)</th>
            <th>Retenido (g)</th>
            <th>Ret. Corregido (g)</th>
            <th>% Parcial</th>
            <th>% Acumulado</th>
            <th>% Que Pasa</th>
          </tr>
        </thead>
        <tbody>
          ${filasHTML}
        </tbody>
      </table>

      ${chartImgHTML}

      <div class="pdf-section-title">PARÁMETROS DE GRADACIÓN Y CLASIFICACIÓN DEL SUELO (SUCS / ASTM D2487)</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>% Grava (&gt; N°4)</th>
            <th>% Arena (N°4 a N°200)</th>
            <th>% Finos (&lt; N°200)</th>
            <th>D₁₀ (mm)</th>
            <th>D₃₀ (mm)</th>
            <th>D₆₀ (mm)</th>
            <th>Cu</th>
            <th>Cc</th>
            <th>Grupo SUCS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${g.grava.toFixed(2)} %</td>
            <td style="text-align: right; font-weight: bold; color: #1565c0;">${g.arena.toFixed(2)} %</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${g.finos.toFixed(2)} %</td>
            <td style="text-align: right;">${g.d10 ? g.d10.toFixed(3) : '—'}</td>
            <td style="text-align: right;">${g.d30 ? g.d30.toFixed(3) : '—'}</td>
            <td style="text-align: right;">${g.d60 ? g.d60.toFixed(3) : '—'}</td>
            <td style="text-align: right; font-weight: bold;">${g.cu ? g.cu.toFixed(2) : '—'}</td>
            <td style="text-align: right; font-weight: bold;">${g.cc ? g.cc.toFixed(2) : '—'}</td>
            <td style="text-align: center; font-weight: bold; color: #1565c0; font-size: 10pt;">${g.sucs_simbolo}</td>
          </tr>
        </tbody>
      </table>

      <div style="font-size: 8pt; margin: 4px 0 10px 0; color: #334155;">
        <strong>Descripción Geotécnica:</strong> ${g.sucs_descripcion}
      </div>

      ${g.observaciones ? `
        <div class="pdf-section-title">OBSERVACIONES</div>
        <p style="font-size: 8.5pt; margin-bottom: 12px;">${g.observaciones}</p>
      ` : ''}

      ${getPlantillaFirmasHTML()}
    </div>
  `;

  printContainer.innerHTML = contentHTML;
  ejecutarDescargaPDF(filename);
}

function ejecutarDescargaPDF(nombreArchivo) {
  showToast("Generando documento PDF oficial...");

  const element = document.getElementById("print-container");
  element.style.display = "block";

  const opt = {
    margin: [10, 12, 10, 12],
    filename: nombreArchivo,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
  };

  if (window.html2pdf) {
    html2pdf().set(opt).from(element).save().then(() => {
      element.style.display = "none";
      showToast("¡PDF generado y descargado correctamente!");
    }).catch(err => {
      console.warn("Fallo html2pdf, abriendo diálogo nativo de impresión:", err);
      element.style.display = "none";
      window.print();
    });
  } else {
    element.style.display = "none";
    window.print();
  }
}

// 9. UTILIDADES Y NOTIFICACIONES TOAST
function showToast(mensaje) {
  let toast = document.getElementById("geo-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "geo-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      border-left: 4px solid #16a34a;
      z-index: 1000;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.25s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = mensaje;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 3200);
}
