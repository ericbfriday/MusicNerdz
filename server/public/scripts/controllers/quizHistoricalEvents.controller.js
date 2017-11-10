myApp.controller('EventCreation', function (ModuleCreation, $timeout, $q, $log) {
    console.log('in quizHistoricalEvents.controller!');

    const vm = this;
    /** main variables below -> excludes chips */
    vm.year = ModuleCreation.year.data;
    vm.title = ModuleCreation.title.data;
    vm.desc = ModuleCreation.desc.data;
    vm.existingHistoricalEventTags = ModuleCreation.existingHistoricalEventTags;
    vm.hTags = ModuleCreation.hTags.data;
    vm.getHistoricalInfo = ModuleCreation.getHistoricalInfo;
    vm.makeEvent = ModuleCreation.makeEvent;
    /** Chips variables below */
    vm.selectedItem = ModuleCreation.selectedItem;
    vm.searchText = ModuleCreation.searchText;
    vm.chipsQuerySearch = ModuleCreation.chipsQuerySearch;
    vm.loadTags = ModuleCreation.loadTags;
    vm.requireMatch = ModuleCreation.requireMatch;
    vm.transformChip = ModuleCreation.transformChip;
    vm.tags = ModuleCreation.tags;

    /** COPY PASTA BELOW */
    vm.simulateQuery = false;
    vm.isDisabled = false;

    // list of `state` value/display objects
    vm.states = loadAll();
    vm.eventQuerySearch = eventQuerySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.searchTextChange = searchTextChange;
    vm.searchEventText = null;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function eventQuerySearch(query) {
        var results = query ? vm.states.filter(createFilterFor(query)) : vm.states,
            deferred;
        if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(results);
            }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
        var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

        return allStates.split(/, +/g).map(function (state) {
            return {
                value: state.toLowerCase(),
                display: state
            };
        });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };

    }
});