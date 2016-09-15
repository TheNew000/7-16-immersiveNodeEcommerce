var app = angular.module('commerceApp', ['ngRoute', 'ngCookies']);

app.controller('mainController', function ($scope, $http, $location, $cookies) {
    var apiPath = "http://localhost:3000";

    // Register Function
    $scope.register= function(){
        if($scope.password != $scope.password2){
            alert('Your passwords do not match!');
        }else{
            $http.post(apiPath + '/register', {
                username: $scope.username,
                password: $scope.password,
                email: $scope.email
            }).then(function success(response){
                if(response.data.message == 'Added: ' + $scope.username){
                    $cookies.put('token', response.data.token);
                    $cookies.put('username', $scope.username);
                    $location.path('/options');
                }
            }, function error(response){
                console.log(response.data.message);
            });
        }
    }

    // Log In Function
    $scope.login= function(){
        $http.post(apiPath + '/login', {
            username: $scope.username,
            password: $scope.password
        }).then(function success(response){
            if(response.data.success){
                $location.path('/options');
            }else{
                alert('Please Check Your UserName and Password.  No matches found with the information provided.');
            }
        }, function error(response){
            console.log(response.data.message);
        });
    }

    $http.get(apiPath + '/getUserData?token=' + $cookies.get('token')
    ).then(function success(response){
        if(response.data.failure == 'badToken'){
            $location.path = '/login';
        }else if(response.data.failure == 'noToken'){
            $location.path = '/login';
        }else{
            $location.path = '/options';
        }
    }, function error(respone){

    });

    // Logout Function
    // $cookies.put('token', '') || $cookies.remove('token')

    // Options Controller

    $scope.optionsForm = function(formId){
        var frequency = $scope.frequency;
        var quantity = $scope.quantity;
        var grind = $scope.grindTypeThree;
    $http.post(apiUrl + 'options', {
            frequency: frequency,
            quantity: quantity,
            grind: grind,
            token: $cookies.get('token')
        }).then(function successCallback(response){
            if(response.data.success == 'updated'){
                $location.path('/delivery');
            };
        }, function errorCallback(response){
        });
    };
        $scope.frequencies = [
            'Weekly',
            'Bi-weekly',
            'Monthly'
        ];

        $scope.grinds = [
            {option: 'Extra coarse'},
            {option: 'Coarse'},
            {option: 'Medium-coarse'},
            {option: 'Medium'},
            {option: 'Medium-fine'},
            {option: 'Fine'},
            {option: 'Extra fine'}
        ];

    if(($location.path() != '/') && ($location.path() != '/register') && ($location.path() != '/login') && ($location.path() != '/about')){

        $http.get(apiUrl+'getUserData?token='+$cookies.get('token'),{
        }).then(function successCallback(response){
            if(response.data.failure == 'badToken'){
                console.log('badToken')
                $location.path('/');
            }else{  
            $scope.grind = response.data.grind;
            $scope.frequency = response.data.frequency;
            $scope.quantity = response.data.quantity;
            $scope.name = response.data.name;
            $scope.address = response.data.address;
            $scope.address2 = response.data.address2;
            $scope.city = response.data.city;
            $scope.state = response.data.state;
            $scope.zipCode = response.data.zipCode;
            $scope.deliveryDate = response.data.deliveryDate;
            $scope.total = Number(response.data.quantity) * 20;
            enableStripe($scope.total);
            }
        }, function errorCallback(response){
        });
    }

    // Delivery Controller
    $scope.deliveryDate = new Date();
    $scope.deliveryForm = function(){

        var date = new Date($scope.deliveryDate);
        var formattedDate = ((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());

        $http.post(apiUrl + 'delivery', {
            name: $scope.name,
            address: $scope.address,
            address2: $scope.address2,
            city: $scope.city,
            state: $scope.state,
            zipCode: $scope.zipCode,
            deliveryDate: formattedDate,
            token: $cookies.get('token')
        }).then(function successCallback(response){
            $location.path('/payment');
        }, function errorCallback(response){
        });
    };

$scope.addtoCart = function(idofThingClickedOn){
    var oldCart = $cookies.get('cart');
    var newCart = oldCart + ',' + idofThingClickedOn;
    $cookies.put('cart', newCart);
}

$scope.getCart = function(){
    var cart = $cookies.get('cart');
    var cartItemsArray = cart.split(',');
    for (var i = 0; i < cartItemsArray.length; i++) {
        cartItemsArray[i] // get the properties of each item
    }
}


});

// Set up routes using the routes module
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'mainController'
    }).when('/login',{
        templateUrl: 'views/login.html',
        controller: 'mainController'
    }).when('/register',{
        templateUrl: 'views/register.html',
        controller: 'mainController'
    }).when('/options',{
        templateUrl: 'views/options.html',
        controller: 'mainController'
    }).when('/delivery',{
        templateUrl: 'views/delivery.html',
        controller: 'mainController'
    }).otherwise({
        redirectTo: '/'
    });
});
