public class Tm_ObjectAndRelatedfieldHelper {
    public static List<Schema.DescribeSObjectResult> allObjectDetailsMethod()
    {
        List<Schema.DescribeSObjectResult> allObjectDetails=new List<Schema.DescribeSObjectResult>();
        for ( Schema.SObjectType o : Schema.getGlobalDescribe().values() )
        {
            allObjectDetails.add(o.getDescribe());
        }
        return allObjectDetails;
    }
    
    public static List<Schema.DescribeFieldResult> allFieldsDetailsMethod(String objApiName)
    {
        List<Schema.DescribeFieldResult> allFieldsDetails=new List<Schema.DescribeFieldResult>();
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objApiName);
        Map<String, Schema.SObjectField> a_fields = targetType.getDescribe().fields.getMap();
        for(Schema.sObjectField fld:a_fields.values())
        {
            
            allFieldsDetails.add(fld.getDescribe());
        }
        
        return allFieldsDetails;
    }

}