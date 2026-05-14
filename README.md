# Bills Tracker Backend

Este repositorio contiene la API y la infraestructura para el backend del sistema de Bills Tracker, desarrollado con Node.js, Express y MySQL. Cuenta con configuraciones completas para despliegue y desarrollo local mediante Docker, además de soporte para Integración Continua (Jenkins) y un ecosistema de monitoreo (Prometheus, Grafana).

## Requisitos Previos

Necesitas tener instalado en tu computadora:
- [Docker](https://www.docker.com/products/docker-desktop/) (Docker Desktop en Windows/Mac, o Docker Engine en Linux)
- [Git](https://git-scm.com/)

*(Nota: Como todo el entorno está contenerizado, **no** es estrictamente necesario que tengas Node.js ni MySQL instalados en tu sistema anfitrión, a menos que quieras correr el código por fuera de Docker).*

## Cómo levantar el proyecto localmente

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/fernandow1/bills-tracker-backend.git
   cd bills-tracker-backend
   ```

2. **Configurar las Variables de Entorno:**
   El proyecto requiere un archivo `.env` para manejar secretos y credenciales.
   - Crea una copia del archivo de ejemplo:
     ```bash
     cp .env.example .env
     ```
   - Abre el nuevo archivo `.env` y ajusta los valores (como las contraseñas de la base de datos) si lo consideras necesario. Los valores por defecto en `.env.example` son suficientes para un entorno local funcional.

3. **Ejecutar con Docker Compose:**
   Para levantar la API, el proxy Nginx y la base de datos MySQL, simplemente ejecuta:
   ```bash
   docker compose up -d
   ```
   *La configuración `-d` (detached) permite que los contenedores corran en segundo plano. La primera vez que lo ejecutes puede tardar un poco mientras Docker descarga y construye las imágenes necesarias.*

4. **Verificar que funciona:**
   Una vez que termine de construir y prender, la API estará expuesta y respondiendo peticiones detrás del Nginx.
   Localmente, puedes probar que el servicio está funcionando accediendo a:
   - `http://localhost/api` (Dependiendo de la configuración de tu proxy y puertos expuestos)

5. **Apagar los servicios:**
   Para detener todo de forma segura cuando termines de trabajar, ejecuta:
   ```bash
   docker compose down
   ```

---

## Ejecución de Pruebas (Testing)

El proyecto utiliza **Jest** para las pruebas unitarias y de integración, configurado para no tener conflictos en diferentes sistemas operativos o entornos de CI/CD.

### Ejecutar Tests Localmente
Para ejecutar los tests utilizando tu entorno de desarrollo local (aprovechando los volúmenes montados):

```bash
docker compose run --rm app npm run test:unit
docker compose run --rm app npm run test:integration
```

### Ejecutar Tests en CI/CD (Entorno limpio)
Para entornos automatizados como Jenkins, se ha habilitado un `docker-compose.test.yml`. Este entorno prescinde del montaje de volúmenes para asegurar la ejecución más limpia y reproducible, ejecutando desde adentro de la imagen.

```bash
# 1. Fuerza la compilación completa de la imagen de prueba sin usar caché
docker compose -f docker-compose.test.yml build --no-cache app

# 2. Ejecuta los tests dentro de un contenedor desechable
docker compose -f docker-compose.test.yml run --rm app npm run test
```

## Estructura Principal
- `src/`: Código fuente de la aplicación basándose en arquitectura limpia o arquitectura de capas (Application, Domain, Infrastructure, Presentation).
- `jenkins/`: Entorno e imágenes para pipeline de integración continua.
- `nginx/`: Configuraciones enrutador y proxy reverso.
- `monitoring/`: Archivos para el observatorio mediante Grafana y Prometheus.
- `tests/`: Pruebas de carga (k6) y setups de integración.
