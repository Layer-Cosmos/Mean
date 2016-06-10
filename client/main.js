var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) 
{
  $routeProvider
      .when('/', {
      templateUrl: 'partials/articles.html',
      controller: 'homeController',
      access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: false}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/administration', {
      templateUrl: 'partials/administration.html',
      controller: 'adminController',
      access: {restricted: false}
    })
    .when('/articles', {
      templateUrl: 'partials/articles.html',
      controller: 'homeController',
      access: {restricted: false}
    })
    .when('/articles/:id', {
      templateUrl: 'partials/article.html',
      controller: 'articleController',
      access: {restricted: false}
    })
    .otherwise({
      redirectTo: '/'
    });
});

myApp.run(function ($rootScope, $location, $route, AuthService) 
{
  $rootScope.$on('$routeChangeStart',
    function (event, next)
    {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn())
        {
          $location.path('/login');
          $route.reload();
        }
      });
  });
});