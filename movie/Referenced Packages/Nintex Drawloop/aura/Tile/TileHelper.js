({
    hideSlideContent : function(component) {
        var contentSections = ['checkboxContainer', 'editEmail', 'editDocuSignReminder', 'contentLibraries'];
        for (var i = 0; i < contentSections.length; i++) {
            var section = component.find(contentSections[i]);
            if (section && !section.getElement().hidden) {
                section.getElement().hidden = true;
            }
        }
    },
    //Apply 'selected' UI
    openTile : function(component) {
        var tile = component.find("tile");
        var checkBackground = component.find("check-background");
        
        $A.util.removeClass(tile, "cursor-pointer");
        $A.util.addClass(tile, "cursor-default");
        $A.util.addClass(tile, "is-selected");
        $A.util.addClass(checkBackground, "check-is-selected");

        if (component.get("v.record.AllowSubjectEmailChanges")) {
            component.find("editEmail").getElement().hidden = false;
        }
        if (component.get("v.record.AllowAttachToRecord") && !component.get("v.record.RequireAttachToRecord")) {
            component.find("checkboxContainer").getElement().hidden = false;
        }
        if (component.get("v.isUserSelectedContent")) {
            if (component.get("v.record.RequireAttachToRecord") || (component.get("v.record.AllowAttachToRecord") && component.find("attachCheckbox").getElement().checked)) {
                component.find("contentLibraries").getElement().hidden = false;
            }
        }
        
        if (component.get("v.type") === "delivery" && component.get("v.isESign")) {
            $A.util.addClass(tile, "esign-selected");
            component.set("v.showESignRecipients", true);
            
            if (component.get("v.record.ExposeExpirations")) {
                component.find("editDocuSignReminder").getElement().hidden = false;
            }
        }
        
        component.set("v.isOpen", true);
    },
    //Remove 'selected' UI
    closeTile : function(component) {
        var tile = component.find("tile");
        var checkBackground = component.find("check-background");
        
        $A.util.removeClass(tile, "cursor-default");
        $A.util.addClass(tile, "cursor-pointer");
        $A.util.removeClass(tile, "is-selected");
        $A.util.removeClass(checkBackground, "check-is-selected");
        
        this.hideSlideContent(component);
        
        if (component.get("v.record.AllowSubjectEmailChanges")) {
            component.find("editEmail").getElement().hidden = true;
        }
        if (component.get("v.isUserSelectedContent")) {
            component.find("contentLibraries").getElement().hidden = true;
        }
       
        if (component.get("v.type") === "delivery" && component.get("v.isESign")) {
            $A.util.removeClass(tile, "esign-selected");
            component.set("v.showESignRecipients", false);
        }
        
        component.set("v.isOpen", false);
    },
    toggleContentLibraryDropdown : function(component) {
        if (component.get("v.attachToRecord")) {
			component.find("contentLibraries").getElement().hidden = false;            
        } else {
            component.find("contentLibraries").getElement().hidden = true;
        }
    },
    addClickedStyle : function(component, event, helper) {
        var tile = component.find("tile");
        var checkmark = component.find("check-background");
        $A.util.addClass(tile, "is-selected");
        $A.util.addClass(checkmark, "check-is-selected");
    },
    removeClickedStyle : function(component, event, helper) {
        var tile = component.find("tile");
        var checkBackground = component.find("check-background");
        $A.util.removeClass(tile, "is-selected");
        $A.util.removeClass(checkBackground, "check-is-selected");
    }
})