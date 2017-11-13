myApp.controller('SongCreation', function (ModuleCreation) {
    console.log('in songCreation.controller!');

    const vm = this;

    vm.songTitle = ModuleCreation.songTitle;
    vm.songAlbum = ModuleCreation.songAlbum;
    vm.songArtist = ModuleCreation.songArtist;
    vm.songYear = ModuleCreation.songYear;
    vm.songURL = ModuleCreation.songURL;
    vm.songDesc = ModuleCreation.songDesc;
    vm.songLyrics = ModuleCreation.songLyrics;
    vm.songArt = ModuleCreation.songArt;

    vm.makeSong = ModuleCreation.makeSong;
});