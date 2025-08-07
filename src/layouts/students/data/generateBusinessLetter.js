import React from 'react';
import { Page, Document, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed (optional)
// Font.register({ family: 'Arial', src: '/path/to/arial.ttf' });

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  instituteName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 20,
  },
  reference: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  salutation: {
    fontSize: 12,
    marginBottom: 15,
  },
  bodyText: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  signature: {
    marginTop: 30,
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'center',
    borderTop: '1pt solid black',
    paddingTop: 10,
  },
});

// Create Document Component
const BusinessLetter = ({
  studentName = "",
  studentId = "",
  career = "",
  letterDate = "",
  reference = "",
  directorName = "",
  directorTitle = "DIRECTOR",
  city = "San Cristóbal",
  extension = "Extensión San Cristóbal",
  jefeNombre = "Lcda.",
  jefeCargo = "Jefe Investigación y Pasantías",
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.instituteName}>Instituto Universitario de Tecnología "Antonio José de Sucre"</Text>
        <Text style={styles.date}>{city}, {letterDate}</Text>
        <Text style={styles.reference}>{reference}</Text>
      </View>
      <View>
        <Text style={styles.reference}>LCDO.</Text>
        <Text style={styles.reference}>{directorTitle}</Text>
        <Text style={styles.reference}>SU DESPACHO</Text>
        <Text style={styles.reference}>Ref. Investigación II (Trabajo Especial de Grado)</Text>
      </View>
      <View>
        <Text style={styles.salutation}>Ante todo, reciba un cordial saludo. La presente tiene como propósito presentar ante</Text>
        <Text style={styles.bodyText}>
          usted y postular muy respetuosamente al bachiller {studentName} de la cédula de identidad N° {studentId} cursante
          del <Text style={styles.bold}>VI Semestre de la Carrera</Text> <Text style={styles.bold}>{career} en el</Text> <Text style={styles.bold}>Instituto Universitario de
          Tecnología "Antonio José de Sucre" {extension}</Text>; estudiante que solicita sea
          permitido desarrollar su período de Investigación de Trabajo Especial de Grado en tan
          prestigiosa organización que usted representa.
        </Text>
        <Text style={styles.bodyText}>
          Solicitamos ante su despacho, la posibilidad de realizar su Proyecto de Investigación y
          futuro Trabajo de Grado, requisito para poder optar por el título de Técnico Superior
          Universitario
        </Text>
        <Text style={styles.bodyText}>
          Dicha Fase, tiene como propósito que el estudiante, mediante la realización de un
          conjunto de actividades de carácter investigativa, entre en contacto con el campo académico
          y aplique los conocimientos, las habilidades, las actitudes y valores logrados durante el
          proceso formativo cumplido en el <Text style={styles.bold}>INSTITUTO UNIVERSITARIO DE TECNOLOGÍA
          "ANTONIO JOSÉ DE SUCRE"</Text> a casos concretos relacionados con la carrera y mención
          que cursa, en la elaboración del Trabajo Especial de Grado.
        </Text>
        <Text style={styles.bodyText}>
          Sin más a que hacer referencia, deseando una pronta y positiva respuesta se despide
          de Usted.
        </Text>
      </View>
      <View style={styles.signature}>
        <Text>Atentamente</Text>
        <Text style={{ marginTop: 30 }}>_________________________</Text>
        <Text style={styles.bold}>{jefeNombre}</Text>
        <Text style={styles.bold}>{jefeCargo}</Text>
      </View>
      <View style={styles.footer}>
        <Text>Carrera 17 entre calles 9 y 10, Edificio Doña María, San Cristóbal, Estado Táchira. Telf. (0276) 3551168, 3556640</Text>
        <Text>J-07025041-0</Text>
        <Text>Correo Institucional: coordinacion.academica@utsancristobal.edu.ve</Text>
      </View>
    </Page>
  </Document>
);

const BusinessLetterGenerator = ({
  studentName,
  studentId,
  career,
  letterDate,
  reference,
  directorName,
  directorTitle,
  city,
  extension,
  jefeNombre,
  jefeCargo,
}) => {
  return (
    <Button variant="contained" color="primary">
      <PDFDownloadLink
        document={
          <BusinessLetter
            studentName={studentName}
            studentId={studentId}
            career={career}
            letterDate={letterDate}
            reference={reference}
            directorName={directorName}
            directorTitle={directorTitle}
            city={city}
            extension={extension}
            jefeNombre={jefeNombre}
            jefeCargo={jefeCargo}
          />
        }
        fileName="Carta_Empresa.pdf"
        color="white"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Generando PDF..." : "Descargar Carta"
        }
      </PDFDownloadLink>
    </Button>
  );
};

export default BusinessLetterGenerator;