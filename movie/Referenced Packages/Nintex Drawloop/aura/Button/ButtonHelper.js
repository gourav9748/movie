({
	toggleDisabled : function(component, disabled) {
        var componentElement = component.find("button").getElement();
        if (componentElement) {
            if (disabled) {
                componentElement.setAttribute('disabled', 'disabled');
            } else {
                componentElement.removeAttribute('disabled');
            }
        }
    }
})