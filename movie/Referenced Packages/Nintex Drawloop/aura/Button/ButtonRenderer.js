({
    render: function(component, helper) {
        var ret = this.superRender();
        var disabled = component.get("v.disabled");
        if (disabled) {
            helper.toggleDisabled(component, disabled);
        }
        return ret;
    },
    rerender : function(component, helper) {
        var disabled = component.get("v.disabled");
        if (disabled != null) {
            helper.toggleDisabled(component, disabled);
        }
    }
})