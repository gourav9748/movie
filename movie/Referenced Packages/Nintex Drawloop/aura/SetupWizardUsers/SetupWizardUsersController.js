({
    onInit : function(component, event, helper) {
        var fetchInitData = component.get("c.fetchInitData");
        fetchInitData.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    component.set("v.isSandbox", parsedResponse.isSandbox);
                    component.set("v.hasSiteWideLicense", parsedResponse.hasSiteWideLicense);
                    component.set("v.tooManyUsers", parsedResponse.tooManyUsers);
                    helper.handleVisualsForTooManyUsers(component);
                    
                    component.set("v.allProfiles", parsedResponse.profiles);
                    component.set("v.selectedProfile", parsedResponse.defaultProfile);
                    
                    component.set("v.availableUsers", parsedResponse.availableUsers);
                    component.set("v.ddpAdmins", parsedResponse.ddpAdmins);
                    component.set("v.ddpUsers", parsedResponse.ddpUsers);
                    
                    component.set("v.usedLicenses", parsedResponse.usedLicenses);
                    component.set("v.allowedLicenses", parsedResponse.allowedLicenses);
                    component.set("v.provisionedUsersText", helper.getProvisionedUsersText(parsedResponse.usedLicenses, parsedResponse.allowedLicenses, parsedResponse.isSandbox, parsedResponse.hasSiteWideLicense));
                    
                    component.set("v.ddpAdminPermissionSetId", parsedResponse.ddpAdminPermissionSetId);
                    component.set("v.ddpUserPermissionSetId", parsedResponse.ddpUserPermissionSetId);
                    component.set("v.salesforceUserLicenseId", parsedResponse.salesforceUserLicenseId);
                }
                else {
                    component.set("v.provisionedUsersText", helper.getProvisionedUsersText(0, 0, false, false));
                    
                    component.getEvent('showError').setParams({
                        title: "Error: Unable to retrieve data",
                        message: parsedResponse.errorMessage
                    }).fire();
                }
            }
            else {
                component.getEvent('showError').setParams({
                    message: "Unable to retrieve data"
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
    onDoneRendering : function(component, event, helper) {
        var selectedAvailableUsers = component.get("v.selectedAvailableUsers");
        if (selectedAvailableUsers.length > 0) {
            var availableUsers = component.get("v.availableUsers");
            for (var i = 0; i < selectedAvailableUsers.length; i++) {
                for (var j = 0; j < availableUsers.length; j++) {
                    if (availableUsers[j].Id === selectedAvailableUsers[i].Id) {
                        helper.addSelectedUI(selectedAvailableUsers[i]);
                    }
                }
            }
        }
        var selectedDdpAdmins = component.get("v.selectedDdpAdmins");
        if (selectedDdpAdmins.length > 0) {
            var ddpAdmins = component.get("v.ddpAdmins");
            for (var k = 0; k < selectedDdpAdmins.length; k++) {
                for (var l = 0; l < ddpAdmins.length; l++) {
                    if (ddpAdmins[l].Id === selectedDdpAdmins[k].Id) {
                        helper.addSelectedUI(selectedDdpAdmins[k]);
                    }
                }
            }
        }
        var selectedDdpUsers = component.get("v.selectedDdpUsers");
        if (selectedDdpUsers.length > 0) {
            var ddpUsers = component.get("v.ddpUsers");
            for (var m = 0; m < selectedDdpUsers.length; m++) {
                for (var n = 0; n < ddpUsers.length; n++) {
                    if (ddpUsers[n].Id === selectedDdpUsers[m].Id) {
                        helper.addSelectedUI(selectedDdpUsers[m]);
                    }
                }
            }
        }
        var selectedProfile = component.get("v.selectedProfile");
        if (selectedProfile) {
            helper.addSelectedUI(selectedProfile);
        }
    },
    selectProfile : function(component, event, helper) {
        component.find("availableUsersLoading").getElement().hidden = false;
        component.set("v.availableUsers", []);
        
        var currentlySelectedProfile = component.get("v.selectedProfile");
        var newSelectedProfileId = event.currentTarget.getAttribute("id");
        
        var newSelectedProfile = helper.getItem(component.get("v.allProfiles"), newSelectedProfileId);
        
        if (newSelectedProfile) {
            if (currentlySelectedProfile) {
                helper.removeSelectedUI(currentlySelectedProfile);
            }
            helper.addSelectedUI(newSelectedProfile);
            
            component.set("v.selectedProfile", newSelectedProfile);
        }
        else {
            component.getEvent('showError').setParams({
                title: "Error: Unable to select Profile",
                message: "An unknown error has occurred. Please contact Nintex Drawloop Support if this error persists."
            }).fire();
        }
        var action = component.get("c.requeryAvailableUsers");
        action.setParams({
            profileId : newSelectedProfileId !== 'allUsers' ? newSelectedProfileId : '',
            ddpAdminPermissionSetId : component.get("v.ddpAdminPermissionSetId"),
            ddpUserPermissionSetId : component.get("v.ddpUserPermissionSetId"),
            salesforceUserLicenseId : component.get("v.salesforceUserLicenseId")
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    var availableUsers = parsedResponse.availableUsers;
                    var stagedUsers = component.get("v.stagedUsers");
                    
                    for (var i = 0; i < availableUsers.length; i++) {
                        for (var j = 0; j < stagedUsers.length; j++) {
                            if (availableUsers[i].Id === stagedUsers[j].Id && stagedUsers[j].DesiredStatus !== 'none') {
                                availableUsers.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                    
                    for (var k = 0; k < stagedUsers.length; k++) {
                        if (stagedUsers[k].DesiredStatus === 'none' && (stagedUsers[k].ProfileId === component.get("v.selectedProfile").Id || component.get("v.selectedProfile").Id === 'allUsers')) {
                            availableUsers.push(stagedUsers[k]);
                        }
                    }
                    
                    helper.sortList(availableUsers);
                    
                    component.set("v.tooManyUsers", false);
                    component.set("v.availableUsers", availableUsers);
                    component.set("v.selectedAvailableUsers", []);
                }
                else {
                    component.getEvent('showError').setParams({
                        title: "Error: Unable to get filtered Users.",
                        message: parsedResponse.errorMessage
                    }).fire();
                }
            }
            else {
                component.getEvent('showError').setParams({
                    title: "Error: Unable to get filtered Users.",
                    message: "An unknown error has occurred. Please contact Nintex Drawloop Support if this error persists."
                }).fire();
            }
            
        	component.find("availableUsersLoading").getElement().hidden = true;
        });
        
        $A.enqueueAction(action);
    },
    availableUserClicked : function(component, event, helper) {
        var availableUsers = component.get("v.availableUsers");
        var clickedUserId = event.currentTarget.id;
        var selectedUsers = component.get("v.selectedAvailableUsers");
        
        var clickedUser;
        for (var i = 0; i < availableUsers.length; i++) {
            if (availableUsers[i].Id === clickedUserId) {
                clickedUser = availableUsers[i];
                break;
            }
        }
        
        var userIsAlreadySelected = false;
        for (var j = 0; j< selectedUsers.length; j++) {
            if (selectedUsers[j].Id === clickedUser.Id) {
                userIsAlreadySelected = true;
                selectedUsers.splice(j, 1);
            	helper.removeSelectedUI(clickedUser);
            }
        }
        
        if (!userIsAlreadySelected) {
            selectedUsers.push(clickedUser);
        }
        
        helper.sortList(selectedUsers);
        component.set("v.selectedAvailableUsers", selectedUsers);
    },
    ddpAdminClicked : function(component, event, helper) {
        var availableUsers = component.get("v.ddpAdmins");
        var clickedUserId = event.currentTarget.id;
        var selectedUsers = component.get("v.selectedDdpAdmins");
        
        var clickedUser;
        for (var i = 0; i < availableUsers.length; i++) {
            if (availableUsers[i].Id === clickedUserId) {
                clickedUser = availableUsers[i];
                break;
            }
        }
        
        var userIsAlreadySelected = false;
        for (var j = 0; j < selectedUsers.length; j++) {
            if (selectedUsers[j].Id === clickedUser.Id) {
                userIsAlreadySelected = true;
                selectedUsers.splice(j, 1);
            	helper.removeSelectedUI(clickedUser);
            }
        }
        
        if (!userIsAlreadySelected) {
            selectedUsers.push(clickedUser);
        }
        
        helper.sortList(selectedUsers);
        component.set("v.selectedDdpAdmins", selectedUsers);
    },
    ddpUserClicked : function(component, event, helper) {
        var availableUsers = component.get("v.ddpUsers");
        var clickedUserId = event.currentTarget.id;
        var selectedUsers = component.get("v.selectedDdpUsers");
        
        var clickedUser;
        for (var i = 0; i < availableUsers.length; i++) {
            if (availableUsers[i].Id === clickedUserId) {
                clickedUser = availableUsers[i];
                break;
            }
        }
        
        var userIsAlreadySelected = false;
        for (var j = 0; j < selectedUsers.length; j++) {
            if (selectedUsers[j].Id === clickedUser.Id) {
                userIsAlreadySelected = true;
                selectedUsers.splice(j, 1);
            	helper.removeSelectedUI(clickedUser);
            }
        }
        
        if (!userIsAlreadySelected) {
            selectedUsers.push(clickedUser);
        }
        
        helper.sortList(selectedUsers);
        component.set("v.selectedDdpUsers", selectedUsers);
    },
    addAdmin : function(component, event, helper) {
        var selectedUsers = component.get("v.selectedAvailableUsers");
        var errorEvent = component.getEvent('showError');
        if (selectedUsers.length > 0) {
            var isSandbox = component.get("v.isSandbox");
            var hasSiteWideLicense = component.get("v.hasSiteWideLicense");
            var usedLicenses = component.get("v.usedLicenses");
            var allowedLicenses = component.get("v.allowedLicenses");
            
            if (isSandbox || hasSiteWideLicense || usedLicenses + selectedUsers.length <= allowedLicenses) {
                var adminCheckError = false;
                var invalidUsersForAdmin = [];
                
                for (var i = 0; i < selectedUsers.length; i++) {
                    if (!selectedUsers[i].CanBeAdmin) {
                        adminCheckError = true;
                        invalidUsersForAdmin.push(selectedUsers[i].Name);
                    }
                }
                
                if (adminCheckError) {
                    var invalidUsersString = invalidUsersForAdmin.join(", ");
                    var secondSentence = invalidUsersForAdmin.length === 1 ? "The following User cannot be made Admin: \n" : "The following Users cannot be made Admin: \n";
                    errorEvent.setParams({
                        title: "Error",
                        message: "Only Users with a \'Salesforce\' license type can be made Admin. " + secondSentence + invalidUsersString
                    });
                    errorEvent.fire();
                    return;
                }
                
                var stagedUsers = component.get("v.stagedUsers");
                var availableUsers = component.get("v.availableUsers");
            	var ddpAdmins = component.get("v.ddpAdmins");
                var selectedDdpAdmins = component.get("v.selectedDdpAdmins");
                
                for (var j = 0; j < selectedUsers.length; j++) {
                    var selectedUser = selectedUsers[j];
                    selectedUser.DesiredStatus = 'admin';
                    
                    //If the User started out as a 'User', then it already exists in 'stagedUsers' and its 'DesiredStatus' just needs to be updated
                    ddpAdmins.push(selectedUser);
                    selectedDdpAdmins.push(selectedUser);
                        
                    var addNewUserToStaging = true;
                    for (var k = 0; k < stagedUsers.length; k++) {
                        if (stagedUsers[k].Id === selectedUser.Id) {
                            addNewUserToStaging = false;
                            break;
                        }
                    }
                    
                    var resetUser = selectedUser.CurrentStatus === 'admin';
                    
                    if (addNewUserToStaging) {
                        //User started out as 'available' and wants to become 'admin'
                        stagedUsers.push(selectedUser);
                    }
                    else if (resetUser) {
                        //User started out as 'admin' and wants to become 'admin' again (This will occur if a User was moved out of Drawloop Admin, and then added back into Drawloop Admin)
                        for (var l = 0; l < stagedUsers.length; l++) {
                            if (stagedUsers[l].Id === selectedUser.Id) {
                                stagedUsers.splice(l, 1);
                                break;
                            }
                        }
                    }
                    
                    for (var m = 0; m < availableUsers.length; m++) {
                        if (availableUsers[m].Id === selectedUser.Id) {
                            availableUsers.splice(m, 1);
                            break;
                        }
                    }
                    
                    usedLicenses++;
                    component.set("v.usedLicenses", usedLicenses);
                    component.set("v.provisionedUsersText", helper.getProvisionedUsersText(usedLicenses, allowedLicenses, isSandbox, hasSiteWideLicense));
                }
                
                helper.sortList(stagedUsers);
                helper.sortList(availableUsers);
                helper.sortList(ddpAdmins);
                
                component.set("v.stagedUsers", stagedUsers);
                component.set("v.availableUsers", availableUsers);
                component.set("v.ddpAdmins", ddpAdmins);
                component.set("v.selectedDdpAdmins", selectedDdpAdmins);
                component.set("v.selectedAvailableUsers", []);
            }
            else {
                errorEvent.setParams({
                    title: "Error",
                    message: "License seats exceeded."
                });
                errorEvent.fire();
            }
        }
    },
    addUser : function(component, event, helper) {
        var selectedUsers = component.get("v.selectedAvailableUsers");
        
        if (selectedUsers.length > 0) {
            var isSandbox = component.get("v.isSandbox");
            var hasSiteWideLicense = component.get("v.hasSiteWideLicense");
            var usedLicenses = component.get("v.usedLicenses");
            var allowedLicenses = component.get("v.allowedLicenses");
            
            if (isSandbox || hasSiteWideLicense || usedLicenses + selectedUsers.length <= allowedLicenses) {
                var stagedUsers = component.get("v.stagedUsers");
                var availableUsers = component.get("v.availableUsers");
                var ddpUsers = component.get("v.ddpUsers");
                var selectedDdpUsers = component.get("v.selectedDdpUsers");
                
                for (var i = 0; i < selectedUsers.length; i++) {
                    var selectedUser = selectedUsers[i];
                    selectedUser.DesiredStatus = 'user';
                    
                    //If the User started out as a 'Admin', then it already exists in 'stagedUsers' and its 'DesiredStatus' just needs to be updated
                    ddpUsers.push(selectedUser);
                    selectedDdpUsers.push(selectedUser);
                    
                    var addNewUserToStaging = true;
                    for (var j = 0; j < stagedUsers.length; j++) {
                        if (stagedUsers[j].Id === selectedUser.Id) {
                            addNewUserToStaging = false;
                            break;
                        }
                    }
                    
                    var resetUser = selectedUser.CurrentStatus === 'user';
                    
                    if (addNewUserToStaging) {
                        //User started out as 'available' and wants to become 'user'
                        stagedUsers.push(selectedUser);
                    }
                    else if (resetUser) {
                        //User started out as 'user' and wants to become 'user' again (This will occur if a User was moved out of Drawloop User, and then added back into Drawloop User)
                        for (var k = 0; k < stagedUsers.length; k++) {
                            if (stagedUsers[k].Id === selectedUser.Id) {
                                stagedUsers.splice(k, 1);
                                break;
                            }
                        }
                    }
                    
                    for (var l = 0; l < availableUsers.length; l++) {
                        if (availableUsers[l].Id === selectedUser.Id) {
                            availableUsers.splice(l, 1);
                            break;
                        }
                    }
                    
                    usedLicenses++;
                    component.set("v.usedLicenses", usedLicenses);
                    component.set("v.provisionedUsersText", helper.getProvisionedUsersText(usedLicenses, allowedLicenses, isSandbox, hasSiteWideLicense));
                }
                
                helper.sortList(stagedUsers);
                helper.sortList(availableUsers);
                helper.sortList(ddpUsers);
                
                component.set("v.stagedUsers", stagedUsers);
                component.set("v.availableUsers", availableUsers);
                component.set("v.ddpUsers", ddpUsers);
                component.set("v.selectedDdpUsers", selectedDdpUsers);
                component.set("v.selectedAvailableUsers", []);
            }
            else {
                var errorEvent = component.getEvent('showError');
                errorEvent.setParams({
                    title: "Error",
                    message: "License seats exceeded."
                });
                errorEvent.fire();
            }
        }
    },
    removeAdmin : function(component, event, helper) {
        var selectedUsers = component.get("v.selectedDdpAdmins");
        if (selectedUsers.length > 0) {
            var stagedUsers = component.get("v.stagedUsers");
            var ddpAdmins = component.get("v.ddpAdmins");
            var availableUsers = component.get("v.availableUsers");
            var selectedAvailableUsers = component.get("v.selectedAvailableUsers");
            
            for (var i = 0; i < selectedUsers.length; i++) {
                var selectedUser = selectedUsers[i];
                selectedUser.DesiredStatus = 'none';
                
                var addNewUserToStaging = true;
                for (var j = 0; j < stagedUsers.length; j++) {
                    if (stagedUsers[j].Id === selectedUser.Id) {
                        addNewUserToStaging = false;
                        break;
                    }
                }
                
                var resetUser = selectedUser.CurrentStatus === 'none';
                
                if (addNewUserToStaging) {
                    //User started out as 'admin' and wants to become 'none'
                    stagedUsers.push(selectedUser);
                }
                else if (resetUser) {
                    //User started out as 'none' and wants to become 'none' again (This will occur if a User was moved out of Available, and then added back into Available)
                    for (var k = 0; k < stagedUsers.length; k++) {
                        if (stagedUsers[k].Id === selectedUser.Id) {
                            stagedUsers.splice(k, 1);
                            break;
                        }
                    }
                }
                
                //If the User started out as a 'none', then it already exists in 'stagedUsers' and its 'DesiredStatus' just needs to be updated
                var selectedProfile = component.get("v.selectedProfile");
                if (selectedProfile.Id === selectedUser.ProfileId || selectedProfile.Id === 'allUsers') {
                    availableUsers.push(selectedUser);
                    selectedAvailableUsers.push(selectedUser);
                }
                
                for (var l = 0; l < ddpAdmins.length; l++) {
                    if (ddpAdmins[l].Id === selectedUser.Id) {
                        ddpAdmins.splice(l, 1);
                        break;
                    }
                }

                var isSandbox = component.get("v.isSandbox");
                var hasSiteWideLicense = component.get("v.hasSiteWideLicense");
                var usedLicenses = component.get("v.usedLicenses");
                var allowedLicenses = component.get("v.allowedLicenses");
                
                usedLicenses--;
                component.set("v.usedLicenses", usedLicenses);
                component.set("v.provisionedUsersText", helper.getProvisionedUsersText(usedLicenses, allowedLicenses, isSandbox, hasSiteWideLicense));
            }
            
            helper.sortList(stagedUsers);
            helper.sortList(ddpAdmins);
            helper.sortList(availableUsers);
            
            component.set("v.stagedUsers", stagedUsers);
            component.set("v.ddpAdmins", ddpAdmins);
            component.set("v.availableUsers", availableUsers);
            component.set("v.selectedAvailableUsers", selectedAvailableUsers);
            component.set("v.selectedDdpAdmins", []);
        }
    },
    removeUser : function(component, event, helper) {
        var selectedUsers = component.get("v.selectedDdpUsers");
        if (selectedUsers.length > 0) {
            for (var i = 0; i < selectedUsers.length; i++) {
                var selectedUser = selectedUsers[i];
                
                var stagedUsers = component.get("v.stagedUsers");
                var ddpUsers = component.get("v.ddpUsers");
                var availableUsers = component.get("v.availableUsers");
                var selectedAvailableUsers = component.get("v.selectedAvailableUsers");
                
                selectedUser.DesiredStatus = 'none';
                
                var addNewUserToStaging = true;
                for (var j = 0; j < stagedUsers.length; j++) {
                    if (stagedUsers[j].Id === selectedUser.Id) {
                        addNewUserToStaging = false;
                        break;
                    }
                }
                
                var resetUser = selectedUser.CurrentStatus === 'none';
                
                if (addNewUserToStaging) {
                    //User started out as 'admin' and wants to become 'none'
                    stagedUsers.push(selectedUser);
                }
                else if (resetUser) {
                    //User started out as 'none' and wants to become 'none' again (This will occur if a User was moved out of Available, and then added back into Available)
                    for (var k = 0; k < stagedUsers.length; k++) {
                        if (stagedUsers[k].Id === selectedUser.Id) {
                            stagedUsers.splice(k, 1);
                            break;
                        }
                    }
                }
                
                //If the User started out as a 'none', then it already exists in 'stagedUsers' and its 'DesiredStatus' just needs to be updated
                var selectedProfile = component.get("v.selectedProfile");
                if (selectedProfile.Id === selectedUser.ProfileId || selectedProfile.Id === 'allUsers') {
                    availableUsers.push(selectedUser);
                    selectedAvailableUsers.push(selectedUser);
                }
                
                for (var l = 0; l < ddpUsers.length; l++) {
                    if (ddpUsers[l].Id === selectedUser.Id) {
                        ddpUsers.splice(l, 1);
                        break;
                    }
                }
                
                var isSandbox = component.get("v.isSandbox");
                var hasSiteWideLicense = component.get("v.hasSiteWideLicense");
                var usedLicenses = component.get("v.usedLicenses");
                var allowedLicenses = component.get("v.allowedLicenses");
                
                usedLicenses--;
                component.set("v.usedLicenses", usedLicenses);
                component.set("v.provisionedUsersText", helper.getProvisionedUsersText(usedLicenses, allowedLicenses, isSandbox, hasSiteWideLicense));
            }
            
            helper.sortList(stagedUsers);
            helper.sortList(availableUsers);
            helper.sortList(ddpUsers);
            
            component.set("v.stagedUsers", stagedUsers);
            component.set("v.availableUsers", availableUsers);
            component.set("v.ddpUsers", ddpUsers);
            component.set("v.selectedAvailableUsers", selectedAvailableUsers);
            component.set("v.selectedDdpUsers", []);
        }
    },
    save : function(component, event, helper) {
        var action = component.get("c.applyPermissionSets");
        action.setParams({
            stagedUsers: JSON.stringify(component.get("v.stagedUsers")),
            ddpAdminPermissionSetId: component.get("v.ddpAdminPermissionSetId"),
            ddpUserPermissionSetId: component.get("v.ddpUserPermissionSetId")
        });
        action.setCallback(this, function(response) {
            var moveToNextStep = component.getEvent("moveToNextStep");
            if (response.getState() === "SUCCESS") {
                var parsedResponse = JSON.parse(response.getReturnValue());
                if (parsedResponse.isSuccess) {
                    var selectedAvailableUsers = component.get("v.selectedAvailableUsers");
                    for (var i = 0; i < selectedAvailableUsers.length; i++) {
                        helper.removeSelectedUI(selectedAvailableUsers[i]);
                    }
                    component.set("v.selectedAvailableUsers", []);
                         
                    var selectedDdpAdmins = component.get("v.selectedDdpAdmins");
                    for (var j = 0; j < selectedDdpAdmins.length; j++) {
                        helper.removeSelectedUI(selectedDdpAdmins[j]);
                    }
                    component.set("v.selectedDdpAdmins", []);
                    
                    var selectedDdpUsers = component.get("v.selectedDdpUsers");
                    for (var k = 0; k < selectedDdpUsers.length; k++) {
                        helper.removeSelectedUI(selectedDdpUsers[k]);
                    }
                    component.set("v.selectedDdpUsers", []);
                    
                    var stagedUsers = component.get("v.stagedUsers");
                    for (var l = 0; l < stagedUsers.length; l++) {
                        stagedUsers[l].CurrentStatus = stagedUsers[l].DesiredStatus;
                    }
                    component.set("v.stagedUsers", []);
                    
                    moveToNextStep.setParams({success: true}).fire();
                }
                else {
                    component.getEvent('showError').setParams({
                        title: "Error",
                        message: "Unable to save."
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
	},
    redirectPage : function(component, event) {
        var redirectEvent = component.getEvent("redirectPage");
        redirectEvent.setParams({
            'buttonName' : 'purchaseForm'
        });
        redirectEvent.fire();
    }
})