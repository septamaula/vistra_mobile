# Gunakan image Node.js (versi 22 yang sesuai dengan package.json)
FROM node:22-alpine

# Set directory kerja di dalam container
WORKDIR /app

# Install Quasar CLI secara global
RUN npm install -g @quasar/cli

# Salin file package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install seluruh dependencies project
RUN npm install

# Salin seluruh file kode ke dalam container
COPY . .

# Expose port yang digunakan oleh Quasar (default 9000)
EXPOSE 9000

# Command untuk menjalankan dev server, -H 0.0.0.0 agar bisa diakses dari luar container
CMD ["quasar", "dev", "-H", "0.0.0.0"]
