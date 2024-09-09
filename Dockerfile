# Usa una imagen base de Node.js
FROM node:18

# Instala Bun
RUN curl -fsSL https://bun.sh/install | bash

# Define el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo de definición de paquetes y las dependencias
COPY bun.lockb package.json ./

# Instala las dependencias usando Bun
RUN bun install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación Next.js usando Bun
RUN bun build

# Expon el puerto en el que Next.js servirá la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación Next.js usando Bun
CMD ["bun", "start"]

