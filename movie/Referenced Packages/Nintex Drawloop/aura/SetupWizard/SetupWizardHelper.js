({
	updateContent : function(component) {
        var step = component.get("v.step");
        var stepTitle = '';
        var stepDescription = '';

        switch (step) {
            case "Edition":
                stepTitle = step;
                stepDescription = '';
                component.set("v.skipButtonLabel", "Skip");
                component.set("v.saveButtonLabel", "Save & Next");
                component.set("v.helpLink", "http://help.nintex.com/en-us/docgen/docservices/Default.htm#cshid=9013");
                break;
            case "Users":
                stepTitle = 'User Permissions and Licensing';
                stepDescription = 'Identify users in your organization who can use the app and set their permission level. Administrators have access to the Drawloop Admin tab, and can create and run Document Packages. Users only have permission to run Document Packages.';
                component.set("v.skipButtonLabel", "Skip");
                component.set("v.saveButtonLabel", "Save & Next");
                component.set("v.helpLink", "http://help.nintex.com/en-us/docgen/docservices/Default.htm#cshid=9010");
                break;
            case "Authorize":
                stepTitle = "Authorize Nintex Drawloop";
                stepDescription = '';
                component.set("v.skipButtonLabel", "Skip this and Integration Steps");
                component.set("v.saveButtonLabel", "");
                component.set("v.helpLink", "http://help.nintex.com/en-us/docgen/docservices/Default.htm#cshid=9008");
                break;
            case "Integrations":
                stepTitle = 'Third-party Integrations';
                stepDescription = 'Integrate the app with our third-party partner applications. Select a service and fill out the required fields.';
                component.set("v.skipButtonLabel", "Next");
                component.set("v.saveButtonLabel", "");
                component.set("v.helpLink", "http://help.nintex.com/en-us/docgen/docservices/Default.htm#cshid=9014");
                break;
            case "Settings":
                stepTitle = step;
                stepDescription = '';
                component.set("v.skipButtonLabel", "Skip");
                component.set("v.saveButtonLabel", "Save & Next");
                break;
            case "Sample Document Packages":
                stepTitle = 'Sample Document Packages';
                stepDescription = '';
                component.set("v.skipButtonLabel", "Skip");
                component.set("v.saveButtonLabel", "Save & Next");
                component.set("v.helpLink", "http://help.nintex.com/en-us/docgen/docservices/Default.htm#cshid=9011");
                break;
            case "Basic Buttons":
                stepTitle = 'Basic Buttons';
                stepDescription = '';
                component.set("v.skipButtonLabel", "Skip");
                component.set("v.saveButtonLabel", "Save & Complete");
                if (!component.get('v.customizeApplication')) {
                    component.set('v.ready', false);
                }
                component.set("v.helpLink", "http://help.nintex.com/en-us/docgen/docservices/Default.htm#cshid=9009");
                break;
            default:
                break;
        }

        component.set("v.stepTitle", stepTitle);
        component.set("v.stepDescription", stepDescription);
    },
    moveToNextStep : function(component, event, helper) {
        var steps = component.get("v.steps");
        var nextStep = steps[steps.indexOf(component.get("v.step")) + 1];
        if (nextStep) {
	        component.set("v.busy", false);
            component.set("v.step", nextStep);
	        helper.updateContent(component);
        } else {
            var action = component.get("c.completeSetupWizard");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state !== "SUCCESS" || response.getReturnValue() !== "true") {
                    component.getEvent('showError').setParams({
                        message: 'An unexpected error has occurred.'
                    }).fire();
                } else {
                    // Go to End Page
			        component.set("v.busy", false);
		            component.set("v.step", '');
                    helper.updateContent(component);
                    component.set('v.complete', true);
		            component.set('v.alertType', 'success');
		            component.set('v.alertText', 'You deployed Nintex Drawloop!');
                }
            });
            $A.enqueueAction(action);
        }
    }
})