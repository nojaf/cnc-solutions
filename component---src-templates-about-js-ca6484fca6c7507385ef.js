(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{EnGO:function(e,a,t){"use strict";t.r(a);var r=t("q1tI"),n=t.n(r),c=t("Wbzz"),l=t("Bl7J"),m=t("LbRr"),i=t("blXi"),s=t.n(i),o=t("oHY+"),d=t("QDSi"),u=function(e){var a=e.linkText,t=e.linkUrl,r=e.culture,l=Object(o.b)(r,t);return n.a.createElement(c.Link,{to:l,className:"btn-cnc"},a,n.a.createElement("span",{className:"corner"}),n.a.createElement("span",{className:"inner-corner"}))},E=function(e){var a=e.culture,t=e.page,r=Object(o.a)(a,t),c=r.image,l=c.desktop,m=c.medium,i=c.small,d=c.tablet,E=r.imageRight?["order-md-1","order-md-0"]:["order-md-0","order-md-1"],b=E[0],g=E[1];return n.a.createElement("section",null,n.a.createElement("div",{className:"container-md p-0"},n.a.createElement("div",{className:"row no-gutters about-row"},n.a.createElement("div",{className:"col-12 col-md-6 "+b},n.a.createElement("picture",null,n.a.createElement("source",{media:"(min-width: 75em)",srcSet:l}),n.a.createElement("source",{media:"(min-width: 62em)",srcSet:d}),n.a.createElement("source",{media:"(min-width: 48em)",srcSet:d}),n.a.createElement("source",{media:"(min-width: 34em)",srcSet:m}),n.a.createElement("img",{className:"w-100",src:i,srcSet:i,alt:r.altText}))),n.a.createElement("div",{className:"col-12 col-md-6 "+g},n.a.createElement("div",{className:"container content"},r.aboveTitle&&n.a.createElement("h3",{className:"above"},r.aboveTitle),n.a.createElement("h2",null,r.title),n.a.createElement("img",{src:s.a,alt:"underline-bar",className:"underline-bar"}),n.a.createElement("div",{dangerouslySetInnerHTML:{__html:r.lead}}),r.linkText&&n.a.createElement(u,Object.assign({},r,{culture:a})))))))};a.default=function(e){var a=e.data,t=e.pageContext,r=t.culture,c=Object(o.a)(r,a.about),i=a.allAboutRow.edges.map((function(e){return e.node}));return n.a.createElement(l.a,{culture:r,currentPageId:t.umbracoId,seo:t.seo},n.a.createElement(m.a,{currentPage:c}),n.a.createElement(d.a,c),i.map((function(e){return n.a.createElement(E,{page:e,culture:r,key:e.key})})))}},LbRr:function(e,a,t){"use strict";var r=t("q1tI"),n=t.n(r);var c=function(e){var a=function(e){return{mobile:e.headerImage.mobile,tablet:e.headerImage.tablet,desktop:e.headerImage.desktop,largeDesktop:e.headerImage.large_desktop,alt:e.headerImage.headerImageAlt}}(e.currentPage),t=a.alt,r=a.mobile,c=a.tablet,l=a.desktop,m=a.largeDesktop;return n.a.createElement("header",null,n.a.createElement("picture",null,n.a.createElement("source",{media:"(min-width: 75em)",srcSet:m}),n.a.createElement("source",{media:"(min-width: 62em)",srcSet:l}),n.a.createElement("source",{media:"(min-width: 48em)",srcSet:c}),n.a.createElement("source",{media:"(min-width: 34em)",srcSet:r}),n.a.createElement("img",{src:r,srcSet:r,alt:t})),n.a.createElement("div",{className:"edge-container"},n.a.createElement("div",{className:"edge white"})))};c.defaultProps={},a.a=c},QDSi:function(e,a,t){"use strict";var r=t("q1tI"),n=t.n(r),c=t("blXi"),l=t.n(c);a.a=function(e){var a=e.aboveTitle,t=e.title,r=e.lead;return n.a.createElement("section",null,n.a.createElement("div",{className:"container"},n.a.createElement("div",{className:"text-center mt-5 mb-2"},n.a.createElement("h2",{className:"above text-lowercase"},a),n.a.createElement("div",{className:"title-container"},n.a.createElement("h1",{className:"mb-0"},t),n.a.createElement("img",{src:l.a,alt:"",className:"underline-bar"}),n.a.createElement("div",{className:"text-left",id:"lead",dangerouslySetInnerHTML:{__html:r}})))))}}}]);
//# sourceMappingURL=component---src-templates-about-js-ca6484fca6c7507385ef.js.map