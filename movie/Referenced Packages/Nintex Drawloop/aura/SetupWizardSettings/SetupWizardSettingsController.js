({
    init : function(component) {
        var action = component.get('c.fetchServices');
        action.setParams({
            sessionId: component.get('v.sessionId'),
            location: '',
            domain: ''
        });  
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    component.set('v.isMass', parsedResponse.massDdp);
                    component.set('v.isGovCloud', parsedResponse.isGovCloud);
                    var subdomain = !parsedResponse.subdomain && parsedResponse.isGovCloud && !component.get('v.isDdpAdmin') ? 'gov' : parsedResponse.subdomain;
                    component.set('v.subdomain', subdomain);
                    component.find(parsedResponse.storeAsSalesforceFile ? "salesforceFilesRadio" : "attachmentsRadio").set("v.value", true);
                    component.set('v.useSalesforceFiles', parsedResponse.storeAsSalesforceFile);
                }
                else {
                    component.getEvent('showError').setParams({
                        message: parsedResponse.errorMessage
                    }).fire();
                }
                
                var actionEvent = component.getEvent('actionEvent');
                actionEvent.setParams({
                    action: 'doneLoading'
                });
                actionEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    subdomainChange : function(component, event) {
        var subdomain = event.getSource().get('v.value');
        component.set('v.subdomain', subdomain);
    },
    openRemoteSiteSettings : function(component) {
        var subdomainValue = component.get('v.subdomain');
        var subdomainLabel = component.find(subdomainValue).get('v.label');
        var endpointUrl = 'https://' + subdomainValue + '.drawloop.com';
        var finalUrl = '/0rp/e?' + 
            		'SiteName=Drawloop' + subdomainLabel + 
            		'&spl1=1&setupid=SecurityRemoteProxy' +
        			'&EndpointUrl=' + encodeURIComponent(endpointUrl) +
                	'&retURL=' + encodeURIComponent('/ui/setup/Setup?setupid=Security');
        window.open(finalUrl, '_blank');
    },
    updateAttachmentOption : function(component, event) {
        component.set('v.useSalesforceFiles', event.getSource().get("v.text") === 'Salesforce Files');
    },
    save : function(component, event, helper) {
        var pauseToEdit = component.find('pauseToEdit');
        pauseToEdit.save();
        
        var oAuth = component.find('oAuth');
        oAuth.save();
        
        //update the changes the user made on values in the custom settings
        var action = component.get('c.updateCustomSettings');
        action.setParams({
            subdomain: component.get('v.subdomain'),
            useSalesforceFiles: component.get('v.useSalesforceFiles')
        });
        $A.enqueueAction(action);
    }
})