({
    doInit : function(cmp, event, helper) {
        helper.startSearch(cmp);
    },
    startSearch : function(cmp, event, helper) {
        helper.startSearch(cmp);
    },
    handleNewTokens : function(cmp, event, helper) {
        var searchReady = cmp.get('v.searchReady');
        if (searchReady) {
            cmp.set('v.loading', false);
            helper.handleNewTokens(cmp);
        }
    },
    startLoading : function(cmp) {
        cmp.set('v.loading', true);
        cmp.set('v.searchReady', false);
    }
})