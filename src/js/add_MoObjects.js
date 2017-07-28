var addMoObject=function(){
    if(!(this instanceof addMoObject)) return new addMoObject();
    
  
	
};
addMoObject.prototype={
   add_jiheti : function(editor,type)
   {
   		var plane ;

	   	switch(type)
	   	{
	   		case "fangxing":
	   			plane = new THREE.PlaneBufferGeometry(1,1);
	   		break;
	   		case "yuanxing":
	   			plane = new THREE.CircleBufferGeometry(1,32);
	   		break;
	   		case "lifangti":
	   			plane = new THREE.BoxBufferGeometry(1,1,1);
	   		break;
	   		case "qiuti":
	   			plane = new THREE.SphereBufferGeometry(1,32,32);
	   		break;
	   		default:
	   		break;
	   	}
   		var mal = new THREE.MeshPhongMaterial({color:0xffffff});
		var mesh = new THREE.Mesh(plane,mal);
		for (var i = 1; i < 99; i++) {
			if(editor.scene.getObjectByName(type+i)==undefined)
			{
				mesh.name = type+i;
				break;
			}
		}
		
		editor.scene.add(mesh);
		//editor.objects.push(mesh);
		editor.signals.objectAdded.dispatch(mesh);
		return mesh.name;
   },
   add_light : function(editor,type)
   {	var light,lightHelper;
   		switch(type)
   		{
   			case "pointLight":
   				light = new THREE.PointLight(0xffffff, 1, 100);
   				light.position.set(0,0,0);
   			break;
   			case "spotLight":
   				light = new THREE.SpotLight( 0xffffff );
   				light.angle = 0.314;
   				light.position.set(20,20,20);
   				//lightHelper = new THREE.SpotLightHelper( light );
   			break;
   			case "dirLight":
   				light = new THREE.DirectionalLight( 0xFFFFFF );
   				light.position.set(20,20,20);
   				//lightHelper = new THREE.DirectionalLightHelper( light, 5 );
   			break;
   			case "ambLight":
   				light = new THREE.AmbientLight( 0xffffff );
   			break;
   		}
   		for (var i = 1; i < 99; i++) {
			if(editor.scene.getObjectByName(type+i)==undefined)
			{
				light.name = type+i;
				break;
			}
		}
   		editor.scene.add(light);
   		
   		//lightHelper.name = "picker";
   		//editor.sceneHelpers.add(lightHelper);
   		editor.addObject(light);
   		return light.name;
   		//editor.objects.push(lightHelper);
   }
};


exports.addMoObject = addMoObject();