({
    capitaliseLetters : function(component, event, helper) {
        var locrec = component.get("v.locationRec");
        locrec.locationName = locrec.locationName.toUpperCase();
        component.set("v.locationRec", locrec);
    },/*
    addLocationToEvent: function(component, event, helper) {
        var locationname = event.getSource().get("v.value");
        var locationrec = {};
        locationrec.locationName = locationname;
        locationrec.surfaceList = {};
        locationrec.conditions = {};
        component.set("v.locationRec", locationrec);
        var configlocationrec = component.get("v.locationRec");
        var evt = $A.get("e.c:CP_LocationAddEvent");
        evt.setParams({
            LocationName: configlocationrec
        });
        evt.fire();
    },*/
    addsurfaceFromEvent: function(component, event, helper) {
        var surfaceRec = event.getParam("surfaceName");
        var parentLocRec = event.getParam("locationName");
        var addEvent =event.getParam("addOrRemove");
        var surfacelist = parentLocRec.surfaceList;
        if (parentLocRec == component.get("v.locationRec")) {
            var newsurfaceFlag = false;
            var samesurfaceFlag = false;
            var emptySurfaceFlag = false;
            var listlenth;
            if(typeof(surfacelist.length) == 'undefined') {
            	emptySurfaceFlag= true;
            }else{
                listlenth = surfacelist.length;
                var locrec = JSON.stringify(component.get("v.locationRec"));
                for (var i = 0; i <= listlenth; i++) {
                    if (typeof(surfacelist[i]) == 'undefined') {
                        newsurfaceFlag = true;
                    }else if (surfacelist[i].surfaceName == surfaceRec.surfaceName) {
                        if(addEvent){
                            samesurfaceFlag = true;
                            surfacelist[i]=surfaceRec;
                        }else if(!addEvent){
                            surfacelist.splice(i,1);
                        }
                        component.set("v.surfaceList", surfacelist);
                        break;
                    }else if (i == listlenth) {
                        newsurfaceFlag = true;
                    }
                }
                
            }
            if(emptySurfaceFlag){
                surfacelist = [];
                surfacelist.push(surfaceRec);
            }
            if (newsurfaceFlag) {            
            	surfacelist.push(surfaceRec);
            }
            var locationrec = component.get("v.locationRec");
            locationrec.surfaceList = surfacelist;
            component.set("v.locationRec", locationrec);
            console.log('updated location List --' + JSON.stringify(component.get("v.locationRec")));
            
            var evt = $A.get("e.c:CP_LocationAddEvent");
            evt.setParams({
                LocationName: locationrec
            });
            evt.fire();
            
        }
    }
})