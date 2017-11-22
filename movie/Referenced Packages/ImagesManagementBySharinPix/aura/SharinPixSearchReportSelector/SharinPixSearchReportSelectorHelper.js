({
    fillReports : function(cmp) {
        var action = cmp.get("c.getReports");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                var recvdReports = response.getReturnValue();
                var reportsFolders = [];
                for (var recvdReport in recvdReports) {
                    if (recvdReports.hasOwnProperty(recvdReport)) {
                        reportsFolders.push({
                            name: recvdReport,
                            reports: recvdReports[recvdReport]
                        });
                    }
                }
                cmp.set('v.reportsFolders', reportsFolders);
            } else if (cmp.isValid() && state === "ERROR") {
                var errors = response.getError();
                this.showToast('', $A.get('$Label.sharinpix.ErrorSeeConsole'));
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
    toCaseSafeId : function(id) {
        var idParts = id.match(/(.{5})(.{5})(.{5})/);
        var base36 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
        var output = [];
        var outer, inner, subparts, buffer;

        for(outer = 1; outer <= 3; outer++) {
            subparts = idParts[outer].split('');
            buffer = 0;
            for(inner = 4; inner >= 0; inner--) {
                buffer = (buffer << 1) | (subparts[inner].match(/[A-Z]/) ? 1 : 0);
            }
            output.push(base36[buffer]);
        }
        return id + output.join('');
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