angular.module('meuSite')
    .controller('controllerDepartamento', function (DepartamentoService, $scope, $resource, $location, $routeParams) {
        const departamentoFindById = $resource("https://sistema-backend-2-1.onrender.com/api/departamento/findById/:id");
        const departamentoUpdate = $resource("https://sistema-backend-2-1.onrender.com/api/departamento/update/:id",
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

        $scope.modalEditAberto = false;
        $scope.abrirEditModal = function () {
            $scope.modalEditAberto = true
        }

        $scope.fecharEditModal = function () {
            $scope.modalEditAberto = false;
        }

        $scope.editTabela = function(id){
            DepartamentoService.findById({ id: id}, function(data){
                $scope.departamento = data;
                $scope.modalEditAberto = true;
            })
        }
        $scope.saveDepartamentoEdit = function(){
            let departamentoData = angular.copy($scope.departamento);
            DepartamentoService.update({ id: departamentoData.id}, departamentoData, function(){
                $scope.fecharEditModal();
                $scope.findAll();
            })
        }

        const departamentoSave = $resource("https://sistema-backend-2-1.onrender.com/api/departamento/save");
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

        const departamentoFindAll = $resource("https://sistema-backend-2-1.onrender.com/api/departamento/findAll");
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

        const departamentoDeleteById = $resource("https://sistema-backend-2-1.onrender.com/api/departamento/delete/:id");
        $scope.delete = function (id) {
            departamentoDeleteById.delete({ id: id }, function () {
                $scope.findAll();
            });
        };

    });