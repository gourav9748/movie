({
    doInit : function(cmp, event, helper) {
        helper.fillReports(cmp);
        var reportId = cmp.get('v.reportId');
        if (!$A.util.isEmpty(reportId)) {
            cmp.set('v.id', reportId);
        }
    },
    setId : function(cmp, event, helper) {
        var id = cmp.find('txtReportId').get('v.value');
        if ($A.util.isEmpty(id)) return;
        id = id.trim();
        if (id.length != 15 && id.length != 18) return;
        if (id.length == 15) id = helper.toCaseSafeId(id);
        cmp.set('v.id', id);
    },
    setReportId : function(cmp, event, helper) {
        var id = cmp.get('v.id');
        if (!$A.util.isEmpty(id)) {
            cmp.find('txtReportId').set('v.value', id);
            cmp.set('v.reportId', id);
        }
    }
})