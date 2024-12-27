!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("maplibre-gl")):"function"==typeof define&&define.amd?define(["maplibre-gl"],e):"object"==typeof exports?exports.MaplibreGlFlightSimulator=e(require("maplibre-gl")):t.MaplibreGlFlightSimulator=e(t.maplibregl)}(this,(t=>(()=>{"use strict";var e={565:e=>{e.exports=t}},i={};function a(t){var o=i[t];if(void 0!==o)return o.exports;var n=i[t]={exports:{}};return e[t](n,n.exports,a),n.exports}a.d=(t,e)=>{for(var i in e)a.o(e,i)&&!a.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},a.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),a.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var o={};a.r(o),a.d(o,{FlightMotionControl:()=>l});var n=a(565);const r=6371008.8;class l{constructor(t={}){this._updateInterval=null,this._currentState=null,this._previousState=null,this._currentInterpolation=null,this._lastUpdateTime=0,this._disposed=!1,this.predict=!1,this.shouldPredict=!1,this._deltaIsCalculated=!1,this.FRAMES=60,this.FRAME_INTERVAL=16,this._velocity={x:0,y:0,z:0},this._angularVelocity={heading:0,pitch:0,roll:0},this._cameraMode={type:"COCKPIT",offset:{x:0,y:-30,z:10},orientation:{heading:0,pitch:0,roll:0}},this._boundUpdateFrame=this._updateFrame.bind(this),this._lastUpdateTime=performance.now(),t.initialPosition&&(this._currentState={position:{lat:t.initialPosition.lat,lng:t.initialPosition.lng,altitude:t.initialPosition.altitude},attitude:{heading:0,pitch:0,roll:0},velocity:{groundSpeed:0,verticalSpeed:0}}),t.cameraMode&&(this._cameraMode=Object.assign(Object.assign({},t.cameraMode),{offset:t.cameraMode.offset||{x:0,y:0,z:0},orientation:t.cameraMode.orientation||{heading:0,pitch:0,roll:0}})),t.predict&&(this.shouldPredict=!0)}onAdd(t){return this._map=t,this._container=document.createElement("div"),this._container.className="maplibregl-ctrl",this._map.dragRotate.disable(),this._map.touchZoomRotate.disableRotation(),this._map.keyboard.disable(),this._map._fadeDuration=0,this._map._maxTileCacheSize=8,this._startUpdate(),this._container}onRemove(){this._dispose()}_dispose(){var t;this._disposed||(this._stopUpdate(),(null===(t=this._container)||void 0===t?void 0:t.parentNode)&&this._container.parentNode.removeChild(this._container),this._map&&(this._map.dragRotate.enable(),this._map.touchZoomRotate.enableRotation(),this._map.keyboard.enable()),this._container=null,this._map=null,this._currentState=null,this._currentInterpolation=null,this._disposed=!0)}_startUpdate(){this._stopUpdate(),this._disposed||(this._updateInterval=window.setInterval(this._boundUpdateFrame,this.FRAME_INTERVAL))}_stopUpdate(){null!==this._updateInterval&&(window.clearInterval(this._updateInterval),this._updateInterval=null)}_updateFrame(){!this._disposed&&this._map&&this._interpolateFrame()}updateFlightState(t){var e,i,a,o,n,r,l,s,h,c,d,u,p,_,g,S;const m=performance.now()-this._lastUpdateTime;if(this._lastUpdateTime=performance.now(),this._previousState=this._currentState,!this._currentState)return void(this._currentState={position:{lat:null!==(e=t.lat)&&void 0!==e?e:this._map.transform.getCameraLngLat().lat,lng:null!==(i=t.lng)&&void 0!==i?i:this._map.transform.getCameraLngLat().lng,altitude:null!==(a=t.elevation)&&void 0!==a?a:this._map.transform.getCameraAltitude()},attitude:{heading:null!==(o=t.flightHeading)&&void 0!==o?o:0,pitch:null!==(n=t.pitchAttitude)&&void 0!==n?n:0,roll:null!==(r=t.rollAttitude)&&void 0!==r?r:0},velocity:{groundSpeed:null!==(l=t.groundSpeed)&&void 0!==l?l:0,verticalSpeed:null!==(s=t.verticalSpeed)&&void 0!==s?s:0}});const v={position:{lat:null!==(h=t.lat)&&void 0!==h?h:this._currentState.position.lat,lng:null!==(c=t.lng)&&void 0!==c?c:this._currentState.position.lng,altitude:null!==(d=t.elevation)&&void 0!==d?d:this._currentState.position.altitude},attitude:{heading:null!==(u=t.flightHeading)&&void 0!==u?u:this._currentState.attitude.heading,pitch:null!==(p=t.pitchAttitude)&&void 0!==p?p:this._currentState.attitude.pitch,roll:null!==(_=t.rollAttitude)&&void 0!==_?_:this._currentState.attitude.roll},velocity:{groundSpeed:null!==(g=t.groundSpeed)&&void 0!==g?g:this._currentState.velocity.groundSpeed,verticalSpeed:null!==(S=t.verticalSpeed)&&void 0!==S?S:this._currentState.velocity.verticalSpeed}};let M=Math.round(m/1e3*this.FRAMES);M=Math.max(M,3);const f={lat:(v.position.lat-this._currentState.position.lat)/M,lng:this._calculateShortestLongitudeDelta(this._currentState.position.lng,v.position.lng)/M,altitude:(v.position.altitude-this._currentState.position.altitude)/M,heading:this._calculateShortestAngleDelta(this._currentState.attitude.heading,v.attitude.heading)/M,pitch:(v.attitude.pitch-this._currentState.attitude.pitch)/M,roll:this._calculateShortestAngleDelta(this._currentState.attitude.roll,v.attitude.roll)/M,groundSpeed:(v.velocity.groundSpeed-this._currentState.velocity.groundSpeed)/M,verticalSpeed:(v.velocity.verticalSpeed-this._currentState.velocity.verticalSpeed)/M};this._currentInterpolation={start:this._currentState,target:v,remainingFrames:M,deltas:f},this.shouldPredict&&this._updateMotionDerivatives(m/1e3)}_updateMotionDerivatives(t){if(!this._previousState||!this._currentState)return;const e=this._previousState,i=this._currentState,a=110574.3,o=Math.cos(i.position.lat*Math.PI/180),n=(i.position.lng-e.position.lng)*o*a,r=(i.position.lat-e.position.lat)*a,l=i.position.altitude-e.position.altitude;this._velocity.x=n/t,this._velocity.y=r/t,this._velocity.z=l/t;const s=this._calculateShortestAngleDelta(e.attitude.heading,i.attitude.heading),h=i.attitude.pitch-e.attitude.pitch,c=i.attitude.roll-e.attitude.roll;this._angularVelocity.heading=s/t,this._angularVelocity.pitch=h/t,this._angularVelocity.roll=c/t}_interpolateFrame(){this._currentInterpolation&&this._currentState&&this._map&&(this._currentInterpolation.remainingFrames<=0?(this._currentState=this._currentInterpolation.target,this._currentInterpolation=null):(this._currentState={position:{lat:this._currentState.position.lat+this._currentInterpolation.deltas.lat,lng:this._currentState.position.lng+this._currentInterpolation.deltas.lng,altitude:this._currentState.position.altitude+this._currentInterpolation.deltas.altitude},attitude:{heading:(this._currentState.attitude.heading+this._currentInterpolation.deltas.heading+360)%360,pitch:this._currentState.attitude.pitch+this._currentInterpolation.deltas.pitch,roll:(this._currentState.attitude.roll+this._currentInterpolation.deltas.roll+360)%360},velocity:{groundSpeed:this._currentState.velocity.groundSpeed+this._currentInterpolation.deltas.groundSpeed,verticalSpeed:this._currentState.velocity.verticalSpeed+this._currentInterpolation.deltas.verticalSpeed}},this._currentInterpolation.remainingFrames--),this._updateCamera())}_updateCamera(){let t=this._currentState;this.predict&&this._previousState&&(this._deltaIsCalculated||(this._currentDeltaTimeForPrediction=performance.now()-this._lastUpdateTime,this._deltaIsCalculated=!0),t=this._predictCurrentState(this._currentDeltaTimeForPrediction));const e=this._calculateCameraPosition(t);if(!e)return;const{camPos:i,camAlt:a,heading:o,pitch:n,roll:r}=e,l=this._map.calculateCameraOptionsFromCameraLngLatAltRotation(i,a,o,n,r);this._map.jumpTo(l)}_predictCurrentState(t){const e=this._currentState,i=110574.3,a=this._velocity.y*t/i,o=this._velocity.x*t/(i*Math.cos(e.position.lat*Math.PI/180)),n=this._velocity.z*t,r=this._angularVelocity.heading*t,l=this._angularVelocity.pitch*t,s=this._angularVelocity.roll*t;return{position:{lat:e.position.lat+a,lng:e.position.lng+o,altitude:e.position.altitude+n},attitude:{heading:(e.attitude.heading+r+360)%360,pitch:e.attitude.pitch+l,roll:e.attitude.roll+s},velocity:{groundSpeed:e.velocity.groundSpeed,verticalSpeed:e.velocity.verticalSpeed}}}_calculateShortestAngleDelta(t,e){let i=(e=(e%360+360)%360)-(t=(t%360+360)%360);return i>180&&(i-=360),i<-180&&(i+=360),i}_calculateShortestLongitudeDelta(t,e){let i=e-t;return i>180&&(i-=360),i<-180&&(i+=360),i}_calculateCameraPosition(t=this._currentState){if(!this._currentState)return null;const e=this._cameraMode;let i,a,o,r,l;const s=t=>90-Math.max(-90,Math.min(90,t));switch(e.type){case"COCKPIT":i=new n.LngLat(t.position.lng,t.position.lat),a=t.position.altitude+e.offset.z,o=t.attitude.heading,r=s(t.attitude.pitch),l=t.attitude.roll;break;case"CHASE":const h=this._calculateChaseOffset(e.offset);i=this._offsetPosition(t.position.lat,t.position.lng,t.attitude.heading,h.x,h.y),a=t.position.altitude+h.z,o=t.attitude.heading,r=s(.5*t.attitude.pitch),l=.5*t.attitude.roll;break;case"ORBIT":const c=performance.now()%3e4/3e4*Math.PI*2,d=Math.sqrt(e.offset.y*e.offset.y+e.offset.x*e.offset.x),u=Math.cos(c)*d,p=Math.sin(c)*d;i=this._offsetPosition(t.position.lat,t.position.lng,0,u,p),a=t.position.altitude+e.offset.z,o=this._calculateHeadingToPoint(i.lat,i.lng,t.position.lat,t.position.lng),r=this._calculatePitchToPoint(i.lat,i.lng,a,t.position.lat,t.position.lng,t.position.altitude),l=0;break;case"FREE":i=new n.LngLat(t.position.lng,t.position.lat),a=t.position.altitude,o=e.orientation.heading,r=e.orientation.pitch,l=e.orientation.roll}return{camPos:i,camAlt:a,heading:o,pitch:r,roll:l}}_offsetPosition(t,e,i,a,o){const l=(i-90)*Math.PI/180,s=r,h=Math.atan2(o,a),c=Math.sqrt(a*a+o*o),d=t*Math.PI/180,u=e*Math.PI/180,p=l+h,_=Math.asin(Math.sin(d)*Math.cos(c/s)+Math.cos(d)*Math.sin(c/s)*Math.cos(p)),g=u+Math.atan2(Math.sin(p)*Math.sin(c/s)*Math.cos(d),Math.cos(c/s)-Math.sin(d)*Math.sin(_));return new n.LngLat(180*g/Math.PI,180*_/Math.PI)}_calculateChaseOffset(t){if(!this._currentState)return t;const e=this._currentState.velocity.groundSpeed,i=Math.min(e/100,1);return{x:t.x,y:t.y*(1+.5*i),z:t.z*(1+.3*i)}}_calculateHeadingToPoint(t,e,i,a){const o=(a-e)*Math.PI/180,n=t*Math.PI/180,r=i*Math.PI/180,l=Math.sin(o)*Math.cos(r),s=Math.cos(n)*Math.sin(r)-Math.sin(n)*Math.cos(r)*Math.cos(o);return(180*Math.atan2(l,s)/Math.PI+360)%360}_calculatePitchToPoint(t,e,i,a,o,n){const l=r,s=(a-t)*Math.PI/180,h=(o-e)*Math.PI/180,c=Math.sin(s/2)*Math.sin(s/2)+Math.cos(t*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(h/2)*Math.sin(h/2),d=l*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c))),u=n-i;return 180*-Math.atan2(u,d)/Math.PI}setCameraMode(t){this._cameraMode=Object.assign(Object.assign({},t),{offset:t.offset||{x:0,y:0,z:0},orientation:t.orientation||{heading:0,pitch:0,roll:0}}),"CHASE"!==t.type||t.offset?"ORBIT"!==t.type||t.offset||(this._cameraMode.offset={x:0,y:-100,z:50}):this._cameraMode.offset={x:0,y:-30,z:10}}startPrediction(){this.predict=!0}stopPrediction(){this.predict=!1,this._deltaIsCalculated=!1}getState(){return this._currentState?Object.assign({},this._currentState):null}}return o})()));