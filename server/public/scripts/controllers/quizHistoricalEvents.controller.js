myApp.controller('EventCreation', function (ModuleCreation) {
    console.log('in quizHistoricalEvents.controller!');

    const vm = this;

    vm.year = ModuleCreation.year;
    vm.dateRange = ModuleCreation.dateRange;
    vm.description = ModuleCreation.description;
    vm.existingHistoricalEvent = ModuleCreation.existingHistoricalEvent;
    vm.existingHistoricalEventTags = ModuleCreation.existingHistoricalEventTags;
    vm.historicalEvent = ModuleCreation.historicalEvent;
    vm.historicalEventTags = ModuleCreation.historicalEventTags;
    vm.getHistoricalInfo = ModuleCreation.getHistoricalInfo;

    /** copy/paste of reference code below */

    vm.selectedItem = ModuleCreation.selectedItem;
    vm.searchText = ModuleCreation.searchText;
    vm.querySearch = ModuleCreation.querySearch;
    vm.loadTags = ModuleCreation.loadTags;
    vm.selectedVegetables = ModuleCreation.selectedVegetables;
    vm.requireMatch = ModuleCreation.requireMatch;
    vm.transformChip = ModuleCreation.transformChip;
    vm.tags = ModuleCreation.tags;
});