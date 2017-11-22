public with sharing class c8 {

    public PageReference reload() {
        PageReference newocp = new PageReference('/apex/p8');

            newocp.setRedirect(false);
        return newocp;
    }


   public PageReference test() {
    
        System.debug('hey...............................'+ test);
        return null;
    }


   

    


public Account ac {get;  set;}
public Boolean showTable {get;set;}

public String namedetail {get;set;}
public Account acdetails{get;set;}
public List<Account> allacc{get;set;}
static String test;

public Account acdetails2 {get;set;}

 
 public c8() {
    showTable =false;
    
 
    Id id = ApexPages.currentPage().getParameters().get('id');
    acdetails=new Account();
    System.debug('heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
    
    if(acdetails==null)
    {
       acdetails=acdetails2;
    }
 
    /*ac = (id == null) ? new Account() :
    [SELECT Name, accountnumber,billingcountry,type FROM Account WHERE Id = :id];*/
    
    if(id==null)
    {
    ac=new Account();
    }
    else
    ac= [SELECT Name, accountnumber,billingcountry,type FROM Account WHERE Id = :id];
}

    public PageReference save() {
    
        if(ac.name!=null)
        upsert(ac);
   
    
    PageReference acctPage = new ApexPages.StandardController(ac).view();
    acctPage.setRedirect(false);
    return acctPage;
       
    }
    
 public PageReference cancel() {
  PageReference pageRef = new PageReference(ApexPages.currentPage().getUrl());
    pageRef.setRedirect(true);
    return pageRef;
        return null;
    }
    
    

public List<Account> getAccounts()
{
    allacc=[SELECT name, accountnumber,billingCountry,type from Account order by CreatedDate DESC LIMIT 10];
    return allacc;
}

public PageReference details() {
   
    namedetail=apexpages.currentpage().getParameters().get('ac_id');
    test=namedetail;
        System.debug('namedetail '+namedetail);
    acdetails2=[SELECT name,accountnumber,billingcountry,type from account where id=:namedetail];
    System.debug('namedetail,,,,,,,,,,,,,,,,,,,,,,,,,,,,, '+acdetails2);
     PageReference newocp = new PageReference('/apex/p8b');

            newocp.setRedirect(false);

            return newocp;

    
}

public PageReference showdetails() {

  showTable=true;
        return null;
    }
}