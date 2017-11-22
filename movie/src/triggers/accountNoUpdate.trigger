trigger accountNoUpdate on Case (before insert) {
    List<String> allAccId=new List<String>();
    List<Account> allAcc=new List<Account>();
    List<Case> Cases=new List<Case>();
    for(Case c:Trigger.New)
    {
        allAccId.add(c.Account_no__c);
    }
    System.debug(allAccId);
    allAcc=[SELECT AccountNumber,Id,Owner.Name FROM Account where AccountNumber in :allAccId];
    System.debug(allAcc);
    for(Case c:Trigger.New)
    {
        
        for(Account acc:allAcc)
        {
            System.debug(acc.AccountNumber);
           if(c.Account_no__c.equals(acc.AccountNumber))
           {
               c.AccountId=acc.Id;
               c.Policy_Scheme_Acc_No__c=acc.Id;
               
               System.debug('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'+c.accountId );
                System.debug('##ACCID'+acc.id );
                break;
           }
        }
    }
    
}