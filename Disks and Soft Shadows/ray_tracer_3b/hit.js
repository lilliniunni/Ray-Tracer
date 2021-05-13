class Hit{
    constructor(){
        this.originX = 0;
        this.originY = 0;
        this.originZ = 0;
        
        this.normalX = 0;
        this.normalY = 0;
        this.normalZ = 0;
        this.depth = 0;
        this.object = 0;
        
    }
    set setOriginX(originX){
        this.originX = originX;
    }
    set setOriginY(originY){
        this.originY = originY;
    }
    set setOriginZ(originZ){
        this.originZ = originZ;
    }

    set setNormalX(normalX){
        this.normalX = normalX;
    }
    set setNormalY(normalY){
        this.normalY = normalY;
    }
    set setNormalZ(normalZ){
        this.normalZ = normalZ;
    }
    
    set setDepth(depth){
        this.depth = depth;
    }
    
    set setObject(object){
        this.object = object;
    }
    
    
    get getOriginX(){
        return this.originX;
    }
    get getOriginY(){
        return this.originY;
    }
    get getOriginZ(){
        return this.originZ;
    }
    
    get getNormalX(){
        return this.normalX;
    }
    get getNormalY(){
        return this.normalY;
    }
    get getNormalZ(){
        return this.normalZ;
    }
    
    get getDepth(){
        return this.depth;
    }
    
    get getObject(){
        return this.object;
    }
    
}