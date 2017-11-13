myApp.controller('EventCreation', function (ModuleCreation) {
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
    vm.querySearch = ModuleCreation.querySearch;
    vm.loadTags = ModuleCreation.loadTags;
    vm.requireMatch = ModuleCreation.requireMatch;
    vm.transformChip = ModuleCreation.transformChip;
    vm.tags = ModuleCreation.tags;
});