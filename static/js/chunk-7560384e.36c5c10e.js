(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7560384e"],{"23ad":function(t,e,n){!function(e,n){t.exports=n()}(0,(function(){"use strict";var t={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"};return function(e,n,r){var i=n.prototype,a=i.format;r.en.formats=t,i.format=function(e){void 0===e&&(e="YYYY-MM-DDTHH:mm:ssZ");var n=this.$locale().formats,r=function(e,n){return e.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(e,r,i){var a=i&&i.toUpperCase();return r||n[i]||t[i]||n[a].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(t,e,n){return e||n.slice(1)}))}))}(e,void 0===n?{}:n);return a.call(this,r)}}}))},4208:function(t,e,n){!function(e,n){t.exports=n()}(0,(function(){"use strict";return function(t,e,n){t=t||{};var r=e.prototype,i={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function a(t,e,n,i){return r.fromToBase(t,e,n,i)}n.en.relativeTime=i,r.fromToBase=function(e,r,a,s,o){for(var u,c,d,l=a.$locale().relativeTime||i,f=t.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],h=f.length,m=0;m<h;m+=1){var p=f[m];p.d&&(u=s?n(e).diff(a,p.d,!0):a.diff(e,p.d,!0));var M=(t.rounding||Math.round)(Math.abs(u));if(d=u>0,M<=p.r||!p.r){M<=1&&m>0&&(p=f[m-1]);var v=l[p.l];o&&(M=o(""+M)),c="string"==typeof v?v.replace("%d",M):v(M,r,p.l,d);break}}if(r)return c;var Y=d?l.future:l.past;return"function"==typeof Y?Y(c):Y.replace("%s",c)},r.to=function(t,e){return a(t,e,this,!0)},r.from=function(t,e){return a(t,e,this)};var s=function(t){return t.$u?n.utc():n()};r.toNow=function(t){return this.to(s(this),t)},r.fromNow=function(t){return this.from(s(this),t)}}}))},"45eb":function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"root",staticClass:"layout"},[n("div",{staticClass:"toggle",class:{active:t.sidebar},on:{click:t.toggleSidebarStatus}},[n("icon",{attrs:{icon:["fas","sliders-h"]}})],1),n("header",{style:t.options.noPadding?"padding: 0.5rem 0;":""},[n("span",{staticClass:"title"},[t._v(t._s(t.options.title?t.options.title:t.$route.meta.title))]),t.$slots.header?n("div",{staticClass:"btn-container"},[t._t("header")],2):t._e()]),n("main",{on:{click:function(e){return t.setSidebarStatus(!1)}}},[t._t("default"),n("div",{staticClass:"end-center"},[t._t("end")],2)],2),n("footer",[n("div",{staticClass:"float-btns"},[t._t("footer")],2)])])},i=[],a=n("2f62"),s={computed:{...Object(a["c"])(["sidebar"])},methods:{...Object(a["b"])("app",["toggleSidebarStatus","setSidebarStatus"])},props:{options:{type:Object,default(){return{}}}},provide(){return{toTop:()=>{this.$refs.root.scrollTo({left:0,top:0,behavior:"smooth"})}}}},o=s,u=(n("5985"),n("2877")),c=Object(u["a"])(o,r,i,!1,null,"d1e13472",null);e["a"]=c.exports},"528f":function(t,e,n){"use strict";var r=n("7a5d"),i=n.n(r);i.a},5985:function(t,e,n){"use strict";var r=n("72ce"),i=n.n(r);i.a},"71ac":function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},["mobile"!==t.device?n("div",{staticClass:"btn",style:{background:t.backcolor,color:t.forecolor}},[n("div",{staticClass:"name"},[n("div",{},[t._v(t._s(t.name))])]),n("div",{staticClass:"icon",style:{background:t.backcolor}},[n("icon",{attrs:{icon:t.icon}})],1)]):n("div",[n("button",{style:{background:t.backcolor,color:t.forecolor}},[n("icon",{attrs:{icon:t.icon}})],1)])])},i=[],a=n("2f62"),s={props:{icon:{type:Array,required:!0},name:{type:String,required:!0},backcolor:{type:String,default:"#1188e8"},forecolor:String},computed:{...Object(a["c"])(["device"])}},o=s,u=(n("528f"),n("2877")),c=Object(u["a"])(o,r,i,!1,null,"8b036e9c",null);e["a"]=c.exports},"72ce":function(t,e,n){},"7a5d":function(t,e,n){},8607:function(t,e,n){"use strict";n.d(e,"b",(function(){return l})),n.d(e,"c",(function(){return f})),n.d(e,"a",(function(){return h}));var r,i=n("bd8e"),a=(n("a471"),n("f906")),s=n.n(a),o=n("23ad"),u=n.n(o),c=n("4208"),d=n.n(c);i["default"].extend(s.a),i["default"].extend(d.a),i["default"].extend(u.a),i["default"].locale("zh-cn"),function(t){t[t["YYYY年M月D日"]=0]="YYYY年M月D日",t[t["YYYY年M月D日 HH:mm:ss"]=1]="YYYY年M月D日 HH:mm:ss",t[t["HH:mm"]=2]="HH:mm",t[t["LLLL"]=3]="LLLL",t[t["H:mm:ss A"]=4]="H:mm:ss A"}(r||(r={}));const l=(t,e)=>Object(i["default"])(t).format(e),f=t=>Object(i["default"])(new Date(t)).fromNow(),h=(t=new Date)=>{const e=t,n=new Date(e.getFullYear(),0,0),r=e.getTime()-n.getTime(),i=864e5,a=Math.floor(r/i);return a}},"9bba":function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("PageLayout",{scopedSlots:t._u([{key:"header",fn:function(){return[n("layout-button",{attrs:{icon:["fas","plus"],name:"新增"},nativeOn:{click:function(e){return t.$router.push({name:"say-edit"})}}})]},proxy:!0},{key:"end",fn:function(){return[n("el-pagination",{staticClass:"el-pager",attrs:{"hide-on-single-page":"",layout:"prev, pager, next",total:t.page.total},on:{"prev-click":function(e){return t.handleTo(t.page.currentPage-1)},"next-click":function(e){return t.handleTo(t.page.currentPage+1)},"current-change":t.handleTo}})]},proxy:!0}])},[n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.data,"max-height":"650",stripe:""}},[n("el-table-column",{attrs:{prop:"created",label:"创建于",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{type:"text",size:"small"},nativeOn:{click:function(n){return n.preventDefault(),t.$router.push("/extra/say/edit?id="+t.data[e.$index]._id)}}},[t._v(" "+t._s(t.getRelativeTime(e.row.created))+" ")])]}}])}),n("el-table-column",{attrs:{prop:"text",label:"内容"}}),n("el-table-column",{attrs:{fixed:"right",label:"操作",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-popconfirm",{attrs:{title:"确定删除吗？"},on:{onConfirm:function(n){return t.handleDelete(e.$index)}}},[n("el-button",{attrs:{slot:"reference",type:"text",size:"small"},slot:"reference"},[t._v(" 移除 ")])],1)]}}])})],1)],1)},i=[],a=(n("ddb0"),n("9ab4")),s=n("2b0e"),o=n("2fe1"),u=n("45eb"),c=n("71ac"),d=n("8607");let l=class extends s["default"]{constructor(){super(...arguments),this.data=[],this.loading=!0,this.page={}}async created(){await this.fetchData()}async fetchData(t=1,e=10){this.loading=!0;const n=await this.$api("Say").gets({page:t,size:e});this.data=n.data,this.page=n.page,this.loading=!1}async handleDelete(t){const e=this.data[t]._id;await this.$api("Say").delete(e),this.$notice.success("删除成功"),this.fetchData()}getRelativeTime(t){return Object(d["c"])(t)}handleTo(t){this.fetchData(t)}};l=Object(a["__decorate"])([Object(o["b"])({components:{PageLayout:u["a"],LayoutButton:c["a"]}})],l);var f=l,h=f,m=n("2877"),p=Object(m["a"])(h,r,i,!1,null,null,null);e["default"]=p.exports},a471:function(t,e,n){!function(e,r){t.exports=r(n("bd8e"))}(0,(function(t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;var e={name:"zh-cn",weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),ordinal:function(t,e){switch(e){case"W":return t+"周";default:return t+"日"}},weekStart:1,yearStart:4,formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah点mm分",LLLL:"YYYY年M月D日ddddAh点mm分",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},meridiem:function(t,e){var n=100*t+e;return n<600?"凌晨":n<900?"早上":n<1100?"上午":n<1300?"中午":n<1800?"下午":"晚上"}};return t.locale(e,null,!0),e}))},bd8e:function(t,e,n){"use strict";n.r(e);var r=60,i=60*r,a=24*i,s=7*a,o=1e3,u=r*o,c=i*o,d=a*o,l=s*o,f="millisecond",h="second",m="minute",p="hour",M="day",v="week",Y="month",y="quarter",$="year",g="date",D="YYYY-MM-DDTHH:mm:ssZ",_="Invalid Date",b=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?\.?(\d+)?$/,S=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,L={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},w=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},O=function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+w(r,2,"0")+":"+w(i,2,"0")},x=function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,Y),a=n-i<0,s=e.clone().add(r+(a?-1:1),Y);return+(-(r+(n-i)/(a?i-s:s-i))||0)},H=function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},T=function(t){var e={M:Y,y:$,w:v,d:M,D:g,h:p,m:m,s:h,ms:f,Q:y};return e[t]||String(t||"").toLowerCase().replace(/s$/,"")},k=function(t){return void 0===t},A={s:w,z:O,m:x,a:H,p:T,u:k},C="en",j={};j[C]=L;var z=function(t){return t instanceof F},W=function(t,e,n){var r;if(!t)return C;if("string"===typeof t)j[t]&&(r=t),e&&(j[t]=e,r=t);else{var i=t.name;j[i]=t,r=i}return!n&&r&&(C=r),r||!n&&C},Z=function(t,e){if(z(t))return t.clone();var n="object"===typeof e?e:{};return n.date=t,n.args=arguments,new F(n)},N=function(t,e){return Z(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})},P=A;P.l=W,P.i=z,P.w=N;var U=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(P.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"===typeof e&&!/Z$/i.test(e)){var r=e.match(b);if(r){var i=r[2]-1||0,a=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,a)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,a)}}return new Date(e)},F=function(){function t(t){this.$L=W(t.locale,null,!0),this.parse(t)}var e=t.prototype;return e.parse=function(t){this.$d=U(t),this.$x=t.x||{},this.init()},e.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},e.$utils=function(){return P},e.isValid=function(){return!(this.$d.toString()===_)},e.isSame=function(t,e){var n=Z(t);return this.startOf(e)<=n&&n<=this.endOf(e)},e.isAfter=function(t,e){return Z(t)<this.startOf(e)},e.isBefore=function(t,e){return this.endOf(e)<Z(t)},e.$g=function(t,e,n){return P.u(t)?this[e]:this.set(n,t)},e.unix=function(){return Math.floor(this.valueOf()/1e3)},e.valueOf=function(){return this.$d.getTime()},e.startOf=function(t,e){var n=this,r=!!P.u(e)||e,i=P.p(t),a=function(t,e){var i=P.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(M)},s=function(t,e){var i=[0,0,0,0],a=[23,59,59,999];return P.w(n.toDate()[t].apply(n.toDate("s"),(r?i:a).slice(e)),n)},o=this.$W,u=this.$M,c=this.$D,d="set"+(this.$u?"UTC":"");switch(i){case $:return r?a(1,0):a(31,11);case Y:return r?a(1,u):a(0,u+1);case v:var l=this.$locale().weekStart||0,f=(o<l?o+7:o)-l;return a(r?c-f:c+(6-f),u);case M:case g:return s(d+"Hours",0);case p:return s(d+"Minutes",1);case m:return s(d+"Seconds",2);case h:return s(d+"Milliseconds",3);default:return this.clone()}},e.endOf=function(t){return this.startOf(t,!1)},e.$set=function(t,e){var n,r=P.p(t),i="set"+(this.$u?"UTC":""),a=(n={},n[M]=i+"Date",n[g]=i+"Date",n[Y]=i+"Month",n[$]=i+"FullYear",n[p]=i+"Hours",n[m]=i+"Minutes",n[h]=i+"Seconds",n[f]=i+"Milliseconds",n)[r],s=r===M?this.$D+(e-this.$W):e;if(r===Y||r===$){var o=this.clone().set(g,1);o.$d[a](s),o.init(),this.$d=o.set(g,Math.min(this.$D,o.daysInMonth())).$d}else a&&this.$d[a](s);return this.init(),this},e.set=function(t,e){return this.clone().$set(t,e)},e.get=function(t){return this[P.p(t)]()},e.add=function(t,e){var n,r=this;t=Number(t);var i=P.p(e),a=function(e){var n=Z(r);return P.w(n.date(n.date()+Math.round(e*t)),r)};if(i===Y)return this.set(Y,this.$M+t);if(i===$)return this.set($,this.$y+t);if(i===M)return a(1);if(i===v)return a(7);var s=(n={},n[m]=u,n[p]=c,n[h]=o,n)[i]||1,d=this.$d.getTime()+t*s;return P.w(d,this)},e.subtract=function(t,e){return this.add(-1*t,e)},e.format=function(t){var e=this;if(!this.isValid())return _;var n=t||D,r=P.z(this),i=this.$locale(),a=this.$H,s=this.$m,o=this.$M,u=i.weekdays,c=i.months,d=i.meridiem,l=function(t,r,i,a){return t&&(t[r]||t(e,n))||i[r].substr(0,a)},f=function(t){return P.s(a%12||12,t,"0")},h=d||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},m={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:P.s(o+1,2,"0"),MMM:l(i.monthsShort,o,c,3),MMMM:l(c,o),D:this.$D,DD:P.s(this.$D,2,"0"),d:String(this.$W),dd:l(i.weekdaysMin,this.$W,u,2),ddd:l(i.weekdaysShort,this.$W,u,3),dddd:u[this.$W],H:String(a),HH:P.s(a,2,"0"),h:f(1),hh:f(2),a:h(a,s,!0),A:h(a,s,!1),m:String(s),mm:P.s(s,2,"0"),s:String(this.$s),ss:P.s(this.$s,2,"0"),SSS:P.s(this.$ms,3,"0"),Z:r};return n.replace(S,(function(t,e){return e||m[t]||r.replace(":","")}))},e.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},e.diff=function(t,e,n){var r,i=P.p(e),a=Z(t),s=(a.utcOffset()-this.utcOffset())*u,f=this-a,g=P.m(this,a);return g=(r={},r[$]=g/12,r[Y]=g,r[y]=g/3,r[v]=(f-s)/l,r[M]=(f-s)/d,r[p]=f/c,r[m]=f/u,r[h]=f/o,r)[i]||f,n?g:P.a(g)},e.daysInMonth=function(){return this.endOf(Y).$D},e.$locale=function(){return j[this.$L]},e.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=W(t,e,!0);return r&&(n.$L=r),n},e.clone=function(){return P.w(this.$d,this)},e.toDate=function(){return new Date(this.valueOf())},e.toJSON=function(){return this.isValid()?this.toISOString():null},e.toISOString=function(){return this.$d.toISOString()},e.toString=function(){return this.$d.toUTCString()},t}(),E=F.prototype;Z.prototype=E,[["$ms",f],["$s",h],["$m",m],["$H",p],["$W",M],["$M",Y],["$y",$],["$D",g]].forEach((function(t){E[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),Z.extend=function(t,e){return t.$i||(t(e,F,Z),t.$i=!0),Z},Z.locale=W,Z.isDayjs=z,Z.unix=function(t){return Z(1e3*t)},Z.en=j[C],Z.Ls=j,Z.p={};e["default"]=Z},f906:function(t,e,n){!function(e,n){t.exports=n()}(0,(function(){"use strict";var t,e={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},n=function(t,n){return t.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(t,r,i){var a=i&&i.toUpperCase();return r||n[i]||e[i]||n[a].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(t,e,n){return e||n.slice(1)}))}))},r=/(\[[^[]*\])|([-:/.()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,i=/\d\d/,a=/\d\d?/,s=/\d*[^\s\d-:/()]+/,o=function(t){return function(e){this[t]=+e}},u=[/[+-]\d\d:?(\d\d)?/,function(t){(this.zone||(this.zone={})).offset=function(t){if(!t)return 0;var e=t.match(/([+-]|\d\d)/g),n=60*e[1]+(+e[2]||0);return 0===n?0:"+"===e[0]?-n:n}(t)}],c=function(e){var n=t[e];return n&&(n.indexOf?n:n.s.concat(n.f))},d=function(e,n){var r,i=t.meridiem;if(i){for(var a=1;a<=24;a+=1)if(e.indexOf(i(a,0,n))>-1){r=a>12;break}}else r=e===(n?"pm":"PM");return r},l={A:[s,function(t){this.afternoon=d(t,!1)}],a:[s,function(t){this.afternoon=d(t,!0)}],S:[/\d/,function(t){this.milliseconds=100*+t}],SS:[i,function(t){this.milliseconds=10*+t}],SSS:[/\d{3}/,function(t){this.milliseconds=+t}],s:[a,o("seconds")],ss:[a,o("seconds")],m:[a,o("minutes")],mm:[a,o("minutes")],H:[a,o("hours")],h:[a,o("hours")],HH:[a,o("hours")],hh:[a,o("hours")],D:[a,o("day")],DD:[i,o("day")],Do:[s,function(e){var n=t.ordinal,r=e.match(/\d+/);if(this.day=r[0],n)for(var i=1;i<=31;i+=1)n(i).replace(/\[|\]/g,"")===e&&(this.day=i)}],M:[a,o("month")],MM:[i,o("month")],MMM:[s,function(t){var e=c("months"),n=(c("monthsShort")||e.map((function(t){return t.substr(0,3)}))).indexOf(t)+1;if(n<1)throw new Error;this.month=n%12||n}],MMMM:[s,function(t){var e=c("months").indexOf(t)+1;if(e<1)throw new Error;this.month=e%12||e}],Y:[/[+-]?\d+/,o("year")],YY:[i,function(t){t=+t,this.year=t+(t>68?1900:2e3)}],YYYY:[/\d{4}/,o("year")],Z:u,ZZ:u},f=function(e,i,a){try{var s=function(e){for(var i=(e=n(e,t&&t.formats)).match(r),a=i.length,s=0;s<a;s+=1){var o=i[s],u=l[o],c=u&&u[0],d=u&&u[1];i[s]=d?{regex:c,parser:d}:o.replace(/^\[|\]$/g,"")}return function(t){for(var e={},n=0,r=0;n<a;n+=1){var s=i[n];if("string"==typeof s)r+=s.length;else{var o=s.regex,u=s.parser,c=t.substr(r),d=o.exec(c)[0];u.call(e,d),t=t.replace(d,"")}}return function(t){var e=t.afternoon;if(void 0!==e){var n=t.hours;e?n<12&&(t.hours+=12):12===n&&(t.hours=0),delete t.afternoon}}(e),e}}(i)(e),o=s.year,u=s.month,c=s.day,d=s.hours,f=s.minutes,h=s.seconds,m=s.milliseconds,p=s.zone,M=new Date,v=c||(o||u?1:M.getDate()),Y=o||M.getFullYear(),y=0;o&&!u||(y=u>0?u-1:M.getMonth());var $=d||0,g=f||0,D=h||0,_=m||0;return p?new Date(Date.UTC(Y,y,v,$,g,D,_+60*p.offset*1e3)):a?new Date(Date.UTC(Y,y,v,$,g,D,_)):new Date(Y,y,v,$,g,D,_)}catch(t){return new Date("")}};return function(e,n,r){r.p.customParseFormat=!0;var i=n.prototype,a=i.parse;i.parse=function(e){var n=e.date,i=e.utc,s=e.args;this.$u=i;var o=s[1];if("string"==typeof o){var u=!0===s[2],c=!0===s[3],d=u||c,l=s[2];c&&(l=s[2]),u||(t=l?r.Ls[l]:this.$locale()),this.$d=f(n,o,i),this.init(),l&&!0!==l&&(this.$L=this.locale(l).$L),d&&n!==this.format(o)&&(this.$d=new Date("")),t=void 0}else if(o instanceof Array)for(var h=o.length,m=1;m<=h;m+=1){s[1]=o[m-1];var p=r.apply(this,s);if(p.isValid()){this.$d=p.$d,this.$L=p.$L,this.init();break}m===h&&(this.$d=new Date(""))}else a.call(this,e)}}}))}}]);