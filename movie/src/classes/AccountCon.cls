public class AccountCon {
    public Account account1 {get;set;}
    public AccountCon()
    {
      account1=new Account();
    }
    public PageReference accountdetails() {
        PageReference newocp = new PageReference('/apex/accountrelated?id='+account1.Id);
        
        return newocp;
    }


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
                    [SELECT Name,AccountNUmber,Phone,Owner.Name FROM Account]));
                    setCon.setPageSize(5);
            }
            return setCon;
        }
        set;
    }

    // Initialize setCon and return a list of records
    public List<Account> getAccounts() {
        return (List<Account>) setCon.getRecords();
    }
     public PageReference next() {
        setCon.next();
        return null;
    }
}