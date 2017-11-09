myApp.service('StudentService', function ($http) {
    const sv = this;
    sv.mods = {data: []};

    //Function to modules form server
    sv.getMod = function () {
        //$http get request
        $http.get('/student/getModule').then(function (resp) {
            console.log('response:', resp);
            sv.mods = resp.data;
        }); //END $http GET
    }; //END getListings
});//END