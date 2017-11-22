/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class Client {
    global String client_id {
        get;
        set;
    }
    global String client_secret {
        get;
        set;
    }
    global String endpoint_url {
        get;
        set;
    }
    global Client(String sharinpixUrl) {

    }
    global Client(String client_id, String client_secret, String endpoint_url) {

    }
    @Deprecated
    global Object addTag(String albumId, String imageId, String tagName) {
        return null;
    }
    @Deprecated
    global Object add_tag_image(String albumId, String imageId, String tagName) {
        return null;
    }
    @Deprecated
    global String add_tag_image(String a, String b) {
        return null;
    }
    @Deprecated
    global Map<String,Object> api_delete(String endpoint, Map<String,Object> claims) {
        return null;
    }
    @Deprecated
    global Map<String,Object> api_get(String endpoint, Map<String,Object> claims) {
        return null;
    }
    @Deprecated
    global Map<String,Object> api_post(String endpoint, Blob body, Map<String,Object> claims) {
        return null;
    }
    @Deprecated
    global Boolean clear_tag_image(String albumId, String imageId, List<String> tags) {
        return null;
    }
    @Deprecated
    global String croppedImageUrl(String imageId, String cropStyle, Integer width, Integer height) {
        return null;
    }
    @Deprecated
    global String delete_tag_image(String a, String b) {
        return null;
    }
    global Boolean destroy(String endpoint, Map<String,Object> claims) {
        return null;
    }
    @Deprecated
    global List<Object> getAlbumImages(String albumId) {
        return null;
    }
    global String getApiUrl() {
        return null;
    }
    global String getAppHost() {
        return null;
    }
    global String getHost() {
        return null;
    }
    @Deprecated
    global Map<String,Object> getImageDetails(String albumId, String imageId) {
        return null;
    }
    @Deprecated
    global String getImageUrl(String imageId, Map<String,Object> sharinpix, List<Object> transformations) {
        return null;
    }
    global static sharinpix.Client getInstance() {
        return null;
    }
    @Deprecated
    global List<String> getTagsOnImage(String albumId, String imageId, List<String> tags) {
        return null;
    }
    global Object get(String endpoint, Map<String,Object> claims) {
        return null;
    }
    global Object post(String endpoint, Blob body, Map<String,Object> claims) {
        return null;
    }
    global Object put(String endpoint, Blob body, Map<String,Object> claims) {
        return null;
    }
    @Deprecated
    global Boolean removeTag(String albumId, String imageId, List<String> tags) {
        return null;
    }
    @Deprecated
    global Boolean renameAlbum(String oldAlbumId, String newAlbumId) {
        return null;
    }
    global Boolean test_api() {
        return null;
    }
    global String token(Map<String,Object> claims) {
        return null;
    }
    @Deprecated
    global Object upload_attachment(Id attachmentId, String albumId) {
        return null;
    }
    @Deprecated
    global Object upload_attachment(Id attachmentId, String albumId, Map<String,Object> metadatas) {
        return null;
    }
    @Deprecated
    global String upload_attachment_to_album(Id attachmentId, String albumId) {
        return null;
    }
    global String urlEncode(String unencoded) {
        return null;
    }
}
