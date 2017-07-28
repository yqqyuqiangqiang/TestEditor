var Viewport = function ( editor ) {

	var signals = editor.signals;

	var container = document.getElementById('content-scene-main');//new UI.Panel();
	//container.setId( 'viewport' );
	//container.setPosition( 'absolute' );

	//container.add();

	//

	var renderer = null;
	var aspect = container.offsetWidth / container.offsetHeight;
	var camera =editor.camera; 
	camera.aspect = aspect;
	camera.updateProjectionMatrix();
	
	var frustumSize = 10;
	var cameraOrtho = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 10000 );

	//cameraOrthoHelper = new THREE.CameraHelper( cameraOrtho );
			
	var scene = editor.scene;
	
	var sceneHelpers = editor.sceneHelpers;


	var objects = editor.objects;

	var MorenLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	var box =new THREE.Object3D();
	box.position.set(0,0,-0.1);
	camera.add(MorenLight);
	scene.add( camera );
	MorenLight.add(box);
	MorenLight.target = box;
	

	var vrEffect, vrControls;

	if ( WEBVR.isAvailable() === true ) {

		var vrCamera = new THREE.PerspectiveCamera();
		vrCamera.projectionMatrix = camera.projectionMatrix;
		camera.add( vrCamera );

	}
	
	renderer = new THREE.WebGLRenderer( { antialias: true } );
		
	renderer.setClearColor(0xffffff);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	renderer.sortObjects = false;
	renderer.autoClear = false;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.soft = true;
	  
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.renderReverseSided = false;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.offsetWidth, container.offsetHeight );

	container.appendChild( renderer.domElement );

	

		vrControls = new THREE.VRControls( vrCamera );
		vrEffect = new THREE.VREffect( renderer );

		window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

			//effect.isPresenting ? signals.enteredVR.dispatch() : signals.exitedVR.dispatch();

		}, false );

	
	// helpers

	var grid = new THREE.GridHelper( 60, 60 );
	sceneHelpers.add( grid );

	//

	var box = new THREE.Box3();

	var selectionBox = new THREE.BoxHelper();
	selectionBox.material.depthTest = false;
	selectionBox.material.transparent = true;
	selectionBox.visible = false;
	sceneHelpers.add( selectionBox );

	var objectPositionOnDown = null;
	var objectRotationOnDown = null;
	var objectScaleOnDown = null;

	var transformControls = new THREE.TransformControls( camera, container );
	transformControls.addEventListener( 'change', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {
			if(selectionBox.geometry.boundingSphere.radius!=NaN)
			{
			
				selectionBox.setFromObject( object );
			}
			
			if ( editor.helpers[ object.id ] !== undefined ) {

				editor.helpers[ object.id ].update();

			}

			signals.refreshSidebarObject3D.dispatch( object );

		}

		render();

	} );
	transformControls.addEventListener( 'mouseDown', function () {

		var object = transformControls.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();
		editor.update_element();
		controls.enabled = false;

	} );
	transformControls.addEventListener( 'mouseUp', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			switch ( transformControls.getMode() ) {

				case 'translate':

					if ( ! objectPositionOnDown.equals( object.position ) ) {
						editor.update_element();
						editor.setHistory("setPosition",object,objectPositionOnDown);
						//editor.execute( new SetPositionCommand( object, object.position, objectPositionOnDown ) );

					}

					break;

				case 'rotate':

					if ( ! objectRotationOnDown.equals( object.rotation ) ) {
						editor.update_element();
						editor.setHistory("setRotaition",object,objectRotationOnDown);
						//editor.execute( new SetRotationCommand( object, object.rotation, objectRotationOnDown ) );

					}

					break;

				case 'scale':

					if ( ! objectScaleOnDown.equals( object.scale ) ) {
						editor.update_element();
						editor.setHistory("setScale",object,objectScaleOnDown);
						//editor.execute( new SetScaleCommand( object, object.scale, objectScaleOnDown ) );

					}

					break;

			}

		}

		controls.enabled = true;

	} );

	sceneHelpers.add( transformControls );

	// object picking

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// events

	function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}

	var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();

	function getMousePosition( dom, x, y ) {

		var rect = dom.getBoundingClientRect();
		
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

			var intersects = getIntersects( onUpPosition, objects );

			if ( intersects.length > 0 ) {

				var object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {

					// helper

					editor.select( object.userData.object );

				} else {

					editor.select( object );

				}

			} else {

				editor.select( null );

			}

			render();

		}

	}

	function onMouseDown( event ) {

		event.preventDefault();

		var array = getMousePosition( container, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

		var array = getMousePosition( container, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onTouchStart( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container, touch.clientX, touch.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchEnd( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container, touch.clientX, touch.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'touchend', onTouchEnd, false );

	}

	function onDoubleClick( event ) {

		var array = getMousePosition( container, event.clientX, event.clientY );
		onDoubleClickPosition.fromArray( array );

		var intersects = getIntersects( onDoubleClickPosition, objects );

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			signals.objectFocused.dispatch( intersect.object );
			
		}

	}


	function onkeydown(event)
	{
			switch ( event.keyCode ) {

						case 81: // Q
//						cameraOrtho.position.set(0,0,20);
//						camera = cameraOrtho;
						
						var onestep = editor.History.pop();
						console.log(onestep);
						 undo(onestep)
							break;

						
			}
	}
	
	function undo(oldobjects)
	{
		if(oldobjects.type=="setPosition")
		{
			var obj =scene.getObjectByProperty("uuid",oldobjects.uuid,true);
			console.log(obj);
			obj.position.copy(oldobjects.oldPosition);
			obj.updateMatrixWorld( true );
			editor.signals.ModelChanged.dispatch(obj);
		}
	}
	
	function Resize ()
	{
		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.offsetWidth, container.offsetHeight );

		render();
	}

	container.addEventListener( 'mousedown', onMouseDown, false );
	container.addEventListener( 'touchstart', onTouchStart, false );
	container.addEventListener( 'dblclick', onDoubleClick, false );
	window.addEventListener( 'resize', Resize, false );
window.addEventListener( 'keydown', onkeydown, false );
	// controls need to be added *after* main logic,
	// otherwise controls.enabled doesn't work.

	var controls = new THREE.EditorControls( camera, container );
	controls.addEventListener( 'change', function () {

		transformControls.update();
		//signals.cameraChanged.dispatch( camera );

	} );


	function get_Objxinxi(object)
	{
		var objects = 0, vertices = 0, triangles = 0;
		
		object.traverseVisible( function ( object ) {

				objects ++;

				if ( object instanceof THREE.Mesh ) {

					var geometry = object.geometry;

					if ( geometry instanceof THREE.Geometry ) {

						vertices += geometry.vertices.length;
						triangles += geometry.faces.length;

					} else if ( geometry instanceof THREE.BufferGeometry ) {

						if ( geometry.index !== null ) {

							vertices += geometry.index.count * 3;
							triangles += geometry.index.count;

						} else {

							vertices += geometry.attributes.position.count;
							triangles += geometry.attributes.position.count / 3;

						}

					}

				}

			} );
			
		var vs = {
			"vertices":vertices,
			"triangles":triangles
		}
		return vs;
	}

	// signals
	signals.objectSelected.add( function ( object ) {

		selectionBox.visible = false;
		transformControls.detach();

		if ( object !== null && object !== scene && object !== camera ) {

			box.setFromObject( object );

			if ( box.isEmpty() === false ) {

				selectionBox.setFromObject( object );
				selectionBox.visible = true;

			}

			transformControls.attach( object );
			var obj_xinxi = get_Objxinxi(object);
			var pro ={"property":
				{
					type:"moxing",
					name:object.name,
					position:
						{
							x:parseFloat(object.position.x).toFixed(2),
							y:parseFloat(object.position.y).toFixed(2),
							z:parseFloat(object.position.z).toFixed(2)
						},
					rotation:
						{
							x:parseFloat(object.rotation.x*180/Math.PI).toFixed(2),
							y:parseFloat(object.rotation.y*180/Math.PI).toFixed(2),
							z:parseFloat(object.rotation.z*180/Math.PI).toFixed(2)
						},
					scale:
						{
							x:parseFloat(object.scale.x).toFixed(2),
							y:parseFloat(object.scale.y).toFixed(2),
							z:parseFloat(object.scale.z).toFixed(2)
							
						},
					vertices:obj_xinxi.vertices,
					triangles:obj_xinxi.triangles
					}
				};
	
			var prohtml =template("elementProperty", pro);
			$("#model-property").html(prohtml);
			
		}

		render();

	} );
	
	signals.objectFocused.add( function ( object ) {

		controls.focus( object );

	} );


	signals.ModelChanged.add( function ( object ) {
		if ( editor.selected === object ) {

			selectionBox.setFromObject( object );
			object.updateMatrixWorld( true );
			transformControls.update();
			
		}

		if ( object instanceof THREE.PerspectiveCamera ) {
			
			object.updateProjectionMatrix();

		}

		if ( editor.helpers[ object.id ] !== undefined ) {
		
			editor.helpers[ object.id ].update();

		}

		render();
		

	} );
	signals.helperAdded.add( function ( object ) {

		objects.push( object.getObjectByName( 'picker' ) );

	} );

	signals.helperRemoved.add( function ( object ) {

		objects.splice( objects.indexOf( object.getObjectByName( 'picker' ) ), 1 );

	} );
	/*signals.editorCleared.add( function () {

		controls.center.set( 0, 0, 0 );
		render();

	} );

	signals.enterVR.add( function () {

		vrEffect.isPresenting ? vrEffect.exitPresent() : vrEffect.requestPresent();

	} );

	signals.themeChanged.add( function ( value ) {

		switch ( value ) {

			case 'css/light.css':
				sceneHelpers.remove( grid );
				grid = new THREE.GridHelper( 60, 60, 0x444444, 0x888888 );
				sceneHelpers.add( grid );
				break;
			case 'css/dark.css':
				sceneHelpers.remove( grid );
				grid = new THREE.GridHelper( 60, 60, 0xbbbbbb, 0x888888 );
				sceneHelpers.add( grid );
				break;

		}

		render();

	} );

	signals.transformModeChanged.add( function ( mode ) {

		transformControls.setMode( mode );

	} );

	signals.snapChanged.add( function ( dist ) {

		transformControls.setTranslationSnap( dist );

	} );

	signals.spaceChanged.add( function ( space ) {

		transformControls.setSpace( space );

	} );

	signals.rendererChanged.add( function ( newRenderer ) {

		if ( renderer !== null ) {

			container.dom.removeChild( renderer.domElement );

		}

		renderer = newRenderer;

		renderer.autoClear = false;
		renderer.autoUpdateScene = false;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		container.dom.appendChild( renderer.domElement );

		if ( WEBVR.isAvailable() === true ) {

			vrControls = new THREE.VRControls( vrCamera );
			vrEffect = new THREE.VREffect( renderer );

			window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

				effect.isPresenting ? signals.enteredVR.dispatch() : signals.exitedVR.dispatch();

			}, false );

		}

		render();

	} );

	signals.sceneGraphChanged.add( function () {

		render();

	} );

	signals.cameraChanged.add( function () {

		render();

	} );

	

	

	signals.geometryChanged.add( function ( object ) {

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

		}

		render();

	} );

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( editor.selected === object ) {

			selectionBox.setFromObject( object );
			transformControls.update();

		}

		if ( object instanceof THREE.PerspectiveCamera ) {

			object.updateProjectionMatrix();

		}

		if ( editor.helpers[ object.id ] !== undefined ) {

			editor.helpers[ object.id ].update();

		}

		render();

	} );

	signals.objectRemoved.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.splice( objects.indexOf( child ), 1 );

		} );

	} );

	

	signals.materialChanged.add( function ( material ) {

		render();

	} );

	// fog

	signals.sceneBackgroundChanged.add( function ( backgroundColor ) {

		scene.background.setHex( backgroundColor );

		render();

	} );

	var currentFogType = null;

	signals.sceneFogChanged.add( function ( fogType, fogColor, fogNear, fogFar, fogDensity ) {

		if ( currentFogType !== fogType ) {

			switch ( fogType ) {

				case 'None':
					scene.fog = null;
					break;
				case 'Fog':
					scene.fog = new THREE.Fog();
					break;
				case 'FogExp2':
					scene.fog = new THREE.FogExp2();
					break;

			}

			currentFogType = fogType;

		}

		if ( scene.fog instanceof THREE.Fog ) {

			scene.fog.color.setHex( fogColor );
			scene.fog.near = fogNear;
			scene.fog.far = fogFar;

		} else if ( scene.fog instanceof THREE.FogExp2 ) {

			scene.fog.color.setHex( fogColor );
			scene.fog.density = fogDensity;

		}

		render();

	} );

	//

	signals.windowResize.add( function () {

		// TODO: Move this out?

		editor.DEFAULT_CAMERA.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		editor.DEFAULT_CAMERA.updateProjectionMatrix();

		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );

	signals.showGridChanged.add( function ( showGrid ) {

		grid.visible = showGrid;
		render();

	} );*/

	//

	function animate() {

		requestAnimationFrame( animate );

		/*

		// animations

		if ( THREE.AnimationHandler.animations.length > 0 ) {

			THREE.AnimationHandler.update( 0.016 );

			for ( var i = 0, l = sceneHelpers.children.length; i < l; i ++ ) {

				var helper = sceneHelpers.children[ i ];

				if ( helper instanceof THREE.SkeletonHelper ) {

					helper.update();

				}

			}

		}
		*/

		if ( vrEffect ) {

			render();

		}

	}

	function render() {

		sceneHelpers.updateMatrixWorld();
		scene.updateMatrixWorld();

		if ( vrEffect && vrEffect.isPresenting ) {

			vrControls.update();

			camera.updateMatrixWorld();

			vrEffect.render( scene, vrCamera );
			vrEffect.render( sceneHelpers, vrCamera );

		} else {

			renderer.render( scene, camera );

			if ( renderer) {

				renderer.render( sceneHelpers, camera );

			}

		}


	}
	animate();
	requestAnimationFrame( animate );

	return container;

};
