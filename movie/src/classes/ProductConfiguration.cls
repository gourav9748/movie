global class ProductConfiguration{

    global list<location> locations;
    
    global class location{
        global string locationName;
        global list<surface> surfaceList;
        global list<condition>conditions;
    }
    
    global class surface{
        global string surfaceName;
        global integer qty;
        global list<Condition> conditions;
    }
    
    global class condition{
        global string conditionName;
        global string conditionValue;
    }
}