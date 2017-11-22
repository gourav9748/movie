({
    updateLists : function(component) {
        var allUserData = component.get("v.allUserData");
        var selectedProfileId = component.get("v.selectedProfile").Id;
        var ddpTesters = [];
        var availableUsers = [];
        
        for (var i = 0; i < allUserData.length; i++) {
            if (allUserData[i].isTester) {
                ddpTesters.push(allUserData[i]);
            }
            else if (allUserData[i].ProfileId === selectedProfileId || selectedProfileId === 'allUsers') {
                availableUsers.push(allUserData[i]);
            }
        }
        
        component.set("v.ddpTesters", ddpTesters);
        component.set("v.availableUsers", availableUsers);
    },
    handleSelectedVisuals : function(removeFrom, addTo) {
        if (removeFrom && removeFrom.Id) {
            document.getElementById(removeFrom.Id).setAttribute("aria-selected", false);
        }
        
        document.getElementById(addTo).setAttribute("aria-selected", true);
    },
    handleVisualsForTooManyUsers : function(component) {
        var listContainer = document.getElementById("availableUsersListContainer");
        
        if (component.get("v.tooManyUsers")) {
            listContainer.setAttribute("style", "height:91%;");
        }
        else {
            listContainer.setAttribute("style", "height:97%;");
        }
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
    }
})