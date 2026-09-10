const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/js/scripts.js'),'utf8');
function element(){return {style:{},children:[],attrs:{},listeners:{},appendChild(x){this.children.push(x)},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.listeners[k]=fn},focus(){},get textContent(){return this.text||''},set textContent(v){this.text=v;this.children=[]}}}
async function run(kind,mode){
 const docListeners={},els={},get=id=>els[id]??=(element()),form=get(kind==='contact'?'cf':kind==='demo'?'bkf':'tpf'),button=element();
 form.values=new Map(Object.entries({name:'Ada <Test>',email:'ada@example.com',company:'Example & Co',message:'Please contact me',covernote:'CV details',consent:'yes','cf-turnstile-response':'secret-token'}));
 form.checkValidity=()=>true;form.querySelector=()=>button;form.reset=()=>{form.didReset=true};get('tp-cv').files=[{size:100}];
 let navigated=false,opened=0,requests=0;
 const context={document:{getElementById:get,createElement:()=>element(),createTextNode:text=>({textContent:text}),addEventListener(k,fn){docListeners[k]=fn},body:{style:{}}},window:{turnstile:{reset(){},getResponse:()=> 'token',render:()=>1},open(){opened++;return {}}},history:{pushState(){navigated=true}},showPage(){},t:s=>s,isSpam:()=>null,PAGE_LOADED_AT:0,Date,URL,encodeURIComponent,setTimeout(){},FormData:class{constructor(f){this.data=new Map(f.values)}get(k){return this.data.get(k)||null}set(k,v){this.data.set(k,v)}append(k,v){this.data.set(k,v)}},fetch:async()=>{requests++;if(mode==='network')throw Error('offline');return {ok:mode!=='quota',json:async()=> mode==='badjson'?Promise.reject(Error('bad json')):({ok:mode==='success',url:'https://outlook.office.com/book/test'})}}};
 context.turnstile=context.window.turnstile;vm.createContext(context);
 vm.runInContext(source.slice(source.indexOf('function submissionFallback'),source.indexOf('// Booking gate')),context);
 if(kind==='contact')context.hs({preventDefault(){},target:form});
 else{
  const start=source.indexOf(kind==='demo'?'// Booking gate':'// Talent Pool —'),end=source.indexOf(kind==='demo'?'// Cursor-tracking':'// Aether Flow',start);
  vm.runInContext(source.slice(start,end),context);if(kind==='demo')docListeners.click({target:{closest:s=>s==='[data-book]'?{}:null},preventDefault(){},stopPropagation(){}});form.listeners.submit({preventDefault(){}});
 }
 for(let i=0;i<12;i++)await Promise.resolve();
 assert.equal(requests,1);assert.equal(button.disabled,false);
 if(mode==='success'){assert.equal(kind==='demo'?opened>0:navigated,true);assert.equal(kind==='demo'?true:form.didReset,true)}
 else{
 const err=get(kind==='contact'?'cf-error':kind==='demo'?'bk-err':'tp-err');assert.equal(err.style.display,'block');assert.equal(err.attrs.role,'alert');assert(!form.didReset);assert(!navigated);assert.equal(opened,0);
 const link=err.children.find(c=>c.href);assert(link);const uri=new URL(link.href);assert.equal(uri.pathname,'Info@equacoredigital.com');assert(uri.searchParams.get('body').includes('Ada <Test>'));assert(!uri.searchParams.get('body').includes('secret-token'));
 if(kind==='talent'){assert(err.children.some(c=>c.textContent.includes('attach your CV')));assert(uri.searchParams.get('body').includes('covernote: CV details'))}
 }
}
(async()=>{for(const kind of ['contact','demo','talent'])for(const mode of ['success','quota','network','rejected','badjson'])await run(kind,mode);console.log('PASS: all 15 contact/demo/talent success, quota HTTP, network, rejected JSON and invalid JSON scenarios; preserved inputs, accessible persistent draft links, no automatic send/open, CV instruction.');})().catch(e=>{console.error(e);process.exitCode=1});
