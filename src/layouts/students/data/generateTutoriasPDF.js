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
// Make sure this path to the logo is correct in your project
import logo from "../../../assets/images/LOGO UNIVERSIDAD_Mesa de trabajo 1.png";
import { Button } from "@mui/material";

// Styles for the PDF
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
    padding: 5,
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  headerTextContainer: {
    flexGrow: 1,
    textAlign: "center",
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
    backgroundColor: "#D3D3D3", // Grey background for section titles
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "14.28%", // Approximately 100% / 7 columns
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#D3D3D3",
    padding: 3,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "bold",
  },
  tableCol: {
    width: "14.28%", // Approximately 100% / 7 columns
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 3,
    textAlign: "center",
    fontSize: 8,
  },
  tableColPointsTreated: {
    width: "28.56%", // Wider column for 'PUNTOS TRATADOS' (2/7 of total width)
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 3,
    textAlign: "left",
    fontSize: 8,
  },
  tableColSignature: {
    width: "14.28%", // Standard width for signature columns
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 3,
    textAlign: "center",
    fontSize: 8,
  },
  signatureLine: {
    marginTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: "#000",
    paddingTop: 5,
    textAlign: "center",
    fontSize: 9,
  },
});

// PDF Component for Tutoring Control
const ControlTutoriasPDF = ({ data }) => (
  <Document>
    <Page size="letter" style={styles.page}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Image src={logo} style={styles.logo} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerMembrete}>
            INSTITUTO UNIVERSITARIO DE TECNOLOGÍA ANTONIO JOSÉ DE SUCRE
          </Text>
          <Text style={styles.headerTitle}>CONTROL DE TUTORÍAS DE TRABAJO DE GRADO</Text>
          <Text style={styles.formInvCode}>FOR-INV-005</Text>
          <Text style={styles.headerMembrete}>MPSO: DOCENCIA</Text>
          <Text style={styles.headerMembrete}>Extensión: {data.extension}</Text>
        </View>
      </View>

      {/* Student and Tutor Information */}
      <View style={styles.row}>
        <Text style={styles.text}>
          APELLIDOS Y NOMBRES DEL ESTUDIANTE: <Text style={styles.field}>{data.studentName}</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>
          CARRERA: <Text style={styles.field}>{data.career}</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>
          APELLIDOS Y NOMBRES DEL TUTOR: <Text style={styles.field}>{data.tutorName}</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>
          TÍTULO TRABAJO ESPECIAL DE GRADO: <Text style={styles.field}>{data.thesisTitle}</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.textBold}>HORAS DE TUTORÍA</Text>
      </View>

      {/* Tutoring Hours Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableColHeader, { width: "10%" }]}>SEMANA NÚMERO</Text>
          <Text style={[styles.tableColHeader, { width: "12%" }]}>FECHA</Text>
          <Text style={[styles.tableColHeader, { width: "10%" }]}>HORA INICIO</Text>
          <Text style={[styles.tableColHeader, { width: "10%" }]}>HORA FIN</Text>
          <Text style={[styles.tableColHeader, { width: "5%" }]}>TOTAL</Text>
          <Text style={[styles.tableColHeader, { width: "10%" }]}>PUNTOS TRATADOS</Text>
          <Text style={[styles.tableColHeader, { width: "4%" }]}>R/B</Text>
          <Text style={[styles.tableColHeader, { width: "13%" }]}>FIRMA DEL {"\n"}ESTUDIANTE</Text>
          <Text style={[styles.tableColHeader, { width: "13%" }]}>FIRMA DEL {"\n"} TUTOR</Text>
          <Text style={[styles.tableColHeader, { width: "13%" }]}>FIRMA {"\n"} COORDINACIÓN</Text>
        </View>
        {/* Table Rows */}
        {data.tutoringSessions.map((session, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.tableCol, { width: "10%" }]}>{session.weekNumber}</Text>
            <Text style={[styles.tableCol, { width: "12%" }]}>{session.date}</Text>
            <Text style={[styles.tableCol, { width: "10%" }]}>{session.startTime}</Text>
            <Text style={[styles.tableCol, { width: "10%" }]}>{session.endTime}</Text>
            <Text style={[styles.tableCol, { width: "5%" }]}>{session.totalHours}</Text>
            <Text style={[styles.tableCol, { width: "10%" }]}></Text>
            <Text style={[styles.tableCol, { width: "4%" }]}></Text>
            <Text style={[styles.tableCol, { width: "13%" }]}></Text> {/* Student Signature */}
            <Text style={[styles.tableCol, { width: "13%" }]}></Text> {/* Tutor Signature */}
            <Text style={[styles.tableCol, { width: "13%" }]}></Text> {/* Coordination Signature */}
          </View>
        ))}
        {/* Total Hours Row */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableColHeader, { width: "42%", textAlign: "right" }]}>
            TOTAL HORAS
          </Text>
          <Text style={[styles.tableColHeader, { width: "5%" }]}>{data.totalHours}</Text>
          <Text style={[styles.tableColHeader, { width: "53%" }]}></Text>{" "}
          {/* Empty cells for alignment */}
        </View>
      </View>

      {/* Signature Lines at the bottom */}
      <View style={styles.row}>
        <Text style={styles.text}>Cédula de Identidad</Text>
        <Text style={styles.text}>Cédula de Identidad</Text>
      </View>
    </Page>
  </Document>
);

// PropTypes for ControlTutoriasPDF component
ControlTutoriasPDF.propTypes = {
  data: PropTypes.shape({
    extension: PropTypes.string,
    studentName: PropTypes.string,
    career: PropTypes.string,
    tutorName: PropTypes.string,
    thesisTitle: PropTypes.string,
    tutoringSessions: PropTypes.arrayOf(
      PropTypes.shape({
        weekNumber: PropTypes.number,
        date: PropTypes.string,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
        totalHours: PropTypes.number,
        pointsTreated: PropTypes.string,
        rating: PropTypes.string,
      })
    ),
    totalHours: PropTypes.number,
  }).isRequired,
};

// Component to generate and download the PDF
const ControlTutoriasGenerator = () => {
  // Example data for the tutoring control form.
  // You can replace this data with real information from your application.
  const tutoringData = {
    extension: "San Cristóbal",
    studentName: "APELLIDOS Y NOMBRES DEL ESTUDIANTE",
    career: "CARRERA DEL ESTUDIANTE",
    tutorName: "APELLIDOS Y NOMBRES DEL TUTOR",
    thesisTitle: "TÍTULO DEL TRABAJO ESPECIAL DE GRADO",
    tutoringSessions: [
      {
        weekNumber: 1,
        date: "23/07/2025",
        startTime: "09:00am",
        endTime: "11:00am",
        totalHours: 2,
        pointsTreated: "Revisión de marco teórico",
        rating: "Bueno",
      },
      {
        weekNumber: 2,
        date: "30/07/2025",
        startTime: "10:00am",
        endTime: "12:00pm",
        totalHours: 2,
        pointsTreated: "Discusión de metodología",
        rating: "Bueno",
      },
      {
        weekNumber: 3,
        date: "06/08/2025",
        startTime: "01:00pm",
        endTime: "03:00pm",
        totalHours: 2,
        pointsTreated: "Avance de resultados",
        rating: "Regular",
      },
      {
        weekNumber: 4,
        date: "13/08/2025",
        startTime: "09:00am",
        endTime: "11:00am",
        totalHours: 2,
        pointsTreated: "Preparación para presentación",
        rating: "Bueno",
      },
      {
        weekNumber: 5,
        date: "20/08/2025",
        startTime: "10:00am",
        endTime: "12:00pm",
        totalHours: 2,
        pointsTreated: "Revisión final",
        rating: "Bueno",
      },
      {
        weekNumber: 6,
        date: "27/08/2025",
        startTime: "01:00pm",
        endTime: "03:00pm",
        totalHours: 2,
        pointsTreated: "Ajustes menores",
        rating: "Bueno",
      },
      {
        weekNumber: 7,
        date: "03/09/2025",
        startTime: "09:00am",
        endTime: "11:00am",
        totalHours: 2,
        pointsTreated: "Entrega de documento",
        rating: "Bueno",
      },
      {
        weekNumber: 8,
        date: "10/09/2025",
        startTime: "10:00am",
        endTime: "12:00pm",
        totalHours: 2,
        pointsTreated: "Preparación para defensa",
        rating: "Bueno",
      },
    ],
    totalHours: 16, // Sum of totalHours from tutoringSessions
  };

  return (
    <Button variant="outlined" color="primary">
      <PDFDownloadLink
        document={<ControlTutoriasPDF data={tutoringData} />}
        fileName="Control_Tutorias.pdf"
      >
        {({ loading }) => (loading ? "Generando PDF..." : "Descargar Control de Tutorías")}
      </PDFDownloadLink>
    </Button>
  );
};

export default ControlTutoriasGenerator;
