({
    startTimeout : function(component, event, helper) {
        component.set('v.timedOut', false);
        
        setTimeout($A.getCallback(function() {
            component.set('v.timedOut', true);
        }), 7 * 60 * 1000); // 7 minutes
    },
    downloadFile : function(component, event, helper) {
        var downloadCard = event.currentTarget;
        var downloadLink = downloadCard.id;
        var url = '/apex/loop__downloadLightningFile?url=' + encodeURIComponent(downloadLink);
        
        if ($A.get("$Browser.isIOS") || $A.get("$Browser.isIPad") || $A.get("$Browser.isIPhone")) {
            window.open(url);
        }
        else {
            var iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.display = 'hidden';
            component.find('downloadIframes').getElement().appendChild(iframe);
        }
        downloadCard.classList.remove('hideSpinner');
        downloadCard.classList.add('hideIcon');
        
        setTimeout(function(){
            downloadCard.classList.add('hideSpinner');
            downloadCard.classList.remove('hideIcon');
        }, 3000);
    },
    composeEmail : function(component, event, helper) {
        var composeEmail = component.getEvent('slideInEmailComposer');
        composeEmail.setParams({
            returnUri: component.get('v.returnUri')
        });
        composeEmail.fire();
    },
    showLoading : function(component, event) {
        $A.util.addClass(component.find('continueButtonContainer'), 'hidden');
        component.set('v.downloadLinks', []);
        component.set('v.isLoading', true);

        var continueDelivery = component.getEvent('continueDelivery');
        continueDelivery.setParams({disableModify: true});
        continueDelivery.fire();
    },
    showSuccess : function(component, event) {
        component.set('v.successMessage', event.getParam('arguments').message);
        
        component.set("v.isLoading", false);
        component.set('v.isSuccess', true);

        var continueDelivery = component.getEvent('continueDelivery');
        continueDelivery.setParams({disableModify: false});
        continueDelivery.fire();
    }
})