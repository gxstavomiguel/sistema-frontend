angular.module('meuSite')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'src/componentes/main/main.html',
                controller: 'controllerDepartamento'
            })
            .when('/createDepartamento', {
                templateUrl: 'src/componentes/departamento/create/createDepartamento.html',
                controller: 'controllerDepartamento'
            })
            .when('/createChamado/', {
                templateUrl: 'src/componentes/chamado/create/createChamado.html',
                controller: 'controllerChamado'
            })
            .when('/readChamado/', {
                templateUrl: 'src/componentes/chamado/read/readChamado.html',
                controller: 'controllerChamado'
            })
            .when('/register/', {
                templateUrl: 'src/componentes/register/register.html',
                controller: 'controllerLoginRegister'
            })
            .when('/login/', {
                templateUrl: 'src/componentes/login/login.html',
                controller: 'controllerLoginRegister'
            })
            .when('/readUsuario/', {
                templateUrl: 'src/componentes/usuario/readUsuario.html',
                controller: 'controllerLoginRegister'
            })
            .otherwise({
                redirectTo: '/register'
            });
    })