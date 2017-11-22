({
    toggleOAuthButtons : function(component) {
        if (component.get('v.connectedAppsEnabled')) {
            $A.util.addClass(component.find('enabledButton'), 'slds-button--brand');
            $A.util.removeClass(component.find('disabledButton'), 'slds-button--brand');
        } else {
            $A.util.addClass(component.find('disabledButton'), 'slds-button--brand');
            $A.util.removeClass(component.find('enabledButton'), 'slds-button--brand');
        }
    }
})