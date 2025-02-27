const app = angular.module('meuSite', ['ngRoute', 'ngResource',]);

app.run(function($rootScope, $location) {
    $rootScope.homeLink = function() {
        if ($location.path() === "/register/" || $location.path() === "/login/") {
            return true; 
        }
        return $rootScope.tipoUsuario === 'NORMAL'; 
    };
});

app.factory("DepartamentoService", function ($resource) {
    return $resource("https://sistema-backend-2-1.onrender.com/api/departamento/listaDepartamento", {}, {
        query: { method: "GET", isArray: true },
        findById: { method: "GET", url: "https://sistema-backend-2-1.onrender.com/api/departamento/findById/:id"},
        update: { method: "PUT", url: "https://sistema-backend-2-1.onrender.com/api/departamento/update/:id" } 
    });
});

app.factory("UsuarioService", function ($resource) {
    return $resource("https://sistema-backend-2-1.onrender.com/api/usuario/findAll", {}, {
        get: { method: "GET", isArray: false },
        findById: { method: "GET", url: "https://sistema-backend-2-1.onrender.com/api/usuario/findById/:id"},
        update: { method: "PUT", url: "https://sistema-backend-2-1.onrender.com/api/usuario/update/:id" } 
    });
});

app.factory("ChamadoService", function ($resource) {
    return $resource("https://sistema-backend-2-1.onrender.com/api/chamado/findAll", {}, {
        get: { method: "GET", isArray: false },
        findByQtd: { method: "GET", isArray: false, url:"https://sistema-backend-2-1.onrender.com/api/chamado/qtdchamadosbydepartamento" }
    });
});





