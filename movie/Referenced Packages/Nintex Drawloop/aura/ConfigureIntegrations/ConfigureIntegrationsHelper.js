({
    fireErrorEvent : function(component, message) {
        var errorEvent = component.getEvent('showError');
        errorEvent.setParams({
            message: message
        });
        errorEvent.fire();
    },
    getAvailableIntegrations : function(component) {
        var action = component.get("c.getIntegrationInfos");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var iisJson = response.getReturnValue();
                var iis = JSON.parse(iisJson);
                
                var existingTypes = [];
                for (var i in iis) {
                    existingTypes.push(iis[i].Loop__Type__c);
                }
                var singleIntegrations = ['Box', 'Drawloop API', 'DocuSign', 'e-SignLive', 'Lob'];
                var availableIntegrations = [];
                for (var j in singleIntegrations) {
                    var type = singleIntegrations[j];
                    if (existingTypes.indexOf(type) < 0) {
                        availableIntegrations.push(type);
                    }
                }
                availableIntegrations.push('Office 365');
                availableIntegrations.push('SMTP');

                component.set("v.availableIntegrations", availableIntegrations);
            }
        });
        $A.enqueueAction(action);
    },
    showModal : function(component) {
        component.find('integrationsModal').show();
    },
    hideModal : function(component) {
        component.set("v.selectedIntegration", "");
        component.find("selectedOption").set("v.value", "");
        component.set("v.errors", null);
        var name = component.find("name");
        var apiKey = component.find("apiKey");
        var baseUrl = component.find("baseUrl");
        var tagSourceUrl = component.find("tagSourceUrl");
        var singleInputFields = [name, apiKey, baseUrl, tagSourceUrl];
        var paths = component.find("path");
        if (paths) {
            var sitePathFields = this.getSitePathFields(paths);
        }
        
        var allFields = singleInputFields.concat(sitePathFields);
        for (var i in allFields) {
            var field = allFields[i];
            if (field) {
                this.removeErrorFromField(field);
            }
        }
        component.find('integrationsModal').hide();
    },
    editIntegration : function(component, id) {
        var action = component.get("c.getIntegrationInfo");
        action.setParams({value: id});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var integrationsJson = response.getReturnValue();
                var integrations = JSON.parse(integrationsJson);
                if (integrations !== null && integrations.length > 0) {
                    this.updateFields(component, integrations[0].Loop__Type__c);
                    this.updateValues(component, integrations);
                    if (integrations[0].Loop__Type__c === 'Box' || integrations[0].Loop__Type__c === 'Office 365') {
                        component.set("v.saveButtonText", "Reauthorize");
                    } else {
                        component.set("v.saveButtonText", "Save");
                    }
                }
            } else {
                this.fireErrorEvent(component, 'An unexpected error has occurred. Please contact Drawloop Support if this error persists.');
            }
            
            var integrationsList = component.find('integrationsList');
            integrationsList.replaceSpinnersWithLinks();
        });
        $A.enqueueAction(action);
    },
    resetFields : function(component) {
        var singleInputFields = ['name', 'apiKey', 'baseUrl', 'tagSourceUrl', 'username', 'password'];
        for (var i in singleInputFields) {
            var field = component.find(singleInputFields[i]);
            if (field) {
                field.set('v.value', '');
            }
        }
        
        var paths = component.find("path");
        if (paths) {
            try {
                paths = [];
            } catch(ex) {
                paths.set("v.value", "");
            }
        }
    },
    updateFields : function(component, selectedOptionValue) {
        if (selectedOptionValue) {
            component.set('v.selectedIntegration', selectedOptionValue);
            component.set('v.showFields', true);
            if (selectedOptionValue === 'Office 365') {
                component.set('v.sitePaths', ['/']);
            }
            this.showModal(component);
        } else {
            component.set('v.showFields', false);
        }
    },
    resetValues : function(component) {
        var id = component.find("id");
        var name = component.find("name");
        var apiKey = component.find("apiKey");
        var baseUrl = component.find("baseUrl");
        var tagSourceUrl = component.find("tagSourceUrl");

        if (id) id.set("v.value", '');
        if (name) name.set("v.value", '');
        if (apiKey) apiKey.set("v.value", '');
        if (baseUrl) baseUrl.set("v.value", '');
        if (tagSourceUrl) tagSourceUrl.set("v.value", '');
        
        component.set("v.boxError", "");
    },
    updateValues : function(component, values) {
        var integrationData = values[0];
        var id = component.find("id");
        var name = component.find("name");
        var apiKey = component.find("apiKey");
        var baseUrl = component.find("baseUrl");
        var tagSourceUrl = component.find("tagSourceUrl");
        var username = component.find("username");
        
        if (integrationData.Loop__Type__c === 'Office 365') {
            var paths = [];
            var pathIds = [];
            for (var i in values) {
                var el = this.getUrlInfo(values[i].Loop__Base_URL__c);
                paths.push(el.pathname);
                pathIds.push(values[i].Id);
            }
            
            if (paths.length > 0) {
                component.set("v.sitePaths", paths);
                var pathFields = component.find("path");
                var pathIdFields = component.find("pathId");
                if (paths.length === 1) {
                    pathFields.set("v.value", paths[0]);
                    pathIdFields.set("v.value", pathIds[0]);
                } else {
                    for (var p in pathFields) {
                        pathFields[p].set("v.value", paths[p]);
                        pathIdFields[p].set("v.value", pathIds[p]);
                    }
                }
            }
            
            var intName = values[0].Name;
            var el2 = this.getUrlInfo(values[0].Loop__Base_URL__c);
            var intBaseUrl = el2.protocol + '//' + el2.host;
            var path = el2.pathname;
            
            integrationData.Name = intName.substring(0, intName.indexOf(path));
            integrationData.Id = integrationData.Loop__Base_URL__c = intBaseUrl;
        }
        
        if (id && integrationData.Id) id.set("v.value", integrationData.Id);
        if (name && integrationData.Name) name.set("v.value", integrationData.Name);
        if (apiKey && integrationData.Loop__API_Key__c) apiKey.set("v.value", integrationData.Loop__API_Key__c);
        if (baseUrl && integrationData.Loop__Base_URL__c) baseUrl.set("v.value", integrationData.Loop__Base_URL__c);
        if (tagSourceUrl && integrationData.Loop__Tag_Source_URL__c) tagSourceUrl.set("v.value", integrationData.Loop__Tag_Source_URL__c);
        if (username && integrationData.Loop__Username__c) username.set("v.value", integrationData.Loop__Username__c);
    },
    getUrlInfo : function(url) {
        var el = document.createElement('a');
        el.href = url;
        return el;
    },
    getSitePaths : function(paths) {
        var sitePaths = [];
        try {
            for (var i in paths) {
                sitePaths.push(paths[i].get("v.value"));
            }
        } catch(ex) {
            sitePaths.push(paths.get("v.value"));
        }
        return sitePaths;
    },
    getSitePathFields : function(paths) {
        var sitePaths = [];
        try {
            var isSingle = paths.getLocalId() === "path";
            sitePaths.push(paths);
        } catch(ex) {
            for (var i in paths) {
                sitePaths.push(paths[i]);
            }
        }
        return sitePaths;
    },
    validateFields : function(type, fields) {
        var invalidFields = [];
        for (var i in fields) {
            var field = fields[i];
            if (field === undefined) {
                continue;
            }
            if (!field || !field.get("v.value")) {
                this.addErrorToField(field, 'This field is required');
                invalidFields.push(field);
            } else if (type === "Office 365" && field.getLocalId() === "baseUrl" && !this.isValidUrl(field.get("v.value"))) {
                this.addErrorToField(field, 'This must be a valid URL');
                invalidFields.push(field);
            } else if (type === "Office 365" && field.getLocalId() === "path" && !this.isValidPath(field.get("v.value"))) {
                this.addErrorToField(field, 'This must be a valid site path');
                invalidFields.push(field);
            } else {
                this.removeErrorFromField(field);
            }
        }
        return invalidFields;
    },
    addErrorToField : function(field, message) {
        field.set("v.errors", [{message: message}]);
    },
    removeErrorFromField : function(field) {
        field.set("v.errors", null);
    },
    isValidUrl : function(url) {
        // http://stackoverflow.com/questions/1303872/trying-to-validate-url-using-javascript
        var re = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return re.test(url);
    },
    isValidPath : function(path) {
        var re = /^\/(sites\/.+)?$/i;
        return re.test(path);
    },
    upsertIntegrationInfos : function(component, type, values) {
        var action = component.get("c.upsertIntegrationInfos");
        action.setParams({
            type: type,
            valuesJson: JSON.stringify(values)
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    this.hideModal(component);
                    this.getAvailableIntegrations(component);
                    component.find("selectedOption").set("v.value", "");
                    this.resetFields(component);
                    var integrationsList = component.find('integrationsList');
                    integrationsList.refreshList();
                }
                else {
                    this.fireErrorEvent(component, parsedResponse.errorMessage);
                }
            }
            else {
                this.fireErrorEvent(component, 'An unexpected error has occurred. Please contact Drawloop Support if this error persists.');
            }
            component.set("v.modalBusy", false);
        });
        $A.enqueueAction(action);
    },
    getValues : function(component) {
        var id = component.find('id');
        var name = component.find('name');
        var apiKey = component.find('apiKey');
        var baseUrl = component.find('baseUrl');
        var tagSourceUrl = component.find('tagSourceUrl');
        var username = component.find('username');
        var password = component.find('password');

        var values = {
            type: component.get("v.selectedIntegration"),
            id: id ? id.get('v.value') : '',
            name: name ? name.get('v.value') : '',
            apiKey: apiKey ? apiKey.get('v.value') : '',
            baseUrl: baseUrl ? baseUrl.get('v.value') : '',
            tagSourceUrl: tagSourceUrl ? tagSourceUrl.get('v.value') : '',
            username: username ? username.get('v.value') : '',
            password: password ? password.get('v.value') : '',
        };

        var paths = component.find("path");
        var pathIds = component.find("pathId");
        var sitePaths = this.getSitePaths(paths);
        var sitePathIds = this.getSitePaths(pathIds);
        if (sitePaths.length) {
            values.sitePaths = JSON.stringify(sitePaths);
            values.pathIds = JSON.stringify(sitePathIds);
        }

        return values;
    },
    validateAndUpsertIntegrations : function(component, event) {
        var values = this.getValues(component);
        var type = component.get("v.selectedIntegration");
        var paths = component.find("path");

        // Field validation
        var errors = [];
        var singleInputFields = [component.find("name"), component.find("apiKey"), component.find("baseUrl"), component.find("tagSourceUrl"), component.find("username"), component.find("password")];
        var invalidSingleInputFields = this.validateFields(type, singleInputFields);
        var sitePathFields = this.getSitePathFields(paths);
        var invalidSitePathFields = this.validateFields(type, sitePathFields);
        if (invalidSingleInputFields.length || invalidSitePathFields.length) {
            var labels = [];
            for (var i in invalidSingleInputFields) {
              var field = invalidSingleInputFields[i];
              labels.push(field.get("v.label"));
            }
            if (invalidSitePathFields.length > 0) {
              labels.push('Site Paths');
            }
            errors.splice(0, 0, 'These following fields have errors: ' + labels.join(', '));
        }

        if (errors.length) {
            component.set("v.errors", errors);
            component.set("v.modalBusy", false);
        } else {
            // Validation Success
            if (type === 'Office 365') {
                this.oAuthOffice365(component, values);
            } else if (type === 'SMTP') {
                if (!component.get('v.isAuthorized')) {
                    this.startSalesforceOAuth(component, event);
                } else {
                    this.upsertIntegrationInfos(component, type, values);
                }
            } else {
                this.upsertIntegrationInfos(component, type, values);
            }
        }
    },
    oAuthOffice365 : function(component, values) {
        // Store helper methods to window so they are accessible to the listener function
        // This is necessary here because referring to a helper function from the helper would require a reference to 'this.helper',
        // but 'this' is changed in the scope of the below function.
        window.sessionStorage.helper = this;

        window.Drawloop.eventListener.addEventListener('o365', function(event) {
            var payload = JSON.parse(event.data.payload);
            if (payload.isSuccess) {
                var type = 'Office 365';
                var id = component.find("id");
                var name = component.find("name");
                var baseUrl = component.find("baseUrl");
                var paths = component.find("path");
                var sitePaths = window.sessionStorage.helper.getSitePaths(paths);
                var values = {
                    type: type,
                    id: id ? id.get("v.value") : '',
                    name: name ? name.get("v.value") : '',
                    baseUrl: baseUrl ? baseUrl.get("v.value") : ''
                };
                if (sitePaths.length > 0) {
                    values.sitePaths = JSON.stringify(sitePaths);
                }
                window.sessionStorage.helper.upsertIntegrationInfos(component, type, values);
            }
            else {
                window.sessionStorage.helper.fireErrorEvent(component, payload.errorDescription);
            }
        });

        var unblockedWindow = window.open('/apex/loop__loading', 'Authorize Office 365', 'height=500,width=500,location=0,status=0,titlebar=0');

        var action = component.get("c.fetchO365IntegrationData");
        action.setParams({
            nonLightningSessionId : component.get("v.sessionId"),
            valuesJson : JSON.stringify(values),
            domain : component.get('v.loopUrl')
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    unblockedWindow.location.href = parsedResponse.authUrl;
                }
                else {
		            component.set("v.modalBusy", false);
                    var name = component.find("name");
                    var siteUrl = component.find("baseUrl");
                    var labels = [];
                    var errors = [];
                    
                    if (parsedResponse.errors) {
                        var duplicationErrors = parsedResponse.errors;
                        for (var i = 0; i < duplicationErrors.length; i++) {
                            if (duplicationErrors[i].errorType === "invalidName") {
                                labels.push("Name");
                                this.addErrorToField(name, duplicationErrors[i].errorMessage);
                            }
                            else {
                                labels.push("Site Paths");
                                this.addErrorToField(siteUrl, duplicationErrors[i].errorMessage);
                            }
                        }
                    }
                    errors.splice(0, 0, 'These following fields have errors: ' + labels.join(', '));
                    if (errors) {
                        component.set("v.errors", errors);
                    }
                }
            }
            else {
                this.fireErrorEvent(component, 'There was a problem initiating OAuth.');
            }
            
            component.set("v.modalBusy", false);
        });
        
        $A.enqueueAction(action);
    },
    startSalesforceOAuth : function(component, event) {
        window.Drawloop.eventListener.addEventListener('integrationInfo', function(event) {
            var authorizedEvent = component.getEvent('actionEvent');
            authorizedEvent.setParams({
                action: 'authorized'
            });
            authorizedEvent.fire();
        });
        window.open(component.get('v.oAuthUrl'), 'Salesforce Auth', 'width=490, height=680');
    }
})