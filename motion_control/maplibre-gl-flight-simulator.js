!function(t,i){"object"==typeof exports&&"object"==typeof module?module.exports=i(require("maplibre-gl")):"function"==typeof define&&define.amd?define(["maplibre-gl"],i):"object"==typeof exports?exports.MaplibreGlFlightSimulator=i(require("maplibre-gl")):t.MaplibreGlFlightSimulator=i(t.maplibregl)}(this,(t=>(()=>{"use strict";var i={565:i=>{i.exports=t}},e={};function a(t){var o=e[t];if(void 0!==o)return o.exports;var n=e[t]={exports:{}};return i[t](n,n.exports,a),n.exports}a.d=(t,i)=>{for(var e in i)a.o(i,e)&&!a.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:i[e]})},a.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),a.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var o={};a.r(o),a.d(o,{FlightMotionControl:()=>s});var n=a(565);const l=6371008.8;class s{constructor(t={}){this._updateInterval=null,this.FRAME_INTERVAL=16,this._currentState=null,this._previousState=null,this._interpolationState=null,this._currentInterpolation=null,this._lastUpdateTime=0,this._lastFrameTime=performance.now(),this._lastDerivativeCalcTime=0,this._disposed=!1,this.predict=!1,this.shouldPredict=!1,this._velocity={x:0,y:0,z:0},this._angularVelocity={heading:0,pitch:0,roll:0},this.FRAMES=60,this._cameraMode={type:"COCKPIT",offset:{x:0,y:-30,z:10},orientation:{heading:0,pitch:0,roll:0}},this._boundUpdateFrame=this._updateFrame.bind(this),this._lastUpdateTime=performance.now(),t.initialPosition&&(this._currentState={position:{lat:t.initialPosition.lat,lng:t.initialPosition.lng,altitude:t.initialPosition.altitude},attitude:{heading:0,pitch:0,roll:0},velocity:{groundSpeed:0,verticalSpeed:0}}),t.cameraMode&&(this._cameraMode=Object.assign(Object.assign({},t.cameraMode),{offset:t.cameraMode.offset||{x:0,y:0,z:0},orientation:t.cameraMode.orientation||{heading:0,pitch:0,roll:0}})),t.predict&&(this.shouldPredict=!0)}onAdd(t){return this._map=t,this._container=document.createElement("div"),this._container.className="maplibregl-ctrl",this._map.dragRotate.disable(),this._map.touchZoomRotate.disableRotation(),this._map.keyboard.disable(),this._map._fadeDuration=0,this._map._maxTileCacheSize=8,this._startUpdate(),this._container}onRemove(){this._dispose()}_dispose(){var t;this._disposed||(this._stopUpdate(),(null===(t=this._container)||void 0===t?void 0:t.parentNode)&&this._container.parentNode.removeChild(this._container),this._map&&(this._map.dragRotate.enable(),this._map.touchZoomRotate.enableRotation(),this._map.keyboard.enable()),this._container=null,this._map=null,this._currentState=null,this._currentInterpolation=null,this._disposed=!0)}_startUpdate(){this._stopUpdate(),this._disposed||(this._updateInterval=window.setInterval(this._boundUpdateFrame,this.FRAME_INTERVAL))}_stopUpdate(){null!==this._updateInterval&&(window.clearInterval(this._updateInterval),this._updateInterval=null)}_updateFrame(){if(this._disposed||!this._map)return;const t=performance.now(),i=(t-this._lastFrameTime)/1e3;this._lastFrameTime=t,this.predict?this._predictMovement(i):this._interpolateFrame()}updateFlightState(t){var i,e,a,o,n,l,s,r,h,d,u,c,p,_,v,g,m,S,M,f,y,I,P,b;if(!this._map)return;const x=performance.now(),C=x-this._lastUpdateTime;this._lastUpdateTime=x;const T={position:{lat:null!==(i=t.lat)&&void 0!==i?i:null!==(a=null===(e=this._currentState)||void 0===e?void 0:e.position.lat)&&void 0!==a?a:this._map.transform.getCameraLngLat().lat,lng:null!==(o=t.lng)&&void 0!==o?o:null!==(l=null===(n=this._currentState)||void 0===n?void 0:n.position.lng)&&void 0!==l?l:this._map.transform.getCameraLngLat().lng,altitude:null!==(s=t.elevation)&&void 0!==s?s:null!==(h=null===(r=this._currentState)||void 0===r?void 0:r.position.altitude)&&void 0!==h?h:this._map.transform.getCameraAltitude()},attitude:{heading:null!==(d=t.flightHeading)&&void 0!==d?d:null!==(c=null===(u=this._currentState)||void 0===u?void 0:u.attitude.heading)&&void 0!==c?c:0,pitch:null!==(p=t.pitchAttitude)&&void 0!==p?p:null!==(v=null===(_=this._currentState)||void 0===_?void 0:_.attitude.pitch)&&void 0!==v?v:0,roll:null!==(g=t.rollAttitude)&&void 0!==g?g:null!==(S=null===(m=this._currentState)||void 0===m?void 0:m.attitude.roll)&&void 0!==S?S:0},velocity:{groundSpeed:null!==(M=t.groundSpeed)&&void 0!==M?M:null!==(y=null===(f=this._currentState)||void 0===f?void 0:f.velocity.groundSpeed)&&void 0!==y?y:0,verticalSpeed:null!==(I=t.verticalSpeed)&&void 0!==I?I:null!==(b=null===(P=this._currentState)||void 0===P?void 0:P.velocity.verticalSpeed)&&void 0!==b?b:0}};if(this._previousState=this._currentState?Object.assign({},this._currentState):null,this._currentState=T,!this._interpolationState)return void(this._interpolationState=Object.assign({},T));let F=C/1e3*this.FRAMES,O=F.toFixed(2);F="0"!==O[0]?Math.round(F):"0"!==O[2]?3:"0"!==O[3]?2:0;const A={lat:(T.position.lat-this._interpolationState.position.lat)/F,lng:this._calculateShortestLongitudeDelta(this._interpolationState.position.lng,T.position.lng)/F,altitude:(T.position.altitude-this._interpolationState.position.altitude)/F,heading:this._calculateShortestAngleDelta(this._interpolationState.attitude.heading,T.attitude.heading)/F,pitch:(T.attitude.pitch-this._interpolationState.attitude.pitch)/F,roll:this._calculateShortestAngleDelta(this._interpolationState.attitude.roll,T.attitude.roll)/F,groundSpeed:(T.velocity.groundSpeed-this._interpolationState.velocity.groundSpeed)/F,verticalSpeed:(T.velocity.verticalSpeed-this._interpolationState.velocity.verticalSpeed)/F};this._currentInterpolation={start:Object.assign({},this._interpolationState),target:Object.assign({},T),remainingFrames:F,deltas:A},this.shouldPredict&&this._previousState&&x-this._lastDerivativeCalcTime>=5e3&&(this._updateMotionDerivatives(C/1e3),this._lastDerivativeCalcTime=x)}_updateMotionDerivatives(t){if(!this._previousState||!this._currentState)return;const i=this._previousState,e=this._currentState,a=110574.3,o=Math.cos(e.position.lat*Math.PI/180),n=(e.position.lng-i.position.lng)*o*a,l=(e.position.lat-i.position.lat)*a,s=e.position.altitude-i.position.altitude;this._velocity.x=n/t,this._velocity.y=l/t,this._velocity.z=s/t;const r=this._calculateShortestAngleDelta(i.attitude.heading,e.attitude.heading),h=e.attitude.pitch-i.attitude.pitch,d=e.attitude.roll-i.attitude.roll;this._angularVelocity.heading=r/t,this._angularVelocity.pitch=h/t,this._angularVelocity.roll=d/t}_predictMovement(t){if(!this._currentState)return;const{lat:i,lng:e,altitude:a}=this._currentState.position,o=110574.3,n=Math.max(Math.cos(i*Math.PI/180),1e-9),l=this._velocity.y*t/o,s=this._velocity.x*t/(o*n),r=this._velocity.z*t;this._currentState.position.lat+=l,this._currentState.position.lng+=s,this._currentState.position.altitude+=r,this._currentState.attitude.heading=(this._currentState.attitude.heading+this._angularVelocity.heading*t+360)%360,this._currentState.attitude.pitch+=this._angularVelocity.pitch*t,this._currentState.attitude.roll=(this._currentState.attitude.roll+this._angularVelocity.roll*t+360)%360,this._updateCamera()}_interpolateFrame(){this._currentInterpolation&&this._interpolationState?(this._currentInterpolation.remainingFrames<=0?(this._interpolationState=Object.assign({},this._currentInterpolation.target),this._currentInterpolation=null):(this._interpolationState={position:{lat:this._interpolationState.position.lat+this._currentInterpolation.deltas.lat,lng:this._interpolationState.position.lng+this._currentInterpolation.deltas.lng,altitude:this._interpolationState.position.altitude+this._currentInterpolation.deltas.altitude},attitude:{heading:(this._interpolationState.attitude.heading+this._currentInterpolation.deltas.heading+360)%360,pitch:this._interpolationState.attitude.pitch+this._currentInterpolation.deltas.pitch,roll:(this._interpolationState.attitude.roll+this._currentInterpolation.deltas.roll+360)%360},velocity:{groundSpeed:this._interpolationState.velocity.groundSpeed+this._currentInterpolation.deltas.groundSpeed,verticalSpeed:this._interpolationState.velocity.verticalSpeed+this._currentInterpolation.deltas.verticalSpeed}},this._currentInterpolation.remainingFrames--),this._updateCamera()):this._updateCamera()}_updateCamera(){if(!this._map)return;const t=this.predict?this._currentState:this._interpolationState;if(!t)return;const i=this._calculateCameraPosition(t);if(!i)return;const{camPos:e,camAlt:a,heading:o,pitch:n,roll:l}=i,s=this._map.calculateCameraOptionsFromCameraLngLatAltRotation(e,a,o,n,l);this._map.jumpTo(s)}_calculateCameraPosition(t){var i,e,a,o,l,s,r,h,d,u,c,p,_,v,g;if(!t)return null;const m=this._cameraMode;let S,M,f,y,I;const P=t=>90-Math.max(-90,Math.min(90,t));switch(m.type){case"COCKPIT":S=new n.LngLat(t.position.lng,t.position.lat),M=t.position.altitude+(null!==(e=null===(i=m.offset)||void 0===i?void 0:i.z)&&void 0!==e?e:0),f=t.attitude.heading,y=P(t.attitude.pitch),I=t.attitude.roll;break;case"CHASE":{const i=this._calculateChaseOffset(null!==(a=m.offset)&&void 0!==a?a:{x:0,y:-30,z:10});S=this._offsetPosition(t.position.lat,t.position.lng,t.attitude.heading,i.x,i.y),M=t.position.altitude+i.z,f=t.attitude.heading,y=P(.5*t.attitude.pitch),I=.5*t.attitude.roll;break}case"ORBIT":{const i=performance.now()%3e4/3e4*Math.PI*2,e=Math.sqrt((null!==(l=null===(o=m.offset)||void 0===o?void 0:o.y)&&void 0!==l?l:100)**2+(null!==(r=null===(s=m.offset)||void 0===s?void 0:s.x)&&void 0!==r?r:0)**2),a=Math.cos(i)*e,n=Math.sin(i)*e;S=this._offsetPosition(t.position.lat,t.position.lng,0,a,n),M=t.position.altitude+(null!==(d=null===(h=m.offset)||void 0===h?void 0:h.z)&&void 0!==d?d:50),f=this._calculateHeadingToPoint(S.lat,S.lng,t.position.lat,t.position.lng),y=this._calculatePitchToPoint(S.lat,S.lng,M,t.position.lat,t.position.lng,t.position.altitude),I=0;break}default:S=new n.LngLat(t.position.lng,t.position.lat),M=t.position.altitude,f=null!==(c=null===(u=m.orientation)||void 0===u?void 0:u.heading)&&void 0!==c?c:0,y=null!==(_=null===(p=m.orientation)||void 0===p?void 0:p.pitch)&&void 0!==_?_:0,I=null!==(g=null===(v=m.orientation)||void 0===v?void 0:v.roll)&&void 0!==g?g:0}return{camPos:S,camAlt:M,heading:f,pitch:y,roll:I}}_offsetPosition(t,i,e,a,o){const s=(e-90)*Math.PI/180,r=l,h=Math.atan2(o,a),d=Math.sqrt(a*a+o*o),u=t*Math.PI/180,c=i*Math.PI/180,p=s+h,_=Math.asin(Math.sin(u)*Math.cos(d/r)+Math.cos(u)*Math.sin(d/r)*Math.cos(p)),v=c+Math.atan2(Math.sin(p)*Math.sin(d/r)*Math.cos(u),Math.cos(d/r)-Math.sin(u)*Math.sin(_));return new n.LngLat(180*v/Math.PI,180*_/Math.PI)}_calculateChaseOffset(t){if(!this._currentState)return t;const i=this._currentState.velocity.groundSpeed,e=Math.min(i/100,1);return{x:t.x,y:t.y*(1+.5*e),z:t.z*(1+.3*e)}}_calculateHeadingToPoint(t,i,e,a){const o=(a-i)*Math.PI/180,n=t*Math.PI/180,l=e*Math.PI/180,s=Math.sin(o)*Math.cos(l),r=Math.cos(n)*Math.sin(l)-Math.sin(n)*Math.cos(l)*Math.cos(o);return 180*Math.atan2(s,r)/Math.PI%360}_calculatePitchToPoint(t,i,e,a,o,n){const s=l,r=(a-t)*Math.PI/180,h=(o-i)*Math.PI/180,d=Math.sin(r/2)*Math.sin(r/2)+Math.cos(t*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(h/2)*Math.sin(h/2),u=s*(2*Math.atan2(Math.sqrt(d),Math.sqrt(1-d))),c=n-e;return-Math.atan2(c,u)*(180/Math.PI)}_calculateShortestAngleDelta(t,i){let e=(i=(i%360+360)%360)-(t=(t%360+360)%360);return e>180&&(e-=360),e<-180&&(e+=360),e}_calculateShortestLongitudeDelta(t,i){let e=i-t;return e>180&&(e-=360),e<-180&&(e+=360),e}setCameraMode(t){this._cameraMode=Object.assign(Object.assign({},t),{offset:t.offset||{x:0,y:0,z:0},orientation:t.orientation||{heading:0,pitch:0,roll:0}}),"CHASE"!==t.type||t.offset?"ORBIT"!==t.type||t.offset||(this._cameraMode.offset={x:0,y:-100,z:50}):this._cameraMode.offset={x:0,y:-30,z:10}}startPrediction(){this.predict=!0}stopPrediction(){this.predict=!1}getState(){return this._currentState?Object.assign({},this._currentState):null}}return o})()));