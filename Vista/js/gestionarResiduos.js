window.addEventListener("load", principal, false);

function principal() {

    var residuos = obtenerResiduosDesdeFuenteExterna();


    agregarListaResiduosOrganizada(residuos);
}

function obtenerResiduosDesdeFuenteExterna() {

    $.ajax({
        url: 'URL_DE_LA_API_O_ENDPOINT', 
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            
            var residuos = data.residuos; 

            agregarListaResiduosOrganizada(residuos);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

function agregarListaResiduosOrganizada(residuos) {

    var residuosOrganizados = organizarResiduosPorTipo(residuos);


    var listaResiduosOrganizada = document.createElement("ul");


    for (var tipo in residuosOrganizados) {
        var residuosTipoLista = document.createElement("ul");
        residuosTipoLista.innerHTML = "<strong>" + tipo + "</strong>:";
        residuosOrganizados[tipo].forEach(function(residuo) {
            var listItem = document.createElement("li");
            listItem.textContent = residuo;
            residuosTipoLista.appendChild(listItem);
        });
        listaResiduosOrganizada.appendChild(residuosTipoLista);
    }

    document.getElementById("lista-residuos").appendChild(listaResiduosOrganizada);
}


function organizarResiduosPorTipo(residuos) {
    var residuosPorTipo = {};
    residuos.forEach(function(residuo) {
        if (!residuosPorTipo[residuo.tipo]) {
            residuosPorTipo[residuo.tipo] = [];
        }
        residuosPorTipo[residuo.tipo].push(residuo.nombre);
    });
    return residuosPorTipo;
}
