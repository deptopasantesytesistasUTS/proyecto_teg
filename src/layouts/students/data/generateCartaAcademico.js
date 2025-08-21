"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import PropTypes from "prop-types";
// Asegúrate de que esta ruta al logo sea correcta en tu proyecto
import logo from "../../../assets/images/LOGO UNIVERSIDAD_Mesa de trabajo 1.png";
import { Button } from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    fontSize: 12,
    lineHeight: 1.5,
    flexDirection: "column",
    padding: 30,
    fontFamily: "Helvetica",
  },
  logo: {
    width: 150,
    height: 150,
    marginRight: 10,
  },
  header: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    textDecoration: "underline",
  },
  paragraph: {
    textAlign: "justify",
    marginBottom: 15,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: "bold",
  },
  signature: {
    marginTop: 40,
    marginBottom: 20,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    width: 200,
    marginBottom: 5,
    textAlign: "center",
  },
  signatureText: {
    textAlign: "center",
    fontSize: 10,
  },
  studentInfo: {
    marginTop: 30,
    marginBottom: 20,
  },
  observationsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  observationItem: {
    marginBottom: 8,
    textAlign: "justify",
  },
  observationTitle: {
    fontWeight: "bold",
  },
});

const ApprovalDocument = ({ data }) => {
  console.log("generando");
  return (
    <Document>
      <Page size="Letter" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
        </View>

        {/* Title */}
        <View style={styles.title}>
          <Text>APROBACIÓN DEL TUTOR ACADÉMICO</Text>
        </View>

        {/* Main content */}
        <View style={styles.paragraph}>
          <Text>En mi carácter de tutor acedémico del Trabajo Especial de Grado titulado:</Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.bold}>
            {'"'}
            {data.titulo}
            {'"'}
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text>
            Presentado por el ciudadano <Text style={styles.bold}>{data.nombre}</Text>, cédula de
            identidad No. <Text style={styles.bold}>{data.cedula}</Text>, para optar al título de{" "}
            <Text style={styles.bold}>T.S.U. en {data.carrera}</Text>. Considero que este reúne los
            requisitos y méritos suficientes para ser sometido a presentación pública y evaluación
            por parte del Jurado Examinador que se designe.
          </Text>
        </View>

        <View style={styles.paragraph}>
          <Text>En la ciudad de San Cristóbal {data.fechaHoy}.</Text>
        </View>

        {/* Signature section */}
        <View style={styles.signature}>
          <View style={styles.signatureText}>
            <Text>_________________________________________</Text>
          </View>
          <View style={styles.signatureText}>
            <Text>{data.tutorNombre}</Text>
          </View>
          <Text style={styles.signatureText}>C.I {data.tutorCedula}</Text>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.bold}>Se anexa correcciones.</Text>
        </View>

        {/* Student info */}
        <View style={styles.studentInfo}>
          <Text style={styles.bold}>{data.nombre}</Text>
          <Text style={styles.bold}>{data.cedula}</Text>
        </View>
      </Page>
    </Document>
  );
};

ApprovalDocument.propTypes = {
  data: PropTypes.shape({
    nombre: PropTypes.string,
    cedula: PropTypes.string,
    carrera: PropTypes.string,
    titulo: PropTypes.string,
    fecha: PropTypes.string,
    tutorNombre: PropTypes.string,
    tutorCedula: PropTypes.string,
    fechaHoy: PropTypes.string,
  }).isRequired,
};


function obtenerFechaEnFormato() {
  // Mapeo de meses de inglés a español
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Obtener el día, mes y año
  const dia = fechaActual.getDate();
  const mes = meses[fechaActual.getMonth()]; // getMonth() devuelve un índice de 0 a 11
  const año = fechaActual.getFullYear();

  // Formatear el día para que siempre tenga dos dígitos
  const diaFormateado = dia < 10 ? "0" + dia : dia;

  // Construir la cadena de la fecha
  const fechaCompleta = `a los ${diaFormateado} días del mes de ${mes} de ${año}`;

  return fechaCompleta;
}

const CartaAprAcaGenerator = ({data}) => {
  // Datos de ejemplo para la planilla.
  // Puedes reemplazar estos datos con información real de tu aplicación.
  console.log(data);
  const protocolData = {
    nombre: data.nombre,
    cedula: data.cedula,
    carrera: data.carrera,
    titulo: data.titulo,
    fecha: data.fecha,
    tutorNombre: data.tutorNombre,
    tutorCedula: data.tutorCedula,
    fechaHoy: obtenerFechaEnFormato(),
  };


  return (
    <Button variant="outlined" color="primary">
      <PDFDownloadLink
        document={<ApprovalDocument data={protocolData} />}
        fileName={`Carta de Aprobacion Tutor Metodologico .pdf`}
      >
        {({ blob, url, loading, error }) => (loading ? "Generando PDF..." : "Descargar ")}
      </PDFDownloadLink>
    </Button>
  );
};

CartaAprAcaGenerator.propTypes = {
  data: PropTypes.shape({
    nombre: PropTypes.string,
    cedula: PropTypes.string,
    carrera: PropTypes.string,
    titulo: PropTypes.string,
    fecha: PropTypes.string,
    tutorNombre: PropTypes.string,
    tutorCedula: PropTypes.string,
  }).isRequired,
};

export default CartaAprAcaGenerator;
