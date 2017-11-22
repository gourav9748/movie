public class LocationController_v2 {
@AuraEnabled
    public static list<product2> getSurfaceProducts(){
        list<product2> surfaceList = new list<product2>([select id,name,family from product2 where family = 'Surface']);
        return surfaceList;
    }

/*
    @AuraEnabled
    public static string getConfigForQuote(id quote,string configJSON){
        
        //List of quote line group(Locations) which are to be inserted for quote
        list<SBQQ__QuoteLineGroup__c> quoteLineItemGroup = new list<SBQQ__QuoteLineGroup__c>();
        
        //Delete existing quote line group and quote lines
        /*list<SBQQ__QuoteLine__c> qltodelete = new list<SBQQ__QuoteLine__c>([select id from SBQQ__QuoteLine__c where  SBQQ__Quote__c=:quote]); 
        if(qltodelete.size()>0) delete qltodelete;
        list<SBQQ__QuoteLineGroup__c> qlgtodelete = new list<SBQQ__QuoteLineGroup__c>([select id from SBQQ__QuoteLineGroup__c where  SBQQ__Quote__c=:quote]); 
        if(qlgtodelete.size()>0) delete qlgtodelete;
        
        map<id,SBQQ__QuoteLineGroup__c> insertedqlgmap2;
        
        //List of quote lines(Surface) which are to be inserted for quote
        list<SBQQ__QuoteLine__c> SurfaceQLList = new list<SBQQ__QuoteLine__c>();
        
        //List of quote lines(Process) which are to be inserted for quote
        list<SBQQ__QuoteLine__c> ProcessQLList = new list<SBQQ__QuoteLine__c>();
        
        //List of quote lines(Process Child) which are to be inserted for quote
        list<SBQQ__QuoteLine__c> ProcessChildQLList = new list<SBQQ__QuoteLine__c>();
        
        
        list<product2> allProductList = new list<product2>([select id,name,family from product2]); //All Products
        map<string,id> productNameToIdMap = new Map<string,id>(); //Map of Product name to Id in order to get Id of Surface product
        map<id,string> productIdtoNameMap = new Map<id,string>(); //Map of Product Id to Name
        
        list<Process_Selection_Rule__c> productSelectionRule = new list<Process_Selection_Rule__c>([SELECT Id, Name,Access_to_Bottom__c,Board_Condition__c,Board_Mounting__c,Board_Spacing__c,Debris__c, Difficulties__c,Evaluation_and_Recommendation__c,External_ID__c,Growth__c,Optional__c,Knots__c,Process_Bundle_Code__c, Multiplication_Factor__c,Option_Number__c,Paint_Condition__c,Process_Process_bundle__c,Product__c, Repair__c,Screw_Nail_Condition__c,Screw_nail_Coating__c,Stain_Color__c,Stain_Condition__c, Stain_Type__c,Sun_Exposure__c,Surface__c,Surface_Condition__c,Type__c,Unique_Formula_ID__c, Wood_Age__c,Wood_Type__c FROM Process_Selection_Rule__c]);
        
        //List of all Product Options
        list<SBQQ__ProductOption__c> prodOptionList = new list<SBQQ__ProductOption__c>([select id,name,Work_Order__c,SBQQ__Type__c,SBQQ__Bundled__c,SBQQ__ConfiguredSKU__c,SBQQ__ConfiguredSKU__r.name,SBQQ__OptionalSKU__c,SBQQ__OptionalSKU__r.name from SBQQ__ProductOption__c]);
        
        map<string,SBQQ__ProductOption__c> prodOptionParentChildMap = new map<string,SBQQ__ProductOption__c>(); //Map to hold product option record for parent product and child product combination
        
        //Map to get product option for configured SKU and optional SKU
        for(SBQQ__ProductOption__c prodOptionRec : prodOptionList){
            string key = string.valueof(prodOptionRec.SBQQ__ConfiguredSKU__c)+string.valueof(prodOptionRec.SBQQ__OptionalSKU__c);
            prodOptionParentChildMap.put(key,prodOptionRec);
        }
        
        //Map to get product Id based on product Name AND product name based on product id
        
        for(product2 pr : allProductList){
            if(pr.family == 'Surface'){
                productNameToIdMap.put(pr.name,pr.id);
            }
            if(pr.family == 'Surface' || pr.family == 'Process'){
                productIdtoNameMap.put(pr.id,pr.name);
            }
        }
        //system.debug('productIdtoNameMap --' +productIdtoNameMap);
        
        //construct map of parent child product START
        map<string,list<string>> parentToClildsProNameMap = new map<string,list<string>>();
        map<id,list<id>> parentToClildsProIdMap = new map<id,list<id>>();

        for(SBQQ__ProductOption__c productOptionRec : prodOptionList){

            string parentProName = productOptionRec.SBQQ__ConfiguredSKU__r.name;
            string optionProName = productOptionRec.SBQQ__OptionalSKU__r.name;
            
            id parentProId = productOptionRec.SBQQ__ConfiguredSKU__c;
            id optionProId = productOptionRec.SBQQ__OptionalSKU__c;
            
            if(parentToClildsProNameMap.containsKey(parentProName)){
                //Add options to the existing list
                list<string> optionList = new list<string>();
                optionList = parentToClildsProNameMap.get(parentProName);
                optionList.add(optionProName);
                parentToClildsProNameMap.put(parentProName,optionList);
            }else{
                //New list
                list<string> optionList = new list<string>();
                optionList.add(optionProName);
                parentToClildsProNameMap.put(parentProName,optionList);
            }
            
            if(parentToClildsProIdMap.containsKey(parentProId)){
                //Add options to the existing list
                list<id> optionidList = new list<id>();
                optionidList = parentToClildsProIdMap.get(parentProId);
                optionidList.add(optionProId);
                parentToClildsProIdMap.put(parentProId,optionidList);
            }else{
                //New list
                list<id> optionidList = new list<id>();
                optionidList.add(optionProId);
                parentToClildsProIdMap.put(parentProId,optionidList);
            }
            
        }
        system.debug('parentToClildsProIdMap --' +parentToClildsProIdMap);
        //construct map of parent child product END
        
        //List of all Locations from Lightning Component
        list<ProductConfiguration_v2.location> prLocationList = new list<ProductConfiguration_v2.location>();
        prLocationList = (list<ProductConfiguration_v2.location>)JSON.deserializeStrict(configJSON,list<ProductConfiguration_v2.location>.class);
        //system.debug('prLocationList --' +prLocationList);
        
        map<string,SBQQ__QuoteLineGroup__c> insertedQLGMap = new map<string,SBQQ__QuoteLineGroup__c>(); //Map of Location name to inserted Quote line group ID
        map<id,string> insertedQLGIdtoNameMap = new map<id,string>(); //Map of inserted Quote line group ID to Location name
        map<string,id> insertedSurfaceQLMap = new map<string,id>(); //Map of Location name+Surface name to inserted Quote line group ID
        
        for(ProductConfiguration_v2.location prLocation: prLocationList){
            
            SBQQ__QuoteLineGroup__c QLG = new SBQQ__QuoteLineGroup__c();
            QLG.SBQQ__Quote__c = quote;
            QLG.Name = prLocation.locationName;
            quoteLineItemGroup.add(QLG);
        }
        
        if(quoteLineItemGroup.size()>0){
            insert(quoteLineItemGroup); //Insert Locations
            
            //system.debug('quoteLineItemGroup after--' +quoteLineItemGroup);
        }
        
        //location to surface list map
        map<id,list<id>> locationIdtoPSurfaceListIDMap = new Map<id,list<id>>();
        set<id> qlgmapId = new set<id>();
        for(SBQQ__QuoteLineGroup__c QLGRec : quoteLineItemGroup){
            insertedQLGMap.put(QLGRec.Name,QLGRec);
            insertedQLGIdtoNameMap.put(QLGRec.id,QLGRec.Name);
            list<id> dummySurfaceList = new list<id>();
            locationIdtoPSurfaceListIDMap.put(QLGRec.id,dummySurfaceList);
            qlgmapId.add(QLGRec.id);
        }
        if(qlgmapId.size()>0)
        insertedqlgmap2 = new map<id,SBQQ__QuoteLineGroup__c>([select id,condition_key__c from SBQQ__QuoteLineGroup__c where id in:qlgmapId]);
        
        system.debug('Number of Locations --' +prLocationList.size());
        
        for(ProductConfiguration_v2.location prLocation: prLocationList){
            for(ProductConfiguration_v2.surface surfaceRec : prLocation.surfaceList){
                SBQQ__QuoteLine__c QLREC = new SBQQ__QuoteLine__c(); 
                QLREC.SBQQ__Quote__c = quote;
                QLREC.SBQQ__Group__c = insertedQLGMap.get(prLocation.locationName).id;
                QLREC.SBQQ__Product__c = productNameToIdMap.get(surfaceRec.surfaceName);
                QLREC.surface__c = surfaceRec.surfaceName;
                QLREC.SBQQ__Quantity__c = surfaceRec.qty;
                QLREC.Option_Number__c= 'NA';
                SurfaceQLList.add(QLREC);
            }
        }
        
        if(SurfaceQLList.size()>0){
            //system.debug('SurfaceQLList before --' +SurfaceQLList);
            insert(SurfaceQLList); //Insert Surfaces
            //system.debug('SurfaceQLList after--' +SurfaceQLList);
        }
        
        //SurfaceId to BundleProcessListId Map
        map<id,list<id>> surfaceIdtoBundleProcessListIdMap = new Map<id,list<id>>();
        for(SBQQ__QuoteLine__c SurfaceQLRec : SurfaceQLList){
            string key = insertedQLGIdtoNameMap.get(SurfaceQLRec.SBQQ__Group__c)+productIdtoNameMap.get(SurfaceQLRec.SBQQ__Product__c);
            insertedSurfaceQLMap.put(key,SurfaceQLRec.id);
            list<id> dummyBundleProcessList = new list<id>();
            surfaceIdtoBundleProcessListIdMap.put(SurfaceQLRec.id,dummyBundleProcessList);
                if(locationIdtoPSurfaceListIDMap.containsKey(SurfaceQLRec.SBQQ__Group__c)){
                //Add to existing List
                list<id> surfaceQLIdList = new list<id>();
                surfaceQLIdList = locationIdtoPSurfaceListIDMap.get(SurfaceQLRec.SBQQ__Group__c);
                surfaceQLIdList.add(SurfaceQLRec.id);
                locationIdtoPSurfaceListIDMap.put(SurfaceQLRec.SBQQ__Group__c,surfaceQLIdList);
            }else{
                //Add new list
                list<id> surfaceQLIdList = new list<id>();
                surfaceQLIdList.add(SurfaceQLRec.id);
                locationIdtoPSurfaceListIDMap.put(SurfaceQLRec.SBQQ__Group__c,surfaceQLIdList);
            }
        }
        
        //system.debug('insertedSurfaceQLMap --' +insertedSurfaceQLMap);
        
        for(ProductConfiguration_v2.location prLocation: prLocationList){
            for(ProductConfiguration_v2.surface surfaceRec : prLocation.surfaceList){
                string surfacewoodType='--None--';
                string surfacewoodAge='--None--';
                string surfaceknots='--None--';
                string surfacestainType='--None--';
                string surfacestainCondition='--None--';
                string surfacestainColor='--None--';
                string surfacepaintCondition='--None--';
                string surfacesurfaceCondition='--None--';
                string surfaceboardCondition='--None--';
                string surfaceboardSpacing='--None--';
                string surfaceboardMounting='--None--';
                string surfacescrewNailCondition='--None--';
                string surfacedebris='--None--';
                string surfacegrowth='--None--';
                string surfacerepair='--None--';
                string surfacedifficulty='--None--';
                string surfaceaccessToBottom='--None--';
                string surfacesunExposure='--None--';
                string surfacescrewNailCoating='--None--';
                for(ProductConfiguration_v2.condition conditionRec : surfaceRec.conditions){
                    if(conditionRec.conditionName == 'Wood Type') surfacewoodType  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Knots') surfaceknots  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Stain Type') surfacestainType  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Wood Age') surfacewoodAge  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Stain Condition') surfacestainCondition  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Stain Color') surfacestainColor  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Paint Condition') surfacepaintCondition  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Surface Condition') surfacesurfaceCondition  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Board Condition') surfaceboardCondition  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Board Spacing') surfaceboardSpacing  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Board Mounting') surfaceboardMounting  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Screw Nail Condition') surfacescrewNailCondition  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Screw Nail Coating') surfacescrewNailCoating  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Debris') surfacedebris  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Growth') surfacegrowth  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Repairs') surfacerepair  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Sun exposure') surfacesunExposure  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Difficulty') surfacedifficulty  =conditionRec.conditionValue;
                    if(conditionRec.conditionName == 'Access to Bottom') surfaceaccessToBottom  =conditionRec.conditionValue;
                }
                for(Process_Selection_Rule__c processSelectionRec: productSelectionRule){
                    string surface='--None--';
                    string woodType='--None--';
                    string woodAge='--None--';
                    string knots='--None--';
                    string stainType='--None--';
                    string stainCondition='--None--';
                    string stainColor='--None--';
                    string paintCondition='--None--';
                    string surfaceCondition='--None--';
                    string boardCondition='--None--';
                    string boardSpacing='--None--';
                    string boardMounting='--None--';
                    string screwNailCondition='--None--';
                    string debris='--None--';
                    string growth='--None--';
                    string repair='--None--';
                    string difficulty='--None--';
                    string accessToBottom='--None--';
                    string sunExposure='--None--';
                    string screwNailCoating='--None--';
                    
                    boolean surfacecheck = false;
                    boolean woodTypecheck = false;
                    boolean woodAgecheck = false;
                    boolean knotscheck = false;
                    boolean stainTypecheck = false;
                    boolean stainConditioncheck = false;
                    boolean stainColorcheck = false;
                    boolean paintConditioncheck = false;
                    boolean surfaceConditioncheck = false;
                    boolean boardConditioncheck = false;
                    boolean boardSpacingcheck = false;
                    boolean boardMountingcheck = false;
                    boolean screwNailConditioncheck = false;
                    boolean debrischeck = false;
                    boolean growthcheck = false;
                    boolean repaircheck = false;
                    boolean difficultycheck = false;
                    boolean accessToBottomcheck = false;
                    boolean sunExposurecheck = false;
                    boolean screwNailCoatingcheck = false;
                    
                    if(processSelectionRec.Surface__c != null && processSelectionRec.Surface__c != ''){
                        surface=processSelectionRec.Surface__c; 
                        if(processSelectionRec.Surface__c == 'NA') surfaceCheck = true;
                    }
                    if(processSelectionRec.Wood_Type__c != null && processSelectionRec.Wood_Type__c != ''){
                         woodType=processSelectionRec.Wood_Type__c; 
                         if(processSelectionRec.Wood_Type__c == 'NA') woodTypecheck = true;
                    }
                    if(processSelectionRec.Wood_Age__c != null && processSelectionRec.Wood_Age__c != ''){
                        woodAge=processSelectionRec.Wood_Age__c; 
                        if(processSelectionRec.Wood_Age__c == 'NA') woodAgecheck = true;
                    }
                    if(processSelectionRec.Knots__c != null && processSelectionRec.Knots__c != ''){
                        knots=processSelectionRec.Knots__c; 
                        if(processSelectionRec.Knots__c == 'NA') knotscheck = true;
                    }
                    if(processSelectionRec.Stain_Type__c != null && processSelectionRec.Stain_Type__c != ''){
                        stainType=processSelectionRec.Stain_Type__c; 
                        if(processSelectionRec.Stain_Type__c == 'NA') stainTypecheck = true;
                    }
                    if(processSelectionRec.Stain_Condition__c != null && processSelectionRec.Stain_Condition__c != ''){
                        stainCondition=processSelectionRec.Stain_Condition__c; 
                        if(processSelectionRec.Stain_Condition__c == 'NA') stainConditioncheck = true;
                    }
                    if(processSelectionRec.Stain_Color__c != null && processSelectionRec.Stain_Color__c != ''){
                        stainColor=processSelectionRec.Stain_Color__c; 
                        if(processSelectionRec.Stain_Color__c == 'NA') stainColorcheck = true;
                    }
                    if(processSelectionRec.Paint_Condition__c != null && processSelectionRec.Paint_Condition__c != ''){
                        paintCondition=processSelectionRec.Paint_Condition__c; 
                        if(processSelectionRec.Paint_Condition__c == 'NA') paintConditioncheck = true;
                    }
                    if(processSelectionRec.Surface_Condition__c != null && processSelectionRec.Surface_Condition__c != ''){
                        surfaceCondition=processSelectionRec.Surface_Condition__c; 
                        if(processSelectionRec.Surface_Condition__c == 'NA') surfaceConditioncheck = true;
                    }
                    if(processSelectionRec.Board_Condition__c != null && processSelectionRec.Board_Condition__c != ''){
                        boardCondition=processSelectionRec.Board_Condition__c; 
                        if(processSelectionRec.Board_Condition__c == 'NA') boardConditioncheck = true;
                    }
                    if(processSelectionRec.Board_Spacing__c != null && processSelectionRec.Board_Spacing__c != ''){
                        boardSpacing=processSelectionRec.Board_Spacing__c; 
                        if(processSelectionRec.Board_Spacing__c == 'NA') boardSpacingcheck = true;
                    }
                    if(processSelectionRec.Board_Mounting__c != null && processSelectionRec.Board_Mounting__c != ''){
                        boardMounting=processSelectionRec.Board_Mounting__c; 
                        if(processSelectionRec.Board_Mounting__c == 'NA') boardMountingcheck = true;
                    }
                    if(processSelectionRec.Screw_Nail_Condition__c != null && processSelectionRec.Screw_Nail_Condition__c != ''){
                        screwNailCondition=processSelectionRec.Screw_Nail_Condition__c; 
                        if(processSelectionRec.Screw_Nail_Condition__c == 'NA') screwNailConditioncheck = true;
                    }
                    if(processSelectionRec.Debris__c != null && processSelectionRec.Debris__c != ''){
                        debris=processSelectionRec.Debris__c; 
                        if(processSelectionRec.Debris__c == 'NA') debrischeck = true;
                    }
                    if(processSelectionRec.Growth__c != null && processSelectionRec.Growth__c != ''){
                        growth=processSelectionRec.Growth__c; 
                        if(processSelectionRec.Growth__c == 'NA') growthcheck = true;
                    }
                    if(processSelectionRec.Repair__c != null && processSelectionRec.Repair__c != ''){
                        repair=processSelectionRec.Repair__c; 
                        if(processSelectionRec.Repair__c == 'NA') repaircheck = true;
                    }
                    if(processSelectionRec.Difficulties__c != null && processSelectionRec.Difficulties__c != ''){
                        difficulty=processSelectionRec.Difficulties__c; 
                        if(processSelectionRec.Difficulties__c == 'NA') difficultycheck = true;
                    }
                    if(processSelectionRec.Access_to_Bottom__c != null && processSelectionRec.Access_to_Bottom__c != ''){
                        accessToBottom=processSelectionRec.Access_to_Bottom__c; 
                        if(processSelectionRec.Access_to_Bottom__c == 'NA') accessToBottomcheck = true;
                    }
                    if(processSelectionRec.Sun_Exposure__c != null && processSelectionRec.Sun_Exposure__c != ''){
                        sunExposure=processSelectionRec.Sun_Exposure__c; 
                        if(processSelectionRec.Sun_Exposure__c == 'NA') sunExposurecheck = true;
                    }
                    if(processSelectionRec.Screw_nail_Coating__c != null && processSelectionRec.Screw_nail_Coating__c != ''){
                        screwNailCoating=processSelectionRec.Screw_nail_Coating__c; 
                        if(processSelectionRec.Screw_nail_Coating__c == 'NA') screwNailCoatingcheck = true;
                    }
                    
                    
                    
                    if((surface.contains(surfaceRec.surfaceName) || surfaceCheck) && 
                        (woodType.contains(surfacewoodType) || woodTypecheck) &&
                        (woodAge.contains(surfacewoodAge) || woodAgecheck) &&
                        (knots.contains(surfaceknots) || knotscheck) &&
                        (stainType.contains(surfacestainType) || stainTypecheck) &&
                        (stainCondition.contains(surfacestainCondition) || stainConditioncheck) &&
                        (stainColor.contains(surfacestainColor) || stainColorcheck) &&
                        (paintCondition.contains(surfacepaintCondition) || paintConditioncheck) &&
                        (surfaceCondition.contains(surfacesurfaceCondition) || surfaceConditioncheck) &&
                        (boardCondition.contains(surfaceboardCondition) || boardConditioncheck) &&
                        (boardSpacing.contains(surfaceboardSpacing) || boardSpacingcheck) &&
                        (boardMounting.contains(surfaceboardMounting) || boardMountingcheck) &&
                        (screwNailCondition.contains(surfacescrewNailCondition) || screwNailConditioncheck) &&
                        (debris.contains(surfacedebris) || debrischeck) &&
                        (growth.contains(surfacegrowth) || growthcheck) &&
                        (repair.contains(surfacerepair) || repaircheck) &&
                        (difficulty.contains(surfacedifficulty) || difficultycheck) &&
                        (accessToBottom.contains(surfaceaccessToBottom) || accessToBottomcheck) &&
                        (sunExposure.contains(surfacesunExposure) || sunExposurecheck) &&
                        (screwNailCoating.contains(surfacescrewNailCoating) || screwNailCoatingcheck)){
                            
                            SBQQ__QuoteLine__c ProcessQLREC = new SBQQ__QuoteLine__c(); 
                            ProcessQLREC.SBQQ__Quote__c = quote;
                            ProcessQLREC.SBQQ__ProductOption__c = prodOptionParentChildMap.get(productNameToIdMap.get(surfaceRec.surfaceName)+string.valueof(processSelectionRec.Product__c)).id;
                            ProcessQLREC.SBQQ__Group__c = insertedQLGMap.get(prLocation.locationName).id;
                            ProcessQLREC.SBQQ__Product__c = processSelectionRec.Product__c;
                            ProcessQLREC.SBQQ__RequiredBy__c = insertedSurfaceQLMap.get(prLocation.locationName+surfaceRec.surfaceName);
                            ProcessQLREC.SBQQ__OptionLevel__c = 1;
                            ProcessQLREC.SBQQ__Quantity__c = 1;
                            ProcessQLREC.SBQQ__BundledQuantity__c = 1;
                            ProcessQLREC.surface__c = surfaceRec.surfaceName;
                            ProcessQLREC.Evaluation_and_Recommendation__c = processSelectionRec.Evaluation_and_Recommendation__c;
                            ProcessQLREC.Option_Number__c= processSelectionRec.Option_Number__c;
                            ProcessQLREC.SBQQ__Optional__c = processSelectionRec.Optional__c;
                            ProcessQLREC.Wood_Type_Text__c = surfacewoodType;
                            ProcessQLREC.Knots_Text__c = surfaceknots;
                            ProcessQLREC.Stain_Type_Text__c = surfacestainType;
                            ProcessQLREC.Wood_Age_Text__c = surfacewoodAge;
                            ProcessQLREC.Stain_Condition_Text__c = surfacestainCondition;
                            ProcessQLREC.Stain_Color_Text__c = surfacestainColor;
                            ProcessQLREC.Paint_Condition_Text__c = surfacepaintCondition;
                            ProcessQLREC.Surface_Condition_Text__c = surfacesurfaceCondition;
                            ProcessQLREC.Board_Condition_Text__c = surfaceboardCondition;
                            ProcessQLREC.Board_Spacing_Text__c = surfaceboardSpacing;
                            ProcessQLREC.Board_Mounting_Text__c = surfaceboardMounting;
                            ProcessQLREC.Screw_Nail_Condition_Text__c = surfacescrewNailCondition;
                            ProcessQLREC.Screw_Nail_Coating_Text__c = surfacescrewNailCoating;
                            ProcessQLREC.Debris_Text__c = surfacedebris;
                            ProcessQLREC.Growth_Text__c = surfacegrowth;
                            ProcessQLREC.Repairs_Text__c = surfacerepair;
                            ProcessQLREC.Sun_exposure_Text__c = surfacesunExposure;
                            ProcessQLREC.Difficulty_Text__c = surfacedifficulty;
                            ProcessQLREC.Access_to_Bottom_Text__c = surfaceaccessToBottom;
                            if(prodOptionParentChildMap.get(productNameToIdMap.get(surfaceRec.surfaceName)+string.valueof(processSelectionRec.Product__c)).Work_Order__c != null 
                                || prodOptionParentChildMap.get(productNameToIdMap.get(surfaceRec.surfaceName)+string.valueof(processSelectionRec.Product__c)).Work_Order__c != ''){
                                ProcessQLREC.Work_Order__c = prodOptionParentChildMap.get(productNameToIdMap.get(surfaceRec.surfaceName)+string.valueof(processSelectionRec.Product__c)).Work_Order__c;
                            }
                            ProcessQLList.add(ProcessQLREC);
                    }
                }
            }
        }
        
        if(ProcessQLList.size()>0){
            system.debug('ProcessQLList before --' +ProcessQLList);
            insert(ProcessQLList);
            system.debug('ProcessQLList after--' +ProcessQLList);
        }
        
        
        for(SBQQ__QuoteLine__c processQL: ProcessQLList){
            id parentProductId = processQL.SBQQ__Product__c;
            if(parentToClildsProIdMap.containsKey(parentProductId)){
                for(Id OptionProductId : parentToClildsProIdMap.get(parentProductId)){
                    string ProductOptionSearchkey = string.valueof(parentProductId)+string.valueof(OptionProductId);
                    SBQQ__QuoteLine__c ProcessChildQLREC = new SBQQ__QuoteLine__c(); 
                    ProcessChildQLREC.SBQQ__Quote__c = quote;
                    ProcessChildQLREC.SBQQ__ProductOption__c = prodOptionParentChildMap.get(ProductOptionSearchkey).id;
                    ProcessChildQLREC.SBQQ__Group__c = processQL.SBQQ__Group__c;
                    ProcessChildQLREC.SBQQ__Product__c = OptionProductId;
                    ProcessChildQLREC.SBQQ__RequiredBy__c = processQL.id;
                    ProcessChildQLREC.Process_Line_Key__c = processQL.Process_Line_Key__c;
                    ProcessChildQLREC.SBQQ__OptionLevel__c = 2;
                    ProcessChildQLREC.SBQQ__Quantity__c = 1;
                    ProcessChildQLREC.surface__c=processQL.surface__c;
                    ProcessChildQLREC.SBQQ__Bundled__c = prodOptionParentChildMap.get(ProductOptionSearchkey).SBQQ__Bundled__c;
                    ProcessChildQLREC.SBQQ__OptionType__c = prodOptionParentChildMap.get(ProductOptionSearchkey).SBQQ__Type__c;
                    ProcessChildQLREC.SBQQ__BundledQuantity__c = 1;
                    ProcessChildQLREC.Option_Number__c= 'NA';
                    
                    ProcessChildQLREC.Wood_Type_Text__c = processQL.Wood_Type_Text__c;
                    ProcessChildQLREC.Knots_Text__c = processQL.Knots_Text__c;
                    ProcessChildQLREC.Stain_Type_Text__c = processQL.Stain_Type_Text__c;
                    ProcessChildQLREC.Wood_Age_Text__c = processQL.Wood_Age_Text__c;
                    ProcessChildQLREC.Stain_Condition_Text__c = processQL.Stain_Condition_Text__c;
                    ProcessChildQLREC.Stain_Color_Text__c = processQL.Stain_Color_Text__c;
                    ProcessChildQLREC.Paint_Condition_Text__c = processQL.Paint_Condition_Text__c;
                    ProcessChildQLREC.Surface_Condition_Text__c = processQL.Surface_Condition_Text__c;
                    ProcessChildQLREC.Board_Condition_Text__c = processQL.Board_Condition_Text__c;
                    ProcessChildQLREC.Board_Spacing_Text__c = processQL.Board_Spacing_Text__c;
                    ProcessChildQLREC.Board_Mounting_Text__c = processQL.Board_Mounting_Text__c;
                    ProcessChildQLREC.Screw_Nail_Condition_Text__c = processQL.Screw_Nail_Condition_Text__c;
                    ProcessChildQLREC.Screw_Nail_Coating_Text__c = processQL.Screw_Nail_Coating_Text__c;
                    ProcessChildQLREC.Debris_Text__c = processQL.Debris_Text__c;
                    ProcessChildQLREC.Growth_Text__c = processQL.Growth_Text__c;
                    ProcessChildQLREC.Repairs_Text__c = processQL.Repairs_Text__c;
                    ProcessChildQLREC.Sun_exposure_Text__c = processQL.Sun_exposure_Text__c;
                    ProcessChildQLREC.Difficulty_Text__c = processQL.Difficulty_Text__c;
                    ProcessChildQLREC.Access_to_Bottom_Text__c = processQL.Access_to_Bottom_Text__c;
                    
                    if(prodOptionParentChildMap.get(ProductOptionSearchkey).Work_Order__c != null || prodOptionParentChildMap.get(ProductOptionSearchkey).Work_Order__c != ''){
                        ProcessChildQLREC.Work_Order__c = prodOptionParentChildMap.get(ProductOptionSearchkey).Work_Order__c;
                    }
                    ProcessChildQLList.add(ProcessChildQLREC);
                }
            }
            //surfaceIdtoBundleProcessListIdMap
            if(surfaceIdtoBundleProcessListIdMap.containsKey(processQL.SBQQ__RequiredBy__c)){
                list<id> bundleProcessIdList = new list<id>();
                bundleProcessIdList = surfaceIdtoBundleProcessListIdMap.get(processQL.SBQQ__RequiredBy__c);
                bundleProcessIdList.add(processQL.id);
                surfaceIdtoBundleProcessListIdMap.put(processQL.SBQQ__RequiredBy__c,bundleProcessIdList);
            }else{
                list<id> bundleProcessIdList = new list<id>();
                bundleProcessIdList.add(processQL.id);
                surfaceIdtoBundleProcessListIdMap.put(processQL.SBQQ__RequiredBy__c,bundleProcessIdList);
            }
        }
        
        if(ProcessChildQLList.size()>0){
            system.debug('ProcessChildQLList before --' +ProcessChildQLList);
            insert(ProcessChildQLList);
            system.debug('ProcessChildQLList after--' +ProcessChildQLList);
        }
        
        //BundleProcessId to ProcessListId Map
        map<id,list<id>> bundleProcessIdtoProcessListIdMap = new Map<id,list<id>>();
        for(SBQQ__QuoteLine__c proRec: ProcessChildQLList){
            if(bundleProcessIdtoProcessListIdMap.containsKey(proRec.SBQQ__RequiredBy__c)){
                //Add to existing List
                list<id> processIdList = new list<id>();
                processIdList = bundleProcessIdtoProcessListIdMap.get(proRec.SBQQ__RequiredBy__c);
                processIdList.add(proRec.id);
                bundleProcessIdtoProcessListIdMap.put(proRec.SBQQ__RequiredBy__c,processIdList);
            }else{
                //Create new list
                list<id> processIdList = new list<id>();
                processIdList.add(proRec.id);
                bundleProcessIdtoProcessListIdMap.put(proRec.SBQQ__RequiredBy__c,processIdList);
            }
        }
        system.debug('locationIdtoPSurfaceListIDMap --' +locationIdtoPSurfaceListIDMap);
        system.debug('surfaceIdtoBundleProcessListIdMap --' +surfaceIdtoBundleProcessListIdMap);
        system.debug('bundleProcessIdtoProcessListIdMap --' +bundleProcessIdtoProcessListIdMap);
        
        
        sbqq__quote__c quoteRec = new sbqq__quote__c();
        quoteRec = [select SBQQ__LineItemCount__c from sbqq__quote__c where id =:quote limit 1];
        decimal quotenumber = quoteRec.SBQQ__LineItemCount__c +1;
        list<SBQQ__QuoteLine__c> quoteLineToBeUpdatedList = new list<SBQQ__QuoteLine__c>();
        
        //Correct number on Quote Lines
        for(id locRecQLID : locationIdtoPSurfaceListIDMap.keyset()){
            if(locationIdtoPSurfaceListIDMap.containsKey(locRecQLID)){
                for(id surfaceQId : locationIdtoPSurfaceListIDMap.get(locRecQLID)){
                    SBQQ__QuoteLine__c surfaceQLRec1 = new SBQQ__QuoteLine__c(id=surfaceQId,SBQQ__Number__c = quotenumber);
                    quoteLineToBeUpdatedList.add(surfaceQLRec1);
                    quotenumber++;
                    if(surfaceIdtoBundleProcessListIdMap.containsKey(surfaceQId)){
                        for(id processbundleQLID : surfaceIdtoBundleProcessListIdMap.get(surfaceQId)){
                            SBQQ__QuoteLine__c processBundleQLRec1 = new SBQQ__QuoteLine__c(id=processbundleQLID,SBQQ__Number__c = quotenumber);
                            quoteLineToBeUpdatedList.add(processBundleQLRec1);
                            quotenumber++;
                            if(bundleProcessIdtoProcessListIdMap.containsKey(processbundleQLID)){
                                for(id processQLID : bundleProcessIdtoProcessListIdMap.get(processbundleQLID)){
                                    SBQQ__QuoteLine__c processQLRec1 = new SBQQ__QuoteLine__c(id=processQLID,SBQQ__Number__c = quotenumber);
                                    quoteLineToBeUpdatedList.add(processQLRec1);
                                    quotenumber++;
                                }
                            }
                        }
                    }
                }
            }
        }
        system.debug('quotenumber --' +quotenumber);
        system.debug('quoteLineToBeUpdatedList --' +quoteLineToBeUpdatedList);
        if(quoteLineToBeUpdatedList.size()>0){
            update quoteLineToBeUpdatedList;
        }
        return 'TRUE';
    }    
    
    */
    
    /*
    @AuraEnabled
    public static map<string,list<string>> getConditionValues(){
        map<string,list<string>> returnMap = new map<string,list<string>>();
        Condition__mdt adminConfigConditions = new Condition__mdt();
        adminConfigConditions = [select id,label,wood_type__c,Knots__c,Paint_Condition__c,Stain_Color__c,Stain_Condition__c,
                                                                    Stain_Type__c,Wood_Age__c from Condition__mdt where label ='Admin'];
                                                                    
        if(adminConfigConditions.wood_type__c != null && adminConfigConditions.wood_type__c != ''){
            list<string> conditionValueList = new list<string>();
            conditionValueList = adminConfigConditions.wood_type__c.split(';');
            returnMap.put('wood_type__c',conditionValueList);
        }                                                           
        if(adminConfigConditions.Knots__c != null && adminConfigConditions.Knots__c != ''){
            list<string> conditionValueList = new list<string>();
            conditionValueList = adminConfigConditions.Knots__c.split(';');
            returnMap.put('Knots__c',conditionValueList);
        }                                                           
        if(adminConfigConditions.Paint_Condition__c != null && adminConfigConditions.Paint_Condition__c != ''){
            list<string> conditionValueList = new list<string>();
            conditionValueList = adminConfigConditions.Paint_Condition__c.split(';');
            returnMap.put('Paint_Condition__c',conditionValueList);
        }                                                           
        if(adminConfigConditions.Stain_Color__c != null && adminConfigConditions.Stain_Color__c != ''){
            list<string> conditionValueList = new list<string>();
            conditionValueList = adminConfigConditions.Stain_Color__c.split(';');
            returnMap.put('Stain_Color__c',conditionValueList);
        }                                                           
        if(adminConfigConditions.Wood_Age__c != null && adminConfigConditions.Wood_Age__c != ''){
            list<string> conditionValueList = new list<string>();
            conditionValueList = adminConfigConditions.Wood_Age__c.split(';');
            returnMap.put('Wood_Age__c',conditionValueList);
        }                                                           
        if(adminConfigConditions.Stain_Condition__c != null && adminConfigConditions.Stain_Condition__c != ''){
            list<string> conditionValueList = new list<string>();
            conditionValueList = adminConfigConditions.Stain_Condition__c.split(';');
            returnMap.put('Stain_Condition__c',conditionValueList);
        }                                                           
        if(adminConfigConditions.Stain_Type__c != null && adminConfigConditions.Stain_Type__c != ''){
            list<string> conditionValueList = new list<string>();
            conditionValueList = adminConfigConditions.Stain_Type__c.split(';');
            returnMap.put('Stain_Type__c',conditionValueList);
        }                                                           
        
        return returnMap;
            
    }
    
    @AuraEnabled
    public static string getApexJobStatus(){
        list<string> jobstatuslist = new list<string>();
        jobstatuslist.add('Holding');
        jobstatuslist.add('Queued');
        jobstatuslist.add('Preparing');
        jobstatuslist.add('Processing');
        list<apexclass> apexClassList = new list<apexclass>([SELECT Id, Name FROM ApexClass]);
        map<string,id> apexClassNameToIdMap = new map<string,id>();
        for(apexclass rec : apexClassList){
            apexClassNameToIdMap.put(rec.name,rec.id);
        }
        list<AsyncApexJob> apexJobs = new list<AsyncApexJob>([select ApexClassID,CompletedDate,ExtendedStatus, JobItemsProcessed,MethodName,NumberOfErrors,Status,TotalJobItems,JobType,CreatedById from AsyncApexJob where JobType = 'Queueable' and Status IN :jobstatuslist and ApexClassID =: apexClassNameToIdMap.get('QueueableCalculatorService') and CreatedById =: userinfo.getUserId()]);
        
        if(apexJobs.size()>0){
            return 'Processing';
        }
        else return 'Completed';
    }
    
    
    @AuraEnabled
    public static string getAttachmentToAmazon(id quote){
        id batchinstanceid = database.executeBatch(new uploadImageToAmazonBatch('select id,name,Body,ParentId,ContentType,bodyLength from Attachment where ParentId='+'\''+quote+'\''),1);
        return 'UPLOADED';
    }*/
}