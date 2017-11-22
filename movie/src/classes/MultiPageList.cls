public with sharing class MultiPageList {
// properties
public list<Account> smList{get;set;}
public integer counter{get;set;} // page number
public list<Account> bgList{get;set;}

//ivars

//constants
private static final Integer pageSize = 5;

//constructor

public MultiPageList(){
    smList = new list<Account>();
    bgList = [SELECT Id, Name FROM Account];
    counter = 1;
    getPage(counter);
}

public void getPage(integer cnt){
    smList.clear();
    for(integer i=(cnt-1)*pageSize;i<cnt*pageSize;i++){
        if(bgList.size()-1>=i){
            smList.add(bgList.get(i));  
        }
    }

}

public pageReference nextPage(){
    if(bgList.size()>=counter*pageSize-2){
        counter++;
        getPage(counter);
    }
    return null;
}

public pageReference prevPage(){
    if (counter>1){
        counter--;
        getPage(counter);
    }
    return null;
}



}