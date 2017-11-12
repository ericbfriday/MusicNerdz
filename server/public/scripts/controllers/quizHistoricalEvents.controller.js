myApp.controller('EventCreation', function (ModuleCreation) {
    console.log('in quizHistoricalEvents.controller!');

    const vm = this;
    /** main variables below -> excludes chips & event association code */
    vm.year = ModuleCreation.year.data;
    vm.title = ModuleCreation.title.data;
    vm.desc = ModuleCreation.desc.data;
    vm.existingHistoricalEventTags = ModuleCreation.existingHistoricalEventTags;
    vm.hTags = ModuleCreation.hTags.data;
    vm.getHistoricalInfo = ModuleCreation.getHistoricalInfo;
    vm.makeEvent = ModuleCreation.makeEvent;

    /** Chips variables below */
    vm.selectedItem = ModuleCreation.selectedItem.data;
    vm.searchText = ModuleCreation.searchText.data;
    vm.chipsQuerySearch = ModuleCreation.chipsQuerySearch;
    vm.loadTags = ModuleCreation.loadTags;
    vm.requireMatch = ModuleCreation.requireMatch;
    vm.transformChip = ModuleCreation.transformChip;
    vm.tags = ModuleCreation.tags;

    /** Associating events to module code is below */
    vm.simulateQuery = false;
    vm.isDisabled = false;
    vm.eventQuerySearch = ModuleCreation.eventQuerySearch;
    vm.selectedEventChange = ModuleCreation.selectedEventChange;
    vm.selectedEvent = ModuleCreation.selectedEvent.data;
    vm.searchEventTextChange = ModuleCreation.searchEventTextChange;
    vm.searchEventText = ModuleCreation.searchEventText.data;
    vm.eventList = ModuleCreation.eventList.data;
    vm.loadEvents = ModuleCreation.loadEvents;
    vm.getEvents = ModuleCreation.getEvents;
    vm.associateEvent = ModuleCreation.associateEvent;
    vm.finishEvents = ModuleCreation.finishEvents;
});