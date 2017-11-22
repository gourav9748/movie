({
    setCustomObjectSelectOptions : function(component, customObjects) {
        var optionsArray = [];
        optionsArray.push({
            text: '',
            label: 'Select a custom object'
        });
        for (var i = Object.keys(customObjects).length - 1; i > -1; i--) {
            var customObjectKey = Object.keys(customObjects)[i];
            optionsArray.push({
                text: customObjectKey,
                label: customObjects[customObjectKey]
            });
        }
        
        component.set("v.customObjectSelectOptions", optionsArray);
        $A.util.removeClass(component.find('customObjectRow'), 'rowHidden');
    },
    updateObjectGroups : function(component) {
        var allGroups = component.get("v.allObjectGroups");
        var filteredGroups = this.filterObjectGroups(component, allGroups);

        var selectedCount = 0;
        var checkedExist = false;
        var uncheckedExist = false;
        for (var i = filteredGroups.length - 1; i > -1; i--) {
            var group = filteredGroups[i];
			
            if (group.isGroup) {
                if (checkedExist) {
                    group.enabled = true;
                    if (uncheckedExist) {
                        group.tristate = true;
                    }
                }
                checkedExist = false;
                uncheckedExist = false;
            } else {
                if (group.enabled) {
                    checkedExist = true;
                } else {
                    uncheckedExist = true;
                }
            } 
            
            selectedCount += ((!group.isGroup && group.enabled) ? 1 : 0);
        }        
        
        component.set("v.objectGroups", filteredGroups);
        component.set("v.enabledCount", selectedCount > 0 ? ' (' + selectedCount + ')' : '');
        
        var noRecordRow = component.find("noRecordRow");
        if (filteredGroups.length === 0) {
            var spinner = noRecordRow.getElement().getElementsByTagName('div')[0];
            if (spinner) {
				spinner.remove();
            }
            noRecordRow.getElement().getElementsByTagName('span')[0].innerHTML = 'There are no records to display.';
			$A.util.removeClass(noRecordRow, "rowHidden");
        } else {
            $A.util.addClass(noRecordRow, "rowHidden");
        }
    },
	getObjectGroups : function(component) {
		var action = component.get("c.getObjectGroups");
        action.setParams({
            sessionId: component.get("v.sessionId"),
            domain: component.get('v.apiUrl')
        });
        action.setCallback(this, function(response) {
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
        				component.set('v.availableCustomObjects', customObjects);
                    	this.setCustomObjectSelectOptions(component, parsedResponse.customObjects);
                    }
                }
                else {
                    this.fireErrorEvent(component, parsedResponse.errorMessage);
                }
            }
        });
        $A.enqueueAction(action);
    },
    filterObjectGroups : function(component, allGroups) {
		var searchText = component.get("v.searchText");

        var filteredGroups = {};
        for (var i in allGroups) {
            var group = allGroups[i];
            if (group.isGroup) {
                var subGroups = [group];
                filteredGroups[group.obj] = subGroups;
                continue;
            } else {
                if (searchText) {
                    var values = '';
                    var items = ['obj', 'page'];
                    for (var key in group) {
                        if (items.indexOf(key) >= 0) {
                            values += group[key];
                        }
                    }
                    var escapedSearchText = this.escapeRegExp(searchText);
                    var re = new RegExp(escapedSearchText, 'i');
                    if (!values.match(re) || values.match(re).length === 0) {
                        continue;
                    }
                }
                filteredGroups[group.obj].push(group);
            }
        }

        var groupsWithSubgroups = [];
        var fgKeys = Object.keys(filteredGroups);
        for (var j in fgKeys) {
            var filteredGroup = filteredGroups[fgKeys[j]];
            if (filteredGroup.length > 1) { // The first item is the grouping (header), not a Document Package
                groupsWithSubgroups = groupsWithSubgroups.concat(filteredGroup);
            }
        }
        return groupsWithSubgroups;
    },
    findAncestorWithName : function(el, name) {
        while((el = el.parentElement) && el.nodeName !== name);
        return el;
    },
    toggleLinkAndSpinner : function(component, showLink) {
        if (!showLink) {
            $A.util.addClass(component.find('addButtonLink'), 'hidden');
            $A.util.removeClass(component.find('addButtonSpinner'), 'hidden');
        } else {
            $A.util.addClass(component.find('addButtonSpinner'), 'hidden');
            $A.util.removeClass(component.find('addButtonLink'), 'hidden');
        }
    },
    expandGroup : function(component, selectedRow) {
        selectedRow.setAttribute('data-expanded', 'true');
        
        // Update icon
        var div = selectedRow.childNodes[0].childNodes[0];
        var divNextSibling = selectedRow.childNodes[0].childNodes[1];
        $A.util.addClass(div, 'divHidden');
        $A.util.removeClass(divNextSibling, 'divHidden');
        
        // Update rows
        var rows = component.find('row');
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i].getElement();
            if (row.getAttribute('data-is-group') === 'false' && row.id === selectedRow.id) {
                $A.util.removeClass(row, 'rowHidden');
                $A.util.addClass(row, 'slds-hint-parent');
            }
        }
    },
    retractGroup : function(component, selectedRow) {
        selectedRow.setAttribute('data-expanded', 'false');
        
        // Update icon
        var div = selectedRow.childNodes[0].childNodes[1];
        var divPreviousSibling = selectedRow.childNodes[0].childNodes[0];
        $A.util.addClass(div, 'divHidden');
        $A.util.removeClass(divPreviousSibling, 'divHidden');
        
        // Update rows
        var rows = component.find('row');
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i].getElement();
            if (row.getAttribute('data-is-group') === 'false' && row.id === selectedRow.id) {
                $A.util.addClass(row, 'rowHidden');
                $A.util.removeClass(row, 'slds-hint-parent');
            }
        }
    },
    escapeRegExp : function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	},
    fireErrorEvent : function(component, message) {
        component.getEvent('showError').setParams({
            message: message
        }).fire();
    }
})