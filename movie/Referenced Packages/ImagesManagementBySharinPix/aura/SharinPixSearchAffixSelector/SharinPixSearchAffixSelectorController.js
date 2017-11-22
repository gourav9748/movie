({
    doInit : function(cmp, event, helper) {
        var action = cmp.get("c.getAffixes");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                var allAffixes = response.getReturnValue();
                cmp.set('v.allAffixes', allAffixes);
                var affixes = [];
                allAffixes.forEach(function(affix) {
                    affix.checked && affixes.push(affix.value);
                });
                cmp.set('v.affixes', JSON.stringify(affixes));
            } else if (cmp.isValid() && state === "ERROR") {
                var errors = response.getError();
                helper.showToast('', $A.get('$Label.sharinpix.ErrorSeeConsole'));
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
    handleChecked : function(cmp, event, helper) {
        var allAffixes = cmp.get('v.allAffixes') || [];
        var selectedAffixes = allAffixes
            .filter(function(affix) { return affix.checked; })
            .map(function(affix) { return affix.value; });
        cmp.set('v.affixes', JSON.stringify(selectedAffixes));
    }
})