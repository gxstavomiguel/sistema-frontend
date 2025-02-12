const app = angular.module('meuSite', ['ngRoute', 'ngResource']);
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
                alert('Departamento atualizado com sucesso!');
                $location.path('/readDepartamentos');
            })
    }

    $scope.editTabela = function (id) {
        $location.path('/editDepartamento/' + id);
    };

    const departamentoSave = $resource("http://127.0.0.1:8080/api/departamento/save");
    $scope.save = function () {
        // if ($scope.departamento.nome && $scope.departamento.descricao) {
            departamentoSave.save($scope.departamento, function (data) {
                $scope.retorno = data;
                $scope.departamento = {
                    nome: '',
                    descricao: ''
                };
            }
        );
        // }
    };

    const departamentoFindAll = $resource("http://127.0.0.1:8080/api/departamento/findAll");
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
            // alert('deletado');
            $scope.findAll();
        });
    };

});

app.controller('controllerDashboard', function($scope, $resource){
    $scope.chamados = [];
    $scope.departamentos = [];
    $scope.usuarios = [];
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/main', {
            templateUrl: 'src/componentes/main/main.html',
            controller: 'controllerDepartamento'
        })
        .when('/readDepartamentos', {
            templateUrl: 'src/componentes/departamento/read/read.html',
            controller: 'controllerDepartamento'
        })
        .when('/createDepartamento', {
            templateUrl: 'src/componentes/departamento/create/create.html',
            controller: 'controllerDepartamento'
        })
        .when('/editDepartamento/:id', {
            templateUrl: 'src/componentes/departamento/edit/edit.html',
            controller: 'controllerDepartamento'
        })
        .otherwise({
            redirectTo: '/main'
        });
})