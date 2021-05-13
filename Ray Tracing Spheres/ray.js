class Ray{
    constructor(){
        this.originX = 0;
        this.originY = 0;
        this.originZ = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.directionZ = 0;
        
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
    set setDirectionX(directionX){
        this.directionX = directionX;
    }
    set setDirectionY(directionY){
        this.directionY = directionY;
    }
    set setDirectionZ(directionZ){
        this.directionZ = directionZ;
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
    get getDirectionX(){
        return this.directionX;
    }
    get getDirectionY(){
        return this.directionY;
    }
    get getDirectionZ(){
        return this.directionZ;
    }
}