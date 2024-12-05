
### **Descripción de las Funciones**

1. **Autenticación**:
   - **`login`**: Envía las credenciales al backend, recibe un token JWT y lo guarda en `localStorage`.
   - **`register`**: Envía los datos del registro de usuario al backend.

2. **Gestión de Usuarios**:
   - **`fetchUserProfile`**: Obtiene el perfil del usuario autenticado.
   - **`updateUserProfile`**: Actualiza los datos del perfil del usuario.

3. **Gestión de Pacientes**:
   - **`fetchPatients`**: Recupera la lista completa de pacientes.
   - **`createPatient`**: Crea un nuevo paciente.
   - **`updatePatient`**: Actualiza los datos de un paciente existente.

4. **Gestión de Historiales Médicos**:
   - **`fetchMedicalHistory`**: Recupera el historial médico de un paciente por su ID.
   - **`addMedicalHistory`**: Agrega un nuevo historial médico a un paciente.
   - **`updateMedicalHistory`**: Actualiza un historial médico existente.

5. **Gestión de Citas**:
   - **`createAppointment`**: Crea una nueva cita.
   - **`updateAppointment`**: Actualiza una cita existente.

---

### **Configuración Adicional**

1. **Variables de entorno**:
   Definir la variable `REACT_APP_API_URL` en un archivo `.env` en el frontend para apuntar al backend:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

2. **Manejo de Errores**:
   Personalizar el manejo de errores añadiendo interceptores en Axios o envolviendo las funciones con bloques `try-catch` en los componentes.

3. **Autenticación y Roles**:
   El token de autenticación se gestiona mediante `localStorage`. Para ello usamos un contexto global como `AuthContext` para verificar roles y permisos..


---

### **File: `context/AuthContext.tsx`**

---

### **Explicación del Código**

1. **Estado del Usuario**:
   - Se utiliza `useState` para guardar la información del usuario actualmente autenticado.

2. **Carga Automática del Usuario**:
   - En el `useEffect`, si existe un token en el `localStorage`, se hace una llamada al backend para cargar el perfil del usuario.

3. **Funciones del Contexto**:
   - **`login`**: Llama al endpoint de login y obtiene el perfil del usuario autenticado.
   - **`logout`**: Limpia el estado del usuario y elimina el token del `localStorage`.

4. **Determinación de Autenticación**:
   - La propiedad `isAuthenticated` devuelve `true` si el usuario está autenticado, basado en la presencia del objeto `user`.

5. **Hook Personalizado**:
   - **`useAuth`**: Facilita el acceso al contexto en cualquier componente.

---

### **Uso del Contexto**

En el archivo principal `App.tsx`, envuelve la aplicación con el `AuthProvider`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
```


### **Consideraciones de Seguridad**
- El token se almacena en `localStorage` para simplicidad. Si necesitas mayor seguridad, considera el uso de **httpOnly cookies**.
- Asegúrate de que las rutas protegidas verifiquen la autenticación antes de permitir acceso.


## Auth Provider useMemo

Usar el hook `useMemo` para envolver el valor proporcionado por el `AuthContext.Provider` es una buena práctica, ya que optimiza el rendimiento evitando re-renderizados innecesarios cuando las dependencias no cambian.


### **Explicación de los Cambios**

1. **Uso de `useMemo`**:
   - El valor proporcionado por el `AuthContext.Provider` está envuelto en `useMemo`.
   - Esto asegura que el valor del contexto solo se recalcula cuando cambian las dependencias (en este caso, `user` o `isAuthenticated`).

2. **Mejor Rendimiento**:
   - Al evitar la recreación del valor del contexto en cada render, los componentes hijos que consumen el contexto no se re-renderizan innecesariamente.

3. **Estado de Carga (`loading`)**:
   - Se muestra una pantalla de carga mientras se determina el estado del usuario, lo que mejora la experiencia del usuario al cargar la aplicación.

---

### **Beneficio del Uso de `useMemo`**

Sin `useMemo`, cada vez que el `AuthProvider` se re-renderiza, se recrea el objeto de valor proporcionado, lo que puede provocar re-renderizados innecesarios en los componentes consumidores del contexto. Al usar `useMemo`, el objeto solo se recrea cuando sus dependencias cambian.
