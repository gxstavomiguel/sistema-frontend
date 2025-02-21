const app = angular.module('meuSite', ['ngRoute', 'ngResource']);

app.factory("DepartamentoService", function ($resource) {
    return $resource("http://localhost:8080/api/departamento/listaDepartamento", {}, {
        query: { method: "GET", isArray: true }
    });
});

app.factory("UsuarioService", function ($resource) {
    return $resource("http://localhost:8080/api/usuario/findAll", {}, {
        get: { method: "GET", isArray: false }
    });
});

app.factory("ChamadoService", function ($resource) {
    return $resource("http://localhost:8080/api/chamado/findAll", {}, {
        get: { method: "GET", isArray: false }
    });
});





