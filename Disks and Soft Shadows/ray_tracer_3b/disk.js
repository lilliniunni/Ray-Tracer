class Disk{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        
        this.radius = 0;
        
        this.nx = 0;
        this.ny = 0;
        this.nz = 0;


        this.dr = 0;
        this.dg = 0;
        this.db = 0;
        
        this.k_ambient = 0;
        this.k_specular = 0;
        this.specular_pow = 0;
    }
    set setX(x){
        this.x = x;
    }
    set setY(y){
        this.y = y;
    }
    set setZ(z){
        this.z = z;
    }
    
    set setRadius(radius){
        this.radius = radius;
    }

    set setNx(nx){
        this.nx = nx
    }
    set setNy(ny){
        this.ny = ny
    }
    set setNz(nz){
        this.nz = nz
    }
    
    set setDr(dr){
        this.dr = dr;
    }
    set setDg(dg){
        this.dg = dg;
    }
    set setDb(db){
        this.db = db;
    }
    
    set setK_ambient(k_ambient){
        this.k_ambient = k_ambient;
    }
    set setK_sepcular(k_specular){
        this.k_specular = k_specular;
    }
    set setSpecular_pow(specular_pow){
        this.specular_pow = specular_pow;
    }
    
    get getX(){
        return this.x;
    }
    get getY(){
        return this.y;
    }
    get getZ(){
        return this.z;
    }
    get getRadius(){
        return this.radius;
    }
    get getNx (){
        return this.nx;
    }
    get getNy (){
        return this.ny;
    }
    get getNz (){
        return this.nz;
    }
    get getDr(){
        return this.dr;
    }
    get getDg(){
        return this.dg;
    }
    get getDb(){
        return this.db;
    }
    get getK_ambient(){
        return this.k_ambient;
    }
    get getK_specular(){
        return this.k_specular;
    }
    get getSpecular_pow(){
        return this.specular_pow;
    }

}