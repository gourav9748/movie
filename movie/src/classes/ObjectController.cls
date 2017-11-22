public with sharing class ObjectController {

    public Boolean showresult{get;set;}
    public Boolean showresult2{get;set;}
    public String order_id{get;set;}
    public String chooseorderid{get;set;}
    public Order order{get;set;}
    public list<Order> ord{get;set;}
    public Order choosedorder{get;set;}
    public list<OrderItem> ordpro{get;set;}
    
    public ObjectController()
    {
    
    order= new Order();
    ordpro=new list<OrderItem>();
    showresult=false;
    showresult2=false;
    }
    
    
    public void search()
    {
        ord=[select id,OrderNumber,accountid,effectivedate,contractid from order where OrderNumber=:order_id or accountid=:order.accountid];
        showresult=true;
        
    }
    
    
    public void Next()
    {
        System.debug('ffffffffffffffffffffffffffffffffffffffffffffffff'+chooseorderid);
        showresult2=true;
        ordpro=[SELECT AvailableQuantity,ListPrice,OrderId,OrderItemNumber,OriginalOrderItemId,PricebookEntryId,Quantity,ServiceDate,UnitPrice FROM OrderItem where OrderId = :chooseorderid];
        
    }
    
    
    public  PageReference Cancel()
    {
     PageReference pf=new PageReference('https://ap2.salesforce.com/'+ order.accountid);
        pf.setRedirect(true);
        return pf;
    }
    
    
    
    
    
    public List<selectOption> getradioorderlist()
    {
   /* List<selectOption> rTypes = new List<selectOption>();    
    for (Order  o :  [select OrderNumber,accountid,effectivedate,contractid from order where OrderNumber=:order_id or accountid=:order.accountid]) 
            {
                rTypes.add(new selectOption(o.Id, o.OrderNumber ));
            }
   */ return null; 
    }  
}