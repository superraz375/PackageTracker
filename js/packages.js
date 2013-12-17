
function PackageCtrl($scope,$http) {

    $scope.packagesLoaded = false;

    $scope.package =
    {
        product_name:'',
        status: 'PROCESSING',
        tracking_number: '',
        estimated_arrival_date: '',
        order_date: moment().format('YYYY-MM-DD'),
        link: '',
        price: '',
        isEditing: false
    };

    $scope.packages = [];


    $http.get('api/index.php/packages').success(function(data) {

        $scope.packagesLoaded = true;

        data.forEach(function(package) {
            package.isEditing = false;

            if(package.order_date != null) {
                package.order_date = moment(package.order_date).format('YYYY-MM-DD');
            }

            if (package.estimated_arrival_date != null) {
                package.estimated_arrival_date = moment(package.estimated_arrival_date).format('YYYY-MM-DD');
            }

            if (package.price != null) {
                package.price = parseFloat(package.price);
            }

            $scope.packages.push(package);
        });
    });



    $scope.removePackage = function(index) {
        $scope.packages.splice(index, 1);
    };

    $scope.resetPackage = function() {
        $scope.package =
        {
            name:'',
            status: 'PROCESSING',
            tracking_number: '',
            estimated_arrival_date: '',
            order_date: '',
            link: '',
            price: '',
            isEditing: false
        };

    };

    $scope.markAsArrived = function(index) {
        var package = $scope.packages[index];
        package.status = 'ARRIVED';
    };

    $scope.editPackage = function(index) {
        var package = $scope.packages[index];
        package.isEditing = true;
    };

    $scope.savePackage = function(index) {
        var package = $scope.packages[index];
        package.isEditing = false;
    };

    $scope.addPackage = function() {
        $scope.packages.push($scope.package);

        if ($scope.package.estimated_arrival_date == '') {
            $scope.package.estimated_arrival_date = null;
        }

        if ($scope.package.order_date == '') {
            $scope.package.order_date = null;
        }

        console.log($scope.package.price);

        if ($scope.package.price == '') {
            $scope.package.price = null;
        }

        console.log($scope.package);

        $http({
            url: 'api/index.php/packages',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: $scope.package
        }).success(function () {
                console.log('success');
            });

        $scope.resetPackage();
    };

    $scope.numberOfDays = function(index) {
        var package = $scope.packages[index];
        var startDate = moment(package.order_date);
        var endDate = moment(package.estimated_arrival_date);

        return moment.duration(endDate.diff(startDate)).asDays();
    };



}