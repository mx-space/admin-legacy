(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f476173e"],{"528f":function(t,e,o){"use strict";var a=o("7a5d"),r=o.n(a);r.a},"5b1c":function(t,e,o){"use strict";o.r(e);var a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("PageLayout",{scopedSlots:t._u([{key:"header",fn:function(){return[o("layout-button",{attrs:{backcolor:"#41B883",icon:["far","save"],name:"发布一言"},nativeOn:{click:function(e){return t.handlePostHitokoto(e)}}}),o("layout-button",{attrs:{icon:["fab","telegram-plane"],name:t.$route.query.id?"更新":"发布"},nativeOn:{click:function(e){return t.handleSubmit(e)}}})]},proxy:!0}])},[o("el-form",{ref:"form",attrs:{model:t.model,"label-width":"80px",rules:t.rules}},[o("el-form-item",{attrs:{label:"内容",prop:"text",required:""}},[o("el-input",{attrs:{type:"textarea",autosize:{minRows:6,maxRows:8},placeholder:t.placeholder.text},model:{value:t.model.text,callback:function(e){t.$set(t.model,"text",e)},expression:"model.text"}})],1),o("el-form-item",{attrs:{label:"作者",prop:"author"}},[o("el-input",{attrs:{placeholder:t.placeholder.author,"auto-complete":"off"},model:{value:t.model.author,callback:function(e){t.$set(t.model,"author",e)},expression:"model.author"}})],1),o("el-form-item",{attrs:{label:"来源",prop:"source"}},[o("el-input",{attrs:{placement:t.placeholder.source,"auto-complete":"off"},model:{value:t.model.source,callback:function(e){t.$set(t.model,"source",e)},expression:"model.source"}})],1)],1)],1)},r=[],s=(o("ddb0"),o("9ab4")),c=o("2b0e"),i=o("2fe1"),l=o("45eb"),n=o("71ac"),u=o("d257");let d=class extends c["default"]{constructor(){super(...arguments),this.model={source:"",text:"",author:""},this.placeholder={text:"",author:"",source:""},this.rules={text:[{required:!0,message:"请输入正文",trigger:"blur"}]}}async created(){if(await this.getHitokoto(),!this.id)return;const{data:t}=await this.$api("Say").get(this.$route.query.id);this.model=t}async getHitokoto(){const t=await fetch("https://v1.hitokoto.cn/"),e=await t.json();this.placeholder={source:e.from,text:e.hitokoto,author:e.from_who||e.creator}}async handlePostHitokoto(){await this.$api("Say").post(Object(u["b"])(this.placeholder)),this.$message.success("发送成功~"),this.$router.push({name:"say-list"})}async handleSubmit(){this.$refs["form"].validate(async t=>{t&&(this.id?(await this.$api("Say").update(this.id,Object(u["b"])(this.model)),this.$message.success("修改成功~")):(await this.$api("Say").post(Object(u["b"])(this.model)),this.$message.success("发送成功~")),this.$router.push({name:"say-list"}))})}get id(){return this.$route.query.id}};d=Object(s["__decorate"])([Object(i["b"])({components:{PageLayout:l["a"],LayoutButton:n["a"]}})],d);var h=d,m=h,p=o("2877"),b=Object(p["a"])(m,a,r,!1,null,null,null);e["default"]=b.exports},"71ac":function(t,e,o){"use strict";var a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{},["mobile"!==t.device?o("div",{staticClass:"btn",style:{background:t.backcolor,color:t.forecolor}},[o("div",{staticClass:"name"},[o("div",{},[t._v(t._s(t.name))])]),o("div",{staticClass:"icon",style:{background:t.backcolor}},[o("icon",{attrs:{icon:t.icon}})],1)]):o("div",[o("button",{style:{background:t.backcolor,color:t.forecolor}},[o("icon",{attrs:{icon:t.icon}})],1)])])},r=[],s=o("2f62"),c={props:{icon:{type:Array,required:!0},name:{type:String,required:!0},backcolor:{type:String,default:"#1188e8"},forecolor:String},computed:{...Object(s["c"])(["device"])}},i=c,l=(o("528f"),o("2877")),n=Object(l["a"])(i,a,r,!1,null,"8b036e9c",null);e["a"]=n.exports},"7a5d":function(t,e,o){}}]);