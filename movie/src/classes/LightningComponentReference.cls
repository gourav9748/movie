public with sharing class LightningComponentReference {
@AuraEnabled
    public static Candidate__c getCancelOrder(Id recid) {
                  Candidate__c can= new Candidate__c();
         can= [Select id from Candidate__c where id =:recid limit 1];
        
      return can;
    }
}