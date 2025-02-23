angular.module('meuSite')
    .controller('controllerChamado', function ($scope, DepartamentoService, $resource, $timeout, ChamadoService, $rootScope) {

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
                if (graficoBarraExistente instanceof Chart) {
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
                      labels: ['Aberto', 'Em andamento', 'Concluído'],
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