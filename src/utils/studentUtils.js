// Utilidades para manejo de estudiantes
// Lista de cédulas válidas disponibles en la base de datos
export const VALID_STUDENT_IDS = [
  "32345213", // Luis Alexandro Perez Gimenez
  "12323212", // Monica Maria Mora Mendez
  "11503984", // Jesús Gámez Morales
  "30523215", // Lynerker Leandro Mora Ortega
  "30443333", // Luis Carlos Perez Karlz
  "23554324"  // Mora Maria Fernandex Perez
];

/**
 * Valida si una cédula existe en la base de datos
 * @param {string} cedula - La cédula a validar
 * @returns {boolean} - True si la cédula es válida
 */
export const isValidStudentId = (cedula) => {
  return VALID_STUDENT_IDS.includes(cedula);
};

/**
 * Obtiene una cédula válida, mapeando cédulas inexistentes a una válida
 * @param {string} cedula - La cédula original
 * @returns {string} - La cédula válida a usar
 */
export const getValidStudentId = (cedula) => {
  return VALID_STUDENT_IDS.includes(cedula) ? cedula : VALID_STUDENT_IDS[0];
};

/**
 * Verifica si una cédula fue mapeada a otra
 * @param {string} originalCedula - La cédula original
 * @param {string} validCedula - La cédula válida
 * @returns {boolean} - True si la cédula fue mapeada
 */
export const wasCedulaMapped = (originalCedula, validCedula) => {
  return originalCedula !== validCedula;
};
