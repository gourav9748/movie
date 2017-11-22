({
    getAllTags : function(cmp, callback) {
        this.toggleSpinner(cmp, true);
        var action = cmp.get("c.getAllTags");
        action.setCallback(this, function(response) {
            this.toggleSpinner(cmp, false);
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                callback(response.getReturnValue());
            } else if (cmp.isValid() && state === "ERROR") {
                var errors = response.getError();
                this.showToast('Error', $A.get('$Label.sharinpix.ErrorSeeConsole'));
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    toggleSpinner : function(cmp, value) {
        var spinner = cmp.find('ltngSpinner');
        value = (value == null) ? $A.util.hasClass(spinner, 'slds-hide') : value;
        if (value) {
            $A.util.removeClass(spinner, "slds-hide");
        } else {
            $A.util.addClass(spinner, "slds-hide");
        }
    },
    showToast : function(title, message, type, mode) {
        var toastEvent = $A.get("e.force:showToast");
        if (!$A.util.isEmpty(toastEvent)) {
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type || "other",
                "mode": mode || "dismissible"
            });
            toastEvent.fire();
        } else {
            alert(title + ': ' + message);
        }
    }
})