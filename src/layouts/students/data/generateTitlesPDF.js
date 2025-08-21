import React from "react";
import { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";
// Asegúrate de que esta ruta al logo sea correcta en tu proyecto
import logo from "../../../assets/images/LOGO UNIVERSIDAD_Mesa de trabajo 1.png";
import { Button } from "@mui/material";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 60,
    fontFamily: "Helvetica",
  },
  headerSection: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 15,
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  headerTextContainer: {
    flexGrow: 1,
    textAlign: "center",
    width: "70%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  headerTextContainer2: {
    flexGrow: 1,
    textAlign: "center",
    height: "100%",
    width: "15%",
    borderColor: "#000",
    padding: 5,
  },
  headerImageContainer: {
    height: "100%",
    width: "15%",
    borderColor: "#000",
    padding: 5,
  },
  headerMembrete: {
    fontWeight: "bold",
    fontSize: 9,
    textAlign: "center",
    marginBottom: 1,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
  },
  formInvCode: {
    fontSize: 8,
    textAlign: "right",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: "#D3D3D3", // Fondo gris para los títulos de sección
    padding: 3,
  },
  text: {
    fontSize: 9,
    marginBottom: 3,
  },
  textBold: {
    fontSize: 9,
    marginBottom: 3,
    fontWeight: "bold",
  },
  field: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    marginBottom: 5,
    paddingBottom: 2,
    fontWeight: "normal",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  column: {
    flexDirection: "column",
    width: "48%", // Adjust width as needed for two columns
  },
  signatureLine: {
    marginTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: "#000",
    paddingTop: 5,
    textAlign: "center",
    fontSize: 9,
  },
  acceptanceText: {
    fontSize: 9,
    textAlign: "justify",
    lineHeight: 1.5,
    marginTop: 10,
  },
});

// Componente PDF para el Protocolo de Investigación
const ProtocoloInvestigacionPDF = ({ data }) => (
  <Document>
    <Page size="letter" style={styles.page}>
      {/* Sección de Encabezado */}
      <View style={styles.headerSection}>
        <View style={styles.headerImageContainer}>
          <Image src={logo} style={styles.logo} />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerMembrete}>INSTITUTO UNIVERSITARIO DE TECNOLOGÍA</Text>
          <Text style={styles.headerMembrete}>“ANTONIO JOSÉ DE SUCRE”</Text>
          <Text style={styles.headerMembrete}>EXTENSION SAN CRISTOBAL</Text>

          <Text style={styles.headerTitle}>
            TRABAJO ESPECIAL DE GRADO PROTOCOLO DE INVESTIGACIÓN
          </Text>
        </View>
        <View style={styles.headerTextContainer2}>
          <Text style={styles.formInvCode}>FOR-INV-001</Text>
          <Text style={styles.headerMembrete}>DEPARTAMENTO DE INVESTIGACIÓN</Text>
        </View>
      </View>

      {/* Datos Generales */}
      <View style={styles.row}>
        <Text style={styles.text}>
          Sede Principal: ____ Extensión: {data.extension} Ampliación: ____
        </Text>
        <Text style={styles.text}>Lapso Académico: {data.lapsoAcademico}</Text>
      </View>

      {/* DATOS DEL ESTUDIANTE */}
      <Text style={styles.sectionTitle}>DATOS DEL ESTUDIANTE</Text>
      <Text style={[styles.text, { fontWeight: "bold" }]}>
        Nombres y Apellidos: <Text style={styles.field}>{data.studentName}</Text>
      </Text>
      <Text style={[styles.text, { fontWeight: "bold" }]}>
        C.I.: <Text style={styles.field}>{data.studentCI}</Text>
      </Text>
      <View style={styles.row}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Teléfonos: <Text style={styles.field}>{data.studentPhone}</Text>
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          E-Mail: <Text style={styles.field}>{data.studentEmail}</Text>
        </Text>
      </View>
      <Text style={[styles.text, { fontWeight: "bold" }]}>
        Carrera: <Text style={styles.field}>{data.studentCareer}</Text>
      </Text>
      <View style={styles.row}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Docente de la Asignatura: <Text style={styles.field}>{data.teacherName}</Text>
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Sección: <Text style={styles.field}>{data.section}</Text>
        </Text>
        <Text style={styles.text}>
          Fecha: <Text style={styles.field}>{data.date}</Text>
        </Text>
      </View>

      {/* INFORMACIÓN ACADÉMICA */}
      <Text style={styles.sectionTitle}>INFORMACIÓN ACADÉMICA</Text>
      <Text style={[styles.text, { fontWeight: "bold" }]}>
        Título tentativo de la Propuesta de Trabajo Especial de Grado:{" "}
        <Text style={styles.field}>{data.tentativeTitle}</Text>
      </Text>
      <Text style={[styles.text, { fontWeight: "bold" }]}>
        Línea de Investigación: <Text style={styles.field}>{data.researchLine}</Text>
      </Text>
      <Text style={[styles.text, { fontWeight: "bold" }]}>
        Propósito de la Investigación: <Text style={styles.field}>{data.researchPurpose}</Text>
      </Text>

      {/* INFORMACIÓN SOBRE EL LUGAR DONDE SE DESARROLLARÁ LA INVESTIGACIÓN */}
      <Text style={styles.sectionTitle}>
        INFORMACIÓN SOBRE EL LUGAR DONDE SE DESARROLLARÁ LA INVESTIGACIÓN
      </Text>
      <Text style={styles.text}>Nombre del lugar o área: {data.placeName}</Text>
      <Text style={styles.text}>
        Tutor(a) Empresarial (si aplica): _________________________________
      </Text>
      <Text style={styles.text}>Dirección: {data.placeAddress}</Text>
      <View style={styles.row}>
        <Text style={styles.text}>Teléfonos: {data.placePhone}</Text>
        <Text style={styles.text}>Móvil: {data.placeMobile}</Text>
      </View>
      <Text style={styles.signatureLine}>
        Firma del Estudiante:_______________________________________________________
      </Text>

      {/* RESULTADOS DE LA EVALUACIÓN DEL PROTOCOLO */}
      <Text style={styles.sectionTitle}>RESULTADOS DE LA EVALUACIÓN DEL PROTOCOLO</Text>
      <View style={styles.row}>
        <Text style={styles.text}>Aprobado: ____ No Aprobado: ____ Observaciones: ____</Text>
      </View>
      <Text style={styles.signatureLine}>
        Firma del Coordinador de la Comisión Permanente de Trabajo Especial de Grado:
        _______________________________________________________
      </Text>

      {/* ACEPTACIÓN DEL TUTOR */}
      <Text style={styles.sectionTitle}>ACEPTACIÓN DEL TUTOR</Text>
      <View style={styles.row}>
        <Text style={styles.text}>
          Tutor Asignado: <Text style={styles.field}>______________________________</Text>
        </Text>
        <Text style={styles.text}>
          Teléfono: <Text style={styles.field}>______________________________</Text>
        </Text>
        <Text style={styles.text}>
          E-Mail: <Text style={styles.field}>______________________________</Text>
        </Text>
      </View>
      <Text style={styles.acceptanceText}>
        Por medio del presente, yo ______________________________________________________________,
        portador de la C.I.N.º: ____________, acepto asesorar al estudiante{" "}
        <Text style={styles.field}>{data.studentName}</Text>, durante la etapa de diseño y
        desarrollo de su Proyecto de Investigación; y durante la etapa de ejecución del Trabajo
        Especial de Grado, hasta su presentación. Igualmente, me comprometo moral, ética y
        profesionalmente a guiar al participante en la elaboración de una producción intelectual de
        excelencia, así como dar cumplimiento a lo previsto en el Reglamento Interno sobre el
        Trabajo Especial de Grado vigente en la Institución.
      </Text>
      <Text style={styles.signatureLine}>Firma del Tutor:</Text>

      <View style={styles.row}>
        <Text style={styles.signatureLine}>Firma y Sello del Departamento de Investigación</Text>
        <Text style={styles.signatureLine}>Fecha: ____ / ____ / ____</Text>
      </View>
    </Page>
  </Document>
);

// PropTypes para validar las propiedades del componente ProtocoloInvestigacionPDF
ProtocoloInvestigacionPDF.propTypes = {
  data: PropTypes.shape({
    extension: PropTypes.string,
    lapsoAcademico: PropTypes.string,
    studentName: PropTypes.string,
    studentCI: PropTypes.string,
    studentPhone: PropTypes.string,
    studentEmail: PropTypes.string,
    studentCareer: PropTypes.string,
    teacherName: PropTypes.string,
    section: PropTypes.string,
    date: PropTypes.string,
    tentativeTitle: PropTypes.string,
    researchLine: PropTypes.string,
    researchPurpose: PropTypes.string,
    placeName: PropTypes.string,
    placeAddress: PropTypes.string,
    placePhone: PropTypes.string,
    placeMobile: PropTypes.string,
  }).isRequired,
};

const FechaActual = () => {
  const [fechaFormateada, setFechaFormateada] = useState("");

  useEffect(() => {
    const obtenerFecha = () => {
      const fecha = new Date();
      const opciones = { weekday: "long", year: "numeric", month: "2-digit", day: "2-digit" };
      const fechaString = fecha.toLocaleDateString("es-ES", opciones);

      // toLocaleDateString devuelve "Jueves, 17/08/2025"
      // Eliminamos la coma para que quede "Jueves 17/08/2025"
      const fechaSinComa = fechaString.replace(",", "");

      setFechaFormateada(fechaSinComa);
    };

    obtenerFecha();
  }, []);

  return fechaFormateada;
};

// Componente para generar y descargar el PDF
const ProtocoloGenerator = ({studentData, titleInfo, numero}) => {
  // Datos de ejemplo para la planilla.
  // Puedes reemplazar estos datos con información real de tu aplicación.
  const protocolData = {
    extension: "X",
    lapsoAcademico:
      studentData?.lapso?.toString().slice(0, 4) + "-" + studentData?.lapso?.toString().slice(4) || " ",
    studentName:
      studentData.apellido1 +
      " " +
      studentData.apellido2 +
      " " +
      studentData.nombre1 +
      " " +
      studentData.nombre2,
    studentCI: studentData.cedula,
    studentPhone: studentData.telf,
    studentEmail: studentData.correo,
    studentCareer: studentData.carrera,
    teacherName: studentData.docente,
    section: studentData.seccion,
    date: FechaActual(),
    tentativeTitle: titleInfo.title,
    researchLine: titleInfo.researchLine,
    researchPurpose: titleInfo.purpose,
    placeName: titleInfo.placeName,
    placeAddress: titleInfo.placeAddress,
    placePhone: titleInfo.placePhone,
    placeMobile: titleInfo.placeMobile,
  };

  return (
    <Button variant="outlined" color="primary">
      <PDFDownloadLink
        document={<ProtocoloInvestigacionPDF data={protocolData} />}
        fileName={`Protocolo_Investigacion ${numero}.pdf`}
      >
        {({ blob, url, loading, error }) =>
          loading ? "Generando PDF..." : "Descargar Protocolo de Investigación " + numero
        }
      </PDFDownloadLink>
    </Button>
  );
};


ProtocoloGenerator.propTypes = {
  studentData: PropTypes.shape({
    apellido1: PropTypes.string,
    apellido2: PropTypes.string,
    nombre1: PropTypes.string,
    nombre2: PropTypes.string,
    cedula: PropTypes.string,
    telf: PropTypes.string,
    correo: PropTypes.string,
    carrera: PropTypes.string,
    docente: PropTypes.string,
    seccion: PropTypes.string,
    lapso: PropTypes.string,
  }).isRequired,
  titleInfo: PropTypes.shape({
    apellido1: PropTypes.string,
    title: PropTypes.string,
    researchLine: PropTypes.string,
    purpose: PropTypes.string,
    placeName: PropTypes.string,
    placeAddress: PropTypes.string,
    placePhone: PropTypes.string,
    placeMobile: PropTypes.string,
  }).isRequired,
  numero: PropTypes.number
};

export default ProtocoloGenerator;
