({
	doInit : function(component, event, helper) {
		   
        var action = component.get("c.getContact");
        action.setCallback(this, function(response){
            var state = response.getState();

            if(state == "SUCCESS"){
                var res1 = response.getReturnValue();
                console.log('response --' +JSON.stringify(res1));
                component.set("v.contactList",res1);
            }
            
        });
      
         $A.enqueueAction(action);
        var action1 = component.get("c.getAccount");
        action1.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var res2 = response.getReturnValue();
                console.log('res2-----'+res2);
                console.log('response --' +JSON.stringify(res2));
                component.set("v.accountList",res2);
                
            }
            
        });
        
         $A.enqueueAction(action1); 
	}
})