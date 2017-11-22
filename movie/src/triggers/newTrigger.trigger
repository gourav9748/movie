trigger newTrigger on Account (after insert) {
 for(Account acc:Trigger.new)
    {
        if(acc.Rating.equals('Cold'))
        {
            comment__c c=new comment__c();
            c.Name=acc.name;
            c.comment__c='this is cold acc';
            Insert c;
        }
    }

}