(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5b13fb6c"],{"0de2":function(e,t,o){},"0f34":function(e,t,o){"use strict";o.r(t);var a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("PageLayout",{scopedSlots:e._u([{key:"header",fn:function(){return[o("layout-button",{attrs:{icon:["fab","telegram-plane"],name:e.$route.query.id?"更新":"发布"},nativeOn:{click:function(t){return e.handleSubmit(t)}}})]},proxy:!0}])},[o("el-form",{ref:"form",attrs:{model:e.model,"label-width":"80px",rules:e.rules}},[o("el-form-item",{attrs:{label:"项目名称",prop:"name",required:""}},[o("el-input",{attrs:{"auto-complete":"off"},model:{value:e.model.name,callback:function(t){e.$set(e.model,"name",t)},expression:"model.name"}})],1),o("el-form-item",{attrs:{label:"文档地址",prop:"docUrl"}},[o("el-input",{attrs:{"auto-complete":"off"},model:{value:e.model.docUrl,callback:function(t){e.$set(e.model,"docUrl",t)},expression:"model.docUrl"}})],1),o("el-form-item",{attrs:{label:"项目地址"}},[o("el-input",{attrs:{"auto-complete":"off"},model:{value:e.model.projectUrl,callback:function(t){e.$set(e.model,"projectUrl",t)},expression:"model.projectUrl"}})],1),o("el-form-item",{attrs:{label:"预览地址"}},[o("el-input",{attrs:{"auto-complete":"off"},model:{value:e.model.previewUrl,callback:function(t){e.$set(e.model,"previewUrl",t)},expression:"model.previewUrl"}})],1),o("el-form-item",{attrs:{label:"项目描述",prop:"description",required:""}},[o("el-input",{attrs:{"auto-complete":"off"},model:{value:e.model.description,callback:function(t){e.$set(e.model,"description",t)},expression:"model.description"}})],1),o("el-form-item",{attrs:{label:"项目图标",prop:"avatar"}},[o("el-input",{attrs:{"auto-complete":"off"},model:{value:e.model.avatar,callback:function(t){e.$set(e.model,"avatar",t)},expression:"model.avatar"}})],1),o("el-form-item",{attrs:{label:"预览图片",prop:"images"}},[e._l(e.model.images,(function(t){return o("el-tag",{key:t,attrs:{closable:"","disable-transitions":!1},on:{close:function(t){return e.handleClose(e.tag)}}},[e._v(" "+e._s(t)+" ")])})),e.inputVisible?o("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small"},on:{blur:e.handleInputConfirm},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleInputConfirm(t)}},model:{value:e.inputValue,callback:function(t){e.inputValue=t},expression:"inputValue"}}):o("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:e.showInput}},[e._v("+ New ")])],2),o("el-form-item",{attrs:{label:"正文",prop:"text",required:""}},[o("el-input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:6},placeholder:"在这里介绍一下你的项目吧"},model:{value:e.model.text,callback:function(t){e.$set(e.model,"text",t)},expression:"model.text"}})],1)],1)],1)},i=[],s=(o("ddb0"),o("9ab4")),l=o("2b0e"),r=o("2fe1"),n=o("45eb"),c=o("71ac");let u=class extends l["default"]{constructor(){super(...arguments),this.model={name:"",previewUrl:"",docUrl:"",projectUrl:"",images:[],description:"",avatar:"",text:""},this.inputVisible=!1,this.inputValue="",this.rules={name:[{required:!0,message:"请输入项目名称",trigger:"blur"}],description:[{required:!0,message:"请输入描述信息",trigger:"blur"}],text:[{required:!0,message:"请输入正文",trigger:"blur"}]}}async created(){if(!this.id)return;const{data:e}=await this.$api("Project").get(this.$route.query.id);this.model=e}async handleSubmit(){this.$refs["form"].validate(async e=>{e&&(this.id?(await this.$api("Project").update(this.id,this.model),this.$message.success("修改成功~")):(await this.$api("Project").post(this.model),this.$message.success("发送成功~")),this.$router.push({name:"project-list"}))})}get id(){return this.$route.query.id}handleClose(e){this.model.images.splice(this.model.images.indexOf(e),1)}showInput(){this.inputVisible=!0,this.$nextTick(()=>{this.$refs.saveTagInput.$refs.input.focus()})}handleInputConfirm(){const e=this.inputValue;e&&(this.model.images?this.model.images.push(e):this.model.images=[e]),this.inputVisible=!1,this.inputValue=""}};u=Object(s["__decorate"])([Object(r["b"])({components:{PageLayout:n["a"],LayoutButton:c["a"]}})],u);var d=u,p=d,m=(o("e914"),o("2877")),f=Object(m["a"])(p,a,i,!1,null,"0e77d0eb",null);t["default"]=f.exports},"45eb":function(e,t,o){"use strict";var a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{ref:"root",staticClass:"layout"},[o("div",{staticClass:"toggle",class:{active:e.sidebar},on:{click:e.toggleSidebarStatus}},[o("icon",{attrs:{icon:["fas","sliders-h"]}})],1),o("header",{style:e.options.noPadding?"padding: 0.5rem 0;":""},[o("span",{staticClass:"title"},[e._v(e._s(e.options.title?e.options.title:e.$route.meta.title))]),e.$slots.header?o("div",{staticClass:"btn-container"},[e._t("header")],2):e._e()]),o("main",{on:{click:function(t){return e.setSidebarStatus(!1)}}},[e._t("default"),o("div",{staticClass:"end-center"},[e._t("end")],2)],2),o("footer",[o("div",{staticClass:"float-btns"},[e._t("footer")],2)])])},i=[],s=o("2f62"),l={computed:{...Object(s["c"])(["sidebar"])},methods:{...Object(s["b"])("app",["toggleSidebarStatus","setSidebarStatus"])},props:{options:{type:Object,default(){return{}}}},provide(){return{toTop:()=>{this.$refs.root.scrollTo({left:0,top:0,behavior:"smooth"})}}}},r=l,n=(o("5985"),o("2877")),c=Object(n["a"])(r,a,i,!1,null,"d1e13472",null);t["a"]=c.exports},"528f":function(e,t,o){"use strict";var a=o("7a5d"),i=o.n(a);i.a},5985:function(e,t,o){"use strict";var a=o("72ce"),i=o.n(a);i.a},"71ac":function(e,t,o){"use strict";var a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{},["mobile"!==e.device?o("div",{staticClass:"btn",style:{background:e.backcolor,color:e.forecolor}},[o("div",{staticClass:"name"},[o("div",{},[e._v(e._s(e.name))])]),o("div",{staticClass:"icon",style:{background:e.backcolor}},[o("icon",{attrs:{icon:e.icon}})],1)]):o("div",[o("button",{style:{background:e.backcolor,color:e.forecolor}},[o("icon",{attrs:{icon:e.icon}})],1)])])},i=[],s=o("2f62"),l={props:{icon:{type:Array,required:!0},name:{type:String,required:!0},backcolor:{type:String,default:"#1188e8"},forecolor:String},computed:{...Object(s["c"])(["device"])}},r=l,n=(o("528f"),o("2877")),c=Object(n["a"])(r,a,i,!1,null,"8b036e9c",null);t["a"]=c.exports},"72ce":function(e,t,o){},"7a5d":function(e,t,o){},e914:function(e,t,o){"use strict";var a=o("0de2"),i=o.n(a);i.a}}]);