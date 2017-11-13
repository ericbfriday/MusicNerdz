myApp.controller('ResourcesController', function(ModuleCreation) {
    console.log('ResourcesController sourced!');
    const vm = this;

    vm.resourceType = ModuleCreation.resourceType.data;
    vm.vTitle = ModuleCreation.vTitle.data;
    vm.vURL = ModuleCreation.vURL.data;
    vm.vDesc =  ModuleCreation.vDesc.data;
    vm.naTitle = ModuleCreation.naTitle.data;
    vm.naURL = ModuleCreation.naURL.data;
    vm.naDesc =  ModuleCreation.naDesc.data;
    vm.bpTitle = ModuleCreation.bpTitle.data;
    vm.bpURL = ModuleCreation.bpURL.data;
    vm.bpDesc =  ModuleCreation.bpDesc.data;
    vm.oTitle = ModuleCreation.oTitle.data;
    vm.oURL = ModuleCreation.oURL.data;
    vm.oDesc =  ModuleCreation.oDesc.data;

    vm.pushV = ModuleCreation.pushV;
    vm.pushNA = ModuleCreation.pushNA;
    vm.pushBP = ModuleCreation.pushBP;
    vm.pushO = ModuleCreation.pushO;
    vm.pushResources = ModuleCreation.pushResources;
});