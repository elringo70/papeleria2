# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración del proyecto
COPY package.json yarn.lock* package-lock.json* ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto en el que correrá la aplicación
EXPOSE 4173

# Comando para ejecutar la aplicación
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
