import React from "react";
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
    padding: 30,
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
          Fecha: <Text style={styles.field}>____ / ____ / ____</Text>
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
      <Text style={styles.text}>
        Nombre del lugar o área: _______________________________________________________
      </Text>
      <Text style={styles.text}>
        Tutor(a) Empresarial (si aplica): _______________________________________________________
      </Text>
      <Text style={styles.text}>
        Dirección: _______________________________________________________
      </Text>
      <View style={styles.row}>
        <Text style={styles.text}>Teléfonos: ___________________________</Text>
        <Text style={styles.text}>Móvil: _______________________________</Text>
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
    businessTutor: PropTypes.string,
    placeAddress: PropTypes.string,
    placePhone: PropTypes.string,
    placeMobile: PropTypes.string,
    assignedTutor: PropTypes.string,
    tutorPhone: PropTypes.string,
    tutorEmail: PropTypes.string,
    tutorAcceptanceName: PropTypes.string,
    tutorAcceptanceCI: PropTypes.string,
  }).isRequired,
};

// Componente para generar y descargar el PDF
const ProtocoloGenerator = () => {
  // Datos de ejemplo para la planilla.
  // Puedes reemplazar estos datos con información real de tu aplicación.
  const protocolData = {
    extension: "X",
    lapsoAcademico: "2025 - 1",
    studentName: "LYNERKEN LEANDRO MORA ORTEGA",
    studentCI: "V-30.523.215",
    studentPhone: "0414-1234567",
    studentEmail: "estudiantejdhdhdjjdjdjdjdjdjdjdjdjjdjdjdjdjdjjdjd@email.com",
    studentCareer: "INGENIERÍA EN SISTEMAS",
    teacherName: "Laura Santander Parra",
    section: "A",
    date: "Jueves 10 /10 / 2024",
    tentativeTitle:
      "Desarrollo de sistema web para el control de los procesos administrativos del departamento de investigación y pasantías UTS",
    researchLine: "Desarrollo de Software",
    researchPurpose:
      "Desarrollar un sistema web para el control de los procesos administrativos del departamento de investigación y pasantías UTS.",
    placeName: "Instituto Universitario de Tecnología 'Antonio José de Sucre'",
    businessTutor: "N/A",
    placeAddress: "Av. Principal, Edificio Central, San Cristóbal",
    placePhone: "0276-1234567",
    placeMobile: "0412-7654321",
    assignedTutor: "Mayerling Siloé Vesga Contreras",
    tutorPhone: "0424-7654321",
    tutorEmail: "tutor@email.com",
    tutorAcceptanceName: "Mayerling Siloé Vesga Contreras",
    tutorAcceptanceCI: "V-15.502.565",
  };

  return (
    <Button variant="contained" color="primary">
      <PDFDownloadLink
        document={<ProtocoloInvestigacionPDF data={protocolData} />}
        fileName="Protocolo_Investigacion.pdf"
        color="white"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Generando PDF..." : "Descargar Protocolo de Investigación"
        }
      </PDFDownloadLink>
    </Button>
  );
};

export default ProtocoloGenerator;
