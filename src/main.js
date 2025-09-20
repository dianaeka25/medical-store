// src/main.js
console.log("Hello from main.js!");

document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.innerHTML = '<h2 class="text-2xl font-semibold mb-4">Produk Alat Kesehatan</h2>';
    }
});