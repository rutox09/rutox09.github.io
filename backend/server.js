const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Votaciones guardadas en memoria
let votaciones = [];

// Obtener votaciones
app.get('/api/votaciones', (req, res) => {
    res.json(votaciones);
});

// Crear votación
app.post('/api/votaciones', (req, res) => {
    const { titulo, opciones } = req.body;

    const nueva = {
        id: Date.now(),
        titulo,
        opciones: opciones.map(op => ({
            nombre: op,
            votos: 0
        }))
    };

    votaciones.push(nueva);

    res.json(nueva);
});

// Votar
app.post('/api/votar/:id/:opcion', (req, res) => {
    const id = Number(req.params.id);
    const opcionIndex = Number(req.params.opcion);

    const votacion = votaciones.find(v => v.id === id);

    if (!votacion) {
        return res.status(404).json({ error: 'No encontrada' });
    }

    votacion.opciones[opcionIndex].votos++;

    res.json(votacion);
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
