public with sharing class RelatedController2 {
     public String type { get; set; }
     public String naId { get; set; }
    public String account { get; set; }
    public List<Note> n { get; set; }
    public List<Attachment> a { get; set; }
     public Account acdetails2 { get; set; }
   // public List<Contact> con { get; set; }
     public Contact contact1 { get; set; }
     public boolean displayPopup {get; set;}
     public boolean displayNotePopup {get; set;}   
    public List<WrapperNotesAttatch> wna {get; set;}
     public ApexPages.StandardSetController con {get; set;}
     public Integer pagelength {get; set;}
     public Integer resultlength {get; set;}
      public RelatedController2()
    {
        pagelength=5;
       wna=new List<WrapperNotesAttatch>();
       acdetails2=[SELECT OwnerId,Id,parentId,name,accountnumber,billingcountry,type,fax,phone,industry,website,ownership,rating,sic,NumberOfEmployees,TickerSymbol,Tradestyle,YearStarted,SicDesc,AnnualRevenue,Site,billingcity,shippingcity,shippingcountry,CustomerPriority__c,SLA__c,SLASerialNumber__c,UpsellOpportunity__c,NumberofLocations__c,SLAExpirationDate__c,Description from Account where Id=:ApexPages.currentPage().getParameters().get('id')];
       con = new ApexPages.StandardSetController(Database.getQueryLocator(
                    [SELECT Id,Name,Email,Fax,FirstName,HomePhone,MailingCity,OtherPhone,MobilePhone,Phone,AssistantName,Birthdate,Department,Title,LeadSource FROM Contact where Account.Id=:acdetails2.Id]));
                    con.setPageSize(pagelength);
                    resultlength=con.getResultSize();
       //con=[SELECT Id,Name,Email,Fax,FirstName,HomePhone,MailingCity,OtherPhone,MobilePhone,Phone,AssistantName,Birthdate,Department,Title,LeadSource FROM Contact where Account.Id=:acdetails2.Id];
       contact1=new Contact();
       n=[SELECT Id,Title,LastModifiedDate,Parent.Name,CreatedBy.Name FROM Note where ParentId=:acdetails2.Id];
       a=[SELECT Id,Name,LastModifiedDate,Parent.Name,CreatedBy.Name FROM Attachment where ParentId=:acdetails2.Id];
       for(Note n1: n)
       {
           wna.add(new WrapperNotesAttatch(n1));
       }
        for(Attachment a1:a)
       {
           wna.add(new WrapperNotesAttatch(a1));
       }
    }
    public PageReference changeowner() {
        String abc=acdetails2.Id;
        return new PageReference('/'+abc.subString(0,15)+'/a?retURL=%2F0012800000yk8p2');
    }


    public PageReference showhirechy() {
        String abc=acdetails2.Id;
        return new PageReference('/acc/account_hierarchy.jsp?id='+abc);
    }


    public PageReference newattatchment() {
        String abc=acdetails2.Id;
        return new PageReference('/p/attach/NoteAttach?pid='+abc.subString(0,15)+'&parentname='+acdetails2.Name+'&retURL=%2F0012800000yk8p2');
        
    }


    public PageReference newnote() {
        String abc=acdetails2.Id;
        return new PageReference('/002/e?parent_id='+abc.subString(0,15)+'&retURL=%2F0012800000yk8p2');
    }


    public PageReference noteview() {
        return new PageReference('/servlet/servlet.FileDownload?file='+naId);
    }
    public PageReference showNotePopup() {
        displayNotePopup=true;
        return null;
    }
        

public PageReference closePopupOnYesfornote() {
        displayNotePopup=false;
        notedel();
        return null;
    }

    public PageReference notedel() {
    wna=new List<WrapperNotesAttatch>();
    if(type.equals('Note'))
    {
        Note n2=new Note();
        n2.Id=naId;
        delete n2;
        n=[SELECT Id,Title,LastModifiedDate,Parent.Name,CreatedBy.Name FROM Note where ParentId=:acdetails2.Id];
        for(Note n1: n)
       {
           wna.add(new WrapperNotesAttatch(n1));
       }
        
    } 
    else
    {
        Attachment a2=new Attachment();
        a2.Id=naId;
        delete a2;
        a=[SELECT Id,Name,LastModifiedDate,Parent.Name,CreatedBy.Name FROM Attachment where ParentId=:acdetails2.Id];
        for(Attachment a1:a)
       {
           wna.add(new WrapperNotesAttatch(a1));
       }
    } 
    return null;  
    }


    public PageReference noteedit() {
        return new PageReference('/'+naId+'/e?retURL=%2F0012800000yk8p2');
    }


    public PageReference noteorattatchdetails() {
        return new PageReference('/'+naId);
    }


    public PageReference edit() {
        return new ApexPages.StandardController(contact1).edit();
    }


    public PageReference CanceltheSection() {
        return null;
    }


    
      

    public PageReference contactpage() {
        PageReference newocp = new PageReference('/003/e?retURL=%2F0012800000yk8p2&accid='+ApexPages.currentPage().getParameters().get('id'));
        return newocp;
    }
    
     public PageReference editpage() {
        PageReference newocp = new PageReference('/003/e?retURL=%2F0032800000irmQi&accid='+ApexPages.currentPage().getParameters().get('id'));
        return newocp;
    }


   
    
     public PageReference closePopupOnYes() {        
        displayPopup = false; 
        delete contact1;
        con = new ApexPages.StandardSetController(Database.getQueryLocator(
                    [SELECT Id,Name,Email,Fax,FirstName,HomePhone,MailingCity,OtherPhone,MobilePhone,Phone,AssistantName,Birthdate,Department,Title,LeadSource FROM Contact where Account.Id=:acdetails2.Id]));
                    con.setPageSize(5);
                    resultlength=con.getResultSize();
        //con=[SELECT Id,Name,Email,Fax,FirstName,HomePhone,MailingCity,OtherPhone,MobilePhone,Phone,AssistantName,Birthdate,Department,Title,LeadSource FROM Contact where Account.Id=:acdetails2.Id];
        //PageReference pageRef = new PageReference(ApexPages.currentPage().getUrl());


            //pageRef.setRedirect(true);
            

            return null;   
    } 
    public void closePopupOnNo() {        
        displayPopup = false;
        displayNotePopUp=false;    
    }         
    public void showPopup() {        
        displayPopup = true;    
    }
    
    
public PageReference deletetheSection()
         {
           try{
            delete acdetails2;
             }
        catch(DMLException e)
        {
             ApexPages.addMessages(e);
        }
        Pagereference pf=new Pagereference('/apex/p15');
        return pf;
       } 
       public List<Contact> getContactpage()
       {
         return (List<Contact>) con.getRecords();
       }

     
  
public PageReference EditSection(){
          
         return new ApexPages.StandardController(acdetails2).edit();
         } 
         public PageReference next() {
         pagelength=pagelength+5;
        con.setPageSize(pagelength);
        return null;
    }
    public PageReference all() {
         
        return new PageReference('/003?rlid=RelatedContactList&id='+acdetails2.Id);
    }
}