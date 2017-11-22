public class AllObjectDetails {
    //public List<Schema.SObjectField> fields{get;set;}
    public List<FieldWrapper> fieldDetails{get;set;}
    public Boolean show{get;set;}
    public PageReference allFields() {
        //fields.clear();
        fieldDetails.clear();
        show=true;
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objectApiName);
        //System.Debug('========================='+objectApiName);
        //System.Debug('========================='+targetType);
        Map<String, Schema.SObjectField> a_fields = targetType.getDescribe().fields.getMap();
        for(Schema.sObjectField fld:a_fields.values()){

               system.debug(fld);
               //fields.add(fld);
               Schema.DescribeFieldResult dfr=fld.getDescribe();
               fieldDetails.add(new FieldWrapper(dfr));
               
               //system.debug('============================='+dfr.getName());

        }

        
        return null;
    }

    public String objectApiName{get;set;}
    public String objectName{get;set;}
    public List<SelectOption> getOptions() {
        List<SelectOption> options = new List<SelectOption>();
        //options.add(new SelectOption('None','None'));
      for ( Schema.SObjectType o : Schema.getGlobalDescribe().values() )
    {
    Schema.DescribeSObjectResult objResult = o.getDescribe();
    //system.debug( 'Sobject: ' + objResult );
    //system.debug( 'Sobject API Name: ' + objResult.getName() );
    //system.debug( 'Sobject Label Name: ' + objResult.getLabel() ); 
      
    options.add(new SelectOption(objResult.getName(), objResult.getLabel()));
    }
    
        options.sort();
        return options;
    }
    
    
    
    

  public AllObjectDetails()
  {
     //fields=new List<Schema.SObjectField>();
     fieldDetails=new List<FieldWrapper>();
  }
}