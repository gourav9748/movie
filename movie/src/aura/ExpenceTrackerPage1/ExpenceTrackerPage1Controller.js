({
	helperMethod10 : function(component, event, helper) {
		var id=event.getSource().getLocalId();
        for (var i = 1;i <= 9; i++)
    {
        component.find("Check" + i).set("v.value",false);
    }
    	component.find(id).set("v.value",true);
        var chtableCmp = component.find("chtable");
        var chtableElement = chtableCmp.getElement();
        chtableElement.style.background = component.find(id).get("v.label");
        //$A.util.addClass(component.find("chtable"), 'red');
       //	helper.changeColor(component.find("chtable"),component.find(id));
	}
})