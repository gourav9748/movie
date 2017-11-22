({
  doInit : function(component, event, helper) {
    component.reload();
    if (window && (window.addEventListener !== null)) {
        window.addEventListener('message', $A.getCallback( function(postMessageEvent) {
          if (postMessageEvent.origin !== 'https://app.sharinpix.com'){
            return;
          }
          if (postMessageEvent && component.isValid() ){
            switch(postMessageEvent.data.name) {
              case 'viewer-image-viewed':
                component.set('v.fullscreen', true);
                break;
              case 'viewer-closed':
                component.set('v.fullscreen', false);
                break;
              case 'tag-image-new':
                if (component.get('v.enableAction')===true){
                  var albumId = component.get('v.AlbumId') || component.get('v.recordId');
                  if (albumId === postMessageEvent.data.payload.tag_image.image.album_id) {
                    helper.execCommand(albumId, JSON.stringify(postMessageEvent.data.payload.tag_image), component, event);
                  }
                }
                break;
              default:
                console.log('Unhandled event:', postMessageEvent.data.name);
            }
            var obj = helper.validateData(postMessageEvent);
            var eventSharinPix = $A.get('e.sharinpix:Event');
            eventSharinPix.setParams({
              'name' : obj.name,
              'payload': obj.payload,
              'albumId': component.get('v.AlbumId')
            });
            eventSharinPix.fire();
          }
        })
      );
    }
  },
  onLoaded : function(component) {
    component.set('v.loading', false);
  },
  doReload : function(component, event, helper) {
    var albumId = component.get('v.AlbumId') || component.get('v.recordId');
    if (albumId == null) {
      helper.setComponentAttributes(component, { 'v.loading': true, 'v.url': null, 'v.sharinpixError': null });
      return;
    }
    helper.getSharinPixURL(component, albumId, function(err, url) {
      if (component.isValid() && url != null) {
        helper.setComponentAttributes(component, { 'v.loading': false, 'v.url': url, 'v.sharinpixError': null });
      } else {
        helper.setComponentAttributes(component, { 'v.loading': false, 'v.url': null, 'v.sharinpixError': 'SharinPix Token Error' });
      }
    });
  }
})