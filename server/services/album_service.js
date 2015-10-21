var albumController = require('../controllers/album_controller');
module.exports = function(router) {
    router.post('/upload', albumController.uploadPhoto);
    router.delete('/uploaded/files/:name', albumController.deletePhoto);
    router.get('/uploaded/files/:file', albumController.getPhoto1);
    router.get('/uploaded/files/thumbnail/:file', albumController.getThumbnail1);
    router.get('/albums', albumController.getAlbums);
    router.get('/albums/year', albumController.getAlbumYear);
    router.get('/albums/month/:year', albumController.getAlbumMonthsByYear);
    router.get('/albums/:year/:month', albumController.getAlbumsByYearAndMonth);
    router.get('/photos/:year/:month/:folderName', albumController.getPhotos);
    router.get('/photo/file/:year/:month/:folderName/:name', albumController.getPhoto2);
    router.get('/photo/thumbnail/:year/:month/:folderName/:name', albumController.getThumbnail2);
};
