({
	getProvisionedUsersText : function(usedLicenses, allowedLicenses, isSandbox, hasSiteWideLicense) {
        if (isSandbox) {
            return "Sandbox environments can have an unlimited number of users.";
        }
        else if (hasSiteWideLicense) {
            return "An organization with a site-wide license can have an unlimited number of users.";
        }
        else {
            return usedLicenses + " of " + allowedLicenses + " users provisioned";
        }
	},
    //Return ProfileData/UserData given a list of ProfileData/UserData and an id
    getItem : function(list, id) {
        var item;
        for (var i = 0; i < list.length; i++) {
            if (list[i].Id === id) {
                item = list[i];
                break;
            }
        }
        
        return item;
    },
    stageUser : function(component, user, desiredStatus) {
        //If user is already staged somewhere, remove user from that staging list
        if (user.CurrentStatus !== user.DesiredStatus) {
            var userDesiredStatus = user.DesiredStatus;
            var currentStagedList = userDesiredStatus === "admin" ? component.get("v.stagedDdpAdmins")
                : userDesiredStatus = "user" ? component.get("v.stagedDdpUsers")
                : component.get("v.stagedAvailableUsers");
            
            for (var i = 0; i < currentStagedList.length; i++) {
                if (currentStagedList[i].Id === user.Id) {
                	currentStagedList.splice(i, 1);
                }
            }
        }
        //If user wants to return to its current status, we're done
        if (user.CurrentStatus === desiredStatus) {
            user.DesiredStatus = desiredStatus;
            
            return true;
        }
        //If user wants to move to a new status, then add it to appropriate staging list
        else {
        	var targetStagedListVText = desiredStatus === "admin" ? "v.stagedDdpAdmins"
            	: desiredStatus === "user" ? "v.stagedDdpUsers"
            	: desiredStatus === "none" ? "v.stagedAvailableUsers"
            	: null;
            
            if (!targetStagedListVText) {
                return false;
            }
            
            var targetStagedList = component.get(targetStagedListVText);
            user.DesiredStatus = desiredStatus;
            targetStagedList.push(user);
            component.set(targetStagedListVText, targetStagedList);
        }
        
        return true;
    },
    sortList : function(list) {
        list.sort(function(a, b) {
            var nameA = a.Name.toLowerCase();
            var nameB = b.Name.toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            
            return 0;
        });
    },
    //Used to update 'availableUsers', 'ddpAdmins', and 'ddpUsers' when user.Status has been updated
    updateLists : function(component, user) {
        var allUsers = component.get("v.allUsers");
        var profileId = component.get("v.selectedProfile").Id;
        var ddpAdmins = [];
        var ddpUsers = [];
        var availableUsers = [];
        
        for (var i = 0; i < allUsers.length; i++) {
            if (allUsers[i].Id === user.Id) {
                allUsers[i].NewStatus = user.NewStatus;
            }
            
            if (allUsers[i].NewStatus === "admin") {
                ddpAdmins.push(allUsers[i]);
            }
            else if (allUsers[i].NewStatus === "user") {
                ddpUsers.push(allUsers[i]);
            }
            else if (profileId === "allUsers" || allUsers[i].ProfileId === profileId) {
                availableUsers.push(allUsers[i]);
            }
        }
        
        component.set("v.availableUsers", availableUsers);
        component.set("v.allDdpAdmins", ddpAdmins);
        component.set("v.allDdpUsers", ddpUsers);
    },
    addSelectedUI : function(userData) {
        var element = document.getElementById(userData.Id);
        element.setAttribute("aria-selected", true);
    },
    removeSelectedUI : function(userData) {
        var element = document.getElementById(userData.Id);
        element.setAttribute("aria-selected", false);
    },
    handleVisualsForTooManyUsers : function(component) {
        var listContainer = document.getElementById("availableUsersListContainer");
        
        if (component.get("v.tooManyUsers")) {
            listContainer.setAttribute("style", "height:91%;");
        }
        else {
            listContainer.setAttribute("style", "height:97%;");
        }
    }
})