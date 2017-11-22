public class RoleController {
    UserRole loopRole1;
    public RoleController()
    {
        showTable=false;
        loopRole=new UserRole();
        loopRole1=new UserRole();
        allRoles=new List<UserRole>();
    }
    

    public PageReference showHirerchy() {
        System.debug('heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
        loopRole.Id=idr;
        
        
        while(extractParentId(loopRole.Id).ParentRoleId!=null)
        {
            loopRole.Id=loopRole1.ParentRoleId;
        }
        System.debug('ffffffffffffffffffffffffffffffffffffffffffffff'+allroles);
        showTable=true;
        return null;
    }
    public UserRole extractParentId(String roleid)
    {
        
        loopRole1=[select ParentRoleId,Id,Name from UserRole WHERE Id = :roleid];
        allroles.add(loopRole1);
        return loopRole1;
    }
    public Boolean showTable { get; set; }
    public List<UserRole> allroles { get; set; }
    public String idR { get; set; }
    Public UserRole loopRole { get; set; }
}