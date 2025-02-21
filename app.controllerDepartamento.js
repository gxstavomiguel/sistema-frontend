angular.module('meuSite')
    .controller('controllerDepartamento', function ($scope, $resource, $location, $routeParams) {
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