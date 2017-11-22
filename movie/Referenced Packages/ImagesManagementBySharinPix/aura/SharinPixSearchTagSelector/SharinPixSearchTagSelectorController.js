({
    toggleTagsFilter : function(cmp, event, helper) {
        var tagOperator = event.target.id;
        if ($A.util.isEmpty(tagOperator) || tagOperator == 'no-tag') {
            cmp.set('v.tagOperator', null);
            cmp.set('v.tagNames', null);
            cmp.find('selTagList') && cmp.find('selTagList').set('v.value', '');
            cmp.set('v.displayTags', false);
        } else {
            var allTags = cmp.get('v.allTags');
            if ($A.util.isEmpty(allTags)) {
                helper.getAllTags(cmp, function(recvdTags) {
                    cmp.set('v.allTags', recvdTags);
                    cmp.set('v.displayTags', true);
                });
            } else {
                cmp.set('v.displayTags', true);
            }
            cmp.set('v.tagOperator', tagOperator == 'all-tags' ? 'AND' : 'OR');
        }
    },
    setTagNames : function(cmp, event, helper) {
        var value = cmp.get('v.selection');
        cmp.set('v.tagNames', $A.util.isEmpty(value) ? '[]' : JSON.stringify(value.split(';')));
    }
})