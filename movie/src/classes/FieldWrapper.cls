public class FieldWrapper {
    public String fieldApiName {get;set;}
    public String label {get;set;}
    public Boolean creatable {get;set;}
    public Schema.DisplayType type {get;set;}
    
    public FieldWrapper(Schema.DescribeFieldResult dfr)
    {
       fieldApiName=dfr.getName();
       label=dfr.getLabel();
       creatable=dfr.isCreateable();
       type=dfr.getType();  
    }

}