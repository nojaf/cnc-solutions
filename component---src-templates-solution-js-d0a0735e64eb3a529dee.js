(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"4VmB":function(A,e){A.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAAAVCAMAAABogNA8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAEFAQk9YRVBYRVVhR15wSXJ8ZnV9a36iUZLCVsPdogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGdHumwAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAbElEQVRIS7XN2w2AIBAEQE5Ehf77VUmIEe7xtTsNTGokh3yypMpRxvAqF2v5J5W1TAlrmRPSsiScZU0oi0oYi04Ii5HgFyuBL2aCXuwEvDgJdvES6OImyMVPgEuQ4JYogS1h0pcb4BxDt2ubPOJdg+ZKkvJsAAAAAElFTkSuQmCC"},Oyvg:function(A,e,t){var a=t("dyZX"),r=t("Xbzi"),n=t("hswa").f,c=t("kJMx").f,o=t("quPj"),l=t("C/va"),i=a.RegExp,s=i,u=i.prototype,m=/a/g,d=/a/g,f=new i(m)!==m;if(t("nh4g")&&(!f||t("eeVq")((function(){return d[t("K0xU")("match")]=!1,i(m)!=m||i(d)==d||"/a/i"!=i(m,"i")})))){i=function(A,e){var t=this instanceof i,a=o(A),n=void 0===e;return!t&&a&&A.constructor===i&&n?A:r(f?new s(a&&!n?A.source:A,e):s((a=A instanceof i)?A.source:A,a&&n?l.call(A):e),t?this:u,i)};for(var p=function(A){A in i||n(i,A,{configurable:!0,get:function(){return s[A]},set:function(e){s[A]=e}})},v=c(s),g=0;v.length>g;)p(v[g++]);u.constructor=i,i.prototype=u,t("KroJ")(a,"RegExp",i)}t("elZq")("RegExp")},Qx46:function(A,e,t){"use strict";t.r(e);t("XfO3"),t("HEwt"),t("a1Th"),t("rE2o"),t("ioFf"),t("rGqo"),t("yt8O"),t("Btvt"),t("RW0V"),t("91GP");var a=t("q1tI"),r=t.n(a),n=t("I6ru"),c=t("fMaj"),o=t("L8iz");t("Oyvg");var l=t("nmUU");function i(A,e,t,a){var r,n=function(r){for(var n=e.length,c=0;c<n;){if(A===e[c])return t[c];c+=1}for(var o in e[c+1]=A,t[c+1]=r,A)r[o]=a?i(A[o],e,t,!0):A[o];return r};switch(Object(l.a)(A)){case"Object":return n({});case"Array":return n([]);case"Date":return new Date(A.valueOf());case"RegExp":return r=A,new RegExp(r.source,(r.global?"g":"")+(r.ignoreCase?"i":"")+(r.multiline?"m":"")+(r.sticky?"y":"")+(r.unicode?"u":""));default:return A}}var s=t("VRov"),u=t("gSdd"),m=t("wyUd"),d=t("OEMQ"),f=t("ZMgP"),p=function(){function A(A,e,t,a){this.valueFn=A,this.valueAcc=e,this.keyFn=t,this.xf=a,this.inputs={}}return A.prototype["@@transducer/init"]=f.a.init,A.prototype["@@transducer/result"]=function(A){var e;for(e in this.inputs)if(Object(m.a)(e,this.inputs)&&(A=this.xf["@@transducer/step"](A,this.inputs[e]))["@@transducer/reduced"]){A=A["@@transducer/value"];break}return this.inputs=null,this.xf["@@transducer/result"](A)},A.prototype["@@transducer/step"]=function(A,e){var t=this.keyFn(e);return this.inputs[t]=this.inputs[t]||[t,this.valueAcc],this.inputs[t][1]=this.valueFn(this.inputs[t][1],e),A},A}(),v=Object(s.a)(4,[],(function(A,e,t,a){return new p(A,e,t,a)})),g=Object(s.a)(4,[],Object(u.a)([],v,(function(A,e,t,a){return Object(d.a)((function(a,r){var n=t(r);return a[n]=A(Object(m.a)(n,a)?a[n]:i(e,[],[],!1),r),a}),{},a)}))),E=Object(o.a)(Object(c.a)("groupBy",g((function(A,e){return null==A&&(A=[]),A.push(e),A}),null))),b=t("Bl7J"),h=t("oHY+"),w=t("LbRr"),y=t("QDSi"),k=t("blXi"),O=t.n(k),x=t("4VmB"),N=t.n(x);function j(A){return function(A){if(Array.isArray(A)){for(var e=0,t=new Array(A.length);e<A.length;e++)t[e]=A[e];return t}}(A)||function(A){if(Symbol.iterator in Object(A)||"[object Arguments]"===Object.prototype.toString.call(A))return Array.from(A)}(A)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function S(A){return n.a(Array,A)?A:[A]}t.d(e,"query",(function(){return J}));var R=function(A){var e=A.image,t=A.isActive,a=A.altText,n=A.parentUmbracoId,c=e.large_desktop,o=e.desktop,l=e.tablet,i=e.mobile_landscape,s=e.mobile_portrait;return r.a.createElement("div",{className:"carousel-item "+(t?"active":"")},r.a.createElement("a",{href:o,className:"d-block w-100","data-toggle":"lightbox","data-gallery":"gallery-"+n},r.a.createElement("picture",null,r.a.createElement("source",{media:"(min-width: 75em)",srcSet:c}),r.a.createElement("source",{media:"(min-width: 62em)",srcSet:o}),r.a.createElement("source",{media:"(min-width: 48em)",srcSet:l}),r.a.createElement("source",{media:"(min-width: 34em)",srcSet:i}),r.a.createElement("img",{src:s,alt:a,className:"d-block m-auto w-100"}))))},I=function(A){var e=A.culture,t=A.umbracoId,a=S(A.slides).map((function(A){return Object(h.a)(e,A)}));return console.log("slideShowSlides",a),r.a.createElement("div",{className:"carousel slide",id:"block"+t+"Carousel","data-ride":"carousel"},r.a.createElement("ol",{className:"carousel-indicators"},a.map((function(A,e){return r.a.createElement("li",{key:"carousel-"+t+"-"+e,"data-target":"#block"+t+"Carousel","data-slide-to":e,className:0===e?"active":""},r.a.createElement("div",{className:"inner"}))}))),r.a.createElement("div",{className:"carousel-inner"},a.map((function(A,e){return r.a.createElement(R,Object.assign({},A,{isActive:0===e,key:"show-"+t+"-slide-"+e}))}))),r.a.createElement("a",{className:"carousel-control-prev",href:"#block"+t+"Carousel",role:"button","data-slide":"prev"},r.a.createElement("span",{className:"carousel-control-prev-icon","aria-hidden":"true"}),r.a.createElement("span",{className:"sr-only"},"Previous")),r.a.createElement("a",{className:"carousel-control-next",href:"#block"+t+"Carousel",role:"button","data-slide":"next"},r.a.createElement("span",{className:"carousel-control-next-icon","aria-hidden":"true"}),r.a.createElement("span",{className:"sr-only"},"Next")))},U=function(A){var e=A.aboveTitle,t=A.title,a=A.color,n=A.lead;return r.a.createElement(r.a.Fragment,null,r.a.createElement("p",{className:"above"},e),r.a.createElement("h2",null,t),r.a.createElement("img",{src:"dark"===a?N.a:O.a,alt:"",className:"underline-bar"}),r.a.createElement("div",{dangerouslySetInnerHTML:{__html:n}}))},V=function(A){var e=A.umbracoId,t=A.videoId;return r.a.createElement("div",{id:"video-cnc-block-"+e,className:"video","data-id":t})},B=function(A){switch(console.log("props",A),A.alias){case"solutionSlideshow":return r.a.createElement(I,A);case"solutionText":return r.a.createElement(U,A);case"solutionVideo":return r.a.createElement(V,A);default:return null}},C=function(A){var e=A.blocks,t=A.culture,a=e.length&&e[0].color;return r.a.createElement("section",{className:"cnc-block "+a},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},e.map((function(A){return r.a.createElement("div",{className:(e=A,"col-12 mt-3 mt-lg-0 "+("solutionText"===e.alias?"col-lg-5 text-block":"col-lg-7")+" "+(e.isRight?"order-lg-1":"order-lg-0")),key:A.umbracoId},r.a.createElement(B,Object.assign({},A,{culture:t})));var e})))))},J=(e.default=function(A){var e=A.data,t=A.pageContext,a=t.culture,n=Object(h.a)(a,e.solution),c=E((function(A){return A.row}),[].concat(j(S(e.solution.slideShows)),j(S(e.solution.texts)),j(S(e.solution.videos))).map((function(A){return Object(h.a)(a,A)}))),o=Object.keys(c).map((function(A){return c[A]}));return console.log("rows",o),r.a.createElement(b.a,{culture:t.culture,currentPageId:t.umbracoId},r.a.createElement(w.a,{currentPage:n}),r.a.createElement(y.a,n),o.map((function(A,e){return r.a.createElement(C,{key:e,blocks:A,culture:a})})))},"203165826")}}]);
//# sourceMappingURL=component---src-templates-solution-js-d0a0735e64eb3a529dee.js.map