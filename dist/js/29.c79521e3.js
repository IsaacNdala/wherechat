"use strict";(self["webpackChunkwherechat"]=self["webpackChunkwherechat"]||[]).push([[29],{3029:function(e,s,a){a.r(s),a.d(s,{default:function(){return A}});var t=a(3396),n=a(7139),o=a(9242);const r={id:"message-component",class:"message-component"},m={class:"message-component__nav"},_=(0,t._)("i",{class:"fi fi-rr-arrow-small-left d-flex"},null,-1),i=[_],c={class:"message-component__nav__img-container border"},g=["src"],d={class:"message-component__nav__username"},l={class:"message-component__message-form-container"},h={class:"d-flex"},u=(0,t._)("button",{class:"btn btn-primary"},[(0,t._)("i",{class:"fi fi-rr-paper-plane d-flex"})],-1),p={class:"message-component__body"},f={class:"message-component__body__head"},v={class:"message-component__body__head__img-container border"},w=["src"],y={class:"message-component__body__head__info"},b={class:"message-component__body__head__info__username"},C={key:0,class:"message-component__body__message__img-container border"},D=["src"];function F(e,s,a,_,F,k){return(0,t.wg)(),(0,t.iD)("div",r,[(0,t._)("nav",m,[(0,t._)("a",{onClick:s[0]||(s[0]=e=>this.$router.go(-1))},i),(0,t._)("div",c,[(0,t._)("img",{src:e.serverDomain+F.userInChat.imageUrl,alt:""},null,8,g)]),(0,t._)("span",d,(0,n.zw)(F.userInChat.firstName)+" "+(0,n.zw)(F.userInChat.lastName),1)]),(0,t._)("div",l,[(0,t._)("form",{onSubmit:s[3]||(s[3]=(0,o.iM)(((...e)=>k.sendMessage&&k.sendMessage(...e)),["prevent"]))},[(0,t._)("div",h,[(0,t.wy)((0,t._)("textarea",{"onUpdate:modelValue":s[1]||(s[1]=e=>F.messageForm.content=e),class:"form-control",placeholder:"Write a message",rows:"1"},null,512),[[o.nr,F.messageForm.content]]),(0,t.wy)((0,t._)("input",{"onUpdate:modelValue":s[2]||(s[2]=e=>F.messageForm.to=e),type:"hidden"},null,512),[[o.nr,F.messageForm.to]]),u])],32)]),(0,t._)("div",p,[(0,t._)("div",f,[(0,t._)("div",v,[(0,t._)("img",{src:e.serverDomain+F.userInChat.imageUrl,alt:""},null,8,w)]),(0,t._)("div",y,[(0,t._)("span",b,(0,n.zw)(F.userInChat.firstName)+" "+(0,n.zw)(F.userInChat.lastName),1)])]),((0,t.wg)(!0),(0,t.iD)(t.HY,null,(0,t.Ko)(k.newMessages,(s=>((0,t.wg)(),(0,t.iD)("div",{key:s._id,class:"message-component__body__message"},[(0,t._)("div",{class:(0,n.C_)(["d-flex",{"flex-row-reverse":s.me}])},[s.me?(0,t.kq)("",!0):((0,t.wg)(),(0,t.iD)("div",C,[(0,t._)("img",{src:e.serverDomain+s.imageUrl,alt:""},null,8,D)])),(0,t._)("div",{class:(0,n.C_)(["message-component__body__message__content",{"message-component__body__message__content__you":s.me}])},(0,n.zw)(s.content),3)],2),(0,t._)("span",{class:(0,n.C_)(["message-component__body__message__date",{"message-component__body__message__date__you":s.me}])},(0,n.zw)(s.date),3)])))),128))])])}var k=a(6265),U=a.n(k),I=a(4239),M=a(2066),Z=a(9749),z={name:"MessageComponent",data(){return{messages:[],messageForm:{content:"",to:this.$route.params.userId},userInChat:{}}},computed:{...(0,Z.rn)(["user","serverDomain"]),newMessages(){const e=[...this.messages];return e.forEach((e=>{e.from._id===I.Z.state.user.id&&(e.me=!0,e.imageUrl=e.from.imageUrl),e.from._id===this.messageForm.to&&(e.me=!1,e.imageUrl=e.from.imageUrl),e.date=new Date(e.createdAt).toDateString()})),e}},watch:{$route(e){this.messageForm.to=e.params.userId,this.fetchMessages()}},methods:{async sendMessage(){let e;""!==this.messageForm.content&&(e=await U().post(I.Z.state.serverDomain+"message/send-message",this.messageForm,{headers:{Authorization:`Bearer ${I.Z.state.token}`}})),e&&(this.messageForm.content="")},async fetchMessages(){try{const e=await U().get(I.Z.state.serverDomain+"message/view-messages/"+this.messageForm.to,{headers:{Authorization:`Bearer ${I.Z.state.token}`}});this.messages=e.data.messages,e&&this.fetchUser()}catch(e){e.response&&401===e.response.status&&this.$router.push("/login")}},async fetchUser(){try{const e=await U().get(I.Z.state.serverDomain+"user/get-user/"+this.messageForm.to,{headers:{Authorization:`Bearer ${I.Z.state.token}`}});this.userInChat=e.data.user}catch(e){e.response&&401===e.response.status&&this.$router.push("/login")}}},created(){this.fetchMessages()},mounted(){const e=(0,M.ZP)(I.Z.state.serverDomain);e.on("messages",(e=>{"sent"===e.action&&this.messages.push(e.message)}))}},$=a(89);const x=(0,$.Z)(z,[["render",F]]);var A=x}}]);
//# sourceMappingURL=29.c79521e3.js.map