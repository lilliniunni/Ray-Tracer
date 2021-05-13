// routines for creating a ray tracing scene
// global variables
let eye = new Eye();
let background = new Background();
let lights;
let ambient = new Ambient();
let fov_angle;
let camera = new Camera();
let scene_objects;
let hit = new Hit();
// clear out all scene contents
function reset_scene() {
    eye = new Eye();
    background = new Background();
    
    // create the new lights array for all the light source
    lights = [];
    
    //ambient light
    ambient = new Ambient();
    
    //fov_angle
    fov_angle = 0;
    
    //camera
    camera = new Camera();
    
    //reinitialized the objects in the scene
    scene_objects = [];
    
    //the hit object 
    hit = null;
} 

// create a new point light source
function new_light (r, g, b, x, y, z) {
    let new_light = new Light();
    
    new_light.setR = r;
    new_light.setG = g;
    new_light.setB = b;
    
    new_light.setX = x;
    new_light.setY = y;
    new_light.setZ = z;
    
    // add the new light to the array of lights
    lights.push(new_light);
}

// set value of ambient light source
function ambient_light (r, g, b) {
    ambient.setR = r;
    ambient.setG = g;
    ambient.setB = b;
}

// set the background color for the scene
function set_background (r, g, b) {
    background.setR = r;
    background.setG = g;
    background.setB = b;
}

// set the field of view
function set_fov (theta) {
   fov_angle = radians(theta);
}

// set the position of the virtual camera/eye
function set_eye_position (x, y, z) {
    eye.setX = x;
    eye.setY = y;
    eye.setZ = z;
}

// set the virtual camera's viewing direction
function set_uvw(x1,y1, z1, x2, y2, z2, x3, y3, z3) {
    camera.setXOne = x1;
    camera.setYOne = y1;
    camera.setZOne = z1;
    
    camera.setXTwo = x2;
    camera.setYTwo = y2;
    camera.setZTwo = z2;
    
    camera.setXThree = x3;
    camera.setYThree = y3;
    camera.setZThree = z3;
}

// create a new sphere
function new_sphere (x, y, z, radius, dr, dg, db, k_ambient, k_specular, specular_pow) {
    let sphere = new Sphere();
    sphere.setX = x;
    sphere.setY = y;
    sphere.setZ = z;
    sphere.setRadius = radius;
    sphere.setDr = dr;
    sphere.setDg = dg;
    sphere.setDb = db;
    sphere.setK_ambient = k_ambient;
    sphere.setK_specular = k_specular;
    sphere.setSpecular_pow = specular_pow;

    scene_objects.push(sphere);
}

// create an eye ray based on the current pixel's position
function eye_ray_uvw (i, j) {
    let u = -1.0 + ((2.0*i)/width);
    let v = -1.0 + ((2.0*j)/height);
    let d = 1.0/(tan(fov_angle/2.0));
    // get the big u, big v, and bif w. 
    let cameraU = createVector(camera.getXOne, camera.getYOne, camera.getZOne);
    let cameraV = createVector(camera.getXTwo, camera.getYTwo, camera.getZTwo);
    let cameraW = createVector(camera.getXThree, camera.getYThree, camera.getZThree);

    // calculating the final ray_direction
    let ray_direction = p5.Vector.mult(cameraW, -d);
    ray_direction = p5.Vector.add(ray_direction, (p5.Vector.mult(cameraU, u)));
    ray_direction = p5.Vector.add(ray_direction,(p5.Vector.mult(cameraV, v)));
    
    ray_direction.y = -ray_direction.y;
    
    let eye_ray = new Ray();
    eye_ray.setOriginX = eye.getX;
    eye_ray.setOriginY = eye.getY;
    eye_ray.setOriginZ = eye.getZ;
    eye_ray.setDirectionX = ray_direction.x;
    eye_ray.setDirectionY = ray_direction.y;
    eye_ray.setDirectionZ = ray_direction.z;
    return eye_ray;

}

// this is the main routine for drawing your ray traced scene
function draw_scene() {

  noStroke();  // so we don't get a border when we draw a tiny rectangle

  // go through all the pixels in the image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) { 
        // create eye ray
        let eye_ray = eye_ray_uvw (x, y);
        
        fill(255 * background.getR, 255 * background.getG, 255 * background.getB);
        rect (x, y, 1, 1);
        
        hit = intersect(eye_ray);

        let color = new Color();
        if (hit != null){

            let hit_origin = createVector(hit.getOriginX, hit.getOriginY, hit.getOriginZ);

            let hit_normal = createVector(hit.getNormalX, hit.getNormalY, hit.getNormalZ);

            for (let l = 0; l < lights.length; l++){

                let light_position = createVector(lights[l].getX, lights[l].getY, lights[l].getZ);

                let light_vector = (p5.Vector.sub(light_position, hit_origin)).normalize();

                color.setR = color.getR + lights[l].getR * max(0, p5.Vector.dot(hit_normal, light_vector));

                color.setG = color.getG + lights[l].getG * max(0, p5.Vector.dot(hit_normal, light_vector));

                color.setB = color.getB + lights[l].getB * max(0, p5.Vector.dot(hit_normal, light_vector));
            }
            let sphere = hit.getSphere;
            color.setR = color.getR * sphere.getDr;
            color.setG = color.getG * sphere.getDg;
            color.setB = color.getB * sphere.getDb;
            fill(color.getR * 255, color.getG * 255, color.getB * 255);
            rect(x,y,1,1);
        }
    }

  }
}

function intersect(ray){
    let hits = [];
    for (let i = 0; i < scene_objects.length; i++){

        let sphere = scene_objects[i];
        
        let center = createVector(sphere.getX, sphere.getY, sphere.getZ);
        let radius = sphere.getRadius;

        let ray_direction = createVector(ray.getDirectionX, ray.getDirectionY, ray.getDirectionZ);
        let ray_origin = createVector(ray.getOriginX, ray.getOriginY, ray.getOriginZ);

        let a = p5.Vector.dot(ray_direction,ray_direction);

        let b = 2.0* p5.Vector.dot(p5.Vector.sub(ray_origin, center), ray_direction);

        let c =  (p5.Vector.dot(p5.Vector.sub(ray_origin, center), (p5.Vector.sub(ray_origin, center)))) - sq(radius);

        let det = sq(b)-(4.0*a*c);

        if (det >= 0) {
            // get t1 and t2 
            let t1 = (-b + sqrt(det))/(2.0*a);
            let t2 = (-b - sqrt(det))/(2.0*a);

            let t = 0;
            // ----------------for t----------------------
            if (t1 > 0.0 && t2 > 0.0){ 
                t = min(t1,t2);
            }
            if (t1 > 0.0 && t2 < 0.0){
                t = t1;
            }
            if (t1 < 0.0 && t2 > 0.0){
                t = t2;
            }
            
            if (t > 0.0){
                let hit_origin = p5.Vector.add(ray_origin, p5.Vector.mult(ray_direction, t));

                let hit_normal = (p5.Vector.sub(hit_origin, center)).normalize();
                
                hit = new Hit();

                hit.setOriginX = hit_origin.x;
                hit.setOriginY = hit_origin.y;
                hit.setOriginZ = hit_origin.z;

                hit.setNormalX = hit_normal.x;
                hit.setNormalY = hit_normal.y;
                hit.setNormalZ = hit_normal.z;

                hit.setDepth = t;
                hit.setSphere = sphere;
                hits.push(hit);
            }
        }
    }

    hit = null;
    min_depth = Infinity;
    for (let h = 0; h < hits.length; h++){
        curr_hit = hits[h];
        // get the hit of the minimum depth 
        if (curr_hit.getDepth < min_depth && curr_hit.getDepth > 0){
            min_depth = curr_hit.getDepth;
            hit = curr_hit;

        }
    }
    return hit;
}
