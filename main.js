const app = angular.module('meuSite', ['ngRoute', 'ngResource']);

// app.config(function ($routeProvider) {
//     $routeProvider
//         .when('/main', {
//             templateUrl: 'src/componentes/main/main.html',
//             controller: 'controllerDepartamento'
//         })
//         .when('/readDepartamentos', {
//             templateUrl: 'src/componentes/departamento/read/readDepartamento.html',
//             controller: 'controllerDepartamento'
//         })
//         .when('/createDepartamento', {
//             templateUrl: 'src/componentes/departamento/create/createDepartamento.html',
//             controller: 'controllerDepartamento'
//         })
//         .when('/editDepartamento/:id', {
//             templateUrl: 'src/componentes/departamento/edit/editDepartamento.html',
//             controller: 'controllerDepartamento'
//         })
//         .when('/createChamado/', {
//             templateUrl: 'src/componentes/chamado/create/createChamado.html',
//             controller: 'controllerChamado'
//         })
//         .when('/readChamado/', {
//             templateUrl: 'src/componentes/chamado/read/readChamado.html',
//             controller: 'controllerChamado'
//         })
//         .when('/register/', {
//             templateUrl: 'src/componentes/register/register.html',
//             controller: 'controllerLoginRegister'
//         })
//         .when('/login/', {
//             templateUrl: 'src/componentes/login/login.html',
//             controller: 'controllerLoginRegister'
//         })
//         .when('/readUsuario/', {
//             templateUrl: 'src/componentes/usuario/readUsuario.html',
//             controller: 'controllerLoginRegister'
//         })
//         .otherwise({
//             redirectTo: '/register'
//         });
// })

app.controller('controllerDepartamento', function ($scope, $resource, $location, $routeParams) {
    const departamentoFindById = $resource("http://127.0.0.1:8080/api/departamento/findById/:id");
    const departamentoUpdate = $resource("http://127.0.0.1:8080/api/departamento/update/:id",
        { id: '@id' }, {
        'update': { method: 'PUT' }
    });

    $scope.departamento = {};

    const id = $routeParams.id;
    if (id) {
        departamentoFindById.get({ id: id }, function (data) {
            $scope.departamento = data;
        });
    }

    $scope.tentarAtualizar = function () {
        if (!$scope.departamento.id) {
            alert("ID do departamento não encontrado!");
            return;
        }

        departamentoUpdate.update({ id: $scope.departamento.id }, $scope.departamento,
            function () {
                $location.path('/createDepartamento');
            })
    }

    $scope.editTabela = function (id) {
        $location.path('/editDepartamento/' + id);
    };

    const departamentoSave = $resource("http://127.0.0.1:8080/api/departamento/save");
    $scope.modalAberto = false;
    $scope.abrirModal = function () {
        $scope.modalAberto = true
    }

    $scope.fecharModal = function () {
        $scope.modalAberto = false;
    }

    $scope.save = function () {
        departamentoSave.save($scope.departamento, function (data) {
            $scope.departamento = {
                nome: '',
                descricao: ''
            };
            $scope.findAll();
            $scope.fecharModal();
        }

        );

    };

    const departamentoFindAll = $resource("http://127.0.0.1:8080/api/departamento/findAll");
    $scope.limparCampos = function () {
        $scope.filtrarDepartamento = '';
        $scope.filtrarId = '';
    }
    $scope.findAll = function () {
        departamentoFindAll.query(function (data) {
            $scope.departamentos = data;
        });
    };

    $scope.orderByMe = function (x) {
        $scope.myOrderBy = x;
    }
    $scope.findAll();

    const departamentoDeleteById = $resource("http://127.0.0.1:8080/api/departamento/delete/:id");
    $scope.delete = function (id) {
        departamentoDeleteById.delete({ id: id }, function () {
            $scope.findAll();
        });
    };

});

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

app.controller('controllerLoginRegister', function ($scope, DepartamentoService, $resource, $location, UsuarioService, $rootScope) {
    const rota = "http://127.0.0.1:8080/api/usuario/";

    $scope.departamentos = [];
    $scope.usuarios = [];

    DepartamentoService.query().$promise.then(function (response) {
        $scope.departamentos = response;
    })

    $scope.findAll =
        UsuarioService.get((data) => {
            $scope.usuarios = data.usuarios;
        })

    const usuarioSave = $resource(`${rota}save`);
    $scope.save = function () {
        let usuarioData = angular.copy($scope.usuario);
        usuarioData.departamento = { id: usuarioData.departamento }


        usuarioSave.save(usuarioData, function (data) {
            if ($scope.usuario.tipo === "ADMIN") {
                $location.path('/main');
            } else {
                $location.path('/createChamado');
            }
            $scope.usuario = {
                nome: '',
                email: '',
                senha: '',
                telefone: '',
                cargo: '',
                tipo: '',
                departamento: '',
            }
        })
    }

    $scope.delete = (id) => {
        usuario
    }

    const departamentoDeleteById = $resource("http://127.0.0.1:8080/api/departamento/delete/:id");
    $scope.delete = function (id) {
        departamentoDeleteById.delete({ id: id }, function () {
            $scope.findAll();
        });
    };

    $scope.login = () => {
        UsuarioService.get((data) => {
            if (data && data.usuarios) {
                // console.log('objeto', data.usuarios)
                // console.log('array', data)
                const emailInput = $scope.usuario.email;
                const senhaInput = $scope.usuario.senha;
                let usuarioEncontrado = data.usuarios.find(user =>
                    user.email === emailInput && user.senha === senhaInput
                );
                if (usuarioEncontrado) {
                    $rootScope.usuarioLogado = usuarioEncontrado;
                    $location.path('/main')
                } else {
                    alert('Dados errados')
                }
            }
        });
    };
})

app.controller('controllerChamado', function ($scope, DepartamentoService, $resource, $timeout, ChamadoService, $rootScope) {

    const rota = "http://127.0.0.1:8080/api/chamado/";

    $scope.departamentos = [];
    DepartamentoService.query().$promise.then(function (response) {
        $scope.departamentos = response;
    })

    $scope.prioridades = ["BAIXA", "MEDIA", "ALTA"];
    $scope.status = ["ABERTO", "EM_ANDAMENTO", "CONCLUIDO"];
    $scope.departamento = DepartamentoService.query();

    const chamadoSave = $resource(`${rota}save`);

    $scope.save = function () {
        let chamadoData = angular.copy($scope.chamado);
        chamadoData.departamento = { id: chamadoData.departamento }

        if ($rootScope.usuarioLogado) {
            chamadoData.usuario = { id: $rootScope.usuarioLogado.id }
        }
        else {
            alert('Usuário não encontrado');
            return;
        }

        chamadoSave.save(chamadoData, function (data) {
            $scope.chamado = {
                titulo: '',
                descricao: '',
                prioridade: '',
                departamento: ''
            }
        });
    }

    $scope.chamados = [];
    ChamadoService.get(function (data) {
        $scope.chamados = data.chamados;
        let prioridadeQtd = {
            BAIXA: 0,
            MEDIA: 0,
            ALTA: 0
        };

        let statusQtd = {
            ABERTO: 0,
            EM_ANDAMENTO: 0,
            CONCLUIDO: 0
        }

        $scope.chamados.forEach(chamado => {
            if (prioridadeQtd[chamado.prioridade] !== undefined) {
                prioridadeQtd[chamado.prioridade]++;
            }
            if (statusQtd[chamado.status] !== undefined) {
                statusQtd[chamado.status]++;
            }
        });
        graficoBarra(prioridadeQtd);
        graficoPizza(statusQtd);

    });

    let graficoBarraExistente = null;
    let graficoPizzaExistente = null;
    function graficoBarra(prioridadeQtd) {
        $timeout(function () {
            const graf = document.getElementById('grafico1');
            if (graf) {
                if (graficoBarraExistente) {
                    graficoBarraExistente.destroy();
                }
                graficoBarraExistente = new Chart(graf.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: ['Baixa', 'Média', 'Alta'],
                        datasets: [{
                            label: 'Prioridade dos chamados',
                            data: [
                                prioridadeQtd.BAIXA,
                                prioridadeQtd.MEDIA,
                                prioridadeQtd.ALTA
                            ],
                            // backgroundColor: ['#32c1ec'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }, 300);
    }

    function graficoPizza(statusQtd) {
        $timeout(function () {
            const graf = document.getElementById('grafico2');
            if (graf) {
                if (graficoPizzaExistente) {
                    graficoPizzaExistente.destroy();
                }
                graficoPizzaExistente = new 
                Chart(graf.getContext('2d'), {
                    type: 'pie',
                    data: {
                      labels: ['Aberto', 'Em andamento', 'Finalizado'],
                      datasets: [{
                        label: 'Status dos Chamados',
                        data: [
                            statusQtd.ABERTO,
                            statusQtd.EM_ANDAMENTO,
                            statusQtd.CONCLUIDO
                        ],
                        borderWidth: 1
                      }]
                    },
                    options: {
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }
                  });
            }
        }, 300);

    }


});

