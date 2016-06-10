angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService, $route) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)

        // handle success
        .then(function () {
          console.log($scope.loginForm.username);
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
          $route.reload();
        })
        // handle error
        .catch(function () {
          console.log($scope.loginForm.username);
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
        //console.log($scope.loginForm.username);
    };
}]);

angular.module('myApp').controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService, $route) {

    $scope.logout = function () {
        $scope.formData = {};
        $scope = {};
      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
            $route.reload();
        });

    };

}]);

angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
          console.log($scope.registerForm.username);
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);

//var routeAppControllers = angular.module('routeAppControllers', []);


angular.module('myApp').controller('homeController', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {

        $scope.formData = {};

        // quand on arrive sur la page on affiche tous les articles
        $http.get('/user/articles')
            .success(function (data) {
                $scope.articles = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        $http.get('/user/pseudo')
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        // quand on soumet un formulaire, on envoi le text à l'API
        $scope.createArticle = function () {
            //$scope.formData.author = $scope.users.username.username;
            $scope.formData.author = $scope.users.username.username;
            console.log($scope);
            $http.post('/user/articles', $scope.formData)
                .success(function (data) {
                    //$scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        // supprime un article après vérification
        $scope.deleteArticle = function (id) {
            $http.delete('/blog/articles/' + id)
                .success(function (data) {
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
    }
]);

angular.module('myApp').controller('navController', ['$scope', 'AuthService', '$http',
    function ($scope, AuthService, $http) {

        AuthService.getUserStatus;
    $scope.isLoggedIn = AuthService.isLoggedIn
        //console.log("top");
        $http.get('/user/pseudo')
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
        //console.log($scope.isLoggedIn);

    }
]);

angular.module('myApp').controller('articleController', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams){
        $scope.formData = {};
        var id = $routeParams.id;

        // on recupere un seule article via l'id

        $http.get('/user/pseudo')
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        if(id) {
            $http.get('/user/articles/' + id)
                .success(function (data) {
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
            $http.get('/user/articles/' + id + '/comments')
                .success(function (data) {
                    $scope.comments = data;
                    console.log(data);

                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }
        $scope.createComment = function (id) {
            console.log(id);
            //console.log($scope.formData.content);
            $scope.formData.author = $scope.users.username.username;
            $http.post('/user/articles/' + id + '/comments', $scope.formData)
                .success(function (data) {
                    //$scope.formData = {};
                    $scope.comments = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
        $scope.updateArticle = function (id) {
            $http.put('/user/articles/' + id, $scope.formData)
                .success(function (data) {
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
    }
]);


angular.module('myApp').controller('adminController', ['$scope', '$http',
    function ($scope, $http) {

        $scope.formData = {};
        // quand on arrive sur la page on affiche tous les articles
        $http.get('/user/articles')
            .success(function (data) {
                $scope.articles = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        // quand on soumet un formulaire, on envoi le text à l'API
        $scope.createArticle = function () {
            $http.post('/blog/articles', $scope.formData)
                .success(function (data) {
                    //$scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
        // supprime un article après vérification
        $scope.deleteArticle = function (id) {
            $http.delete('/user/articles/' + id)
                .success(function (data) {
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
        $scope.updateArticle = function (id) {
            $http.put('/user/articles/' + id, $scope.formData)
                .success(function (data) {
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
    }
]);


/*angular.module('myApp').controller('articleController', ['$scope', '$http', '$routeParams', '$location', '$AuthService',
    function($scope, $http, $routeParams)
    {
        $scope.formData = {};
        var id = $routeParams.id;

        // on recupere un seule article via l'id
            $http.get('/articles/' + id)
                .success(function (data) {
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
            $http.get('/articles/' + id + '/comments')
                .success(function (data) {
                    $scope.comments = data;
                    console.log(data);

                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });

        $scope.createComment = function () {
            $http.post('/articles/' + id + '/comments', $scope.formData)
                .success(function (data) {
                    //$scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.comments = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

    }
]);*/

/*angular.module('myApp').controller('homeController', ['$scope', '$http', '$location', '$AuthService',
    function ($scope, $http) {

        $scope.formData = {};


        // quand on arrive sur la page on affiche tous les articles
        $http.get('/user/articles')
            .success(function (data) {
                $scope.articles = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        // quand on soumet un formulaire, on envoi le text à l'API
        $scope.createArticle = function () {
            $http.post('/articles', $scope.formData)
                .success(function (data) {
                    //$scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        // supprime un article après vérification
        $scope.deleteArticle = function (id) {
            $http.delete('/user/articles/' + id)
                .success(function (data) {
                    $scope.articles = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };
    }
]);*/