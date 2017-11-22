({
    init : function(component, event, helper) {
        helper.updateContent(component);
        
        var complete = component.get('v.complete');
        var action = component.get('c.getInitialData');
        action.setParams({
            domain: component.get("v.loopUrl")
        });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    component.set('v.isAuthorized', parsedResponse.isAuthorized);
                    component.set('v.oAuthUrl', parsedResponse.oAuthUrl);
                    if (!parsedResponse.customizeApplication) {
                        component.set('v.alertText', 'You need the Customize Application permission to complete the setup and start generating documents. Contact your system administrator, or continue and complete steps that require this permission later.');
                        component.set('v.customizeApplication', false);
                    }
                }
                else {
                    component.getEvent('showError').setParams({
                        message: parsedResponse.errorMessage
                    }).fire();
                    
                    component.set('v.customizeApplication', false);
                }
            }
            else {
                component.getEvent('showError').setParams({
                    message: 'An unexpected error has occurred. Please contact Drawloop Support if this error persists.'
                }).fire();
                
                component.set('v.customizeApplication', false);
            }
        });
        $A.enqueueAction(action);
        
        var fetchServices = component.get('c.fetchServices');
        fetchServices.setParams({
            passedSessionId: component.get('v.sessionId'),
            location: '',
            domain: component.get('v.loopUrl')
        });
        fetchServices.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                var parsedResponse = JSON.parse(response.getReturnValue());
                component.set('v.services', parsedResponse);
                component.set('v.connectedAppsEnabled', parsedResponse.connectedAppsEnabled);
            }
            
            component.set('v.isLoading', false);
        });
        $A.enqueueAction(fetchServices);
    },
    save : function(component, event, helper) {
        component.set('v.isLoading', true);
        component.set('v.ready', false);

        switch (component.get('v.step')) {
            case 'Splash':
                helper.moveToNextStep(component, event, helper);
                break;
            case 'Edition':
                component.set('v.busy', true);
                component.find('edition').save();
                break;
            case 'Users':
                component.set('v.busy', true);
                component.find('setupUsers').save();
                break;
            case 'Authorize':
                helper.moveToNextStep(component, event, helper);
                break;
            case 'Integrations':
                helper.moveToNextStep(component, event, helper);
                break;
            case 'Settings':
                component.set('v.busy', true);
                component.find('settings').save();
                break;
            case 'Sample Document Packages':
                component.set('v.busy', true);
                component.find('sampleDdps').save();
                break;
            case 'Basic Buttons':
                component.set('v.busy', true);
                component.find('pageLayouts').save();
                break;
            default:
                break;
        }
    },
    moveToNextStep : function(component, event, helper) {
        component.set('v.isLoading', true);
        component.set('v.ready', false);
        
        if (event.getParam('success')) {
            helper.moveToNextStep(component, event, helper);
        } else {
            component.set('v.busy', false);
        }
    },
    skipStep : function(component, event, helper) {
        component.set('v.isLoading', true);
        component.set('v.ready', false);
        
        var text = event.target.textContent;
        if (text === 'Skip Wizard') {
            var action = component.get('c.completeSetupWizard');
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state !== 'SUCCESS' || response.getReturnValue() !== 'true') {
                    component.getEvent('showError').setParams({
                        message: 'An unexpected error has occurred.'
                    }).fire();
                } else {
                    window.location.reload();
                }
            });
            $A.enqueueAction(action);
        } else if (component.get('v.step') === 'Basic Buttons') {
            helper.moveToNextStep(component, event, helper);
        } else {
            var stepsToSkip = 1;
            var steps = component.get('v.steps');
            if (component.get('v.step') === 'Authorize') {
                stepsToSkip = 2;
            }
            var nextStep = steps[steps.indexOf(component.get('v.step')) + stepsToSkip];
            component.set('v.step', nextStep);
            helper.updateContent(component);
        }
    },
    changeStep : function(component, event, helper) {
        component.set('v.isLoading', true);
        component.set('v.ready', false);
        
        var step = event.getParam('path');
        component.set('v.step', step);
        helper.updateContent(component);
        component.set('v.complete', false);
    },
    setSampleObjects : function(component, event, helper) {
        if (event.getParam('sampleType') === 'sampleDdps') {
            component.set('v.sampleDdpObjects', event.getParam('objectTypes'));
        } else if (event.getParam('sampleType') === 'layoutButtons') {
            component.set('v.layoutButtonObjects', event.getParam('objectTypes'));
        }
    },
    showError : function(component, event, helper) {
        component.set('v.isLoading', false);
        
        var errorPrompt = component.find('errorPrompt');
        var title = event.getParam('title');
        var message = event.getParam('message');
        errorPrompt.showError(title, message);
    },
    updateIsStandard : function(component, event) {
        component.set("v.isStandard", event.getParam('isStandard'));
    },
    handleActionEvent : function(component, event, helper) {
        var action = event.getParam('action');
        var serializedParams = event.getParam('params');
        
        switch (action) {
            case 'isLoading':
                component.set('v.isLoading', true);
                component.set('v.ready', false);
                break;
            case 'doneLoading':
                component.set('v.isLoading', false);
                if (serializedParams) {
                    var params = JSON.parse(serializedParams);
                    if (params.isAuthorized != null) {
                        component.set('v.ready', params.isAuthorized);
                    }
                } else {
                    component.set('v.ready', true);
                }
                break;
            case 'authorized':
                component.set('v.ready', true);
                component.set('v.isAuthorized', true);
                break;
            case 'connectedAppsChanged':
                if (serializedParams) {
                    var params = JSON.parse(serializedParams);
                    component.set('v.connectedAppsEnabled', params.connectedAppsEnabled);
                }
                break;
            default:
                break;
        }
    }
})