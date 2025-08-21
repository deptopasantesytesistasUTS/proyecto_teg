import { backendUrl } from '../config';

const TUTORIAS_API = `${backendUrl}/aulavirtualDocente`;

export const tutoriasService = {
  // Crear nueva tutoria
  async crearTutoria(datosTutoria) {
    try {
      const response = await fetch(`${TUTORIAS_API}/tutorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosTutoria),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear tutoria:', error);
      throw error;
    }
  },

  // Obtener tutorias por seccion
  async obtenerTutoriasPorSeccion(idSeccion) {
    try {
      const response = await fetch(`${TUTORIAS_API}/tutorias/${idSeccion}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener tutorias:', error);
      throw error;
    }
  },

  // Editar tutoria
  async editarTutoria(idTutoria, datosActualizados) {
    try {
      const response = await fetch(`${TUTORIAS_API}/tutorias/${idTutoria}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al editar tutoria:', error);
      throw error;
    }
  },

  // Eliminar tutoria
  async eliminarTutoria(idTutoria) {
    try {
      const response = await fetch(`${TUTORIAS_API}/tutorias/${idTutoria}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar tutoria:', error);
      throw error;
    }
  },
};
