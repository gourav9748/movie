public class opportunityList2Con {

    public PageReference previous() {
        setCon.previous();
        return null;
    }


   

    // ApexPages.StandardSetController must be instantiated
    // for standard list controllers
    public ApexPages.StandardSetController setCon {
        get {
            if(setCon == null) {
                setCon = new ApexPages.StandardSetController(Database.getQueryLocator(
                    [SELECT Name FROM Account]));
                    setCon.setPageSize(5);
            }
            return setCon;
        }
        set;
    }

    // Initialize setCon and return a list of records
    public List<Account> getOpportunities() {
        return (List<Account>) setCon.getRecords();
    }
     public PageReference next() {
        setCon.next();
        return null;
    }
}