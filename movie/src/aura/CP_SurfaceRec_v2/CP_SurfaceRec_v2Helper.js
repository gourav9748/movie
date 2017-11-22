({
	showPopupHelper: function(component, componentId, className){ 
        var modal = component.find(componentId); 
        $A.util.removeClass(modal, className+'hide'); 
        $A.util.addClass(modal, className+'open'); 
    },
    hidePopupHelper: function(component, componentId, className){ 
        var modal = component.find(componentId); 
        $A.util.addClass(modal, className+'hide'); 
        $A.util.removeClass(modal, className+'open'); 
        component.set("v.body", "");                                                          
    },
    initializeLocation: function(component,conList, conditionId){ 
    	var conditionLabel = component.find(conditionId).get("v.label");
		var ConditionValue = component.find(conditionId).get("v.value");
		var condition = {};
		condition.conditionName = conditionLabel;
		condition.conditionValue = "--None--";
		conList.push(condition);
    },
    showDeckQuestions: function(component){ 
    	//deck questions
    },
    showpicketscreenQuestions: function(component){ 
    	//picket questions
    }
})