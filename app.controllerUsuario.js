angular.module('meuSite')
    .controller('controllerLoginRegister', function ($scope, DepartamentoService, $resource, $location, UsuarioService, $rootScope) {
        const rota = "http://127.0.0.1:8080/api/usuario/";

        $scope.departamentos = [];
        $scope.usuarios = [];

        DepartamentoService.query().$promise.then(function (response) {
            $scope.departamentos = response;
        })

        $scope.limparCampos = function () {
            $scope.filtrarNome = '';
            $scope.filtrarEmail = '';
        };

        $scope.findAll = function () {
            UsuarioService.get((data) => {
                $scope.usuarios = data.usuarios;
            })
        }
        $scope.findAll()


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

        $scope.modalAberto = false;
        $scope.abrirModal = function () {
            $scope.usuario = {
                nome: '',
                email: '',
                senha: '',
                telefone: '',
                cargo: '',
                tipo: '',
                departamento: '',
            };
            $scope.modalAberto = true
        }

        $scope.fecharModal = function () {
            $scope.modalAberto = false;
        }

        $scope.modalEditAberto = false;
        $scope.abrirEditModal = function () {
            $scope.modalEditAberto = true
        }

        $scope.fecharEditModal = function () {
            $scope.modalEditAberto = false;
        }

        $scope.saveUsuarioModal = () => {
            let usuarioData = angular.copy($scope.usuario);
            usuarioData.departamento = { id: usuarioData.departamento }
            usuarioSave.save(usuarioData, function (data) {
                $scope.usuario = {
                    nome: '',
                    email: '',
                    senha: '',
                    telefone: '',
                    cargo: '',
                    tipo: '',
                    departamento: '',
                };
                $scope.findAll()
                $scope.fecharModal();
            })
        }

        $scope.login = () => {
            UsuarioService.get((data) => {
                if (data && data.usuarios) {
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

        const usuarioDeleteById = $resource(`${rota}delete/:id`);
        $scope.delete = function (id) {
            usuarioDeleteById.delete({ id: id }, function () {
                $scope.findAll();
            });
        };

        const usuarioEditById = $resource(`${rota}update/:id`);
        $scope.editTabela = function(id){
            UsuarioService.findById({ id: id}, function(data){
                $scope.usuario = data;
                $scope.modalEditAberto = true;
            })
        }
        $scope.saveUsuarioEdit = function(){
            let usuarioData = angular.copy($scope.usuario);
            if (usuarioData.departamento) {
                usuarioData.departamento = { id: usuarioData.departamento.id }; 
            }

            UsuarioService.update({ id: usuarioData.id}, usuarioData, function(){
                $scope.fecharEditModal();
                $scope.findAll();
            })
        }
    })