App.controller('ClientsController', ['$scope', '$routeParams', '$location', 'RedisService', 
    function ($scope, $routeParams, $location, RedisService) {
        console.log('ClientsController');
        console.log($routeParams);
        
        $scope.clients = []; 
        
        $scope.clients = {
            sort: {
                field: 'addr',
                reverse: false
            },
            result: {
                selected: [],
                items: []
            }        
        };  
        
        $scope.getServerClients = function(refresh) {
            refresh = angular.isDefined(refresh) ? refresh : false;
            
            console.log('getClients: ' + refresh);
                                    
            return RedisService.getServerClients($scope.current.serverId, refresh).then(
                function(response) {
                    $scope.clients.result.items = response.data.items;
                    $scope.clients.result.selected = [];
                    console.log($scope.clients);
                    console.log('getClients / done');
                }
            );
        }
        
        $scope.killClients = function() {
            var killClients = $scope.clients.result.selected;
            if (killClients) {
                $scope.$parent.showModalConfirm({
                    title: 'Kill client(s)?',
                    message: (killClients.length == 1 ? '1 client is' : killClients.length + ' clients are') + ' about to be killed:',
                    items: killClients,
                    warning: 'You can\'t undo this action!',
                    action: 'Kill'
                }).result.then(function() {
                    RedisService.killServerClients($scope.current.serverId, killClients).then(
                        function(response) {
                            // Refresh clients
                            $scope.getServerClients(true);
                            console.log('killClients / done');
                        }
                    );
                });
            }
        }
        
        $scope.selectItemExclusive = function(addr) {
            console.log('itemSelect: ' + addr);
       
            for (var i=0; i<$scope.clients.result.items.length; i++) {
                if ($scope.clients.result.items[i].addr == addr) {
                    // if multiple keys are selected - then select current key
                    // if only one key was selected - then inverse current state
                    // (i.e. allow to unselect current key) 
                    $scope.clients.result.items[i].selected = $scope.clients.result.selected.length == 1 ? !$scope.clients.result.items[i].selected : true;
                }
                else {
                    $scope.clients.result.items[i].selected = false;
                }
            }
        }
        
        $scope.$watch('clients.result.items', function(){
            $scope.clients.result.selected = [];
            for (var i = 0; i < $scope.clients.result.items.length; i++) {
                if ($scope.clients.result.items[i].selected) {
                    $scope.clients.result.selected.push($scope.clients.result.items[i].addr);
                }
            }
        }, true);
        
        $scope.init($routeParams.serverId, $routeParams.dbId).then(function() {
            $scope.$parent.view = {
                title: 'Clients',
                subtitle: $scope.getCurrentServer().name
            };
            
            console.log('clients');
            $scope.getServerClients();
        });        
    }
]);
