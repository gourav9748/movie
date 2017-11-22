({
  setComponentAttributes : function(component, attributes) {
    for (var key in attributes) {
      component.set(key, attributes[key]);
    }
  },
  getSharinPixURL : function(component, albumId, callback) {
    var action = component.get('c.getToken');
    action.setParams({ albumId : albumId, permissionId: component.get('v.permissionId') });
    action.setCallback(this, function(response) {
      if (response.getState() === 'SUCCESS') {
        callback(null, response.getReturnValue());
      } else {
        callback(JSON.stringify(response.getError()));
      }
    });
    $A.enqueueAction(action);
  },
  execCommand: function(recordId, payload, component, event) {
    var action = component.get("c.executeCommandLightning");
    action.setParams({"albumId": recordId,
                      "jsonfile": payload});
    action.setCallback(this, function(response) {
        var state = response.getState();
        if(state === "SUCCESS"){
          // $A.get("e.force:refreshView").fire();
        }
    });
    $A.enqueueAction(action);
  },
  validateData: function(object){
    if (object.hasOwnProperty('data')){
      var data = object.data;
      if (data.hasOwnProperty('name') && data.hasOwnProperty('payload')){
        return {name: data.name, payload: data.payload};
      }
    }
    return {};
  }
})