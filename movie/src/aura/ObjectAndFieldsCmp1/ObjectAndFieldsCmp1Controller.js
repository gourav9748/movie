({
	getInput : function(component, event, helper) {
       
		var action = component.get("c.getCancelOrder");
        action.setParams({
            "recid": component.get("v.recordId")
        });
        // Register the callback function
        action.setCallback(this, function(response) {
           var state = response.getState();
           if (state === "SUCCESS") {
               component.set("v.expenses", response.getReturnValue());
               console.log('===return value==='+response.getReturnValue());
               var expenses = component.get("v.expenses");
               console.log('expenses=='+expenses);
               
               window.location.assign(expenses);
		
             		$A.get('e.force:refreshView').fire();                      	
                        var dismissActionPanel = $A.get("e.force:closeQuickAction");
                       dismissActionPanel.fire();   
                $A.enqueueAction(action);
           }
        }
                           }
})