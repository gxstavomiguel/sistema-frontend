angular.module('meuSite')
    .controller('controllerLoginRegister', function ($scope, DepartamentoService, $resource, $location, UsuarioService, $rootScope) {
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
})