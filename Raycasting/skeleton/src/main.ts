// custom imports
import { CanvasWidget } from './canvasWidget';
import * as helper from './helper';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';
import { Matrix4, Scene } from 'three';

function main(){
    var settings = new helper.Settings();
    settings.addCallback(callback);
    settings.render=()=>select();
    var gui = helper.createGUI(settings);
    gui.open();

    function select(){
      canvas_wid.changeDimensions(settings.width,settings.height);
      if(!settings.correctSpheres){
        phong2(settings.width,settings.height);
        //raycast(settings.width,settings.height);
      }
      else{
        phong(settings.width,settings.height);
      }
    }
    
    var root = Application("Texture");
    
        // define the (complex) layout, that will be filled later:
        root.setLayout([
            ["renderer",'renderer2']
      
        ]);
        root.setLayoutColumns(["50%",'50%']);
        root.setLayoutRows(["100%",'100%']);
      
      var rendererDiv = createWindow("renderer");
      var rendererDiv2= createWindow('renderer2');
    
      // add it to the root application
      root.appendChild(rendererDiv);
      root.appendChild(rendererDiv2);
      
      
      // create renderer
      var renderer = new THREE.WebGLRenderer({
          antialias: true,  // to enable anti-alias and get smoother output
      });
      var renderer2 = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });
    
    var scene = new THREE.Scene();
    //var sceneleft = new THREE.Scene();

    var meshestmp = helper.setupGeometry(scene);
    
    
    var camera= new THREE.PerspectiveCamera();
    helper.setupCamera(camera);
    
    
    var controls = new OrbitControls(camera, rendererDiv2);
    
    helper.setupControls(controls);
    
    
    var wid1 = new RenderWidget(rendererDiv2,renderer2,camera,scene,controls);
    var canvas_wid = new CanvasWidget(rendererDiv,settings.width,settings.height);
    //raycast_sphere(256,256);
    //raycast(256,256);
    console.log(scene.children[9]);
    var lights: THREE.PointLight[]=helper.setupLight(scene);
    var tmp = scene.children.slice(0,-3); //scene.children without the light points
    var spheres: THREE.Mesh[] ;//array with the sphere meshes
    spheres=[meshestmp[0],meshestmp[1],meshestmp[2]];
      
    console.log(tmp);
    console.log(spheres);
    console.log(scene.children);

    //phong(256,256);
    
    wid1.animate();
    function raycast(width: number, height:number){
      var intersections= [] ;
      var color: THREE.Color;
      var raycast = new THREE.Raycaster();
      
     
      for(var x=0;x<width;x++){
        for(var y=0; y<height;y++){

              raycast.setFromCamera((new THREE.Vector2((x/width*2)-1,-((y/height*2)-1))),camera);
              var direction = raycast.ray.direction;
              
              intersections = raycast.intersectObjects(tmp);
 
              if(intersections.length>0){
          
              color = intersections[0].object.material.color;
              canvas_wid.setPixel(x,y,new THREE.Color(color));
              }
              else{
                canvas_wid.setPixel(x,y,new THREE.Color('black'));
              }
            
        }
      }
    }

    function intersectedSpheres(origin: THREE.Vector3, direction: THREE.Vector3){
    var intersections = [];
    var distance:number;
    var point = new THREE.Vector3();
    var sphere:THREE.Mesh=spheres[0];
    console.log('aaaaaaaaaaaaa');
  
    for(var i=0;i<3;i++){
      sphere=spheres[i];
      var L = sphere.position.clone().sub(camera.position);
      var Tca = L.dot(direction.clone());
      if(Tca<0) continue;
      var d = L.dot(L) - Tca*Tca;
      var Thc = (Math.pow(50/300,2) -d);
    
      if(Thc>=0){//there is an intersection
        distance=Tca-Math.sqrt(Thc);
        point.copy(direction).multiplyScalar(distance);
        point.add(origin.clone());
        if(!intersections.length){
          intersections = [distance, sphere, point.clone()];
        }
        else if(distance<intersections[0]){
          intersections = [distance, sphere, point.clone()];
        }
      }
    }
    return intersections;
    }

    function compareDistance(nonSpherical: THREE.Intersection, spherical){
      var closestObject: THREE.Object3D;
      var point = new THREE.Vector3();
      var value=[];
      if(!spherical.length){
        closestObject=nonSpherical.object;
        point = nonSpherical.point;
      }
      else{
        if(nonSpherical.distance<spherical[0]){
          closestObject=nonSpherical.object;
          point=nonSpherical.point;}
        else{
          closestObject=spherical[1];
          point=spherical[2];
        }
      }
      value= [point,closestObject];
      return value;
    }
    
    function phong(width: number, height:number){
      
      var raycast = new THREE.Raycaster();
      var n_lights;
      
      for(var x=0;x<width;x++){
        for(var y=0; y<height;y++){
    
              raycast.setFromCamera((new THREE.Vector2((x/width*2)-1,-((y/height*2)-1))),camera);
              var point: THREE.Vector3;
              var origin = raycast.ray.origin;
              var direction = raycast.ray.direction;
              var intersections: THREE.Intersection[];
              
              var object;
              intersections = raycast.intersectObjects(tmp);
              var sphereIntersects = intersectedSpheres(origin,direction);
             
              
              if(intersections.length>0||sphereIntersects.length>0){
                if(!intersections.length){
                  point=sphereIntersects[2];
                  object=sphereIntersects[1];
                }
                else{
                  var result = compareDistance(intersections[0],sphereIntersects);
                  point = result[0];
                  object = result[1];
                }
                if(!settings.phong){
                  canvas_wid.setPixel(x,y,object.material.color);
                  continue;
                }else{
                  
                //CALCULATE COLOR (PHONG)
                  if(!settings.alllights){
                    n_lights=1;
                  }else{n_lights=lights.length;}

                var color= new THREE.Color(0,0,0);
                var normal: THREE.Vector3;
                var light_dir = new THREE.Vector3();
                for(var i=0; i<n_lights;i++){
                  if(settings.shadows){
                    var ray_tmp = new THREE.Raycaster(point, lights[i].position.clone());
                    var sphereexist = intersectedSpheres(ray_tmp.ray.origin,ray_tmp.ray.direction).length>0;
                   
                    if(object.geometry.type=='SphereGeometry'){
                      if(sphereexist||intersections.length>0) continue;
                    }
                  }

                  var diffColor:THREE.Color = object.material.color.clone();
                  var specColor:THREE.Color = object.material.specular.clone();

                  
                  light_dir.copy(lights[i].position).sub(point);
                  var light_length = lights[i].position.clone().distanceToSquared(point);
                  var attentuation = 1/light_length; 

                  if(object.geometry.type== 'SphereGeometry'){
                    normal.copy(point).sub(object.position.clone()).normalize();
                  }
                  else{normal=intersections[0].face.normal;}
                
                //normalize the light now
                light_dir = light_dir.clone().normalize();

                var ref_dir = light_dir.reflect(normal).normalize();
                var view_dir=direction;
                
                var diff = Math.max(normal.dot(light_dir),0)*attentuation*2;
                diffColor.multiply(lights[i].color.clone().multiplyScalar(lights[i].intensity)).multiplyScalar(diff);
            
                var spec = Math.pow(Math.max(ref_dir.dot(view_dir),0),object.material.shininess/10)*attentuation*4;
                specColor.multiply(lights[i].color.clone().multiplyScalar(lights[i].intensity)).multiplyScalar(spec);
                color.add(diffColor).add(specColor).add(object.material.color.clone().multiplyScalar(0.05));
                }
                //color.add(new THREE.Color(0.3,0.3,0.3));
                canvas_wid.setPixel(x,y,new THREE.Color(color));
              }
            }
              else{
                canvas_wid.setPixel(x,y, new THREE.Color('black'));
              }
            
        }
      }
    }
    function phong2(width: number, height:number){
      
      var raycast = new THREE.Raycaster();
      var n_lights;
      
      for(var x=0;x<width;x++){
        for(var y=0; y<height;y++){
    
              raycast.setFromCamera((new THREE.Vector2((x/width*2)-1,-((y/height*2)-1))),camera);
              var point: THREE.Vector3;
              var origin = raycast.ray.origin;
              var direction = raycast.ray.direction;
              var intersections: THREE.Intersection[];
              
              var object:THREE.Mesh;
              intersections = raycast.intersectObjects(scene.children.slice(0,-3));
             
              
              if(intersections.length>0){
               object=intersections[0].object;
               point=intersections[0].point;

                if(!settings.phong){
                  canvas_wid.setPixel(x,y,object.material.color);
                  continue;
                }else{
                  
                //CALCULATE COLOR (PHONG)
                  if(!settings.alllights){
                    n_lights=1;
                  }else{n_lights=lights.length;}

                var color= new THREE.Color(0,0,0);
                var normal: THREE.Vector3;
                var light_dir = new THREE.Vector3();
                for(var i=0; i<n_lights;i++){
                  if(settings.shadows){
                    var ray_tmp = new THREE.Raycaster(point, lights[i].position.clone());
                    var sphereexist = intersectedSpheres(ray_tmp.ray.origin,ray_tmp.ray.direction).length>0;
                   
                    if(object.geometry.type=='SphereGeometry'){
                      if(sphereexist||intersections.length>0) continue;
                    }
                  }

                  var diffColor:THREE.Color = object.material.color.clone();
                  var specColor:THREE.Color = object.material.specular.clone();

                  
                  light_dir.copy(lights[i].position).sub(point);
                  var light_length = lights[i].position.clone().distanceToSquared(point);
                  var attentuation = 1/light_length; 

                  normal=intersections[0].face.normal;
                
                //normalize the light now
                light_dir = light_dir.clone().normalize();

                var ref_dir = light_dir.reflect(normal).normalize();
                var view_dir=direction;
                
                var diff = Math.max(normal.dot(light_dir),0)*attentuation*2.5;
                diffColor.multiply(lights[i].color.clone().multiplyScalar(lights[i].intensity)).multiplyScalar(diff);
                
                var spec = Math.pow(Math.max(ref_dir.dot(view_dir),0),object.material.shininess/12)*attentuation*4;
                specColor.multiply(lights[i].color.clone().multiplyScalar(lights[i].intensity)).multiplyScalar(spec);
                color.add(diffColor).add(specColor);
                }
                //color.add(new THREE.Color(0.3,0.3,0.3));
                canvas_wid.setPixel(x,y,new THREE.Color(color));
              }
            }
              else{
                canvas_wid.setPixel(x,y, new THREE.Color('black'));
              }
            
        }
      }
    }

    function callback(changed: utils.KeyValuePair<helper.Settings>){
      if(changed.key == 'width' || changed.key == 'height'){
        //canvas_wid.changeDimensions(settings.width,settings.height);
      }
      
    }
    //save image when 'save' is pressed
    document.addEventListener('save',function save(){
      canvas_wid.savePNG();
    });
}

// call main entrypoint
main();
/*
    function intersectsSphere(ray: THREE.Ray){
      var count = 0;
      for (var i = 0; i<3; i++){
          var Loc = spheres[i].position.clone().sub(ray.origin);
          var Tca = Loc.dot(ray.direction);
          if (Tca < 0) continue;
          var D2 = Loc.dot(Loc) - Tca*Tca;
          var Thc2 = (Math.pow(50/300,2) -D2);
          if (Thc2 >= 0) {
              if (Tca-Math.pow(Thc2,0.5)>0) count++;
              if (Tca+Math.pow(Thc2,0.5)>0) count++;
          }
      }
      return count>0;
  }
    function raycast_sphere(width: number, height:number){
      var intersections= [] ;
      var sphere_intersection= [];
      var color: THREE.Color;
      var raycast = new THREE.Raycaster();
      var object;
  
      
      console.log(tmp);
      var L = new THREE.Vector3(0,0,0);
      var d;
      var Tca;
      var Thc;
      var t0;
      var t1;
      var P0:THREE.Vector3;
      var P1:THREE.Vector3;
      
      for(var x=0;x<width;x++){
        for(var y=0; y<height;y++){
           
              
              raycast.setFromCamera((new THREE.Vector2((x/width*2)-1,-((y/height*2)-1))),camera);
              var direction = raycast.ray.direction;
              var origin = raycast.ray.origin;
              var raycast1 = new THREE.Raycaster(camera.position,direction);
              intersections = raycast.intersectObjects(tmp);
              var sphere_intersection= [];
              //console.log(intersections[0].object);
              for(var i=0;i<3;i++){
                d=0;  
                Tca=0;
                var L = new THREE.Vector3(0,0,0);
                object=spheres[i];
                console.log(object);
                L.subVectors(object.position,origin);
                Tca=L.dot(direction);
      
                d=L.dot(L) - Tca*Tca;
                console.log(d);
                Thc = Math.sqrt(50*50/(300*300)-d*d);
                t0=Tca-Thc;
                t1=Tca+Thc;
                
                P0 = origin.addScaledVector(direction,t0);
                P1 = origin.addScaledVector(direction,t1);
                var find = t0>0 || t1>0;
                if(d<=50*50/(300*300)){
                  canvas_wid.setPixel(x,y,new THREE.Color(object.material.color));
                  sphere_intersection.push(object);
                  
                }else{console.log('ahaa');}
                
            }
            if(sphere_intersection.length<1){
              if(intersections.length>0){
              console.log(intersections);
              object=intersections[0].object
              color = object.material.color;
              if(object.geometry.name != 'sphere'){
                
                canvas_wid.setPixel(x,y,new THREE.Color(color));}
              }
             
              else{
                canvas_wid.setPixel(x,y,new THREE.Color('black'));
              }
            }
        }     
            
      }
    }

              console.log(intersections);
              object=intersections[0];
              color = intersections[0].object.material.color.clone(); //diffuse color
              var spec = object.object.material.specular.clone() //specualr color
              var light_color=light.color.clone();
              point=object.point;
              //modelMatrix
              m.getInverse(object.object.matrixWorld).transpose();
              normal= object.face.normal;
              normal=normal.applyMatrix4(m).normalize();
              var light_pos=light.position;
              var light_dir=light_pos.sub(point);
              var attentuation = 1/(light_dir.length()*light_dir.length());
              light_dir=light_dir.normalize();
    
              var view_dir=camera.position.clone().sub(point).normalize();
              var ref_dir=light_dir.multiplyScalar(-1).reflect(normal);
              var diffuseIntensity= Math.max(normal.dot(light_dir), 0) * light.intensity;
              diffuseCol=color.multiply(light_color).multiplyScalar(diffuseIntensity*attentuation);
    
              var intensitySpec = Math.pow(view_dir.dot(ref_dir), object.object.material.shininess)*diffuseIntensity;
              specCol=spec.multiply(light_color).multiplyScalar(intensitySpec*attentuation);
              color=diffuseCol.add(specCol);

*/