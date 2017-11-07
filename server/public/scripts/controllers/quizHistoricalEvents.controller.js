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

    self.readonly = false;
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    self.vegetables = loadVegetables();
    self.selectedVegetables = [];
    self.numberChips = [];
    self.numberChips2 = [];
    self.numberBuffer = '';
    self.autocompleteDemoRequireMatch = true;
    self.transformChip = transformChip;


});