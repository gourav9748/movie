({
    onInit : function(component, event, helper) {
        var sessionId = component.get("v.sessionId");
        var domain = component.get("v.apiUrl");
        
        var load = component.get("c.load");
        load.setParams({
            sessionId: sessionId,
            domain: domain
        });
        load.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    var layouts = parsedResponse.layouts;
                    component.set("v.layouts", layouts);
                    
                    var layoutMetadataMap = {};
                    for (var i = 0; i < layouts.length; i ++) {
                        var childLayouts = layouts[i].childLayouts;
                        
                        for (var j = 0; j < childLayouts.length; j ++) {
                            layoutMetadataMap[childLayouts[j].id] = childLayouts[j].metadata;
                        }
                    }
                    component.set("v.layoutMetadata", JSON.stringify(layoutMetadataMap));
                    
                    var enabledCount = 0;
                    for (var i = 0; i < parsedResponse.layouts.length; i ++) {
                        var parentLayout = parsedResponse.layouts[i];
                        var childLayouts = parentLayout.childLayouts;
                        for (var j = 0; j < childLayouts.length; j ++) {
                            if (childLayouts[j].isChecked) {
                                enabledCount ++;
                            }
                        }
                    }
                    component.set("v.enabledCount", enabledCount);
                    
                    var customObjects = parsedResponse.customObjects;
                    if (Object.keys(customObjects).length > 0) {
                        helper.setCustomObjectSelectOptions(component, customObjects);
                    }
                }
                else {
                    helper.fireErrorEvent(component, parsedResponse.errorMessage);
                }
            }
            else {
                helper.fireErrorEvent(component, 'There was a problem retrieving layout metadata.');
            }
            
            component.set("v.isTableLoading", false);
        });
        
        $A.enqueueAction(load);
    },
    toggleRow : function(component, event, helper) {
        var selectedRow = event.currentTarget;
        var allParentRows = component.get("v.layouts");
        for (var i = 0; i < allParentRows.length; i ++) {
            if (allParentRows[i].objectName === selectedRow.id) {
                allParentRows[i].isExpanded = !allParentRows[i].isExpanded;
                break;
            }
        }
        component.set("v.layouts", allParentRows);
    },
    parentCheckboxClicked : function(component, event, helper) {
        var selectedRowId = event.currentTarget.id;
        var allParentRows = component.get("v.layouts");
        var enabledCount = component.get("v.enabledCount");
        
        for (var i = 0; i < allParentRows.length; i ++) {
            if (allParentRows[i].objectName === selectedRowId) {
                allParentRows[i].isTristate = false;
                
                for (var j = 0; j < allParentRows[i].childLayouts.length; j ++) {
                    if (allParentRows[i].isChecked || allParentRows[i].isTristate) {
                        if (allParentRows[i].childLayouts[j].isChecked) {
                            enabledCount --;
                        }
                        allParentRows[i].childLayouts[j].isChecked = false;
                    }
                    else {
                        if (!allParentRows[i].childLayouts[j].isChecked) {
                            enabledCount ++;
                        }
                    	allParentRows[i].childLayouts[j].isChecked = true;
                    }
                }
                
                component.set("v.enabledCount", enabledCount);
                break;
            }
        }
    },
    childCheckboxClicked : function(component, event, helper) {
        var selectedRowId = event.currentTarget.id;
        var allParentRows = component.get("v.layouts");
        var parentId;
        
        //Since 'event.currentTarget.data-parent' is not a valid statement with LockerService activated, loop through its attributes to get the value of 'data-parent'
        for (var i = 0; i < event.currentTarget.attributes.length; i ++) {
            var attribute = event.currentTarget.attributes[i];
            if (attribute.name === 'data-parent') {
                parentId = attribute.value;
            }
        }
        
        var enabledCount = component.get("v.enabledCount");
        
        for (var i = 0; i < allParentRows.length; i ++) {
            if (allParentRows[i].objectName === parentId) {
                var childLayouts = allParentRows[i].childLayouts;
                
                //This is used to determine whether or not a parent row's checkbox is in a tristate. Is not related to 'enabledCount'.
        		var enabledChildLayouts = 0;
                
                for (var j = 0; j < childLayouts.length; j ++) {
                    if (childLayouts[j].id === selectedRowId) {
                        //ui:inputCheckbox will toggle the value of isChecked, so we don't have to change it here.
                        //If the current checkbox is currently false, then it is about to become true
                        if (!childLayouts[j].isChecked) {
                            enabledCount ++;
                            enabledChildLayouts ++;
                        }
                        else {
                            enabledCount --;
                        }
                    }
                    else if (childLayouts[j].isChecked) {
                        enabledChildLayouts ++;
                    }
                }
                
                allParentRows[i].isChecked = enabledChildLayouts > 0;
            	allParentRows[i].isTristate = allParentRows[i].isChecked && (enabledChildLayouts < childLayouts.length);
            }
        }
        
        component.set("v.enabledCount", enabledCount);
        component.set("v.layouts", allParentRows);
    },
    save : function(component, event, helper) {
        var allParentLayouts = component.get("v.layouts");
        var checkedLayoutIds = [];
        var checkedObjectTypes = [];
        
        for (var i = 0; i < allParentLayouts.length; i ++) {
            var childLayouts = allParentLayouts[i].childLayouts;
            var addObjectType = false;
            
            for (var j = 0; j < childLayouts.length; j ++) {
                if (childLayouts[j].isChecked) {
                	checkedLayoutIds.push(childLayouts[j].id);
                    addObjectType = true;
                }
            }
            
            if (addObjectType) {
                checkedObjectTypes.push(allParentLayouts[i].objectName);
            }
        }
        
        var action = component.get("c.saveLayouts");
        action.setParams({
            sessionId: component.get("v.sessionId"),
            checkedLayoutIds: checkedLayoutIds,
            layoutMetadataJson: component.get("v.layoutMetadata"),
            domain: component.get('v.apiUrl')
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue())
                if (parsedResponse.isSuccess) {
                    var setSampleObjectsEvent = component.getEvent('setSampleObjects');
                    component.set("v.layoutMetadata", JSON.stringify(parsedResponse.newLayoutMetadata));
                    
                    setSampleObjectsEvent.setParams({
                        sampleType: 'layoutButtons',
                        objectTypes: checkedObjectTypes
                    });
                    setSampleObjectsEvent.fire();
                    
        			var moveToNextStep = component.getEvent("moveToNextStep");
                    moveToNextStep.setParams({success: true}).fire();
                }
                else {
                    helper.fireErrorEvent(component, parsedResponse.errorMessage);
                    var moveToNextStep = component.getEvent("moveToNextStep");
                    moveToNextStep.setParams().fire();
                }
            }
            else {
                helper.fireErrorEvent(component, 'There was a problem modifying layouts.');
                var moveToNextStep = component.getEvent("moveToNextStep");
                moveToNextStep.setParams().fire();
            }
        });
        
        $A.enqueueAction(action);
    },
    createButton : function(component, event, helper) {
        var objectType = component.find('customObjectSelect').get('v.value');
        if (objectType) {
        	helper.toggleLinkAndSpinner(component, false);
            
            var action = component.get("c.createWeblink");
            action.setParams({
                sessionId: component.get("v.sessionId"),
                objectType: objectType,
                domain: component.get('v.apiUrl')
            });
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    var parsedResponse = JSON.parse(response.getReturnValue());
                    if (parsedResponse.isSuccess) {
                        // re-fetch groups to get updates and rerender
                        helper.getObjectGroups(component);
                    }
                    else {
                    	helper.fireErrorEvent(component, parsedResponse.errorMessage);
                    }
                }
                else {
                    helper.fireErrorEvent(component, 'There was a problem creating this button.');
                }
            });
            $A.enqueueAction(action);
        } else {
            helper.fireErrorEvent(component, 'This object type could not be found.');
        }
    },
    filterObjects : function(component, event, helper) {
        var searchText = event.getParam('arguments').searchText;
        component.set('v.searchText', searchText);
        helper.updateObjectGroups(component);
    }
})