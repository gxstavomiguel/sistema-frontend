const app = angular.module('meuSite', ['ngRoute', 'ngResource',]);

app.run(function($rootScope, $location){
    $rootScope.homeLink = function(){
        return $location.path() === "/register/" || $location.path() === "/login/";
    }
})

app.factory("DepartamentoService", function ($resource) {
    return $resource("http://localhost:8080/api/departamento/listaDepartamento", {}, {
        query: { method: "GET", isArray: true },
        findById: { method: "GET", url: "http://localhost:8080/api/departamento/findById/:id"},
        update: { method: "PUT", url: "http://localhost:8080/api/departamento/update/:id" } 
    });
});

app.factory("UsuarioService", function ($resource) {
    return $resource("http://localhost:8080/api/usuario/findAll", {}, {
        get: { method: "GET", isArray: false },
        findById: { method: "GET", url: "http://localhost:8080/api/usuario/findById/:id"},
        update: { method: "PUT", url: "http://localhost:8080/api/usuario/update/:id" } 
    });
});

app.factory("ChamadoService", function ($resource) {
    return $resource("http://localhost:8080/api/chamado/findAll", {}, {
        get: { method: "GET", isArray: false }
    });
});





