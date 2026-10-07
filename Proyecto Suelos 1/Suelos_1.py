import os
import sys
import math
import datetime
# pyrefly: ignore [missing-import]
import customtkinter as ctk
from tkinter import messagebox, filedialog

from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether, Image as RLImage
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
try:
    import matplotlib.pyplot as plt
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False
from io import BytesIO


TABLA_DENSIDAD_AGUA = [
    (15.0, 0.99911, 1.00090), (15.5, 0.99903, 1.00082), (16.0, 0.99894, 1.00073),
    (16.5, 0.99886, 1.00065), (17.0, 0.99877, 1.00056), (17.5, 0.99868, 1.00047),
    (18.0, 0.99859, 1.00038), (18.5, 0.99850, 1.00029), (19.0, 0.99840, 1.00019),
    (19.5, 0.99830, 1.00009), (20.0, 0.99820, 0.99999), (20.5, 0.99810, 0.99989),
    (21.0, 0.99799, 0.99978), (21.5, 0.99788, 0.99967), (22.0, 0.99777, 0.99956),
    (22.5, 0.99765, 0.99944), (23.0, 0.99754, 0.99933), (23.5, 0.99742, 0.99921),
    (24.0, 0.99730, 0.99909), (24.5, 0.99717, 0.99896), (25.0, 0.99705, 0.99884),
    (25.5, 0.99692, 0.99871), (26.0, 0.99679, 0.99858), (26.5, 0.99665, 0.99844),
    (27.0, 0.99652, 0.99831), (27.5, 0.99638, 0.99817), (28.0, 0.99624, 0.99803),
    (28.5, 0.99610, 0.99789), (29.0, 0.99595, 0.99773), (29.5, 0.99580, 0.99758),
    (30.0, 0.99565, 0.99743)
]

def obtener_propiedades_agua(temp):
    t = max(15.0, min(30.0, temp))
    for i in range(len(TABLA_DENSIDAD_AGUA) - 1):
        t1, r1, k1 = TABLA_DENSIDAD_AGUA[i]
        t2, r2, k2 = TABLA_DENSIDAD_AGUA[i+1]
        if t1 <= t <= t2:
            f = (t - t1) / (t2 - t1)
            return r1 + f * (r2 - r1), k1 + f * (k2 - k1)
    return 0.99820, 1.00000


ctk.set_appearance_mode("light")
ctk.set_default_color_theme("blue")

ROJO = "#B71C1C"
ROJO_HOVER = "#8E0000"
AZUL = "#1565C0"
AZUL_HOVER = "#0D47A1"
VERDE = "#2E7D32"
VERDE_HOVER = "#1B5E20"
GRIS = "#546E7A"
GRIS_HOVER = "#37474F"
FONDO = "#F4F6F9"
CARD_BG = "#FFFFFF"
BORDER_COLOR = "#D0D7DE"
HEADER_BG = "#E8EEF5"



def leer_numero(entry, nombre):
    """Lee un CTkEntry y devuelve float. Vacío = None."""
    texto = entry.get().strip().replace(",", ".")
    if not texto:
        return None
    try:
        return float(texto)
    except ValueError:
        raise ValueError(f"El campo '{nombre}' debe contener un número válido.")


def poner_valor(entry, valor, decimales=2):
    if valor is not None:
        entry.delete(0, "end")
        entry.insert(0, f"{valor:.{decimales}f}")


class Cabecera(ctk.CTkFrame):
    def __init__(self, parent, titulo, subtitulo=""):
        super().__init__(parent, fg_color="transparent")

        self.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            self,
            text=titulo,
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color="#1A202C"
        ).grid(row=0, column=0, sticky="w")

        if subtitulo:
            ctk.CTkLabel(
                self,
                text=subtitulo,
                text_color="#5A6A85",
                font=ctk.CTkFont(size=12)
            ).grid(row=1, column=0, sticky="w", pady=(2, 0))


def crear_boton(parent, texto, comando, color=ROJO, hover=ROJO_HOVER,
                width=200, height=38):
    return ctk.CTkButton(
        parent,
        text=texto,
        command=comando,
        width=width,
        height=height,
        fg_color=color,
        hover_color=hover,
        text_color="white",
        font=ctk.CTkFont(size=12, weight="bold"),
        corner_radius=8
    )


class TablaFormulario(ctk.CTkFrame):
    """
    Componente de tabla estructurada para organizar los campos de entrada
    con columnas perfectamente alineadas:
      [0] Parámetro / Descripción
      [1] Recuadro de entrada (CTkEntry)
      [2] Unidad de medida
    """
    def __init__(self, parent, titulo="", icono="📋"):
        super().__init__(
            parent,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )

        self.fila_idx = 0
        self.entradas = {}

        if titulo:
            header = ctk.CTkFrame(self, fg_color=HEADER_BG, corner_radius=8, height=34)
            header.pack(fill="x", padx=4, pady=(4, 6))
            header.pack_propagate(False)

            ctk.CTkLabel(
                header,
                text=f"{icono}  {titulo}",
                font=ctk.CTkFont(size=12, weight="bold"),
                text_color="#1E293B"
            ).pack(side="left", padx=10, pady=6)

        self.cuerpo = ctk.CTkFrame(self, fg_color="transparent")
        self.cuerpo.pack(fill="x", padx=6, pady=(0, 6), expand=True)

        self.cuerpo.grid_columnconfigure(0, weight=0, minsize=190)
        self.cuerpo.grid_columnconfigure(1, weight=1)
        self.cuerpo.grid_columnconfigure(2, weight=0, minsize=65)

    def agregar_fila(self, clave, etiqueta, unidad="", placeholder="", valor_defecto=""):
        bg_color = "#F8FAFC" if (self.fila_idx % 2 == 0) else "#FFFFFF"

        row_frame = ctk.CTkFrame(self.cuerpo, fg_color=bg_color, corner_radius=6)
        row_frame.grid(row=self.fila_idx, column=0, columnspan=3, sticky="ew", padx=2, pady=2)
        row_frame.grid_columnconfigure(0, weight=0, minsize=185)
        row_frame.grid_columnconfigure(1, weight=1)
        row_frame.grid_columnconfigure(2, weight=0, minsize=65)

        lbl = ctk.CTkLabel(
            row_frame,
            text=etiqueta,
            font=ctk.CTkFont(size=12),
            text_color="#334155",
            anchor="w"
        )
        lbl.grid(row=0, column=0, sticky="w", padx=(10, 8), pady=5)

        entry = ctk.CTkEntry(
            row_frame,
            height=32,
            placeholder_text=placeholder,
            font=ctk.CTkFont(size=12),
            border_width=1,
            border_color="#CBD5E1",
            corner_radius=6
        )
        if valor_defecto:
            entry.insert(0, str(valor_defecto))
        entry.grid(row=0, column=1, sticky="ew", padx=4, pady=5)

        if unidad:
            u_lbl = ctk.CTkLabel(
                row_frame,
                text=unidad,
                font=ctk.CTkFont(size=11, weight="bold"),
                text_color="#64748B",
                anchor="center",
                width=55
            )
            u_lbl.grid(row=0, column=2, padx=(4, 8), pady=5)
        else:
            ctk.CTkLabel(row_frame, text="", width=55).grid(row=0, column=2, padx=(4, 8), pady=5)

        self.entradas[clave] = entry
        self.fila_idx += 1
        return entry

    def obtener_texto(self, clave):
        e = self.entradas.get(clave)
        return e.get().strip() if e else ""

    def poner_texto(self, clave, texto):
        e = self.entradas.get(clave)
        if e:
            e.delete(0, "end")
            e.insert(0, str(texto))

    def limpiar(self):
        for e in self.entradas.values():
            e.delete(0, "end")


def obtener_estilos_pdf():
    styles = getSampleStyleSheet()

    estilo_titulo = ParagraphStyle(
        "DocTitulo",
        parent=styles["Heading1"],
        alignment=1,
        fontSize=16,
        leading=20,
        textColor=colors.HexColor(ROJO),
        spaceAfter=3
    )
    estilo_subtitulo = ParagraphStyle(
        "DocSubtitulo",
        parent=styles["Normal"],
        alignment=1,
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#2C3E50"),
        spaceAfter=4
    )
    estilo_norma = ParagraphStyle(
        "DocNorma",
        parent=styles["Italic"],
        alignment=1,
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#555555"),
        spaceAfter=8
    )
    estilo_seccion = ParagraphStyle(
        "DocSeccion",
        parent=styles["Heading2"],
        fontSize=11,
        leading=14,
        textColor=colors.HexColor(AZUL),
        spaceBefore=8,
        spaceAfter=4
    )
    estilo_texto = ParagraphStyle(
        "DocTexto",
        parent=styles["Normal"],
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#333333")
    )
    estilo_formula = ParagraphStyle(
        "DocFormula",
        parent=styles["Normal"],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#4A5568")
    )

    return {
        "styles": styles,
        "titulo": estilo_titulo,
        "subtitulo": estilo_subtitulo,
        "norma": estilo_norma,
        "seccion": estilo_seccion,
        "texto": estilo_texto,
        "formula": estilo_formula,
    }


def crear_tabla_metadatos(datos_proyecto):
    meta = [
        ["Proyecto:", datos_proyecto.get("proyecto", "—"), "N.º de Muestra:", datos_proyecto.get("muestra", "—")],
        ["Procedencia / Ubicación:", datos_proyecto.get("procedencia", "—"), "Material:", datos_proyecto.get("material", "—")],
        ["Ensayado por:", datos_proyecto.get("ensayado", "—"), "Fecha de emisión:", datetime.datetime.now().strftime("%d/%m/%Y %H:%M")],
    ]
    t = Table(meta, colWidths=[110, 185, 100, 145])
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#F1F5F9")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def crear_bloque_firmas(estilos):
    firmas = [
        ["", ""],
        ["_______________________________________", "_______________________________________"],
        ["Responsable del Ensayo", "Supervisor / Jefe de Laboratorio"],
    ]
    tf = Table(firmas, colWidths=[270, 270])
    tf.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("FONTNAME", (0, 2), (-1, 2), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return tf

class BaseEnsayo(ctk.CTkFrame):
    titulo = "ENSAYO"
    subtitulo = ""
    codigo_norma = ""

    def __init__(self, parent, controller):
        super().__init__(parent, fg_color=FONDO)
        self.controller = controller
        self.resultados = []

        Cabecera(self, self.titulo, self.subtitulo).pack(
            fill="x", padx=25, pady=(18, 6)
        )

        barra_nav = ctk.CTkFrame(self, fg_color="transparent")
        barra_nav.pack(fill="x", padx=25, pady=(0, 6))

        ctk.CTkButton(
            barra_nav,
            text="← Volver a Laboratorio 1",
            command=lambda: controller.mostrar("Laboratorio1"),
            width=165,
            height=30,
            fg_color=GRIS,
            hover_color=GRIS_HOVER,
            corner_radius=6
        ).pack(side="left")

        self.contenido = ctk.CTkFrame(self, fg_color="transparent")
        self.contenido.pack(fill="both", expand=True, padx=25, pady=(4, 10))

    def crear_paneles(self):
        self.contenido.grid_columnconfigure(0, weight=1)
        self.contenido.grid_columnconfigure(1, weight=1)
        self.contenido.grid_rowconfigure(0, weight=1)

        self.panel_entrada = ctk.CTkFrame(
            self.contenido, corner_radius=12, fg_color="transparent"
        )
        self.panel_entrada.grid(
            row=0, column=0, sticky="nsew", padx=(0, 8)
        )

        self.panel_resultados = ctk.CTkFrame(
            self.contenido, corner_radius=12, fg_color=CARD_BG,
            border_width=1, border_color=BORDER_COLOR
        )
        self.panel_resultados.grid(
            row=0, column=1, sticky="nsew", padx=(8, 0)
        )

        self.titulo_panel(self.panel_resultados, "📊 Resultados del Ensayo")

        self.cuerpo_resultados = ctk.CTkFrame(self.panel_resultados, fg_color="transparent")
        self.cuerpo_resultados.pack(fill="both", expand=True, padx=10, pady=(2, 6))

        self.barra_export_fija = ctk.CTkFrame(self.panel_resultados, fg_color="transparent")
        self.barra_export_fija.pack(fill="x", padx=14, pady=(6, 14), side="bottom")

        crear_boton(
            self.barra_export_fija,
            "📄 Exportar este Ensayo (PDF)",
            self.exportar_pdf_seguro,
            color=VERDE,
            hover=VERDE_HOVER,
            width=200,
            height=38
        ).pack(fill="x", padx=4)

    def titulo_panel(self, parent, texto):
        ctk.CTkLabel(
            parent,
            text=texto,
            font=ctk.CTkFont(size=15, weight="bold"),
            text_color="#1E293B"
        ).pack(anchor="w", padx=16, pady=(14, 5))

    def exportar_pdf_seguro(self):
        if not self.resultados:
            messagebox.showwarning(
                "Sin Resultados",
                f"Para exportar el informe en PDF de '{self.titulo}', primero ingrese los datos de la muestra y presione '⚡ Calcular'."
            )
            return
        self.exportar_pdf()

    def mostrar_resultados(self):
        for widget in self.cuerpo_resultados.winfo_children():
            widget.destroy()

        if not self.resultados:
            ctk.CTkLabel(
                self.cuerpo_resultados,
                text="Los resultados calculados se mostrarán en esta sección.\n\nIngrese los datos en las tablas de la izquierda y presione '⚡ Calcular'.\n\nPodrá exportar en PDF individualmente este ensayo.",
                text_color="#718096",
                justify="center",
                font=ctk.CTkFont(size=12)
            ).pack(expand=True, pady=40)
            return

        scroll = ctk.CTkScrollableFrame(
            self.cuerpo_resultados,
            fg_color="transparent"
        )
        scroll.pack(fill="both", expand=True, padx=2, pady=2)

        for i, (nombre, valor, unidad) in enumerate(self.resultados):
            fila = ctk.CTkFrame(
                scroll,
                corner_radius=8,
                fg_color="#F8FAFC" if i % 2 == 0 else "#FFFFFF",
                border_width=1,
                border_color="#E2E8F0"
            )
            fila.pack(fill="x", padx=4, pady=3)
            fila.grid_columnconfigure(0, weight=1)

            ctk.CTkLabel(
                fila,
                text=nombre,
                anchor="w",
                font=ctk.CTkFont(size=12),
                text_color="#334155"
            ).grid(row=0, column=0, sticky="w", padx=12, pady=7)

            ctk.CTkLabel(
                fila,
                text=f"{valor} {unidad}".strip(),
                anchor="e",
                text_color=AZUL,
                font=ctk.CTkFont(size=13, weight="bold")
            ).grid(row=0, column=1, sticky="e", padx=12, pady=7)

    def botones(self):
        barra = ctk.CTkFrame(self.panel_entrada, fg_color="transparent")
        barra.pack(fill="x", padx=6, pady=10)
        barra.grid_columnconfigure(0, weight=1)
        barra.grid_columnconfigure(1, weight=1)

        crear_boton(
            barra, "⚡ Calcular", self.calcular, color=ROJO,
            hover=ROJO_HOVER, width=140, height=38
        ).grid(row=0, column=0, padx=4, sticky="ew")

        crear_boton(
            barra, "🗑 Limpiar", self.limpiar, color=GRIS,
            hover=GRIS_HOVER, width=140, height=38
        ).grid(row=0, column=1, padx=4, sticky="ew")

    def exportar_informe_general(self):
        self.controller.exportar_informe_consolidado()

    def calcular(self):
        pass

    def limpiar(self):
        pass

    def exportar_pdf(self):
        pass


class ContenidoHumedad(BaseEnsayo):
    titulo = "01. CONTENIDO DE HUMEDAD"
    subtitulo = "Determinación del contenido de humedad por masa en suelos secados en horno."
    codigo_norma = "ASTM D2216 / NTP 339.127 / MTC E108"

    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        self.crear_paneles()
        self.filas_pesadas = []

        self.scroll = ctk.CTkScrollableFrame(self.panel_entrada, fg_color="transparent")
        self.scroll.pack(fill="both", expand=True, padx=4, pady=2)

        self.tabla_id = TablaFormulario(self.scroll, "Identificación de la Muestra", "📋")
        self.tabla_id.pack(fill="x", padx=4, pady=(2, 8))
        self.tabla_id.agregar_fila("proyecto", "Nombre del Proyecto", "", "Ej. Carretera Central Km 45")
        self.tabla_id.agregar_fila("muestra", "N.º de Muestra", "", "Ej. M-01")
        self.tabla_id.agregar_fila("procedencia", "Procedencia / Ubicación", "", "Ej. Calicata C-01 (1.50 m)")
        self.tabla_id.agregar_fila("material", "Descripción del Material", "", "Ej. Arcilla limosa marrón")
        self.tabla_id.agregar_fila("ensayado", "Ensayado por", "", "Nombre del operador")

        self.tabla_cond = TablaFormulario(self.scroll, "Condiciones de Secado en Horno", "🌡️")
        self.tabla_cond.pack(fill="x", padx=4, pady=6)
        self.tabla_cond.agregar_fila("temperatura", "Temperatura de secado", "°C", "110", "110.0")
        self.tabla_cond.agregar_fila("tiempo", "Tiempo de secado", "h", "Ej. 24", "24.0")

        # Control de selección de cantidad de muestras
        frame_cant = ctk.CTkFrame(
            self.scroll,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )
        frame_cant.pack(fill="x", padx=4, pady=6)

        cant_hdr = ctk.CTkFrame(frame_cant, fg_color=HEADER_BG, corner_radius=8, height=34)
        cant_hdr.pack(fill="x", padx=4, pady=(4, 6))
        cant_hdr.pack_propagate(False)
        ctk.CTkLabel(
            cant_hdr,
            text="🔢  Cantidad de Muestras a Analizar",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#1E293B"
        ).pack(side="left", padx=10, pady=6)

        cuerpo_cant = ctk.CTkFrame(frame_cant, fg_color="transparent")
        cuerpo_cant.pack(fill="x", padx=10, pady=(0, 8))

        ctk.CTkLabel(
            cuerpo_cant,
            text="¿Cuántas muestras/determinaciones desea analizar?:",
            font=ctk.CTkFont(size=12),
            text_color="#334155"
        ).pack(side="left", padx=(4, 10))

        self.combo_cant = ctk.CTkComboBox(
            cuerpo_cant,
            values=[str(i) for i in range(1, 11)],
            width=80,
            state="readonly",
            command=lambda choice: self.generar_tabla_muestras()
        )
        self.combo_cant.set("3")
        self.combo_cant.pack(side="left", padx=5)

        crear_boton(
            cuerpo_cant,
            "✨ Generar Tabla",
            self.generar_tabla_muestras,
            color=AZUL,
            hover=AZUL_HOVER,
            width=130,
            height=32
        ).pack(side="left", padx=10)

        # Contenedor de la tabla dinámica de pesadas
        self.frame_pesadas = ctk.CTkFrame(
            self.scroll,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )
        self.frame_pesadas.pack(fill="x", padx=4, pady=6)

        self.hdr_pesadas = ctk.CTkFrame(self.frame_pesadas, fg_color=HEADER_BG, corner_radius=8, height=34)
        self.hdr_pesadas.pack(fill="x", padx=4, pady=(4, 6))
        self.hdr_pesadas.pack_propagate(False)
        self.lbl_pesadas_titulo = ctk.CTkLabel(
            self.hdr_pesadas,
            text="⚖️  Pesadas de Cápsulas / Recipientes",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#1E293B"
        )
        self.lbl_pesadas_titulo.pack(side="left", padx=10, pady=6)

        self.cuerpo_pesadas = ctk.CTkFrame(self.frame_pesadas, fg_color="transparent")
        self.cuerpo_pesadas.pack(fill="x", padx=6, pady=(0, 6))

        obs_frame = ctk.CTkFrame(
            self.scroll,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )
        obs_frame.pack(fill="x", padx=4, pady=6)

        obs_hdr = ctk.CTkFrame(obs_frame, fg_color=HEADER_BG, corner_radius=8, height=32)
        obs_hdr.pack(fill="x", padx=4, pady=(4, 4))
        obs_hdr.pack_propagate(False)
        ctk.CTkLabel(
            obs_hdr,
            text="📝  Observaciones del Ensayo",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#1E293B"
        ).pack(side="left", padx=10, pady=5)

        self.observaciones = ctk.CTkTextbox(obs_frame, height=65, font=ctk.CTkFont(size=11))
        self.observaciones.pack(fill="x", padx=8, pady=(2, 8))

        self.botones()
        self.mostrar_resultados()

        self.datos_humedad = []
        self.promedio_humedad = 0.0
        self.temp_humedad = 110.0
        self.tiempo_humedad = 24.0

        self.generar_tabla_muestras()

    def generar_tabla_muestras(self):
        try:
            num_muestras = int(self.combo_cant.get())
        except ValueError:
            num_muestras = 3

        valores_previos = []
        for fila in self.filas_pesadas:
            valores_previos.append({
                "recipiente": fila["recipiente"].get(),
                "humedo": fila["humedo"].get(),
                "seco": fila["seco"].get()
            })

        for child in self.cuerpo_pesadas.winfo_children():
            child.destroy()

        self.filas_pesadas = []
        self.lbl_pesadas_titulo.configure(
            text=f"⚖️  Pesadas de Cápsulas / Recipientes ({num_muestras} determinaciones)"
        )

        self.cuerpo_pesadas.grid_columnconfigure(0, weight=0, minsize=32)
        self.cuerpo_pesadas.grid_columnconfigure(1, weight=1)
        self.cuerpo_pesadas.grid_columnconfigure(2, weight=1)
        self.cuerpo_pesadas.grid_columnconfigure(3, weight=1)

        encabezados = ["N.º", "Recipiente (g)", "Recip. + Suelo Húmedo (g)", "Recip. + Suelo Seco (g)"]
        for col, texto in enumerate(encabezados):
            ctk.CTkLabel(
                self.cuerpo_pesadas,
                text=texto,
                font=ctk.CTkFont(size=10, weight="bold"),
                text_color="#1E293B",
                wraplength=110,
                justify="center"
            ).grid(row=0, column=col, padx=3, pady=(2, 6), sticky="nsew")

        placeholders = ["Ej. 25.40", "Ej. 105.40", "Ej. 92.80"]
        claves = ["recipiente", "humedo", "seco"]

        for i in range(num_muestras):
            fila = {}
            bg = "#F8FAFC" if i % 2 == 0 else "#FFFFFF"
            fila_box = ctk.CTkFrame(self.cuerpo_pesadas, fg_color=bg, corner_radius=6)
            fila_box.grid(row=i + 1, column=0, columnspan=4, sticky="ew", padx=1, pady=2)
            fila_box.grid_columnconfigure(0, weight=0, minsize=32)
            fila_box.grid_columnconfigure(1, weight=1)
            fila_box.grid_columnconfigure(2, weight=1)
            fila_box.grid_columnconfigure(3, weight=1)

            ctk.CTkLabel(
                fila_box,
                text=str(i + 1),
                font=ctk.CTkFont(size=11, weight="bold"),
                text_color=ROJO,
                width=28
            ).grid(row=0, column=0, padx=2, pady=3)

            for c_idx, clave in enumerate(claves):
                e = ctk.CTkEntry(
                    fila_box,
                    height=30,
                    placeholder_text=placeholders[c_idx],
                    font=ctk.CTkFont(size=11),
                    border_width=1,
                    border_color="#CBD5E1",
                    corner_radius=6
                )
                if i < len(valores_previos) and valores_previos[i][clave]:
                    e.insert(0, valores_previos[i][clave])
                e.grid(row=0, column=c_idx + 1, padx=3, pady=3, sticky="ew")
                fila[clave] = e

            self.filas_pesadas.append(fila)

    def sincronizar_desde_proyecto(self, datos):
        for k in ["proyecto", "muestra", "procedencia", "material", "ensayado"]:
            if k in datos and datos[k] and not self.tabla_id.obtener_texto(k):
                self.tabla_id.poner_texto(k, datos[k])

    def sincronizar_hacia_proyecto(self):
        d = {k: self.tabla_id.obtener_texto(k) for k in ["proyecto", "muestra", "procedencia", "material", "ensayado"]}
        self.controller.guardar_datos_proyecto(d)
        return d

    def _leer_fila(self, fila, numero):
        mr = leer_numero(fila["recipiente"], f"Recipiente - Muestra {numero}")
        mh = leer_numero(fila["humedo"], f"Recip. + Suelo Húmedo - Muestra {numero}")
        ms = leer_numero(fila["seco"], f"Recip. + Suelo Seco - Muestra {numero}")

        if None in (mr, mh, ms):
            raise ValueError(f"Complete todas las pesadas de la Muestra {numero}.")

        if mr < 0 or mh < 0 or ms < 0:
            raise ValueError(f"Las masas en la Muestra {numero} no pueden ser negativas.")

        masa_humeda = mh - mr
        masa_seca = ms - mr
        masa_agua = mh - ms

        if masa_humeda <= 0:
            raise ValueError(f"En la Muestra {numero}, la masa de suelo húmedo debe ser mayor que cero.")
        if masa_seca <= 0:
            raise ValueError(f"En la Muestra {numero}, la masa de suelo seco debe ser mayor que cero.")
        if masa_agua < 0:
            raise ValueError(f"En la Muestra {numero}, la masa de agua no puede ser negativa.")

        humedad = (masa_agua / masa_seca) * 100.0
        return {
            "id": numero,
            "mr": mr,
            "mh": mh,
            "ms": ms,
            "mw": masa_agua,
            "mss": masa_seca,
            "w": humedad,
        }

    def calcular(self):
        try:
            self.sincronizar_hacia_proyecto()

            datos = []
            for i, fila in enumerate(self.filas_pesadas, start=1):
                d = self._leer_fila(fila, i)
                datos.append(d)

            if not datos:
                raise ValueError("Ingrese las pesadas de las muestras a analizar.")

            temp = leer_numero(self.tabla_cond.entradas["temperatura"], "Temperatura de secado")
            tiempo = leer_numero(self.tabla_cond.entradas["tiempo"], "Tiempo de secado")

            if temp is None:
                temp = 110.0
            if tiempo is None:
                tiempo = 24.0
            if temp <= 0:
                raise ValueError("La temperatura de secado debe ser mayor a 0 °C.")
            if tiempo < 0:
                raise ValueError("El tiempo de secado no puede ser negativo.")

            promedio = sum(d["w"] for d in datos) / len(datos)

            res = []
            for d in datos:
                res.extend([
                    (f"Muestra {d['id']} – Peso del agua (Ww)", f"{d['mw']:.2f}", "g"),
                    (f"Muestra {d['id']} – Peso suelo seco (Ws)", f"{d['mss']:.2f}", "g"),
                    (f"Muestra {d['id']} – Contenido de humedad", f"{d['w']:.2f}", "%"),
                ])
            res.extend([
                ("Número de muestras analizadas", str(len(datos)), ""),
                ("PROMEDIO DE CONTENIDO DE HUMEDAD (w)", f"{promedio:.2f}", "%"),
                ("Temperatura de secado registrada", f"{temp:.1f}", "°C"),
                ("Tiempo de secado registrado", f"{tiempo:.1f}", "h"),
            ])

            self.resultados = res
            self.datos_humedad = datos
            self.promedio_humedad = promedio
            self.temp_humedad = temp
            self.tiempo_humedad = tiempo

            self.mostrar_resultados()

        except Exception as err:
            messagebox.showerror("Error en los datos", str(err))

    def limpiar(self):
        self.tabla_cond.limpiar()
        self.tabla_cond.poner_texto("temperatura", "110.0")
        self.tabla_cond.poner_texto("tiempo", "24.0")
        for fila in self.filas_pesadas:
            for e in fila.values():
                e.delete(0, "end")
        self.observaciones.delete("1.0", "end")
        self.resultados = []
        self.datos_humedad = []
        self.mostrar_resultados()

    def exportar_pdf(self):
        if not self.datos_humedad:
            messagebox.showwarning("Sin resultados", "Primero realice el cálculo del ensayo de humedad.")
            return

        nombre_archivo = f"Contenido_Humedad_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        ruta = filedialog.asksaveasfilename(
            title="Guardar Informe de Contenido de Humedad",
            defaultextension=".pdf",
            initialfile=nombre_archivo,
            filetypes=[("Archivo PDF", "*.pdf")]
        )
        if not ruta:
            return

        try:
            doc = SimpleDocTemplate(
                ruta, pagesize=letter,
                rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
            )
            est = obtener_estilos_pdf()
            elementos = []

            elementos.append(Paragraph("SOFTWARE DE MECÁNICA DE SUELOS", est["titulo"]))
            elementos.append(Paragraph("INFORME TÉCNICO: DETERMINACIÓN DEL CONTENIDO DE HUMEDAD", est["subtitulo"]))
            elementos.append(Paragraph(f"Norma de referencia: {self.codigo_norma}", est["norma"]))
            elementos.append(Spacer(1, 4))
            elementos.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor(ROJO)))
            elementos.append(Spacer(1, 8))

            datos_proj = self.sincronizar_hacia_proyecto()
            elementos.append(crear_tabla_metadatos(datos_proj))
            elementos.append(Spacer(1, 10))

            cond_data = [
                ["Condiciones de secado:", f"Horno a {self.temp_humedad:.1f} °C por {self.tiempo_humedad:.1f} horas"]
            ]
            tc = Table(cond_data, colWidths=[150, 390])
            tc.setStyle(TableStyle([
                ("FONTNAME", (0, 0), (0, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#333333")),
            ]))
            elementos.append(tc)
            elementos.append(Spacer(1, 8))

            elementos.append(Paragraph("REGISTRO DE PESADAS Y RESULTADOS", est["seccion"]))
            tabla = [
                ["N.º", "Masa Recipiente\n(g)", "Recip. + Suelo Húmedo\n(g)", "Recip. + Suelo Seco\n(g)",
                 "Masa de Agua\n(Ww, g)", "Masa Suelo Seco\n(Ws, g)", "Contenido Humedad\n(w, %)"]
            ]
            for d in self.datos_humedad:
                tabla.append([
                    str(d["id"]),
                    f"{d['mr']:.2f}",
                    f"{d['mh']:.2f}",
                    f"{d['ms']:.2f}",
                    f"{d['mw']:.2f}",
                    f"{d['mss']:.2f}",
                    f"{d['w']:.2f} %"
                ])
            tabla.append(["", "", "", "", "", "PROMEDIO (w):", f"{self.promedio_humedad:.2f} %"])

            tt = Table(tabla, colWidths=[28, 76, 96, 96, 76, 88, 80], repeatRows=1)
            tt.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(ROJO)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#E8F5E9")),
                ("FONTNAME", (5, -1), (-1, -1), "Helvetica-Bold"),
                ("TEXTCOLOR", (6, -1), (6, -1), colors.HexColor(VERDE)),
                ("FONTSIZE", (5, -1), (-1, -1), 8.5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            elementos.append(tt)
            elementos.append(Spacer(1, 10))

            elementos.append(Paragraph("FÓRMULAS APLICADAS:", est["formula"]))
            elementos.append(Paragraph("• Ww = (Masa recipiente + suelo húmedo) − (Masa recipiente + suelo seco)", est["formula"]))
            elementos.append(Paragraph("• Ws = (Masa recipiente + suelo seco) − (Masa recipiente)", est["formula"]))
            elementos.append(Paragraph("• w (%) = (Ww / Ws) × 100", est["formula"]))
            elementos.append(Spacer(1, 8))

            obs_txt = self.observaciones.get("1.0", "end").strip() or "Ninguna observación registrada."
            elementos.append(Paragraph(f"<b>Observaciones:</b> {obs_txt}", est["texto"]))
            elementos.append(Spacer(1, 24))

            elementos.append(KeepTogether([
                crear_bloque_firmas(est),
                Spacer(1, 12),
                Paragraph("Documento generado automáticamente por el Software de Mecánica de Suelos.", est["formula"])
            ]))

            doc.build(elementos)

            if messagebox.askyesno("PDF Generado", f"Informe guardado con éxito:\n\n{ruta}\n\n¿Desea abrir el archivo ahora?"):
                try:
                    os.startfile(ruta)
                except Exception:
                    pass

        except Exception as e:
            messagebox.showerror("Error al exportar", f"No se pudo generar el archivo PDF:\n{e}")


class PesoVolumetrico(BaseEnsayo):
    titulo = "02. PESO VOLUMÉTRICO"
    subtitulo = "Determinación del peso volumétrico y densidad en masa y volumen conocidos."
    codigo_norma = "ASTM D7263 / NTP 339.139 / MTC E110"

    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        self.crear_paneles()
        self.filas_peso_vol = []

        self.scroll = ctk.CTkScrollableFrame(self.panel_entrada, fg_color="transparent")
        self.scroll.pack(fill="both", expand=True, padx=4, pady=2)

        self.tabla_id = TablaFormulario(self.scroll, "Identificación de la Muestra", "📋")
        self.tabla_id.pack(fill="x", padx=4, pady=(2, 8))
        self.tabla_id.agregar_fila("proyecto", "Nombre del Proyecto", "", "Ej. Carretera Central Km 45")
        self.tabla_id.agregar_fila("muestra", "N.º de Muestra", "", "Ej. M-01")
        self.tabla_id.agregar_fila("procedencia", "Procedencia / Ubicación", "", "Ej. Calicata C-01 (1.50 m)")
        self.tabla_id.agregar_fila("material", "Descripción del Material", "", "Ej. Arena arcillosa compacta")
        self.tabla_id.agregar_fila("ensayado", "Ensayado por", "", "Nombre del operador")

        # Control de selección de cantidad de muestras
        frame_cant = ctk.CTkFrame(
            self.scroll,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )
        frame_cant.pack(fill="x", padx=4, pady=6)

        cant_hdr = ctk.CTkFrame(frame_cant, fg_color=HEADER_BG, corner_radius=8, height=34)
        cant_hdr.pack(fill="x", padx=4, pady=(4, 6))
        cant_hdr.pack_propagate(False)
        ctk.CTkLabel(
            cant_hdr,
            text="🔢  Cantidad de Muestras a Analizar",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#1E293B"
        ).pack(side="left", padx=10, pady=6)

        cuerpo_cant = ctk.CTkFrame(frame_cant, fg_color="transparent")
        cuerpo_cant.pack(fill="x", padx=10, pady=(0, 8))

        ctk.CTkLabel(
            cuerpo_cant,
            text="¿Cuántas muestras desea analizar?:",
            font=ctk.CTkFont(size=12),
            text_color="#334155"
        ).pack(side="left", padx=(4, 10))

        self.combo_cant = ctk.CTkComboBox(
            cuerpo_cant,
            values=[str(i) for i in range(1, 11)],
            width=80,
            state="readonly",
            command=lambda choice: self.generar_tabla_muestras()
        )
        self.combo_cant.set("2")
        self.combo_cant.pack(side="left", padx=5)

        crear_boton(
            cuerpo_cant,
            "✨ Generar Tabla",
            self.generar_tabla_muestras,
            color=AZUL,
            hover=AZUL_HOVER,
            width=130,
            height=32
        ).pack(side="left", padx=10)

        # Contenedor de la tabla dinámica de molde / muestra
        self.frame_muestras = ctk.CTkFrame(
            self.scroll,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )
        self.frame_muestras.pack(fill="x", padx=4, pady=6)

        self.hdr_muestras = ctk.CTkFrame(self.frame_muestras, fg_color=HEADER_BG, corner_radius=8, height=34)
        self.hdr_muestras.pack(fill="x", padx=4, pady=(4, 6))
        self.hdr_muestras.pack_propagate(False)
        self.lbl_muestras_titulo = ctk.CTkLabel(
            self.hdr_muestras,
            text="⚖️  Datos Medidos del Molde / Muestra",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#1E293B"
        )
        self.lbl_muestras_titulo.pack(side="left", padx=10, pady=6)

        self.cuerpo_muestras = ctk.CTkFrame(self.frame_muestras, fg_color="transparent")
        self.cuerpo_muestras.pack(fill="x", padx=6, pady=(0, 6))

        obs_frame = ctk.CTkFrame(
            self.scroll,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )
        obs_frame.pack(fill="x", padx=4, pady=6)

        obs_hdr = ctk.CTkFrame(obs_frame, fg_color=HEADER_BG, corner_radius=8, height=32)
        obs_hdr.pack(fill="x", padx=4, pady=(4, 4))
        obs_hdr.pack_propagate(False)
        ctk.CTkLabel(
            obs_hdr,
            text="📝  Observaciones del Ensayo",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#1E293B"
        ).pack(side="left", padx=10, pady=5)

        self.observaciones = ctk.CTkTextbox(obs_frame, height=65, font=ctk.CTkFont(size=11))
        self.observaciones.pack(fill="x", padx=8, pady=(2, 8))

        self.botones()
        self.mostrar_resultados()

        self.datos_calculados = {}
        self.generar_tabla_muestras()

    def generar_tabla_muestras(self):
        try:
            num_muestras = int(self.combo_cant.get())
        except ValueError:
            num_muestras = 2

        valores_previos = []
        for fila in self.filas_peso_vol:
            valores_previos.append({
                "molde": fila["molde"].get(),
                "molde_suelo": fila["molde_suelo"].get(),
                "volumen": fila["volumen"].get(),
                "humedad": fila["humedad"].get()
            })

        for child in self.cuerpo_muestras.winfo_children():
            child.destroy()

        self.filas_peso_vol = []
        self.lbl_muestras_titulo.configure(
            text=f"⚖️  Datos Medidos por Muestra / Molde ({num_muestras} Muestra(s))"
        )

        self.cuerpo_muestras.grid_columnconfigure(0, weight=0, minsize=32)
        self.cuerpo_muestras.grid_columnconfigure(1, weight=1)
        self.cuerpo_muestras.grid_columnconfigure(2, weight=1)
        self.cuerpo_muestras.grid_columnconfigure(3, weight=1)
        self.cuerpo_muestras.grid_columnconfigure(4, weight=1)

        encabezados = ["N.º", "Masa Molde (g)", "Masa Molde+Suelo (g)", "Volumen (cm³)", "Humedad w (%) (opc.)"]
        for col, texto in enumerate(encabezados):
            ctk.CTkLabel(
                self.cuerpo_muestras,
                text=texto,
                font=ctk.CTkFont(size=10, weight="bold"),
                text_color="#1E293B",
                wraplength=100,
                justify="center"
            ).grid(row=0, column=col, padx=2, pady=(2, 6), sticky="nsew")

        placeholders = ["Ej. 4500.00", "Ej. 6100.00", "Ej. 1000.00", "Ej. 12.50"]
        claves = ["molde", "molde_suelo", "volumen", "humedad"]

        for i in range(num_muestras):
            fila = {}
            bg = "#F8FAFC" if i % 2 == 0 else "#FFFFFF"
            fila_box = ctk.CTkFrame(self.cuerpo_muestras, fg_color=bg, corner_radius=6)
            fila_box.grid(row=i + 1, column=0, columnspan=5, sticky="ew", padx=1, pady=2)
            fila_box.grid_columnconfigure(0, weight=0, minsize=32)
            fila_box.grid_columnconfigure(1, weight=1)
            fila_box.grid_columnconfigure(2, weight=1)
            fila_box.grid_columnconfigure(3, weight=1)
            fila_box.grid_columnconfigure(4, weight=1)

            ctk.CTkLabel(
                fila_box,
                text=str(i + 1),
                font=ctk.CTkFont(size=11, weight="bold"),
                text_color=ROJO,
                width=28
            ).grid(row=0, column=0, padx=2, pady=3)

            for c_idx, clave in enumerate(claves):
                e = ctk.CTkEntry(
                    fila_box,
                    height=30,
                    placeholder_text=placeholders[c_idx],
                    font=ctk.CTkFont(size=11),
                    border_width=1,
                    border_color="#CBD5E1",
                    corner_radius=6
                )
                if i < len(valores_previos) and valores_previos[i][clave]:
                    e.insert(0, valores_previos[i][clave])
                e.grid(row=0, column=c_idx + 1, padx=2, pady=3, sticky="ew")
                fila[clave] = e

            self.filas_peso_vol.append(fila)

    def sincronizar_desde_proyecto(self, datos):
        for k in ["proyecto", "muestra", "procedencia", "material", "ensayado"]:
            if k in datos and datos[k] and not self.tabla_id.obtener_texto(k):
                self.tabla_id.poner_texto(k, datos[k])

    def sincronizar_hacia_proyecto(self):
        d = {k: self.tabla_id.obtener_texto(k) for k in ["proyecto", "muestra", "procedencia", "material", "ensayado"]}
        self.controller.guardar_datos_proyecto(d)
        return d

    def _leer_fila(self, fila, numero):
        mm = leer_numero(fila["molde"], f"Masa del molde - Muestra {numero}")
        mts = leer_numero(fila["molde_suelo"], f"Masa molde+suelo - Muestra {numero}")
        v = leer_numero(fila["volumen"], f"Volumen del molde - Muestra {numero}")
        w = leer_numero(fila["humedad"], f"Contenido de humedad - Muestra {numero}")

        if mm is None or mts is None or v is None:
            raise ValueError(f"Complete los campos obligatorios de la Muestra {numero}: Masa molde, Masa molde+suelo y Volumen.")

        if mm < 0 or mts < 0:
            raise ValueError(f"Las masas en la Muestra {numero} no pueden ser negativas.")
        if mts <= mm:
            raise ValueError(f"En la Muestra {numero}, la masa recipiente+suelo debe ser mayor que la masa del recipiente.")
        if v <= 0:
            raise ValueError(f"En la Muestra {numero}, el volumen debe ser mayor que cero.")
        if w is not None and w < 0:
            raise ValueError(f"En la Muestra {numero}, el contenido de humedad no puede ser negativo.")

        masa_suelo = mts - mm
        rho_humeda = masa_suelo / v
        rho_kg_m3 = rho_humeda * 1000.0
        gamma_kn_m3 = rho_kg_m3 * 9.80665 / 1000.0
        gamma_gf_cm3 = rho_humeda

        rho_seca = None
        rho_seca_kg_m3 = None
        gamma_seca = None

        if w is not None:
            rho_seca = rho_humeda / (1.0 + w / 100.0)
            rho_seca_kg_m3 = rho_seca * 1000.0
            gamma_seca = rho_seca_kg_m3 * 9.80665 / 1000.0

        return {
            "id": numero,
            "mm": mm,
            "mts": mts,
            "v": v,
            "w": w,
            "masa_suelo": masa_suelo,
            "rho_humeda": rho_humeda,
            "rho_kg_m3": rho_kg_m3,
            "gamma_kn_m3": gamma_kn_m3,
            "gamma_gf_cm3": gamma_gf_cm3,
            "rho_seca": rho_seca,
            "rho_seca_kg_m3": rho_seca_kg_m3,
            "gamma_seca": gamma_seca,
        }

    def calcular(self):
        try:
            self.sincronizar_hacia_proyecto()

            datos_muestras = []
            for i, fila in enumerate(self.filas_peso_vol, start=1):
                d = self._leer_fila(fila, i)
                datos_muestras.append(d)

            if not datos_muestras:
                raise ValueError("Ingrese los datos de las muestras a analizar.")

            n = len(datos_muestras)
            prom_rho_humeda = sum(d["rho_humeda"] for d in datos_muestras) / n
            prom_gamma_kn_m3 = sum(d["gamma_kn_m3"] for d in datos_muestras) / n

            muestras_con_w = [d for d in datos_muestras if d["w"] is not None]
            prom_w = sum(d["w"] for d in muestras_con_w) / len(muestras_con_w) if muestras_con_w else None
            prom_rho_seca = sum(d["rho_seca"] for d in muestras_con_w) / len(muestras_con_w) if muestras_con_w else None
            prom_gamma_seca = sum(d["gamma_seca"] for d in muestras_con_w) / len(muestras_con_w) if muestras_con_w else None

            res = []
            for d in datos_muestras:
                res.extend([
                    (f"Muestra {d['id']} – Masa neta suelo húmedo", f"{d['masa_suelo']:.2f}", "g"),
                    (f"Muestra {d['id']} – Densidad húmeda (ρ)", f"{d['rho_humeda']:.4f}", "g/cm³"),
                    (f"Muestra {d['id']} – Peso volumétrico húmedo (γ)", f"{d['gamma_kn_m3']:.3f}", "kN/m³"),
                ])
                if d["w"] is not None:
                    res.extend([
                        (f"Muestra {d['id']} – Densidad seca (ρd)", f"{d['rho_seca']:.4f}", "g/cm³"),
                        (f"Muestra {d['id']} – Peso volumétrico seco (γd)", f"{d['gamma_seca']:.3f}", "kN/m³"),
                    ])

            res.extend([
                ("Número de muestras analizadas", str(n), ""),
                ("PROMEDIO Densidad natural húmeda (ρ)", f"{prom_rho_humeda:.4f}", "g/cm³"),
                ("PROMEDIO Peso volumétrico húmedo (γ)", f"{prom_gamma_kn_m3:.3f}", "kN/m³"),
            ])
            if prom_gamma_seca is not None:
                res.extend([
                    ("PROMEDIO Densidad seca (ρd)", f"{prom_rho_seca:.4f}", "g/cm³"),
                    ("PROMEDIO Peso volumétrico seco (γd)", f"{prom_gamma_seca:.3f}", "kN/m³"),
                ])

            self.resultados = res
            self.datos_calculados = {
                "muestras": datos_muestras,
                "mm": sum(d["mm"] for d in datos_muestras) / n,
                "mts": sum(d["mts"] for d in datos_muestras) / n,
                "v": sum(d["v"] for d in datos_muestras) / n,
                "w": prom_w,
                "masa_suelo": sum(d["masa_suelo"] for d in datos_muestras) / n,
                "rho_humeda": prom_rho_humeda,
                "rho_kg_m3": prom_rho_humeda * 1000.0,
                "gamma_kn_m3": prom_gamma_kn_m3,
                "gamma_gf_cm3": prom_rho_humeda,
                "rho_seca": prom_rho_seca,
                "rho_seca_kg_m3": prom_rho_seca * 1000.0 if prom_rho_seca else None,
                "gamma_seca": prom_gamma_seca,
            }
            self.mostrar_resultados()

        except Exception as err:
            messagebox.showerror("Error en los datos", str(err))

    def limpiar(self):
        for fila in self.filas_peso_vol:
            for e in fila.values():
                e.delete(0, "end")
        self.observaciones.delete("1.0", "end")
        self.resultados = []
        self.datos_calculados = {}
        self.mostrar_resultados()

    def exportar_pdf(self):
        if not self.datos_calculados or "muestras" not in self.datos_calculados:
            messagebox.showwarning("Sin resultados", "Primero realice el cálculo del peso volumétrico.")
            return

        nombre_archivo = f"Peso_Volumetrico_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        ruta = filedialog.asksaveasfilename(
            title="Guardar Informe de Peso Volumétrico",
            defaultextension=".pdf",
            initialfile=nombre_archivo,
            filetypes=[("Archivo PDF", "*.pdf")]
        )
        if not ruta:
            return

        try:
            doc = SimpleDocTemplate(
                ruta, pagesize=letter,
                rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
            )
            est = obtener_estilos_pdf()
            elementos = []

            elementos.append(Paragraph("SOFTWARE DE MECÁNICA DE SUELOS", est["titulo"]))
            elementos.append(Paragraph("INFORME TÉCNICO: DETERMINACIÓN DEL PESO VOLUMÉTRICO Y DENSIDAD", est["subtitulo"]))
            elementos.append(Paragraph(f"Norma de referencia: {self.codigo_norma}", est["norma"]))
            elementos.append(Spacer(1, 4))
            elementos.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor(ROJO)))
            elementos.append(Spacer(1, 8))

            datos_proj = self.sincronizar_hacia_proyecto()
            elementos.append(crear_tabla_metadatos(datos_proj))
            elementos.append(Spacer(1, 10))

            elementos.append(Paragraph("REGISTRO DE MUESTRAS Y RESULTADOS", est["seccion"]))
            d_calc = self.datos_calculados
            datos_tabla = [
                ["N.º", "Masa Molde\n(g)", "Masa Molde+Suelo\n(g)", "Volumen\n(cm³)", "Humedad w\n(%)",
                 "Masa Suelo\n(g)", "Densidad Húmeda\n(g/cm³)", "Peso Vol. Húmedo\n(kN/m³)", "Peso Vol. Seco\n(kN/m³)"]
            ]
            for m in d_calc["muestras"]:
                datos_tabla.append([
                    str(m["id"]),
                    f"{m['mm']:.2f}",
                    f"{m['mts']:.2f}",
                    f"{m['v']:.2f}",
                    f"{m['w']:.2f} %" if m["w"] is not None else "—",
                    f"{m['masa_suelo']:.2f}",
                    f"{m['rho_humeda']:.4f}",
                    f"{m['gamma_kn_m3']:.3f}",
                    f"{m['gamma_seca']:.3f}" if m.get("gamma_seca") else "—"
                ])

            datos_tabla.append([
                "", "", "", "", "PROMEDIOS:",
                f"{d_calc['masa_suelo']:.2f}",
                f"{d_calc['rho_humeda']:.4f}",
                f"{d_calc['gamma_kn_m3']:.3f}",
                f"{d_calc['gamma_seca']:.3f}" if d_calc.get("gamma_seca") else "—"
            ])

            tm = Table(datos_tabla, colWidths=[25, 60, 75, 55, 50, 65, 75, 70, 65], repeatRows=1)
            tm.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(AZUL)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#E8F5E9")),
                ("FONTNAME", (4, -1), (-1, -1), "Helvetica-Bold"),
                ("TEXTCOLOR", (6, -1), (8, -1), colors.HexColor(VERDE)),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            elementos.append(tm)
            elementos.append(Spacer(1, 10))

            elementos.append(Paragraph("FÓRMULAS EMPLEADAS:", est["formula"]))
            elementos.append(Paragraph("• Masa suelo = (Masa molde + suelo) − Masa molde", est["formula"]))
            elementos.append(Paragraph("• Densidad húmeda ρ = Masa suelo / Volumen", est["formula"]))
            elementos.append(Paragraph("• Peso volumétrico γ = ρ × 9.80665 / 1000  (kN/m³)", est["formula"]))
            if d_calc.get("w") is not None:
                elementos.append(Paragraph("• Densidad seca ρd = ρ / (1 + w/100)", est["formula"]))
                elementos.append(Paragraph("• Peso volumétrico seco γd = ρd × 9.80665 / 1000  (kN/m³)", est["formula"]))
            elementos.append(Spacer(1, 8))

            obs_txt = self.observaciones.get("1.0", "end").strip() or "Ninguna observación registrada."
            elementos.append(Paragraph(f"<b>Observaciones:</b> {obs_txt}", est["texto"]))
            elementos.append(Spacer(1, 24))

            elementos.append(KeepTogether([
                crear_bloque_firmas(est),
                Spacer(1, 12),
                Paragraph("Documento generado automáticamente por el Software de Mecánica de Suelos.", est["formula"])
            ]))

            doc.build(elementos)

            if messagebox.askyesno("PDF Generado", f"Informe guardado con éxito:\n\n{ruta}\n\n¿Desea abrir el archivo ahora?"):
                try:
                    os.startfile(ruta)
                except Exception:
                    pass

        except Exception as e:
            messagebox.showerror("Error al exportar", f"No se pudo generar el archivo PDF:\n{e}")


class GravedadEspecifica(BaseEnsayo):
    titulo = "03. GRAVEDAD ESPECÍFICA"
    subtitulo = "Determinación de la gravedad específica de los sólidos del suelo mediante picnómetro de agua."
    codigo_norma = "ASTM D854 / NTP 339.131 / MTC E107"

    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        self.crear_paneles()
        self.filas_gs = []

        self.scroll = ctk.CTkScrollableFrame(self.panel_entrada, fg_color="transparent")
        self.scroll.pack(fill="both", expand=True, padx=4, pady=2)

        self.tabla_id = TablaFormulario(self.scroll, "Identificación de la Muestra", "📋")
        self.tabla_id.pack(fill="x", padx=4, pady=(2, 8))
        self.tabla_id.agregar_fila("proyecto", "Nombre del Proyecto", "", "Ej. Carretera Central Km 45")
        self.tabla_id.agregar_fila("muestra", "N.º de Muestra", "", "Ej. M-01")
        self.tabla_id.agregar_fila("procedencia", "Procedencia / Ubicación", "", "Ej. Calicata C-01 (1.50 m)")
        self.tabla_id.agregar_fila("material", "Descripción del Material", "", "Ej. Suelo fino granular")
        self.tabla_id.agregar_fila("ensayado", "Ensayado por", "", "Nombre del operador")

        # Control de selección de cantidad de muestras
        frame_cant = ctk.CTkFrame(
            self.scroll,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )
        frame_cant.pack(fill="x", padx=4, pady=6)

        cant_hdr = ctk.CTkFrame(frame_cant, fg_color=HEADER_BG, corner_radius=8, height=34)
        cant_hdr.pack(fill="x", padx=4, pady=(4, 6))
        cant_hdr.pack_propagate(False)
        ctk.CTkLabel(
            cant_hdr,
            text="🔢  Cantidad de Muestras a Analizar",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#1E293B"
        ).pack(side="left", padx=10, pady=6)

        cuerpo_cant = ctk.CTkFrame(frame_cant, fg_color="transparent")
        cuerpo_cant.pack(fill="x", padx=10, pady=(0, 8))

        ctk.CTkLabel(
            cuerpo_cant,
            text="¿Cuántas muestras desea analizar?:",
            font=ctk.CTkFont(size=12),
            text_color="#334155"
        ).pack(side="left", padx=(4, 10))

        self.combo_cant = ctk.CTkComboBox(
            cuerpo_cant,
            values=[str(i) for i in range(1, 11)],
            width=80,
            state="readonly",
            command=lambda choice: self.generar_tabla_muestras()
        )
        self.combo_cant.set("2")
        self.combo_cant.pack(side="left", padx=5)

        crear_boton(
            cuerpo_cant,
            "✨ Generar Tabla",
            self.generar_tabla_muestras,
            color=AZUL,
            hover=AZUL_HOVER,
            width=130,
            height=32
        ).pack(side="left", padx=10)

        # Contenedor de la tabla dinámica del picnómetro
        self.frame_muestras = ctk.CTkFrame(
            self.scroll,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )
        self.frame_muestras.pack(fill="x", padx=4, pady=6)

        self.hdr_muestras = ctk.CTkFrame(self.frame_muestras, fg_color=HEADER_BG, corner_radius=8, height=34)
        self.hdr_muestras.pack(fill="x", padx=4, pady=(4, 6))
        self.hdr_muestras.pack_propagate(False)
        self.lbl_muestras_titulo = ctk.CTkLabel(
            self.hdr_muestras,
            text="🔬  Datos Medidos con el Picnómetro",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#1E293B"
        )
        self.lbl_muestras_titulo.pack(side="left", padx=10, pady=6)

        self.cuerpo_muestras = ctk.CTkFrame(self.frame_muestras, fg_color="transparent")
        self.cuerpo_muestras.pack(fill="x", padx=6, pady=(0, 6))

        obs_frame = ctk.CTkFrame(
            self.scroll,
            corner_radius=10,
            border_width=1,
            border_color=BORDER_COLOR,
            fg_color=CARD_BG
        )
        obs_frame.pack(fill="x", padx=4, pady=6)

        obs_hdr = ctk.CTkFrame(obs_frame, fg_color=HEADER_BG, corner_radius=8, height=32)
        obs_hdr.pack(fill="x", padx=4, pady=(4, 4))
        obs_hdr.pack_propagate(False)
        ctk.CTkLabel(
            obs_hdr,
            text="📝  Observaciones del Ensayo",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#1E293B"
        ).pack(side="left", padx=10, pady=5)

        self.observaciones = ctk.CTkTextbox(obs_frame, height=65, font=ctk.CTkFont(size=11))
        self.observaciones.pack(fill="x", padx=8, pady=(2, 8))

        self.botones()
        self.mostrar_resultados()

        self.datos_calculados = {}
        self.generar_tabla_muestras()

    def generar_tabla_muestras(self):
        try:
            num_muestras = int(self.combo_cant.get())
        except ValueError:
            num_muestras = 2

        valores_previos = []
        for fila in self.filas_gs:
            valores_previos.append({
                "muestra_seca": fila["muestra_seca"].get(),
                "picnometro": fila["picnometro"].get(),
                "pic_agua": fila["pic_agua"].get(),
                "pic_suelo_agua": fila["pic_suelo_agua"].get()
            })

        for child in self.cuerpo_muestras.winfo_children():
            child.destroy()

        self.filas_gs = []
        self.lbl_muestras_titulo.configure(
            text=f"🔬  Datos Medidos con el Picnómetro ({num_muestras} Muestra(s))"
        )

        self.cuerpo_muestras.grid_columnconfigure(0, weight=0, minsize=32)
        self.cuerpo_muestras.grid_columnconfigure(1, weight=1)
        self.cuerpo_muestras.grid_columnconfigure(2, weight=1)
        self.cuerpo_muestras.grid_columnconfigure(3, weight=1)
        self.cuerpo_muestras.grid_columnconfigure(4, weight=1)

        encabezados = ["N.º", "Temperatura de ensayo [°C]", "Masa Suelo Seco Ms (g)", "Picnómetro + Agua Mpw (g)", "Pic. + Suelo + Agua Mpsw (g)"]
        for col, texto in enumerate(encabezados):
            ctk.CTkLabel(
                self.cuerpo_muestras,
                text=texto,
                font=ctk.CTkFont(size=10, weight="bold"),
                text_color="#1E293B",
                wraplength=100,
                justify="center"
            ).grid(row=0, column=col, padx=2, pady=(2, 6), sticky="nsew")

        placeholders = ["Ej. 21.0", "Ej. 50.00", "Ej. 220.00", "Ej. 251.20"]
        claves = ["temperatura", "muestra_seca", "pic_agua", "pic_suelo_agua"]

        for i in range(num_muestras):
            fila = {}
            bg = "#F8FAFC" if i % 2 == 0 else "#FFFFFF"
            fila_box = ctk.CTkFrame(self.cuerpo_muestras, fg_color=bg, corner_radius=6)
            fila_box.grid(row=i + 1, column=0, columnspan=5, sticky="ew", padx=1, pady=2)
            fila_box.grid_columnconfigure(0, weight=0, minsize=32)
            fila_box.grid_columnconfigure(1, weight=1)
            fila_box.grid_columnconfigure(2, weight=1)
            fila_box.grid_columnconfigure(3, weight=1)
            fila_box.grid_columnconfigure(4, weight=1)

            ctk.CTkLabel(
                fila_box,
                text=str(i + 1),
                font=ctk.CTkFont(size=11, weight="bold"),
                text_color=ROJO,
                width=28
            ).grid(row=0, column=0, padx=2, pady=3)

            for c_idx, clave in enumerate(claves):
                e = ctk.CTkEntry(
                    fila_box,
                    height=30,
                    placeholder_text=placeholders[c_idx],
                    font=ctk.CTkFont(size=11),
                    border_width=1,
                    border_color="#CBD5E1",
                    corner_radius=6
                )
                if i < len(valores_previos) and valores_previos[i][clave]:
                    e.insert(0, valores_previos[i][clave])
                e.grid(row=0, column=c_idx + 1, padx=2, pady=3, sticky="ew")
                fila[clave] = e

            self.filas_gs.append(fila)

    def sincronizar_desde_proyecto(self, datos):
        for k in ["proyecto", "muestra", "procedencia", "material", "ensayado"]:
            if k in datos and datos[k] and not self.tabla_id.obtener_texto(k):
                self.tabla_id.poner_texto(k, datos[k])

    def sincronizar_hacia_proyecto(self):
        d = {k: self.tabla_id.obtener_texto(k) for k in ["proyecto", "muestra", "procedencia", "material", "ensayado"]}
        self.controller.guardar_datos_proyecto(d)
        return d

    def obtener_propiedades_agua(self, t):
        if t >= 100 and t <= 500:
            t = t / 10.0
        t = max(0.0, min(t, 50.0))
        rho = 1.0 - ((t - 3.98) ** 2) * (t + 283.0) / (503570.0 * (t + 67.26))
        k = rho / 0.99820
        return rho, k

    def _leer_fila(self, fila, numero):
        temp = leer_numero(fila["temperatura"], f"Temperatura de ensayo - Muestra {numero}")
        ms = leer_numero(fila["muestra_seca"], f"Masa del suelo seco - Muestra {numero}")
        mpw = leer_numero(fila["pic_agua"], f"Masa picnómetro + agua - Muestra {numero}")
        mpsw = leer_numero(fila["pic_suelo_agua"], f"Masa picnómetro + suelo + agua - Muestra {numero}")

        if None in (temp, ms, mpw, mpsw):
            raise ValueError(f"Complete todos los datos requeridos de la Muestra {numero}.")

        if temp < 0 or temp > 50:
            if temp >= 100 and temp <= 500:
                temp = temp / 10.0
            else:
                raise ValueError(f"La temperatura en la Muestra {numero} debe estar entre 0 y 50 °C.")

        if ms <= 0 or mpw <= 0 or mpsw <= 0:
            raise ValueError(f"Las masas medidas en la Muestra {numero} deben ser mayores que cero.")

        denominador = (ms + mpw) - mpsw

        if denominador <= 0:
            raise ValueError(
                f"En la Muestra {numero}, el volumen desplazado no es válido ({denominador:.2f} g). "
                "Verifique la masa con suelo y agua (Mpsw)."
            )

        gt = ms / denominador
        _, k = self.obtener_propiedades_agua(temp)
        g20 = gt * k
        
        return {
            "id": numero,
            "temp": temp,
            "ms": ms,
            "mpw": mpw,
            "mpsw": mpsw,
            "desalojada": denominador,
            "gt": gt,
            "k": k,
            "gs": g20,
        }

    def calcular(self):
        try:
            self.sincronizar_hacia_proyecto()

            datos_muestras = []
            for i, fila in enumerate(self.filas_gs, start=1):
                d = self._leer_fila(fila, i)
                datos_muestras.append(d)

            if not datos_muestras:
                raise ValueError("Ingrese los datos de las muestras a analizar.")

            n = len(datos_muestras)
            prom_gs = sum(d["gs"] for d in datos_muestras) / n

            res = []
            for d in datos_muestras:
                res.extend([
                    (f"Muestra {d['id']} – Temperatura de ensayo", f"{d['temp']:.1f}", "°C"),
                    (f"Muestra {d['id']} – Masa suelo seco (Ms)", f"{d['ms']:.2f}", "g"),
                    (f"Muestra {d['id']} – Masa agua desalojada", f"{d['desalojada']:.2f}", "g"),
                    (f"Muestra {d['id']} – Gravedad específica a T° (Gt)", f"{d['gt']:.3f}", ""),
                    (f"Muestra {d['id']} – Factor de corrección (K)", f"{d['k']:.5f}", ""),
                    (f"Muestra {d['id']} – Gravedad específica a 20°C (Gs)", f"{d['gs']:.3f}", ""),
                ])

            res.extend([
                ("Número de muestras analizadas", str(n), ""),
                ("PROMEDIO GRAVEDAD ESPECÍFICA (Gs)", f"{prom_gs:.3f}", ""),
            ])

            self.resultados = res
            self.datos_calculados = {
                "muestras": datos_muestras,
                "ms": sum(d["ms"] for d in datos_muestras) / n,
                "mp": sum(d["mp"] for d in datos_muestras) / n,
                "mpw": sum(d["mpw"] for d in datos_muestras) / n,
                "mpsw": sum(d["mpsw"] for d in datos_muestras) / n,
                "desalojada": sum(d["desalojada"] for d in datos_muestras) / n,
                "gs": prom_gs,
            }
            self.mostrar_resultados()

        except Exception as err:
            messagebox.showerror("Error en los datos", str(err))

    def limpiar(self):
        for fila in self.filas_gs:
            for e in fila.values():
                e.delete(0, "end")
        self.observaciones.delete("1.0", "end")
        self.resultados = []
        self.datos_calculados = {}
        self.mostrar_resultados()

    def exportar_pdf(self):
        if not self.datos_calculados or "muestras" not in self.datos_calculados:
            messagebox.showwarning("Sin resultados", "Primero realice el cálculo de la gravedad específica.")
            return

        nombre_archivo = f"Gravedad_Especifica_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        ruta = filedialog.asksaveasfilename(
            title="Guardar Informe de Gravedad Específica",
            defaultextension=".pdf",
            initialfile=nombre_archivo,
            filetypes=[("Archivo PDF", "*.pdf")]
        )
        if not ruta:
            return

        try:
            doc = SimpleDocTemplate(
                ruta, pagesize=letter,
                rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
            )
            est = obtener_estilos_pdf()
            elementos = []

            elementos.append(Paragraph("SOFTWARE DE MECÁNICA DE SUELOS", est["titulo"]))
            elementos.append(Paragraph("INFORME TÉCNICO: GRAVEDAD ESPECÍFICA DE LOS SÓLIDOS (Gs)", est["subtitulo"]))
            elementos.append(Paragraph(f"Norma de referencia: {self.codigo_norma}", est["norma"]))
            elementos.append(Spacer(1, 4))
            elementos.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor(ROJO)))
            elementos.append(Spacer(1, 8))

            datos_proj = self.sincronizar_hacia_proyecto()
            elementos.append(crear_tabla_metadatos(datos_proj))
            elementos.append(Spacer(1, 10))

            elementos.append(Paragraph("MEDICIONES EN PICNÓMETRO Y RESULTADOS", est["seccion"]))
            d_calc = self.datos_calculados
            datos_tabla = [
                ["N.º", "Masa Seca Ms\n(g)", "Picnómetro Mp\n(g)", "Pic. + Agua Mpw\n(g)", "Pic. + Suelo + Agua Mpsw\n(g)", "Agua Desalojada\n(g)", "Gravedad Específica\n(Gs)"]
            ]
            for m in d_calc["muestras"]:
                datos_tabla.append([
                    str(m["id"]),
                    f"{m['ms']:.2f}",
                    f"{m['mp']:.2f}",
                    f"{m['mpw']:.2f}",
                    f"{m['mpsw']:.2f}",
                    f"{m['desalojada']:.2f}",
                    f"{m['gs']:.3f}"
                ])

            datos_tabla.append([
                "", "", "", "", "", "PROMEDIO (Gs):", f"{d_calc['gs']:.3f}"
            ])

            tm = Table(datos_tabla, colWidths=[30, 85, 85, 90, 100, 80, 70], repeatRows=1)
            tm.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(AZUL)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#E8F5E9")),
                ("FONTNAME", (5, -1), (-1, -1), "Helvetica-Bold"),
                ("TEXTCOLOR", (6, -1), (6, -1), colors.HexColor(VERDE)),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            elementos.append(tm)
            elementos.append(Spacer(1, 10))

            elementos.append(Paragraph("FÓRMULA EMPLEADA:", est["formula"]))
            elementos.append(Paragraph("• Gs = Ms / [ (Mpw − Mp) − (Mpsw − Mp − Ms) ]", est["formula"]))
            elementos.append(Spacer(1, 8))
            obs_txt = self.observaciones.get("1.0", "end").strip() or "Ninguna observación registrada."
            elementos.append(Paragraph(f"<b>Observaciones:</b> {obs_txt}", est["texto"]))
            elementos.append(Spacer(1, 24))
            elementos.append(KeepTogether([
                crear_bloque_firmas(est),
                Spacer(1, 12),
                Paragraph("Documento generado automáticamente por el Software de Mecánica de Suelos.", est["formula"])
            ]))

            doc.build(elementos)

            if messagebox.askyesno("PDF Generado", f"Informe guardado con éxito:\n\n{ruta}\n\n¿Desea abrir el archivo ahora?"):
                try:
                    os.startfile(ruta)
                except Exception:
                    pass

        except Exception as e:
            messagebox.showerror("Error al exportar", f"No se pudo generar el archivo PDF:\n{e}")


class Granulometria(BaseEnsayo):
    titulo = "04. ANÁLISIS GRANULOMÉTRICO"
    subtitulo = "Análisis Granulométrico por Tamizado"
    codigo_norma = "ASTM D6913"

    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        self.crear_paneles()

        self.scroll = ctk.CTkScrollableFrame(self.panel_entrada, fg_color="transparent")
        self.scroll.pack(fill="both", expand=True, padx=4, pady=2)

        self.tabla_id = TablaFormulario(self.scroll, "Identificación de la Muestra", "📋")
        self.tabla_id.pack(fill="x", padx=4, pady=(2, 8))
        self.tabla_id.agregar_fila("proyecto", "Nombre del Proyecto", "", "Ej. Carretera Central Km 45")
        self.tabla_id.agregar_fila("muestra", "N.º de Muestra", "", "Ej. M-01")
        self.tabla_id.agregar_fila("procedencia", "Procedencia / Ubicación", "", "Ej. Calicata C-01 (1.50 m)")
        self.tabla_id.agregar_fila("material", "Descripción del Material", "", "Ej. Grava arenosa")
        self.tabla_id.agregar_fila("ensayado", "Ensayado por", "", "Nombre del operador")

        self.tabla_masas = TablaFormulario(self.scroll, "Masa de la Muestra", "⚖️")
        self.tabla_masas.pack(fill="x", padx=4, pady=6)
        self.tabla_masas.agregar_fila("masa_seca", "Masa Seca Total Inicial", "g", "")

        self.frame_tamices = ctk.CTkFrame(self.scroll, corner_radius=10, border_width=1, border_color=BORDER_COLOR, fg_color=CARD_BG)
        self.frame_tamices.pack(fill="x", padx=4, pady=6)

        hdr_tamices = ctk.CTkFrame(self.frame_tamices, fg_color=HEADER_BG, corner_radius=8, height=34)
        hdr_tamices.pack(fill="x", padx=4, pady=(4, 6))
        hdr_tamices.pack_propagate(False)
        ctk.CTkLabel(hdr_tamices, text="🕳️  Masas Retenidas por Tamiz", font=ctk.CTkFont(size=12, weight="bold"), text_color="#1E293B").pack(side="left", padx=10, pady=6)

        self.cuerpo_tamices = ctk.CTkFrame(self.frame_tamices, fg_color="transparent")
        self.cuerpo_tamices.pack(fill="x", padx=6, pady=(0, 6))

        self.filas_tamices = []
        self.generar_tabla_tamices()

        obs_frame = ctk.CTkFrame(self.scroll, corner_radius=10, border_width=1, border_color=BORDER_COLOR, fg_color=CARD_BG)
        obs_frame.pack(fill="x", padx=4, pady=6)
        obs_hdr = ctk.CTkFrame(obs_frame, fg_color=HEADER_BG, corner_radius=8, height=32)
        obs_hdr.pack(fill="x", padx=4, pady=(4, 4))
        obs_hdr.pack_propagate(False)
        ctk.CTkLabel(obs_hdr, text="📝  Observaciones del Ensayo", font=ctk.CTkFont(size=12, weight="bold"), text_color="#1E293B").pack(side="left", padx=10, pady=5)
        self.observaciones = ctk.CTkTextbox(obs_frame, height=65, font=ctk.CTkFont(size=11))
        self.observaciones.pack(fill="x", padx=8, pady=(2, 8))

        self.botones()
        self.mostrar_resultados()

        self.datos_calculados = {}

    def generar_tabla_tamices(self):
        tamices_std = [
            ("3\"", 75.000), ("2\"", 50.000), ("1 1/2\"", 37.500), ("1\"", 25.000),
            ("3/4\"", 19.000), ("1/2\"", 12.500), ("3/8\"", 9.500), ("1/4\"", 6.350),
            ("N° 4", 4.750), ("N° 10", 2.000), ("N° 20", 0.850), ("N° 30", 0.600),
            ("N° 40", 0.425), ("N° 60", 0.250), ("N° 100", 0.150), ("N° 200", 0.075),
            ("Fondo", 0.0)
        ]

        self.cuerpo_tamices.grid_columnconfigure(0, weight=1)
        self.cuerpo_tamices.grid_columnconfigure(1, weight=1)
        self.cuerpo_tamices.grid_columnconfigure(2, weight=1)

        ctk.CTkLabel(self.cuerpo_tamices, text="Tamiz", font=ctk.CTkFont(size=10, weight="bold")).grid(row=0, column=0, padx=2, pady=2)
        ctk.CTkLabel(self.cuerpo_tamices, text="Abertura (mm)", font=ctk.CTkFont(size=10, weight="bold")).grid(row=0, column=1, padx=2, pady=2)
        ctk.CTkLabel(self.cuerpo_tamices, text="Retenido (g)", font=ctk.CTkFont(size=10, weight="bold")).grid(row=0, column=2, padx=2, pady=2)

        for i, (nombre, abertura) in enumerate(tamices_std):
            bg = "#F8FAFC" if i % 2 == 0 else "#FFFFFF"
            fila_box = ctk.CTkFrame(self.cuerpo_tamices, fg_color=bg, corner_radius=6)
            fila_box.grid(row=i+1, column=0, columnspan=3, sticky="ew", padx=1, pady=1)
            fila_box.grid_columnconfigure(0, weight=1)
            fila_box.grid_columnconfigure(1, weight=1)
            fila_box.grid_columnconfigure(2, weight=1)

            ctk.CTkLabel(fila_box, text=nombre, font=ctk.CTkFont(size=11)).grid(row=0, column=0, padx=2, pady=2)
            ctk.CTkLabel(fila_box, text=f"{abertura:.3f}" if abertura > 0 else "-", font=ctk.CTkFont(size=11)).grid(row=0, column=1, padx=2, pady=2)
            
            e_ret = ctk.CTkEntry(fila_box, height=28, font=ctk.CTkFont(size=11))
            e_ret.grid(row=0, column=2, padx=2, pady=2, sticky="ew")

            self.filas_tamices.append({
                "nombre": nombre,
                "abertura": abertura,
                "entry": e_ret
            })

    def sincronizar_desde_proyecto(self, datos):
        for k in ["proyecto", "muestra", "procedencia", "material", "ensayado"]:
            if k in datos and datos[k] and not self.tabla_id.obtener_texto(k):
                self.tabla_id.poner_texto(k, datos[k])

    def sincronizar_hacia_proyecto(self):
        d = {k: self.tabla_id.obtener_texto(k) for k in ["proyecto", "muestra", "procedencia", "material", "ensayado"]}
        self.controller.guardar_datos_proyecto(d)
        return d

    def calcular(self):
        try:
            self.sincronizar_hacia_proyecto()

            masa_seca = leer_numero(self.tabla_masas.entradas["masa_seca"], "Masa Seca Total Inicial")
            if masa_seca is None or masa_seca <= 0:
                raise ValueError("La masa seca total debe ser mayor que cero.")

            datos_tamices = []
            acumulado = 0.0
            for fila in self.filas_tamices:
                retenido = leer_numero(fila["entry"], f"Retenido en {fila['nombre']}")
                if retenido is None:
                    retenido = 0.0
                if retenido < 0:
                    raise ValueError(f"El retenido en {fila['nombre']} no puede ser negativo.")
                
                acumulado += retenido
                porc_retenido = (retenido / masa_seca) * 100
                porc_acumulado = (acumulado / masa_seca) * 100
                porc_pasa = 100.0 - porc_acumulado
                if porc_pasa < 0: porc_pasa = 0.0
                
                datos_tamices.append({
                    "nombre": fila["nombre"],
                    "abertura": fila["abertura"],
                    "retenido": retenido,
                    "porc_retenido": porc_retenido,
                    "porc_acumulado": porc_acumulado,
                    "porc_pasa": porc_pasa
                })

            error = masa_seca - acumulado
            porc_error = (error / masa_seca) * 100
            
            aberturas = [d["abertura"] for d in datos_tamices if d["abertura"] > 0]
            pasas = [d["porc_pasa"] for d in datos_tamices if d["abertura"] > 0]
            
            def log_interpolate(x0, x1, y0, y1, y_target):
                if y0 == y1: return x0
                if x0 <= 0 or x1 <= 0: return None
                log_x0 = math.log10(x0)
                log_x1 = math.log10(x1)
                log_xt = log_x0 + (log_x1 - log_x0) * (y_target - y0) / (y1 - y0)
                return 10 ** log_xt

            def find_D(target, sizes, passes):
                for i in range(len(passes) - 1):
                    if (passes[i] >= target and passes[i+1] <= target) or (passes[i] <= target and passes[i+1] >= target):
                        return log_interpolate(sizes[i], sizes[i+1], passes[i], passes[i+1], target)
                return None

            D10 = find_D(10.0, aberturas, pasas)
            D30 = find_D(30.0, aberturas, pasas)
            D60 = find_D(60.0, aberturas, pasas)

            Cu = (D60 / D10) if (D60 and D10 and D10 > 0) else None
            Cc = (D30**2 / (D10 * D60)) if (D30 and D10 and D60 and D10 > 0 and D60 > 0) else None

            res = []
            res.extend([
                ("Masa Seca Total Inicial", f"{masa_seca:.2f}", "g"),
                ("Suma de Masas Retenidas", f"{acumulado:.2f}", "g"),
                ("Error de Tamizado", f"{porc_error:.2f}", "%"),
                ("D10", f"{D10:.3f}" if D10 else "—", "mm"),
                ("D30", f"{D30:.3f}" if D30 else "—", "mm"),
                ("D60", f"{D60:.3f}" if D60 else "—", "mm"),
                ("Coef. Uniformidad (Cu)", f"{Cu:.2f}" if Cu else "—", ""),
                ("Coef. Curvatura (Cc)", f"{Cc:.2f}" if Cc else "—", ""),
            ])

            self.resultados = res
            self.datos_calculados = {
                "tamices": datos_tamices,
                "masa_seca": masa_seca,
                "acumulado": acumulado,
                "porc_error": porc_error,
                "D10": D10, "D30": D30, "D60": D60,
                "Cu": Cu, "Cc": Cc
            }
            self.mostrar_resultados()

        except Exception as err:
            messagebox.showerror("Error en los datos", str(err))

    def limpiar(self):
        self.tabla_masas.limpiar()
        for fila in self.filas_tamices:
            fila["entry"].delete(0, "end")
        self.observaciones.delete("1.0", "end")
        self.resultados = []
        self.datos_calculados = {}
        self.mostrar_resultados()

    def mostrar_resultados(self):
        super().mostrar_resultados()
        
        if not self.resultados or not self.datos_calculados or not MATPLOTLIB_AVAILABLE:
            return
            
        try:
            from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
            
            aberturas = [d["abertura"] for d in self.datos_calculados["tamices"] if d["abertura"] > 0]
            pasas = [d["porc_pasa"] for d in self.datos_calculados["tamices"] if d["abertura"] > 0]
            
            fig, ax = plt.subplots(figsize=(5.5, 4.0), dpi=90)
            fig.patch.set_facecolor('#F8FAFC')
            ax.set_facecolor('#FFFFFF')
            ax.plot(aberturas, pasas, marker='o', linestyle='-', color='#1565C0', markersize=4)
            ax.set_xscale('log')
            ax.set_xlim(100, 0.01)
            ax.set_ylim(0, 100)
            ax.set_xlabel('Abertura (mm)', fontsize=9, color="#334155")
            ax.set_ylabel('Porcentaje que pasa (%)', fontsize=9, color="#334155")
            ax.set_title('Curva Granulométrica', fontsize=11, weight='bold', color="#1E293B")
            ax.tick_params(axis='both', which='major', labelsize=8, colors="#475569")
            ax.grid(True, which="major", ls="-", color="#CBD5E1", alpha=0.8)
            ax.grid(True, which="minor", ls="--", color="#E2E8F0", alpha=0.8)
            fig.tight_layout()
            
            scroll = self.cuerpo_resultados.winfo_children()[-1]
            
            frame_grafico = ctk.CTkFrame(scroll, fg_color="transparent")
            frame_grafico.pack(fill="x", padx=4, pady=10)
            
            canvas = FigureCanvasTkAgg(fig, master=frame_grafico)
            canvas.draw()
            canvas.get_tk_widget().pack(fill="both", expand=True)
            
        except Exception as e:
            print(f"Error al mostrar el gráfico en la interfaz: {e}")

    def generar_grafico(self):
        if not MATPLOTLIB_AVAILABLE:
            return None
            
        aberturas = [d["abertura"] for d in self.datos_calculados["tamices"] if d["abertura"] > 0]
        pasas = [d["porc_pasa"] for d in self.datos_calculados["tamices"] if d["abertura"] > 0]
        
        fig, ax = plt.subplots(figsize=(7, 4.5))
        ax.plot(aberturas, pasas, marker='o', linestyle='-', color='b', markersize=4)
        ax.set_xscale('log')
        ax.set_xlim(100, 0.01)
        ax.set_ylim(0, 100)
        ax.set_xlabel('Abertura (mm)')
        ax.set_ylabel('Porcentaje que pasa (%)')
        ax.set_title('Curva Granulométrica')
        ax.grid(True, which="major", ls="-", color="grey", alpha=0.7)
        ax.grid(True, which="minor", ls="--", color="lightgrey", alpha=0.7)
        
        buf = BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', dpi=150)
        plt.close(fig)
        buf.seek(0)
        return buf

    def exportar_pdf(self):
        if not self.datos_calculados:
            messagebox.showwarning("Sin resultados", "Primero realice el cálculo de la granulometría.")
            return

        nombre_archivo = f"Granulometria_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        ruta = filedialog.asksaveasfilename(
            title="Guardar Informe de Granulometría",
            defaultextension=".pdf",
            initialfile=nombre_archivo,
            filetypes=[("Archivo PDF", "*.pdf")]
        )
        if not ruta:
            return

        try:
            doc = SimpleDocTemplate(
                ruta, pagesize=letter,
                rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
            )
            est = obtener_estilos_pdf()
            elementos = []

            elementos.append(Paragraph("SOFTWARE DE MECÁNICA DE SUELOS", est["titulo"]))
            elementos.append(Paragraph("INFORME TÉCNICO: ANÁLISIS GRANULOMÉTRICO POR TAMIZADO", est["subtitulo"]))
            elementos.append(Paragraph(f"Norma de referencia: {self.codigo_norma}", est["norma"]))
            elementos.append(Spacer(1, 4))
            elementos.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor(ROJO)))
            elementos.append(Spacer(1, 8))

            datos_proj = self.sincronizar_hacia_proyecto()
            elementos.append(crear_tabla_metadatos(datos_proj))
            elementos.append(Spacer(1, 10))

            elementos.append(Paragraph("DISTRIBUCIÓN DE TAMAÑOS DE PARTÍCULAS", est["seccion"]))
            
            tabla = [["Tamiz", "Abertura (mm)", "Retenido (g)", "% Retenido", "% Acumulado", "% Pasa"]]
            for d in self.datos_calculados["tamices"]:
                tabla.append([
                    d["nombre"],
                    f"{d['abertura']:.3f}" if d["abertura"] > 0 else "-",
                    f"{d['retenido']:.2f}",
                    f"{d['porc_retenido']:.2f}",
                    f"{d['porc_acumulado']:.2f}",
                    f"{d['porc_pasa']:.2f}"
                ])
            tt = Table(tabla, colWidths=[80, 80, 80, 80, 90, 80], repeatRows=1)
            tt.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(AZUL)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
            ]))
            elementos.append(tt)
            elementos.append(Spacer(1, 10))

            d_calc = self.datos_calculados
            datos_extras = [
                f"Masa Seca Total: {d_calc['masa_seca']:.2f} g",
                f"Suma de Masas Retenidas: {d_calc['acumulado']:.2f} g",
                f"Error de Tamizado: {d_calc['porc_error']:.2f} %",
                f"D10: {d_calc['D10']:.3f} mm" if d_calc['D10'] else "D10: -",
                f"D30: {d_calc['D30']:.3f} mm" if d_calc['D30'] else "D30: -",
                f"D60: {d_calc['D60']:.3f} mm" if d_calc['D60'] else "D60: -",
                f"Coeficiente de Uniformidad (Cu): {d_calc['Cu']:.2f}" if d_calc['Cu'] else "Coeficiente de Uniformidad (Cu): -",
                f"Coeficiente de Curvatura (Cc): {d_calc['Cc']:.2f}" if d_calc['Cc'] else "Coeficiente de Curvatura (Cc): -",
            ]
            
            t_extra = Table([
                [datos_extras[0], datos_extras[3], datos_extras[6]],
                [datos_extras[1], datos_extras[4], datos_extras[7]],
                [datos_extras[2], datos_extras[5], ""]
            ], colWidths=[180, 100, 200])
            t_extra.setStyle(TableStyle([
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
            ]))
            elementos.append(t_extra)
            elementos.append(Spacer(1, 15))

            buf = self.generar_grafico()
            if buf:
                img = RLImage(buf, width=420, height=270)
                elementos.append(img)
                elementos.append(Spacer(1, 10))

            obs_txt = self.observaciones.get("1.0", "end").strip() or "Ninguna observación registrada."
            elementos.append(Paragraph(f"<b>Observaciones:</b> {obs_txt}", est["texto"]))
            elementos.append(Spacer(1, 24))

            elementos.append(KeepTogether([
                crear_bloque_firmas(est),
                Spacer(1, 12),
                Paragraph("Documento generado automáticamente por el Software de Mecánica de Suelos.", est["formula"])
            ]))

            doc.build(elementos)

            if messagebox.askyesno("PDF Generado", f"Informe guardado con éxito:\n\n{ruta}\n\n¿Desea abrir el archivo ahora?"):
                try:
                    os.startfile(ruta)
                except Exception:
                    pass

        except Exception as e:
            messagebox.showerror("Error al exportar", f"No se pudo generar el archivo PDF:\n{e}")


class Laboratorio1(ctk.CTkFrame):
    def __init__(self, parent, controller):
        super().__init__(parent, fg_color=FONDO)
        self.controller = controller

        Cabecera(
            self,
            "LABORATORIO 1: PROPIEDADES ÍNDICE Y FÍSICAS",
            "Módulo de procesamiento de ensayos fundamentales de mecánica de suelos."
        ).pack(fill="x", padx=35, pady=(22, 10))

        barra_top = ctk.CTkFrame(self, fg_color="transparent")
        barra_top.pack(fill="x", padx=35, pady=(0, 15))

        ctk.CTkButton(
            barra_top,
            text="← Menú Principal",
            command=lambda: controller.mostrar("MenuPrincipal"),
            width=140,
            height=32,
            fg_color=GRIS,
            hover_color=GRIS_HOVER,
            corner_radius=6
        ).pack(side="left")

        contenido = ctk.CTkFrame(self, fg_color="transparent")
        contenido.pack(fill="both", expand=True, padx=35, pady=(0, 10))

        contenido.grid_columnconfigure((0, 1), weight=1)
        contenido.grid_rowconfigure((0, 1), weight=1)

        partes = [
            (
                "01",
                "CONTENIDO DE HUMEDAD",
                "Determinación de humedad por secado en horno según norma ASTM D2216 / NTP 339.127.",
                "ContenidoHumedad"
            ),
            (
                "02",
                "PESO VOLUMÉTRICO",
                "Densidad húmeda, seca y pesos volumétricos según norma ASTM D7263 / NTP 339.139.",
                "PesoVolumetrico"
            ),
            (
                "03",
                "GRAVEDAD ESPECÍFICA",
                "Gravedad específica de los sólidos (Gs) con picnómetro de agua según ASTM D854.",
                "GravedadEspecifica"
            ),
            (
                "04",
                "ANÁLISIS GRANULOMÉTRICO",
                "Distribución de tamaños de partículas por tamizado y curva según ASTM D6913.",
                "Granulometria"
            ),
        ]

        for i, (numero, titulo, descripcion, destino) in enumerate(partes):
            r = i // 2
            c = i % 2
            card = ctk.CTkFrame(
                contenido,
                corner_radius=14,
                border_width=1,
                border_color=BORDER_COLOR,
                fg_color=CARD_BG
            )
            card.grid(row=r, column=c, sticky="nsew", padx=8, pady=8)

            ctk.CTkLabel(
                card,
                text=numero,
                font=ctk.CTkFont(size=38, weight="bold"),
                text_color=ROJO
            ).pack(pady=(25, 4))

            ctk.CTkLabel(
                card,
                text=titulo,
                font=ctk.CTkFont(size=15, weight="bold"),
                text_color="#1E293B",
                wraplength=240
            ).pack(pady=4)

            ctk.CTkLabel(
                card,
                text=descripcion,
                font=ctk.CTkFont(size=11),
                text_color="#64748B",
                wraplength=230,
                justify="center"
            ).pack(padx=18, pady=(8, 20))

            crear_boton(
                card,
                "Abrir Ensayo →",
                lambda d=destino: controller.mostrar(d),
                color=ROJO,
                hover=ROJO_HOVER,
                width=190,
                height=36
            ).pack(pady=(0, 20))

        banner_consolidado = ctk.CTkFrame(
            self,
            corner_radius=12,
            border_width=1,
            border_color="#93C5FD",
            fg_color="#EFF6FF"
        )
        banner_consolidado.pack(fill="x", padx=35, pady=(5, 20))

        banner_consolidado.grid_columnconfigure(0, weight=1)
        banner_consolidado.grid_columnconfigure(1, weight=0)

        info_box = ctk.CTkFrame(banner_consolidado, fg_color="transparent")
        info_box.grid(row=0, column=0, sticky="w", padx=20, pady=12)

        ctk.CTkLabel(
            info_box,
            text="📑  INFORME GENERAL CONSOLIDADO DE LABORATORIO 1",
            font=ctk.CTkFont(size=14, weight="bold"),
            text_color="#1E3A8A"
        ).pack(anchor="w")

        ctk.CTkLabel(
            info_box,
            text="Genere un documento PDF técnico completo con todos los resultados consolidados (Humedad, Peso Volumétrico y Gravedad Específica) más cuadro resumen de propiedades físicas.",
            font=ctk.CTkFont(size=11),
            text_color="#3B82F6",
            wraplength=680,
            justify="left"
        ).pack(anchor="w", pady=(2, 0))

        crear_boton(
            banner_consolidado,
            "📑 Exportar Informe General (PDF)",
            controller.exportar_informe_consolidado,
            color=AZUL,
            hover=AZUL_HOVER,
            width=240,
            height=38
        ).grid(row=0, column=1, padx=20, pady=12, sticky="e")


class MenuPrincipal(ctk.CTkFrame):
    def __init__(self, parent, controller):
        super().__init__(parent, fg_color=FONDO)
        self.controller = controller

        ctk.CTkLabel(
            self,
            text="SOFTWARE DE MECÁNICA DE SUELOS",
            font=ctk.CTkFont(size=32, weight="bold"),
            text_color="#1E293B"
        ).pack(pady=(70, 8))

        ctk.CTkLabel(
            self,
            text="Sistema automatizado de procesamiento y emisión de informes de laboratorio geotécnico",
            font=ctk.CTkFont(size=14),
            text_color="#64748B"
        ).pack(pady=(0, 40))

        card = ctk.CTkFrame(
            self,
            corner_radius=16,
            width=580,
            height=260,
            fg_color=CARD_BG,
            border_width=1,
            border_color=BORDER_COLOR
        )
        card.pack(pady=5)
        card.pack_propagate(False)

        ctk.CTkLabel(
            card,
            text="MÓDULOS DE LABORATORIO",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#1E293B"
        ).pack(pady=(28, 8))

        ctk.CTkLabel(
            card,
            text="Seleccione el laboratorio que desea procesar y exportar:",
            text_color="#64748B",
            font=ctk.CTkFont(size=12)
        ).pack(pady=(0, 22))

        crear_boton(
            card,
            "🧪  LABORATORIO 1 (Humedad, Peso Vol., Gs y Granulometría)",
            lambda: controller.mostrar("Laboratorio1"),
            width=380,
            height=44
        ).pack()

        ctk.CTkButton(
            self,
            text="Salir del Programa",
            command=controller.salir,
            width=220,
            height=36,
            fg_color=GRIS,
            hover_color=GRIS_HOVER,
            corner_radius=6
        ).pack(pady=30)


class SoftwareMecanicaSuelos(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Software de Mecánica de Suelos – Laboratorio Geotécnico")
        self.geometry("1280x760")
        self.minsize(1100, 680)
        self.configure(fg_color=FONDO)

        self.protocol("WM_DELETE_WINDOW", self.salir)

        self.datos_proyecto = {
            "proyecto": "",
            "muestra": "",
            "procedencia": "",
            "material": "",
            "ensayado": "",
        }

        self.container = ctk.CTkFrame(self, fg_color=FONDO)
        self.container.pack(fill="both", expand=True)

        self.container.grid_rowconfigure(0, weight=1)
        self.container.grid_columnconfigure(0, weight=1)

        self.frames = {}

        for Clase in (
            MenuPrincipal,
            Laboratorio1,
            ContenidoHumedad,
            PesoVolumetrico,
            GravedadEspecifica,
            Granulometria,
        ):
            frame = Clase(self.container, self)
            self.frames[Clase.__name__] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        self.mostrar("MenuPrincipal")

    def guardar_datos_proyecto(self, datos):
        for k, v in datos.items():
            if v:
                self.datos_proyecto[k] = v

    def mostrar(self, nombre):
        frame = self.frames.get(nombre)
        if frame:
            if hasattr(frame, "sincronizar_desde_proyecto"):
                frame.sincronizar_desde_proyecto(self.datos_proyecto)
            frame.tkraise()

    def salir(self):
        self.destroy()

    def exportar_ensayo_por_nombre(self, nombre_ensayo):
        frame = self.frames.get(nombre_ensayo)
        if not frame:
            return

        if not getattr(frame, "resultados", None):
            if messagebox.askyesno(
                "Ensayo sin Calcular",
                f"El ensayo '{frame.titulo}' aún no tiene cálculos registrados.\n\n"
                "¿Desea abrir este ensayo ahora para ingresar los datos y realizar el cálculo?"
            ):
                self.mostrar(nombre_ensayo)
            return

        frame.exportar_pdf()

    def exportar_informe_consolidado(self):
        f_hum = self.frames.get("ContenidoHumedad")
        f_vol = self.frames.get("PesoVolumetrico")
        f_gs = self.frames.get("GravedadEspecifica")
        f_gran = self.frames.get("Granulometria")

        tiene_hum = bool(getattr(f_hum, "datos_humedad", []))
        tiene_vol = bool(getattr(f_vol, "datos_calculados", {}))
        tiene_gs = bool(getattr(f_gs, "datos_calculados", {}))
        tiene_gran = bool(getattr(f_gran, "datos_calculados", {}))

        if not (tiene_hum or tiene_vol or tiene_gs or tiene_gran):
            messagebox.showwarning(
                "Sin Ensayos Calculados",
                "Aún no se ha calculado ningún ensayo.\n\n"
                "Para emitir el Informe General Consolidado, debe ingresar los datos "
                "y presionar '⚡ Calcular' en al menos uno de los ensayos de Laboratorio 1."
            )
            return

        estados = []
        estados.append(f"• 01. Contenido de Humedad: {'✅ Calculado' if tiene_hum else '⚠️ Sin calcular'}")
        estados.append(f"• 02. Peso Volumétrico: {'✅ Calculado' if tiene_vol else '⚠️ Sin calcular'}")
        estados.append(f"• 03. Gravedad Específica: {'✅ Calculado' if tiene_gs else '⚠️ Sin calcular'}")
        estados.append(f"• 04. Análisis Granulométrico: {'✅ Calculado' if tiene_gran else '⚠️ Sin calcular'}")

        if not (tiene_hum and tiene_vol and tiene_gs and tiene_gran):
            msg = (
                "El estado de los ensayos de Laboratorio 1 es el siguiente:\n\n"
                + "\n".join(estados)
                + "\n\n¿Desea generar el informe consolidado incluyendo los ensayos calculados?"
            )
            if not messagebox.askyesno("Generar Informe Consolidado", msg):
                return

        nombre_archivo = f"Informe_General_Laboratorio_1_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        ruta = filedialog.asksaveasfilename(
            title="Guardar Informe General Consolidado de Laboratorio 1",
            defaultextension=".pdf",
            initialfile=nombre_archivo,
            filetypes=[("Archivo PDF", "*.pdf")]
        )
        if not ruta:
            return

        try:
            doc = SimpleDocTemplate(
                ruta, pagesize=letter,
                rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
            )
            est = obtener_estilos_pdf()
            elementos = []

            elementos.append(Paragraph("SOFTWARE DE MECÁNICA DE SUELOS", est["titulo"]))
            elementos.append(Paragraph("INFORME GENERAL CONSOLIDADO – LABORATORIO N.º 1", est["subtitulo"]))
            elementos.append(Paragraph("Propiedades Índice y Relaciones Físicas Fundamentales del Suelo", est["norma"]))
            elementos.append(Spacer(1, 4))
            elementos.append(HRFlowable(width="100%", thickness=1.8, color=colors.HexColor(ROJO)))
            elementos.append(Spacer(1, 8))

            for f in (f_hum, f_vol, f_gs, f_gran):
                if hasattr(f, "sincronizar_hacia_proyecto"):
                    f.sincronizar_hacia_proyecto()
            elementos.append(crear_tabla_metadatos(self.datos_proyecto))
            elementos.append(Spacer(1, 10))


            elementos.append(Paragraph("SÍNTESIS DE PROPIEDADES GEOTÉCNICAS OBTENIDAS", est["seccion"]))

            resumen_data = [
                ["Parámetro Físico", "Símbolo", "Valor Obtenido", "Unidad", "Estado / Ensayo"]
            ]

            val_w = f_hum.promedio_humedad if tiene_hum else None
            d_vol = f_vol.datos_calculados if tiene_vol else {}
            d_gs = f_gs.datos_calculados if tiene_gs else {}

            val_gamma_hum = d_vol.get("gamma_kn_m3")
            val_rho_hum = d_vol.get("rho_humeda")
            val_rho_sec = d_vol.get("rho_seca")
            val_gamma_sec = d_vol.get("gamma_seca")
            val_gs = d_gs.get("gs")

            resumen_data.append([
                "Contenido de humedad promedio", "w",
                f"{val_w:.2f}" if val_w is not None else "—",
                "%", "01. Contenido de Humedad" if tiene_hum else "Pendiente"
            ])
            resumen_data.append([
                "Densidad húmeda natural", "ρ",
                f"{val_rho_hum:.4f}" if val_rho_hum is not None else "—",
                "g/cm³", "02. Peso Volumétrico" if tiene_vol else "Pendiente"
            ])
            resumen_data.append([
                "Peso volumétrico húmedo", "γ",
                f"{val_gamma_hum:.3f}" if val_gamma_hum is not None else "—",
                "kN/m³", "02. Peso Volumétrico" if tiene_vol else "Pendiente"
            ])
            resumen_data.append([
                "Densidad seca", "ρd",
                f"{val_rho_sec:.4f}" if val_rho_sec is not None else "—",
                "g/cm³", "02. Peso Volumétrico" if tiene_vol and val_rho_sec else "No determinada"
            ])
            resumen_data.append([
                "Peso volumétrico seco", "γd",
                f"{val_gamma_sec:.3f}" if val_gamma_sec is not None else "—",
                "kN/m³", "02. Peso Volumétrico" if tiene_vol and val_gamma_sec else "No determinado"
            ])
            resumen_data.append([
                "Gravedad específica de sólidos", "Gs",
                f"{val_gs:.3f}" if val_gs is not None else "—",
                "—", "03. Gravedad Específica" if tiene_gs else "Pendiente"
            ])
            
            d_gran = f_gran.datos_calculados if tiene_gran else {}
            val_cu = d_gran.get("Cu")
            val_cc = d_gran.get("Cc")
            resumen_data.append([
                "Coeficiente de Uniformidad", "Cu",
                f"{val_cu:.2f}" if val_cu is not None else "—",
                "—", "04. Granulometría" if tiene_gran else "Pendiente"
            ])
            resumen_data.append([
                "Coeficiente de Curvatura", "Cc",
                f"{val_cc:.2f}" if val_cc is not None else "—",
                "—", "04. Granulometría" if tiene_gran else "Pendiente"
            ])

            if val_gs is not None and val_rho_sec is not None and val_rho_sec > 0:
                rel_vacios = (val_gs * 1.0 / val_rho_sec) - 1.0
                if rel_vacios > 0:
                    porosidad = (rel_vacios / (1.0 + rel_vacios)) * 100.0
                    resumen_data.append([
                        "Relación de vacíos estimada", "e",
                        f"{rel_vacios:.3f}", "—", "Cálculo de Fases (Gs & ρd)"
                    ])
                    resumen_data.append([
                        "Porosidad estimada", "n",
                        f"{porosidad:.2f}", "%", "Cálculo de Fases (Gs & ρd)"
                    ])
                    if val_w is not None:
                        saturacion = (val_w * val_gs) / rel_vacios
                        resumen_data.append([
                            "Grado de saturación estimado", "Sr",
                            f"{saturacion:.2f}", "%", "Cálculo de Fases (w, Gs & e)"
                        ])

            tres = Table(resumen_data, colWidths=[175, 55, 105, 75, 130])
            tres.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(ROJO)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("ALIGN", (1, 0), (-1, -1), "CENTER"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F8FAFC")),
            ]))
            elementos.append(tres)
            elementos.append(Spacer(1, 12))

            if tiene_hum:
                elementos.append(Paragraph("1. ENSAYO DE CONTENIDO DE HUMEDAD (ASTM D2216 / NTP 339.127)", est["seccion"]))
                tabla_h = [
                    ["N.º", "Recipiente\n(g)", "Recip. + Húmedo\n(g)", "Recip. + Seco\n(g)",
                     "Agua (Ww)\n(g)", "Suelo Seco (Ws)\n(g)", "Humedad (w)\n(%)"]
                ]
                for d in f_hum.datos_humedad:
                    tabla_h.append([
                        str(d["id"]), f"{d['mr']:.2f}", f"{d['mh']:.2f}", f"{d['ms']:.2f}",
                        f"{d['mw']:.2f}", f"{d['mss']:.2f}", f"{d['w']:.2f} %"
                    ])
                tabla_h.append(["", "", "", "", "", "PROMEDIO (w):", f"{f_hum.promedio_humedad:.2f} %"])

                th = Table(tabla_h, colWidths=[28, 76, 96, 96, 76, 88, 80])
                th.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(AZUL)),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                    ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                    ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#E8F5E9")),
                    ("FONTNAME", (5, -1), (-1, -1), "Helvetica-Bold"),
                    ("TOPPADDING", (0, 0), (-1, -1), 3),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ]))
                elementos.append(th)
                elementos.append(Spacer(1, 10))

            if tiene_vol:
                elementos.append(Paragraph("2. ENSAYO DE PESO VOLUMÉTRICO (ASTM D7263 / NTP 339.139)", est["seccion"]))
                dv = f_vol.datos_calculados
                tv_data = [
                    ["Masa Molde (g)", "Masa Molde+Suelo (g)", "Volumen (cm³)", "Densidad Húmeda (g/cm³)", "Peso Volumétrico (kN/m³)", "Peso Vol. Seco (kN/m³)"],
                    [
                        f"{dv['mm']:.2f}",
                        f"{dv['mts']:.2f}",
                        f"{dv['v']:.2f}",
                        f"{dv['rho_humeda']:.4f}",
                        f"{dv['gamma_kn_m3']:.3f}",
                        f"{dv['gamma_seca']:.3f}" if dv.get("gamma_seca") else "—"
                    ]
                ]
                tv = Table(tv_data, colWidths=[90, 95, 85, 95, 95, 80])
                tv.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(AZUL)),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                    ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]))
                elementos.append(tv)
                elementos.append(Spacer(1, 10))

            if tiene_gs:
                elementos.append(Paragraph("3. ENSAYO DE GRAVEDAD ESPECÍFICA (ASTM D854 / NTP 339.131)", est["seccion"]))
                dg = f_gs.datos_calculados
                tg_data = [
                    ["Masa Suelo Seco (g)", "Masa Picnómetro (g)", "Picnómetro + Agua (g)", "Picnómetro + Suelo + Agua (g)", "Gravedad Específica (Gs)"],
                    [
                        f"{dg['ms']:.2f}",
                        f"{dg['mp']:.2f}",
                        f"{dg['mpw']:.2f}",
                        f"{dg['mpsw']:.2f}",
                        f"{dg['gs']:.3f}"
                    ]
                ]
                tg = Table(tg_data, colWidths=[108, 108, 108, 110, 106])
                tg.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(AZUL)),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                    ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                    ("BACKGROUND", (4, 1), (4, 1), colors.HexColor("#E8F5E9")),
                    ("FONTNAME", (4, 1), (4, 1), "Helvetica-Bold"),
                ]))
                elementos.append(tg)
                elementos.append(Spacer(1, 14))

            if tiene_gran:
                elementos.append(Paragraph("4. ANÁLISIS GRANULOMÉTRICO (ASTM D6913)", est["seccion"]))
                tabla_g = [["Tamiz", "Abertura (mm)", "Retenido (g)", "% Retenido", "% Acumulado", "% Pasa"]]
                for d in f_gran.datos_calculados["tamices"]:
                    tabla_g.append([
                        d["nombre"],
                        f"{d['abertura']:.3f}" if d["abertura"] > 0 else "-",
                        f"{d['retenido']:.2f}",
                        f"{d['porc_retenido']:.2f}",
                        f"{d['porc_acumulado']:.2f}",
                        f"{d['porc_pasa']:.2f}"
                    ])
                tgr = Table(tabla_g, colWidths=[80, 80, 80, 80, 90, 80], repeatRows=1)
                tgr.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(AZUL)),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                    ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]))
                elementos.append(tgr)
                elementos.append(Spacer(1, 10))
                
                buf = f_gran.generar_grafico()
                if buf:
                    img = RLImage(buf, width=380, height=240)
                    elementos.append(img)
                    elementos.append(Spacer(1, 14))

            elementos.append(KeepTogether([
                crear_bloque_firmas(est),
                Spacer(1, 10),
                Paragraph("Informe consolidado oficial emitido por el Software de Mecánica de Suelos.", est["formula"])
            ]))

            doc.build(elementos)

            if messagebox.askyesno("Informe General Generado", f"Informe Consolidado guardado con éxito:\n\n{ruta}\n\n¿Desea abrir el archivo ahora?"):
                try:
                    os.startfile(ruta)
                except Exception:
                    pass

        except Exception as e:
            messagebox.showerror("Error al generar informe consolidado", f"No se pudo generar el documento PDF:\n{e}")


if __name__ == "__main__":
    try:
        app = SoftwareMecanicaSuelos()
        app.mainloop()
    except Exception as error:
        print(f"Error al ejecutar el programa: {error}")
