({
    doInit : function(component, event, helper) {
		console.log("In It method");
        var lineRec={x:0,y:0};
        lineRec.r=lineRec.x*lineRec.y;
        var lineList=[];
        lineList.push(lineRec);
        component.set("v.calculationLineList",lineList);
		console.log("In It method -- " +JSON.stringify(component.get("v.calculationLineList")));
    },
    addLine : function(component, event, helper) {
        var lineRec={x:0,y:0};
        lineRec.r=lineRec.x*lineRec.y;
        var lineList=component.get("v.calculationLineList");
        lineList.push(lineRec);
        component.set("v.calculationLineList",lineList);
	},
    calculate : function(component, event, helper) {
        var lineList=component.get("v.calculationLineList");
        var res = 0;
        for (var i = 0; i < lineList.length; i++) {
            res = res + lineList[i].r;
        }
        component.set("v.result",res);
	},
    saveSize : function(component, event, helper) {
        component.find("surfaceQty").set("v.value",component.get("v.result"));
        
        console.log("qty -- " +component.find("surfaceQty").get("v.value"));
    	var surfacerec = component.get("v.surfaceRec");
        surfacerec.qty=component.find("surfaceQty").get("v.value");
        component.set("v.surfaceRec",surfacerec);
        var evt = $A.get("e.c:CP_SurfaceAddEvent");
        evt.setParams({addOrRemove : true,
                       surfaceName : surfacerec,
                       locationName : component.get("v.locRecord")});
        evt.fire();
        
        helper.hidePopupHelper(component, 'backdrop', 'slds-fade-in-');
        helper.hidePopupHelper(component, 'modaldialog2', 'slds-backdrop--');
    },
	addSurfaceToLocation : function(component, event, helper) {
        var whichOne = event.getSource().getLocalId();
        if(whichOne == "surfaceID"){
			var conList = [];
			helper.initializeLocation(component, conList, "woodType");
			helper.initializeLocation(component, conList, "knots");
			helper.initializeLocation(component, conList, "stainType");
			helper.initializeLocation(component, conList, "woodage");
			helper.initializeLocation(component, conList, "stainCondition");
			helper.initializeLocation(component, conList, "stainColor");
			helper.initializeLocation(component, conList, "stainColorText");
			helper.initializeLocation(component, conList, "paintCondition");
			helper.initializeLocation(component, conList, "PaintColorText");
			helper.initializeLocation(component, conList, "surfaceCondition");
			helper.initializeLocation(component, conList, "boardCondition");
			helper.initializeLocation(component, conList, "boardSpacing");
			helper.initializeLocation(component, conList, "boardMounting");
			helper.initializeLocation(component, conList, "screwNailCondition");
			helper.initializeLocation(component, conList, "screwNailCoating");
			helper.initializeLocation(component, conList, "descSomeMissingText");
			helper.initializeLocation(component, conList, "debris");
			helper.initializeLocation(component, conList, "growth");
			helper.initializeLocation(component, conList, "descFungusText");
			helper.initializeLocation(component, conList, "repairs");
			helper.initializeLocation(component, conList, "descRotText");
			helper.initializeLocation(component, conList, "sunExposure");
			helper.initializeLocation(component, conList, "difficulty");
			helper.initializeLocation(component, conList, "accessToBottom");
			//locrec.conditions = conList;
			//component.set("v.locationRec", locrec);
			
			
			
			
			var uploadURL = "https://calpre-net--main--c.cs43.visual.force.com/apex/UploadPicture?quote="+component.get("v.quoteId")+"&location="+component.get("v.locRecord").locationName+"&surface="+component.find("surfaceIDText").get("v.value");
			//console.log('quoteId -- ' +component.get("v.quoteId"));
			component.set("v.uploadPictureURL",uploadURL);
			component.find("surfaceQty").set("v.disabled", false);
            component.find("conditionButton").set("v.disabled", false);
			
			var surfaceselected = component.find(whichOne).get("v.value");
			console.log('selected/deselected --' +component.find("surfaceID").get("v.value"));
			//var surfacename = component.find(whichOne).get("v.label");
			var surfacename = component.find("surfaceIDText").get("v.value");
			var surfaceQty = component.find("surfaceQty").get("v.value");
			var locationrecord = component.get("v.locRecord");
			if(component.find("surfaceID").get("v.value")){
				console.log("You have selected");
                component.set("v.uploadPictureURL",uploadURL);
                component.find("surfaceQty").set("v.disabled", false);
                component.find("conditionButton").set("v.disabled", false);
				helper.showPopupHelper(component, 'backdrop', 'slds-fade-in-');
				helper.showPopupHelper(component, 'modaldialog1', 'slds-backdrop--');
				var surfacerec = {};
				surfacerec.surfaceName = surfacename;
				surfacerec.qty=surfaceQty;
				surfacerec.conditions = conList;
				component.set("v.surfaceRec",surfacerec);
				var locationsurfacerec = component.get("v.surfaceRec");
				//console.log('locationsurfacerec --' +JSON.stringify(locationsurfacerec));
				var evt = $A.get("e.c:CP_SurfaceAddEvent");
				evt.setParams({addOrRemove : true,
								surfaceName : locationsurfacerec,
							   locationName : component.get("v.locRecord")});
				evt.fire();
			}else if(!component.find("surfaceID").get("v.value")){
                uploadURL = "";
                component.set("v.uploadPictureURL",uploadURL);
                component.find("surfaceQty").set("v.disabled", true);
                component.find("conditionButton").set("v.disabled", true);
				console.log("You have not selected");
				component.find("surfaceQty").set("v.disabled", true);
				var surfacerec = {};
				surfacerec.surfaceName = surfacename;
				surfacerec.qty=surfaceQty;
				surfacerec.conditions = conList;
				component.set("v.surfaceRec",surfacerec);
				var locationsurfacerec = component.get("v.surfaceRec");
				//console.log('locationsurfacerec --' +JSON.stringify(locationsurfacerec));
				var evt = $A.get("e.c:CP_SurfaceAddEvent");
				evt.setParams({addOrRemove : false,
							   surfaceName : locationsurfacerec,
							   locationName : component.get("v.locRecord")});
				evt.fire();
			}
        }else{
			helper.showPopupHelper(component, 'backdrop', 'slds-fade-in-');
			helper.showPopupHelper(component, 'modaldialog1', 'slds-backdrop--');
		}
	},
    addConditionToSurface : function(component, event, helper) {
        var container = component.find("newSurfaceConditionbutton");
        $A.util.removeClass(container, 'hide');
        var whichOne = event.getSource().getLocalId();
        var condvalue = component.find(whichOne).get("v.value");
        var condLabel = component.find(whichOne).get("v.label");
        var surfacerc = component.get("v.surfaceRec");
        //console.log('surfacerc before--' + JSON.stringify(surfacerc)+'--'+typeof(surfacerc.conditions.length));
        if (typeof(surfacerc.conditions.length) != 'undefined') {
            console.log('surfacerc has conds');
            var listlenth = surfacerc.conditions.length;
            var newconditionFlag = false;
            var sameconditionFlag = false;
            for (var i = 0; i <= listlenth; i++) {
                if (typeof(surfacerc.conditions[i]) == 'undefined') {
                    newconditionFlag = true;
                } else if (surfacerc.conditions[i].conditionName == condLabel) {
                    sameconditionFlag = true;
                    surfacerc.conditions[i].conditionValue = condvalue;
                    component.set("v.surfaceRec", surfacerc);
                    break;
                } else if (i == listlenth) {
                    newconditionFlag = true;
                }
            }
            if (newconditionFlag) {
                var conList = [];
                conList = surfacerc.conditions;
                var condrec = {};
                condrec.conditionName = condLabel;
                condrec.conditionValue = condvalue;
                conList.push(condrec);
                surfacerc.conditions = conList;
                component.set("v.surfaceRec", surfacerc);
            }
        } else {
            console.log('condLabel --'+condLabel);
            
            var conList = [];
            var condrec = {};
            condrec.conditionName = condLabel;
            condrec.conditionValue = condvalue;
            conList.push(condrec);
            surfacerc.conditions = conList;
            component.set("v.surfaceRec", surfacerc);
            console.log('surfacerec --'+JSON.stringify(component.get("v.surfaceRec")));
        }
        console.log('surfacerc after--' + JSON.stringify(surfacerc));
        //Added
        
        var woodTypeValue = component.find("woodType").get("v.value");
        var stainTypeValue = component.find("stainType").get("v.value");
        var boardMountingValue = component.find("boardMounting").get("v.value");
        var growthValue = component.find("growth").get("v.value");
        var repairsValue = component.find("repairs").get("v.value");
        
        if (woodTypeValue == "Redwood" || woodTypeValue == "Cedar" || woodTypeValue == "Softwood") {
            $A.util.removeClass(component.find("knotsDiv"), 'hide');
        } else {
            $A.util.addClass(component.find("knotsDiv"), 'hide');
            //helper.setLocationConditionToNone(component,locRec,component.find("knots").get("v.label"));
        }
        if (stainTypeValue == "No stain") {
            $A.util.removeClass(component.find("woodageDiv"), 'hide');
            $A.util.addClass(component.find("stainConditionDiv"), 'hide');
            $A.util.addClass(component.find("stainColorDiv"), 'hide');
            $A.util.addClass(component.find("stainColorTextDiv"), 'hide');
            $A.util.addClass(component.find("paintConditionDiv"), 'hide');
            $A.util.addClass(component.find("paintColorTextDiv"), 'hide');
        } else if (stainTypeValue == "Solid stain") {
            var stainCondValues = [];
            stainCondValues.push("--None--");
            stainCondValues.push("No work needed now");
            stainCondValues.push("Good-fully covering");
            stainCondValues.push("Fair-partially covering");
            stainCondValues.push("Poor-minimally covering");
            component.set("v.stainConditionValues", stainCondValues);
            $A.util.removeClass(component.find("stainConditionDiv"), 'hide');
            $A.util.removeClass(component.find("stainColorTextDiv"), 'hide');
            $A.util.addClass(component.find("woodageDiv"), 'hide');
            $A.util.addClass(component.find("stainColorDiv"), 'hide');
            $A.util.addClass(component.find("paintConditionDiv"), 'hide');
            $A.util.addClass(component.find("paintColorTextDiv"), 'hide');
        } else if (stainTypeValue == "Semi-transparent stain" || stainTypeValue == "Clear") {
            var stainCondValues = [];
            stainCondValues.push("--None--");
            stainCondValues.push("No work needed now");
            stainCondValues.push("Light stain - will come off");
            stainCondValues.push("Moderate stain - unsure");
            stainCondValues.push("Heavy stain - won’t come off");
            component.set("v.stainConditionValues", stainCondValues);
            console.log('stainCondValues --' + stainCondValues);
            $A.util.removeClass(component.find("stainConditionDiv"), 'hide');
            $A.util.removeClass(component.find("stainColorDiv"), 'hide');
            $A.util.addClass(component.find("woodageDiv"), 'hide');
            $A.util.addClass(component.find("stainColorTextDiv"), 'hide');
            $A.util.addClass(component.find("paintConditionDiv"), 'hide');
            $A.util.addClass(component.find("paintColorTextDiv"), 'hide');
        } else if (stainTypeValue == "Paint") {
            $A.util.removeClass(component.find("paintConditionDiv"), 'hide');
            $A.util.removeClass(component.find("paintColorTextDiv"), 'hide');
            $A.util.removeClass(component.find("stainColorDiv"), 'hide');
            $A.util.addClass(component.find("woodageDiv"), 'hide');
            $A.util.addClass(component.find("stainConditionDiv"), 'hide');
            $A.util.addClass(component.find("stainColorTextDiv"), 'hide');
        } else {
            $A.util.addClass(component.find("woodageDiv"), 'hide');
            $A.util.addClass(component.find("stainConditionDiv"), 'hide');
            $A.util.addClass(component.find("stainColorDiv"), 'hide');
            $A.util.addClass(component.find("stainColorTextDiv"), 'hide');
            $A.util.addClass(component.find("paintConditionDiv"), 'hide');
            $A.util.addClass(component.find("paintColorTextDiv"), 'hide');
        }
        if (boardMountingValue == "Screws" || boardMountingValue == "Nails" || boardMountingValue == "Screws and Nails") {
            $A.util.removeClass(component.find("screwNailConditionDiv"), 'hide');
            $A.util.removeClass(component.find("screwNailCoatingDiv"), 'hide');
            $A.util.addClass(component.find("descSomeMissingTextDiv"), 'hide');
        } else if (boardMountingValue == "Dowels") {
            $A.util.removeClass(component.find("descSomeMissingTextDiv"), 'hide');
            $A.util.addClass(component.find("screwNailConditionDiv"), 'hide');
            $A.util.addClass(component.find("screwNailCoatingDiv"), 'hide');
        } else {
            $A.util.addClass(component.find("descSomeMissingTextDiv"), 'hide');
            $A.util.addClass(component.find("screwNailConditionDiv"), 'hide');
            $A.util.addClass(component.find("screwNailCoatingDiv"), 'hide');
        }
        if (growthValue == "Some growth" || growthValue == "Lots of growth") {
            $A.util.removeClass(component.find("descFungusTextDiv"), 'hide');
        } else {
            $A.util.addClass(component.find("descFungusTextDiv"), 'hide');
        }
        if (repairsValue == "Possible repairs" || repairsValue == "Repairs needed") {
            $A.util.removeClass(component.find("descRotTextDiv"), 'hide');
        } else {
            $A.util.addClass(component.find("descRotTextDiv"), 'hide');
        }
    },
    closeOtherProperties : function(component, event, helper) {
        helper.hidePopupHelper(component, 'backdrop', 'slds-fade-in-');
        helper.hidePopupHelper(component, 'modaldialog1', 'slds-backdrop--');
    },
    saveProperties: function(component, event, helper) {
        helper.hidePopupHelper(component, 'backdrop', 'slds-fade-in-');
        helper.hidePopupHelper(component, 'modaldialog1', 'slds-backdrop--');
    },
    showCalculator : function(component, event, helper) {
       //console.log("TO Design Calculator");
       helper.showPopupHelper(component, 'backdrop', 'slds-fade-in-');
       helper.showPopupHelper(component, 'modaldialog2', 'slds-backdrop--');
    }
})