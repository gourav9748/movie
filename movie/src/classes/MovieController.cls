public with sharing class MovieController 
{

    public PageReference book() {
        insert cd;
        PageReference pr = new PageReference('/apex/moviebooked');
        return pr;
    }

   public List<movietheater__c> relatedMovies{get;set;}
    public Customer_details__c cd{get;set;}
    public Boolean ShowEmail { get; set; }
    public Integer no_of_tickets{set;get;}
     
     public Boolean ticket1 { get; set; }
     public Boolean totalPriceShow { get; set; }
    public Boolean ShowMovies { get; set; }
    public String noofticket { get; set; }
    public List<theater_details__c> allTheaters  { get; set; }
    public decimal totalPricevalue{ get; set; }
    
    public String nooftick{set;get;}
    public MovieController()
    {
         System.debug('welcome');
         ShowEmail=false;
         ShowMovies=false;
         ticket1=false;
         totalPriceShow =false;
         cd=new Customer_details__c();
         
    }

    public PageReference Method() 
    {
        ShowEmail =true;
        relatedTheaters();
                System.debug('hey baby22222222222'+noofticket+'    '+cd.no_of_tickets__c );

        
        return null;
    }
    public void relatedTheaters()
    {
        
      try{
       
       allTheaters=[select Name,Name__c,address__c,total_no_of_seats__c,Type__c from theater_details__c  where location__c like :cd.location__c];
       System.debug('---------test----------'+allTheaters);
       }
       catch(Exception ex)
       {
       }
       }

    public void tickets() {
        ticket1=true;
                        System.debug('hey baby22222222222444444444444444444444444444444444444444444444444444444444444444444444444'+noofticket+'    '+cd.no_of_tickets__c );

        //return null;
    }
    public void totalPrice() {
    
    

         
                         System.debug('hey baby222555555555555555555555555555555'+noofticket+'    '+cd.no_of_tickets__c );

        totalPriceShow=true;
        for(movietheater__c mt:relatedMovies)
        {
           if(cd.movie__c==mt.Id )
           {
             
             
               totalPricevalue=(cd.no_of_tickets__c*mt.Price__c);
               break;
           }
        }
           
        
      
    }


    public PageReference Method1() {
               ShowMovies=true;
               //cd.Theater__c=[select Id from theater_details__c where Name__c like :]
               relatedMovies=[select Name,movie_name__c,Price__c,timings__c,Available_seats__c,director__c from movietheater__c where Theater__c=:cd.Theater__c];

                        System.debug('hey baby222222222223333333333333333333333'+noofticket+'    '+cd.no_of_tickets__c );

        return null;
    }

    


   /* public void getMethod() {
        movieTableVisibility =true;  
        System.debug('hello');
        }*/

   
    
    
    
   
    
}