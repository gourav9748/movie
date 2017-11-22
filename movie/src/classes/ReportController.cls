public class ReportController {

    @AuraEnabled
    public static list<Contact> getContact(){
         list<Contact> alist = [SELECT id,Name,Account.name FROM Contact];
         if ( alist.size() == 0 ) {
            AuraHandledException e = new AuraHandledException('No Accounts Found');
            e.setMessage('No Accounts Found');
            throw e;
        }
        return alist;
    }
    @AuraEnabled
    public static list<Account> getAccount(){
         list<Account> alist = [SELECT id,Name FROM account];
         if ( alist.size() == 0 ) {
            AuraHandledException e = new AuraHandledException('No Accounts Found');
            e.setMessage('No Accounts Found');
            throw e;
        }
        return alist;
    }
}