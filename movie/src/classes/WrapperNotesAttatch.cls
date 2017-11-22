public class WrapperNotesAttatch {
    public String type{get;set;}
    public String related_to{get;set;}
    public String last_modified{get;set;}
    public String created_by{get;set;}
    public String title{get;set;}
    public String Id{get;set;}
    
    public WrapperNotesAttatch(Note n)
    {
       type='Note'   ;     
       related_to=n.Parent.Name;
       last_modified=n.LastModifiedDate.format();
       created_by=n.CreatedBy.Name;
        title=n.Title;
        Id=n.Id;
    }
    public WrapperNotesAttatch(Attachment a)
    {
        type='Attachment';
        related_to=a.Parent.Name;
       last_modified=a.LastModifiedDate.format();
       created_by=a.CreatedBy.Name;
        title=a.Name;
        Id=a.Id;
        
    }

}