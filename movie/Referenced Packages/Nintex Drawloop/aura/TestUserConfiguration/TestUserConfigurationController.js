({
    onInit : function(component, event, helper) {
        var fetchInitData = component.get("c.fetchInitData");
        fetchInitData.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    component.set("v.allProfiles", parsedResponse.profiles);
                    component.set("v.selectedProfile", parsedResponse.defaultProfile);
                    component.set("v.availableUsers", parsedResponse.availableUsers);
                    component.set("v.tooManyUsers", parsedResponse.tooManyUsers);
                    helper.handleVisualsForTooManyUsers(component);
                    component.set("v.ddpAdmins", parsedResponse.ddpAdmins);
                    component.set("v.ddpTesters", parsedResponse.ddpTesters);
                }
                else {
                    component.getEvent('showError').setParams({
                        message: 'Unable to retrieve data'
                    }).fire();
                }
            }
            else {
                component.getEvent('showError').setParams({
                    message: 'Unable to retrieve data'
                }).fire();
            }
            
            var actionEvent = component.getEvent('actionEvent');
            actionEvent.setParams({
                action: 'doneLoading'
            });
            actionEvent.fire();
        });
        
        $A.enqueueAction(fetchInitData);
    },
    onDoneRendering : function(component) {
        // TODO: remove document selectors
        var selectedProfile = component.get("v.selectedProfile");
        if (selectedProfile && document.getElementById(selectedProfile.Id)) {
            document.getElementById(selectedProfile.Id).setAttribute("aria-selected", true);
        }
        
        var selectedAvailableUser = component.get("v.selectedAvailableUser");
        if (selectedAvailableUser && document.getElementById(selectedAvailableUser.Id)) {
            document.getElementById(selectedAvailableUser.Id).setAttribute("aria-selected", true);
        }
        
        var selectedDdpTester = component.get("v.selectedDdpTester");
        if (selectedDdpTester && document.getElementById(selectedDdpTester.Id)) {
            document.getElementById(selectedDdpTester.Id).setAttribute("aria-selected", true);
        }
    },
	selectProfile : function(component, event, helper) {
        var newProfileId = event.currentTarget.getAttribute("id");
        var action = component.get("c.requeryAvailableUsers");
        action.setParams({
            profileId: newProfileId
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    component.set("v.availableUsers", parsedResponse.availableUsers);
                    var currentlySelectedProfile = component.get("v.selectedProfile");
                    
                    var allProfiles = component.get("v.allProfiles");
                    var newSelectedProfile;
                    for (var i = 0; i < allProfiles.length; i++) {
                        if (allProfiles[i].Id === parsedResponse.profileId) {
                            newSelectedProfile = allProfiles[i];
                        }
                    }
                    
                    component.set("v.selectedProfile", newSelectedProfile);
                    helper.handleSelectedVisuals(currentlySelectedProfile, parsedResponse.profileId);
                }
                else {
                    component.set("v.selectedProfile", undefined);
                    component.getEvent('showError').setParams({
                        message: 'Unable to retrieve data'
                    }).fire();
                }
            }
            else {
                component.set("v.selectedProfile", undefined);
                component.getEvent('showError').setParams({
                    message: 'Unable to retrieve data'
                }).fire();
            }
        });
        
        $A.enqueueAction(action);
	},
    selectUser : function(component, event, helper) {
        //Not a huge fan of using 'parent' and 'child', but by doing this here, we remove a lot of duplicate code
        var parentElement = event.currentTarget.parentElement;
        //These checks are to ensure that this portion of the lightning component is written a certain way
        if (!parentElement || parentElement.tagName !== "UL" || !parentElement.hasAttribute("id")) {
            component.set("v.selectedProfile", undefined);
            component.getEvent('showError').setParams({
                title: "Error",
                message: "An unknown error has occurred. Please contact Nintex Drawloop Support if this error persists."
            }).fire();

            return;
        }
        var residentList = parentElement.getAttribute("id");
        var sourceListVText;
        
        var VText;
        if (residentList === "availableUsersList") {
            VText = "v.selectedAvailableUser";
            sourceListVText = "v.availableUsers";
        }
        else if (residentList === "ddpTestersList") {
            VText = "v.selectedDdpTester";
            sourceListVText = "v.ddpTesters";
        }
        else {
            component.getEvent('showError').setParams({
                title: "Error",
                message: "An unknown error has occurred. Please contact Nintex Drawloop Support if this error persists."
            }).fire();
            
            return;
        }
        
        var currentlySelectedUser = component.get(VText);
        var newSelectedUserId = event.currentTarget.getAttribute("id");
        var sourceList = component.get(sourceListVText);
        
        var newSelectedUser;
        
        for (var i = 0; i < sourceList.length; i++) {
            if (sourceList[i].Id === newSelectedUserId) {
                newSelectedUser = sourceList[i];
            }
        }
        
        if (!newSelectedUser) {
            component.getEvent('showError').setParams({
                title: "Error",
                message: "An unknown error has occurred. Please contact Nintex Drawloop Support if this error persists."
            }).fire();
            
            return;
        }
        
        component.set(VText, newSelectedUser);
        helper.handleSelectedVisuals(currentlySelectedUser, newSelectedUserId);
    },
    addUser : function(component, event, helper) {
        var selectedUser = component.get("v.selectedAvailableUser");
        if (selectedUser) {
            selectedUser.NewIsTester = true;
            var stagedDdpTesters = component.get("v.stagedDdpTesters");
            
            if (stagedDdpTesters.indexOf(selectedUser) < 0) {
                stagedDdpTesters.push(selectedUser);
            }

            helper.sortList(stagedDdpTesters);
            component.set("v.stagedDdpTesters", stagedDdpTesters);
            
            var availableUsers = component.get("v.availableUsers");
            for (var i = 0; i < availableUsers.length; i++) {
                if (availableUsers[i].Id === selectedUser.Id) {
                    availableUsers.splice(i, 1);
                }
            }
            component.set("v.availableUsers", availableUsers);
            
            var ddpTesters = component.get("v.ddpTesters");
            ddpTesters.push(selectedUser);
            helper.sortList(ddpTesters);
            component.set("v.ddpTesters", ddpTesters);
            
            component.set("v.selectedAvailableUser", undefined);
        }
    },
    removeUser : function(component, event, helper) {
        var selectedTester = component.get("v.selectedDdpTester");
        
        if (selectedTester) {
            selectedTester.NewIsTester = false;
            var stagedDdpTesters = component.get("v.stagedDdpTesters");
            
            if (stagedDdpTesters.indexOf(selectedTester) < 0) {
                stagedDdpTesters.push(selectedTester);
            }

            helper.sortList(stagedDdpTesters);
            component.set("v.stagedDdpTesters", stagedDdpTesters);
            
            var ddpTesters = component.get("v.ddpTesters");
            for (var i = 0; i < ddpTesters.length; i++) {
                if (ddpTesters[i].Id === selectedTester.Id) {
                    ddpTesters.splice(i, 1);
                }
            }
            component.set("v.ddpTesters", ddpTesters);
            
            var availableUsers = component.get("v.availableUsers");
            availableUsers.push(selectedTester);
            helper.sortList(availableUsers);
            component.set("v.availableUsers", availableUsers);
        }
    },
    save : function(component) {
        var action = component.get("c.saveDdpTesters");
        action.setParams({
            stagedDdpTesters : JSON.stringify(component.get("v.stagedDdpTesters"))
        });
        action.setCallback(this, function(response) {
            var moveToNextStep = component.getEvent("moveToNextStep");
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    moveToNextStep.setParams({success: true}).fire();
                }
                else {
                    component.getEvent('showError').setParams({
                        title: "Error",
                        message: parsedResponse.errorMessage
                    }).fire();
                    moveToNextStep.setParams({success: false}).fire();
                }
            } else {
                component.getEvent('showError').setParams({
                    title: "Error",
                    message: "Unable to save."
                }).fire();
                moveToNextStep.setParams({success: false}).fire();
            }
        });
        
        $A.enqueueAction(action);
	}
})