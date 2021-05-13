class Camera{
    contructor(){       
        this.x1 = 0;
        this.y1 = 0;
        this.z1 = 0;
        
        this.x2 = 0;
        this.y2 = 0;
        this.z2 = 0;
        
        this.x3 = 0;
        this.y3 = 0;
        this.z3 = 0;
    }
    set setXOne(x1){
        this.x1 = x1;
    }
    set setYOne(y1){
        this.y1 = y1;
    }
    set setZOne(z1){
        this.z1 = z1;
    }
    
    set setXTwo(x2){
        this.x2 = x2;
    }
    set setYTwo(y2){
        this.y2 = y2;
    }
    set setZTwo(z2){
        this.z2 = z2;
    }
    
    set setXThree(x3){
        this.x3 = x3;
    }
    set setYThree(y3){
        this.y3 = y3;
    }
    set setZThree(z3){
        this.z3 = z3;
    }
    
    
    get getXOne(){
        return this.x1;
    }
    get getYOne(){
        return this.y1;
    }
    get getZOne(){
        return this.z1;
    }
    
    get getXTwo(){
        return this.x2;
    }
    get getYTwo(){
        return this.y2;
    }
    get getZTwo(){
        return this.z2;
    }

    get getXThree(){
        return this.x3;
    }
    get getYThree(){
        return this.y3;
    }
    get getZThree(){
        return this.z3;
    }
}