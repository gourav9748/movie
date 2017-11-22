({
    initializeIntegrations : function(component, event, helper) {
        // Get Integration Infos and Rows
        helper.getAvailableIntegrations(component);
        
        var action = component.get("c.fetchBoxIntegrationData");
        action.setParams({
            domain: component.get("v.loopUrl")
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.Success) {
                    component.set('v.boxOAuthUrl', parsedResponse.BoxOAuthUrl);
                }
            }
            
            var actionEvent = component.getEvent('actionEvent');
            actionEvent.setParams({
                action: 'doneLoading'
            });
            actionEvent.fire();
        });
        $A.enqueueAction(action);
    },
    saveIntegration : function(component, event, helper) {
        component.set('v.errors', []);
        if (event.getName && event.getName() === 'keyup' && event.getParam('keyCode') !== 13) {
            return true;
        }
        
        var type = component.get("v.selectedIntegration");
        if (type === "Box") {
            window.Drawloop.eventListener.addEventListener('box', function(event) {
                var payload = JSON.parse(event.data.payload);
                if (!payload.isSuccess) {
                    var errorDescription = "Error: " + payload.errorDescription.replace(/\+/g, " ");
                    component.set("v.boxError", errorDescription);
                }
                else {
                    helper.hideModal(component);
                    helper.getAvailableIntegrations(component);
                    component.find("selectedOption").set("v.value", "");
                    helper.resetFields(component);
                    component.find("integrationsList").refreshList();
                }
            });

            window.open(component.get('v.boxOAuthUrl'), "Authorize Box", "height=750,width=500,location=0,status=0,titlebar=0");
        }
        else {
            component.set("v.modalBusy", true);
            helper.validateAndUpsertIntegrations(component, event);
        }
    },
    changeSelectedOption : function(component, event, helper) {
        var selectedOptionValue = event.getSource().get("v.value");
        (selectedOptionValue === 'Box' || selectedOptionValue === 'Office 365' || selectedOptionValue === 'SMTP') ? component.set("v.saveButtonText", "Authorize") : component.set("v.saveButtonText", "Save");
        helper.updateFields(component, selectedOptionValue);
        if (selectedOptionValue === 'DocuSign') {
            var action = component.get("c.getDocuSignAccountConfiguration");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var dsObjJson = response.getReturnValue();
                    if (dsObjJson) {
                        var dsObj = JSON.parse(dsObjJson);
                        if (dsObj && dsObj[0].dsfs__UseSendOnBehalfOf__c) {
                            var ds = dsObj[0];
                            var values = {};
                            values.Name = 'DocuSign';
                            values.Loop__Type__c = 'DocuSign';
                            values.Loop__API_Key__c = ds.dsfs__AccountId__c;
                            values.Loop__Base_URL__c = ds.dsfs__DocuSignBaseURL__c;
                            helper.updateValues(component, [values]);
                        }
                    }
                }
            });
            $A.enqueueAction(action);
        }
        helper.resetValues(component);
    },
    hideModal : function(component, event, helper) {
        helper.hideModal(component);
        helper.resetFields(component);
    },
    addSitePath : function(component, event, helper) {
        var paths = component.get("v.sitePaths");
        paths.push('');
        component.set("v.sitePaths", paths);
    },
    removeSitePath : function(component, event, helper) {
        var rowContainer = event.target.closest('div.slds-grid');
        var removeIndex = event.target.closest('.slds-col--padded').id;
        var newPaths = [];
        for (var i = 0; i < rowContainer.parentNode.children.length; i++) {
            if (removeIndex && i === parseInt(removeIndex, 10)) {
                continue;
            }
            var row = rowContainer.parentNode.children[i];
            newPaths.push(row.children[1].children[0].value);
        }
        component.set("v.sitePaths", newPaths);
    },
    handleActionEvent : function(component, event, helper) {
        var action = event.getParam('action');
        
        switch (action) {
            case 'editIntegration':
                var id = event.getParam('params');
                helper.editIntegration(component, id);
                break;
            case 'deleteIntegration':
                component.find('selectedOption').set('v.value', '');
                helper.getAvailableIntegrations(component);
                break;
            case 'authorized':
                component.set('v.isAuthorized', true);
                helper.validateAndUpsertIntegrations(component, event);
                break;
            default:
                break;
        }
    }
})