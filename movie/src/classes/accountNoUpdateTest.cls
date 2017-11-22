@isTest
public class accountNoUpdateTest {
    Static TestMethod void accountNoUpdateTestMethod(){
        Account acc = new Account(name = 'TestAccountName', AccountNumber = 'test-01');
        insert acc;
    	Case c = new case(Account_no__c='test-01',Name_of_person_reporting_CE__c = 'TestName',Status = 'New' , Origin = 'Phone');
        insert c;
    }
}