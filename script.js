const contador = document.getElementById('contador');
crearVotacionBtn.addEventListener('click', async () => {

    const titulo = document.getElementById('tituloVotacion').value;

    const opcionesTexto = document.getElementById('opcionesVotacion').value;

    const opciones = opcionesTexto
        .split('\n')
        .map(op => op.trim())
        .filter(op => op !== '');

    if (!titulo || opciones.length < 2) {
        alert('Mínimo 2 opciones');
        return;
    }

    await fetch('/api/votaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            titulo,
            opciones
        })
    });

    document.getElementById('tituloVotacion').value = '';
    document.getElementById('opcionesVotacion').value = '';

    cargarVotaciones();
});

async function votar(id, opcion) {

    await fetch(`/api/votar/${id}/${opcion}`, {
        method: 'POST'
    });

    cargarVotaciones();
}

async function cargarVotaciones() {

    const res = await fetch('/api/votaciones');

    const votaciones = await res.json();

    listaVotaciones.innerHTML = '';

    votaciones.forEach(votacion => {

        const div = document.createElement('div');

        div.className = 'votacion';

        let html = `
            <h3>${votacion.titulo}</h3>
        `;

        votacion.opciones.forEach((opcion, index) => {
            html += `
                <div class="opcion">
                    <span>${opcion.nombre} - ${opcion.votos} votos</span>
                    <button onclick="votar(${votacion.id}, ${index})">
                        Votar
                    </button>
                </div>
            `;
        });

        div.innerHTML = html;

        listaVotaciones.appendChild(div);
    });
}

cargarVotaciones();
