(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{Dltz:function(e,a,t){"use strict";t.r(a),t.d(a,"query",(function(){return f}));t("91GP");var n=t("q1tI"),r=t.n(n),c=t("Wbzz"),l=t("Bl7J"),m=t("oHY+"),i=t("LbRr"),o=t("QDSi"),s=t("blXi"),u=t.n(s),d=function(e){var a=e.image,t=e.videoId,n=e.umbracoId,c=e.isMediaRight,l=e.aboveTitle,m=e.title,i=e.lead;return r.a.createElement("div",{className:"row no-gutters"},r.a.createElement("div",{className:"col-12 col-md-6"},r.a.createElement("div",{className:"product-image"},t?r.a.createElement("div",{id:"video-product-"+n,className:"video","data-id":t}):r.a.createElement("picture",null,r.a.createElement("source",{media:"(min-width: 62em)",srcSet:a.desktop}),r.a.createElement("source",{media:"(min-width: 48em)",srcSet:a.tablet}),r.a.createElement("img",{src:a.mobile,srcSet:a.mobile,alt:""})))),r.a.createElement("div",{className:"col-12 col-md-6 "+(c?"order-first":"")},r.a.createElement("div",{className:"product-info"},r.a.createElement("h3",{className:"above"},l),r.a.createElement("h2",null,m),r.a.createElement("img",{src:u.a,className:"underline-bar",alt:""}),r.a.createElement("div",{dangerouslySetInnerHTML:{__html:i}}))))},E=function(e){var a=e.icon,t=e.title,n=e.lead;return r.a.createElement(r.a.Fragment,null,r.a.createElement("img",{src:a,alt:""}),r.a.createElement("div",null,r.a.createElement("h4",null,t),r.a.createElement("div",{dangerouslySetInnerHTML:{__html:n}})))},b=function(e){var a=e.features,t=e.aboveFeature,n=e.featureTitle;return r.a.createElement("section",{id:"features"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"heading"},r.a.createElement("h3",{className:"above"},t),r.a.createElement("h2",null,n)),r.a.createElement("div",{className:"body"},a.map((function(e){return r.a.createElement(E,Object.assign({key:e.umbracoId},e))})))))},v=function(e){var a=e.aboveMoreInfo,t=e.moreInfoTitle,n=e.moreInfoLead,l=e.fileDownloadFile,i=e.fileDownloadText,o=e.contactPageLink,s=e.contactPageText,d=e.culture,E=Object(m.b)(d,o),b=l&&i,v=E&&s;return r.a.createElement("section",{id:"more-info"},r.a.createElement("div",{className:"container text-center"},r.a.createElement("h3",{className:"above"},a),r.a.createElement("h2",null,t),r.a.createElement("img",{src:u.a,className:"underline-bar",alt:""}),r.a.createElement("div",{dangerouslySetInnerHTML:{__html:n}}),b&&r.a.createElement("a",{href:l,download:!0,className:"btn-outline-primary",target:"_blank",rel:"noopener noreferrer"},i,r.a.createElement("span",{className:"corner"}),r.a.createElement("span",{className:"inner-corner"})),v&&r.a.createElement(c.Link,{to:E,className:"btn-outline-primary"},s,r.a.createElement("span",{className:"corner"}),r.a.createElement("span",{className:"inner-corner"}))))};a.default=function(e){var a=e.data,t=e.pageContext,n=t.culture,c=Object(m.a)(n,a.product),s=a.allProductRow.nodes.map((function(e){return Object(m.a)(n,e)})),u=a.allProductFeature.nodes.map((function(e){return Object(m.a)(n,e)}));return r.a.createElement(l.a,{culture:t.culture,currentPageId:t.umbracoId},r.a.createElement(i.a,{currentPage:c}),r.a.createElement(o.a,c),r.a.createElement("section",{id:"product-highlights"},r.a.createElement("div",{className:"container-fluid px-0"},s.map((function(e){return r.a.createElement(d,Object.assign({},e,{key:e.umbracoId}))})))),r.a.createElement(b,Object.assign({features:u},c)),r.a.createElement(v,Object.assign({},c,{culture:n})))};var f="4094603369"}}]);
//# sourceMappingURL=component---src-templates-product-js-447328525870874170a9.js.map