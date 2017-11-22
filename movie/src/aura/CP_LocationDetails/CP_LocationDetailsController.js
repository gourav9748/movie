({
	doInit : function(component, event, helper) {
        //console.log('doInit');
        var locationlist = component.get("v.locationList");
		var locationrec={};
        locationrec.locationName='';
        locationrec.surfaceList = {};
        //locationrec.conditions = {};
        locationlist.push(locationrec);
        component.set("v.locationList",locationlist);
        var action = component.get("c.getSurfaceProducts");
        action.setCallback(this, function(response){
                var state = response.getState();
                if(state === "SUCCESS") {
                    var res = response.getReturnValue();
                    //console.log('Response --' +JSON.stringify(res));
                    component.set("v.surfaceProductList",res);
                }
        });
        $A.enqueueAction(action);
	},
    addLocationFromEvent : function(component, event, helper) {
        //addanotherlocationbutton
        var container = component.find("addanotherlocationbutton");
        $A.util.removeClass(container, 'hide');
        var container = component.find("proceedwithpricingbutton");
        $A.util.removeClass(container, 'hide');
        var locationRec = event.getParam("LocationName");
        var locationlist = component.get("v.locationList");
        //console.log('location List --' +JSON.stringify(locationlist));
        
        var listlenth = locationlist.length;
        //console.log('listlenth --' +listlenth);
        var newLocationFlag = false;
        var sameLocationFlag = false;
        for(var i=0;i<listlenth;i++){
            if(locationlist[i].locationName == ''){
                locationlist[i] = locationRec;
                newLocationFlag = false;
                break;
            }else if(locationlist[i].locationName == locationRec.locationName){
                sameLocationFlag = true;
                if(typeof (locationlist[i+1]) != 'undefined')
                if(locationlist[i+1].locationName == '') locationlist.pop();
                break;
            }else if(i==(listlenth-1)){
                newLocationFlag = true;
            }
        }
        //console.log('newLocationFlag --' +newLocationFlag+ '-- sameLocationFlag --' +sameLocationFlag);
        if(newLocationFlag && !sameLocationFlag){
        	locationlist.push(locationRec);
        }
        component.set("v.locationList",locationlist);
        console.log('loc List --' +JSON.stringify(locationlist));
    },
    addLocation : function(component, event, helper) {
        var locationlist = component.get("v.locationList");
		var locationrec={};
        locationrec.locationName='';
        locationrec.surfaceList = {};
        //locationrec.conditions = {};
        locationlist.push(locationrec);
        component.set("v.locationList",locationlist);
    },
    proceedWithPricing : function(component, event, helper) {
        component.set("v.Spinner", true);
        var locationlist = component.get("v.locationList");
        var quoteId = component.get("v.recordId");
        //console.log("final List --" +JSON.stringify(locationlist));
        //console.log("quoteId --" +quoteId);
        var action = component.get("c.getConfigForQuote");
		var apexJobStatusAction = component.get("c.getApexJobStatus");
        action.setParams({
            quote : component.get("v.recordId"),
            //quote : "a26630000001Vif",
            configJSON: JSON.stringify(locationlist)
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            //console.log('create Config State --' +state);
            if(state === "SUCCESS") {
                var res = response.getReturnValue();
                //console.log('Create Config--' +res);
                //component.set("v.Spinner", false);
				
				if(res == "TRUE"){
					var apexJobStatusValue = "Processing";
					console.log('apexJobStatusValue 1--' +apexJobStatusValue);
					
					//setInterval(function(){
					window.setTimeout(
						$A.getCallback(function() {
							console.log('apexJobStatusValue 2--' +apexJobStatusValue);
							
							apexJobStatusAction.setCallback(this, function(apexJobStatusResponse){
								var apexJobStatusState = apexJobStatusResponse.getState();
								console.log('apexJobStatusState --' +apexJobStatusState);
								if(apexJobStatusState === "SUCCESS") {
									var apexJobStatusValue = apexJobStatusResponse.getReturnValue();
									console.log('apexJobStatusValue 3--' +apexJobStatusValue);
									var uploadToAmazonAction = component.get("c.getAttachmentToAmazon"); 
									uploadToAmazonAction.setParams({
										quote : component.get("v.recordId")
									});
									uploadToAmazonAction.setCallback(this, function(uploadToAmazonresponse){
										var uploadToAmazonstate = uploadToAmazonresponse.getState();
										console.log('uploadToAmazonresponse State --' +uploadToAmazonstate);
										if(uploadToAmazonstate === "SUCCESS") {
											var uploadToAmazonres = uploadToAmazonresponse.getReturnValue();
                                            //if(apexJobStatusValue=="Completed"){
                                            component.set("v.Spinner", false);
                                            var urlEvent = $A.get("e.force:navigateToURL");
                                            urlEvent.setParams({
                                                "url" : "https://calpre-net--main--sbqq.cs43.visual.force.com/apex/sb?scontrolCaching=1&id=" +component.get("v.recordId")
                                                        
                                            });
                                            urlEvent.fire();
                                            }
									});
									$A.enqueueAction(uploadToAmazonAction);
								}
							});
							$A.enqueueAction(apexJobStatusAction);
						}),15000
					);
				}
            }
        });
        $A.enqueueAction(action);
    },
    cancelAction : function(component, event, helper) {
		try {
			var dismissActionPanel = $A.get("e.force:closeQuickAction");
			dismissActionPanel.fire();
		} catch (err) {
			console.log('err--', +err);
		}
	},
    saveAction : function(component, event, helper) {
        console.log('Save Action');
        component.set("v.Spinner", true);
        var locationlist = component.get("v.locationList");
        var quoteId = component.get("v.recordId");
        var action = component.get("c.getConfigForQuote");
        action.setParams({
            quote : component.get("v.recordId"),
            //quote : "a26630000001Vif",
            configJSON: JSON.stringify(locationlist)
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            //console.log('create Config State --' +state);
            if(state === "SUCCESS") {
                var res = response.getReturnValue();
                //console.log('Create Config--' +res);
                //component.set("v.Spinner", false);
                
                var uploadToAmazonAction = component.get("c.getAttachmentToAmazon"); 
                uploadToAmazonAction.setParams({
                    quote : component.get("v.recordId")
                });
                uploadToAmazonAction.setCallback(this, function(uploadToAmazonresponse){
                    var uploadToAmazonstate = uploadToAmazonresponse.getState();
                    console.log('uploadToAmazonresponse State --' +uploadToAmazonstate);
                    if(uploadToAmazonstate === "SUCCESS") {
                        var uploadToAmazonres = uploadToAmazonresponse.getReturnValue();
                        var dismissActionPanel = $A.get("e.force:closeQuickAction");
						dismissActionPanel.fire();
                    }
                });
                $A.enqueueAction(uploadToAmazonAction);
            }
        });
        $A.enqueueAction(action);
    }
})