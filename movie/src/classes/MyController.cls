public class MyController {
 public Integer k{get;set;}
 
    

     List<Account> accounts;
      List<Account> accounts1= null;
      
    public MyController()
    {
      k=0;
    }
    public List<Account> getAccounts() {
    if(accounts1==null)
    {
        accounts1=new List<Account>([SELECT name,owner.name FROM account]);
        System.debug('accounts'+accounts1.size());
        
    }
        System.debug('hello');
        
        
    
            accounts=new List<Account>();
        
     
        for(integer i=0;i<5 || k<accounts1.size();i++)
        {
           accounts.add(accounts1.get(k));
           System.debug('single account k i'+accounts1.get(k)+k+i);
           k++;
           
        }
        
        return accounts;
        
    }
    public PageReference nextPage() {
    if(k==accounts1.size())
    {
      k=0;
      
      }
      else{
      
    getAccounts();
    }
        return null;
    }
   
    
}