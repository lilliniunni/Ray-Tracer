// routines for creating a ray tracing scene
let eye = new Eye();
let background = new Background();
let lights;
let area_lights;
let ambient = new Ambient();
let fov_angle;
let camera = new Camera();
let sphere_list;
let disk_list;
let hit = new Hit();
let level; 
let jitter;

// NEW COMMANDS FOR PART B

// create a new disk
function new_disk (x, y, z, radius, nx, ny, nz, dr, dg, db, k_ambient, k_specular, specular_pow) {
  let disk = new Disk();
  disk.setX = x;
  disk.setY = y;
  disk.setZ = z;
  disk.setRadius = radius;

  disk.setNx = nx;
  disk.setNy = ny;
  disk.setNz = nz; 

  disk.setDr = dr;
  disk.setDg = dg;
  disk.setDb = db;
  disk.setK_ambient = k_ambient;
  disk.setK_specular = k_specular;
  disk.setSpecular_pow = specular_pow;
  disk_list.push(disk);

}

// create a new area light source
function area_light (r, g, b, x, y, z, ux, uy, uz, vx, vy, vz) {
  let new_area_light = new AreaLight();
  new_area_light.setR = r;
  new_area_light.setG = g;
  new_area_light.setB = b;
  new_area_light.setX = x;
  new_area_light.setY = y;
  new_area_light.setZ = z;
  new_area_light.setUx = ux;
  new_area_light.setUy = uy;
  new_area_light.setUz = uz;
  new_area_light.setVx = vx;
  new_area_light.setVy = vy;
  new_area_light.setVz = vz; 
  // add the new light to the array of lights
  area_lights.push(new_area_light);
}

function set_sample_level(num){
  level = num;
}

function jitter_on() {
  jitter = true;
}

function jitter_off() {
  jitter = false;
}


// OLD COMMANDS FROM PART A (some of which you will still need to modify)


// clear out all scene contents
function reset_scene() {
  eye = new Eye();
  background = new Background();
  // create the new lights array for all the light source
  lights = [];
  // area light array 
  area_lights = [];
  //ambient light
  ambient = new Ambient();
  //fov_angle
  fov_angle = 0;
  //camera
  camera = new Camera();
  //reinitialized the objects in the scene
  sphere_list = [];
  disk_list = [];
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
  sphere_list.push(sphere);
}

// create an eye ray based on the current pixel's position
function eye_ray_uvw (i, j) {
  let u = -1.0 + ((2.0*i)/width);
  let v = -1.0 + ((2.0*j)/height);
  let d = 1.0/(tan(fov_angle/2.0));
  // get the big u, big v, and bif w. 
  let cameraU = createVector(camera.getXOne, camera.getYOne, camera.getZOne);
  let cameraV = createVector(camera.getXTwo, camera.getYTwo, camera.getZTwo);
  cameraV = p5.Vector.mult(cameraV, -1)
  let cameraW = createVector(camera.getXThree, camera.getYThree, camera.getZThree);

  // calculating the final ray_direction
  let ray_direction = p5.Vector.mult(cameraW, -d);
  ray_direction = p5.Vector.add(ray_direction, (p5.Vector.mult(cameraU, u)));
  ray_direction = p5.Vector.add(ray_direction,(p5.Vector.mult(cameraV, v)));
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
      let r = 0;
      let g = 0;
      let b = 0;
      // sub dividing x and y 
      for (let sy = 0; sy < level; sy++){
        for (let sx = 0; sx < level; sx++){
          let sub_x = subdivide(sx);
          let sub_y = subdivide(sy);
          let color = new Color();
          let eye_ray = eye_ray_uvw(sub_x + x, sub_y + y);
          let hit = intersect(eye_ray);
          // pass sub x and sub y -> (-1, 1)
          // use these to find the position of the light source
          color = color_grid(hit, sx, sy);
          r = r + color.getR;
          g = g + color.getG;
          b = b + color.getB;
        }
      }
      r = (r * 255) /(level*level)
      g = (g * 255)/(level*level)
      b = (b * 255) /(level*level)
      fill(r, g , b);
      rect(x, y, 1, 1);
    }
  }
}
// subdividing equation 
function subdivide(num){
  return (num + 1)/(level+1)-0.5;
}


function color_grid(hit, sx, sy){
  let color = new Color();
  if (hit != null){
    let shadow_ray;
    let object = hit.getObject;
    let hit_origin = createVector(hit.getOriginX, hit.getOriginY, hit.getOriginZ);
    let hit_normal = createVector(hit.getNormalX, hit.getNormalY, hit.getNormalZ);
    // regular lights
    for (let l = 0; l < lights.length; l++){
      let light_position = createVector(lights[l].getX, lights[l].getY, lights[l].getZ);
      let light_vector = (p5.Vector.sub(light_position, hit_origin)).normalize();
      // not normalized light vecotr
      let l_shadow = p5.Vector.sub(light_position, hit_origin)
      //creating shadow ray
      // origin of the ray is at the intersection point
      shadow_ray = new Ray();
      let shadow_norm;
      let shadow_orig;
      let normal;

      if (object instanceof Sphere){
        shadow_norm = p5.Vector.mult(hit_normal , 0.0000001)
        shadow_orig = p5.Vector.add(hit_origin, shadow_norm)
      }

      else if (object instanceof Disk){
        normal = createVector(object.getNx, object.getNy, object.getNz);
        shadow_norm = p5.Vector.mult(normal , 0.0000001)
        shadow_orig = p5.Vector.add(hit_origin, shadow_norm)
      }

      shadow_ray.setOriginX = shadow_orig.x
      shadow_ray.setOriginY = shadow_orig.y
      shadow_ray.setOriginZ = shadow_orig.z
      //ray direction is basically the L vector
      shadow_ray.setDirectionX = l_shadow.x 
      shadow_ray.setDirectionY = l_shadow.y
      shadow_ray.setDirectionZ = l_shadow.z
      let shadow_hit = intersect(shadow_ray);
      let if_block = 1;
      if (shadow_hit != null && shadow_hit.getDepth > 0 && shadow_hit.getDepth < 1){
        if_block = 0;
      }
      else if (object instanceof Sphere){
        color.setR = color.getR + object.getDr * lights[l].getR * max(0, p5.Vector.dot(hit_normal, light_vector)) * if_block;
        color.setG = color.getG + object.getDg * lights[l].getG * max(0, p5.Vector.dot(hit_normal, light_vector)) * if_block;
        color.setB = color.getB + object.getDb * lights[l].getB * max(0, p5.Vector.dot(hit_normal, light_vector))* if_block; 
      }
      else {
        color.setR = color.getR + object.getDr * lights[l].getR * max(0, p5.Vector.dot(normal, light_vector)) * if_block;
        color.setG = color.getG + object.getDg * lights[l].getG * max(0, p5.Vector.dot(normal, light_vector)) * if_block;
        color.setB = color.getB + object.getDb * lights[l].getB * max(0, p5.Vector.dot(normal, light_vector)) * if_block; 
      }
    }        
    // area lights    
    for (let l = 0; l < area_lights.length; l++){
      // use s and t value as the prameet as sub_x and sub_y 
      let light_position = createVector(area_lights[l].getX, area_lights[l].getY, area_lights[l].getZ);


      let u = createVector(area_lights[l].getUx, area_lights[l].getUy, area_lights[l].getUz);
      let v = createVector(area_lights[l].getVx, area_lights[l].getVy, area_lights[l].getVz);
      let s;
      let t;
      if (jitter) {
        s = (sx + 1 + random(-0.5, 0.5))/(level+1) * 2-1
        t = (sy + 1 + random(-0.5, 0.5))/(level+1) * 2-1
      }
      else {
        s = (sx + 1)/(level+1) * 2 - 1
        t = (sy + 1)/(level+1) * 2 - 1
      }
      let current_position = p5.Vector.add(light_position, p5.Vector.mult(u, s));
      current_position = p5.Vector.add(current_position, p5.Vector.mult(v, t));
      let light_vector = (p5.Vector.sub(current_position, hit_origin)).normalize();

      // not normalized light vector
      let l_shadow = p5.Vector.sub(current_position, hit_origin)
      shadow_ray = new Ray();
      let shadow_norm;
      let shadow_orig;
      let normal;
      if (object instanceof Sphere){
        shadow_norm = p5.Vector.mult(hit_normal , 0.001)
        shadow_orig = p5.Vector.add(hit_origin, shadow_norm)
      }
      else if (object instanceof Disk){
        normal = createVector(object.getNx, object.getNy, object.getNz);
        shadow_norm = p5.Vector.mult(normal , 0.001)
        shadow_orig = p5.Vector.add(hit_origin, shadow_norm)
      }
      shadow_ray.setOriginX = shadow_orig.x
      shadow_ray.setOriginY = shadow_orig.y
      shadow_ray.setOriginZ = shadow_orig.z
      //ray direction is basically the L vector
      shadow_ray.setDirectionX = l_shadow.x 
      shadow_ray.setDirectionY = l_shadow.y
      shadow_ray.setDirectionZ = l_shadow.z
      let shadow_hit = intersect(shadow_ray);

      let if_block = 1;
      if (shadow_hit != null && shadow_hit.getDepth > 0 && shadow_hit.getDepth < 1){
        if_block = 0;
      }
      else if (object instanceof Sphere){
        color.setR = color.getR + object.getDr * area_lights[l].getR * max(0, p5.Vector.dot(hit_normal, light_vector))*if_block;
        color.setG = color.getG + object.getDg * area_lights[l].getG * max(0, p5.Vector.dot(hit_normal, light_vector))*if_block;
        color.setB = color.getB + object.getDb * area_lights[l].getB * max(0, p5.Vector.dot(hit_normal, light_vector))*if_block; 
      }
      else {
        color.setR = color.getR + object.getDr * area_lights[l].getR * max(0, p5.Vector.dot(normal, light_vector))*if_block;
        color.setG = color.getG + object.getDg * area_lights[l].getG * max(0, p5.Vector.dot(normal, light_vector))*if_block;
        color.setB = color.getB + object.getDb * area_lights[l].getB * max(0, p5.Vector.dot(normal, light_vector))*if_block; 
      }
    }
    // color.setR = color.getR * object.getDr
    // color.setG = color.getG * object.getDg
    // color.setB = color.getB * object.getDb

    color.setR = color.getR + ambient.getR * object.getDr * object.getK_ambient
    color.setG = color.getG + ambient.getG * object.getDg * object.getK_ambient
    color.setB = color.getB + ambient.getB * object.getDb * object.getK_ambient
  }
  else {
    color = background;
  }
  return color;
}

function intersect(ray){
    let hits = [];
    for (let i = 0; i < sphere_list.length; i++){
        let sphere = sphere_list[i];
        let center = createVector(sphere.getX, sphere.getY, sphere.getZ);
        let radius = sphere.getRadius;
        let ray_direction = createVector(ray.getDirectionX, ray.getDirectionY, ray.getDirectionZ);
        let ray_origin = createVector(ray.getOriginX, ray.getOriginY, ray.getOriginZ);
        let a = p5.Vector.dot(ray_direction,ray_direction);
        let b = 2.0*p5.Vector.dot(p5.Vector.sub(ray_origin, center), ray_direction);
        let c =  (p5.Vector.dot(p5.Vector.sub(ray_origin, center),(p5.Vector.sub(ray_origin, center)))) - sq(radius);
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
                hit.setObject = sphere;
                hits.push(hit);
            }
        }
    }
    for (let i =0; i < disk_list.length; i++){
      let disk = disk_list[i]
      let center = createVector(disk.getX, disk.getY, disk.getZ);
      // find a, b, c
       // surface normale of our plane
      let disk_plane = createVector(disk.getNx, disk.getNy, disk.getNz);
      // solving for d
      let d = -p5.Vector.dot(disk_plane, center);
      let radius = disk.getRadius;
      let ray_direction = createVector(ray.getDirectionX, ray.getDirectionY, ray.getDirectionZ);
      let ray_origin = createVector(ray.getOriginX, ray.getOriginY, ray.getOriginZ);
      if (p5.Vector.dot(disk_plane, ray_direction) == 0){
          // if N * d is 0, our surface is exactly parallel to our plane
          continue; //no hit found for this circle 
      }
      let top = -(p5.Vector.dot(disk_plane, ray_origin) + d);
      let bottom = p5.Vector.dot(disk_plane, ray_direction);
      let t = top/bottom 
      if (t > 0){
        // calculate the ray intersection point with respect to t
        let intersection = p5.Vector.add(ray_origin , p5.Vector.mult(ray_direction, t))
        let distance = p5.Vector.dist(center, intersection)
        // interception point of the ray to the plane to the disk center is greater than the radius of the disk
        if (distance > radius){
          continue;
        }
        // proceed
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
        hit.setObject = disk;
        hits.push(hit);
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

