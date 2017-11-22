public with sharing class MController {
public list<Account> accounts{get;set;}
public MController()
{
List<account> accounts = [SELECT Name FROM Account LIMIT 5];
//ApexPages.StandardSetController ssc = new ApexPages.StandardSetController(accounts);
}
}