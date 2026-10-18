(function(){
var AUD=[
{label:'Engineers',role:'Engineer',h:'Existing conditions you can design against.',b:'Point clouds and as-builts for structural, MEP and civil work, captured by an engineering draftsman who knows which beams, openings and elevations your calcs depend on.',cta:'Get an engineering quote',recs:[['.E57','Point cloud'],['.DWG','As-built drawings'],['TAGS','Measurements & annotations']]},
{label:'Architects',role:'Architect',h:"Start design from what's actually there.",b:'A measurable existing-conditions model for remodels and additions, without a week of field measuring or a second trip for the dimension you missed.',cta:'Get an architecture quote',recs:[['.RVT','Revit / BIM-ready files'],['.PDF','2D schematic floor plans'],['3D','Virtual walkthrough']]},
{label:'Contractors',role:'Builder / contractor',h:"Document every stage before it's covered up.",b:'Pre-construction records, progress scans and a shareable model your subs can walk before they bid. Fewer RFIs, fewer return trips.',cta:'Get a contractor quote',recs:[['SCAN','Progress scans'],['3D','Virtual walkthrough'],['TAGS','Measurements & annotations']]},
{label:'Homeowners',role:'Homeowner',h:'A full layout of your home, and help with the permit.',b:'Know exactly what you have before a remodel, addition or sale. Jimmy can walk you through what your city or county will ask for.',cta:'Get a homeowner quote',recs:[['.PDF','2D floor plans'],['PRMT','Permit-ready documentation'],['3D','Virtual walkthrough']]}];
function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}
// tablists with arrow keys
function tablist(list,onSel){var tabs=$$('[role=tab]',list);tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(i)});t.addEventListener('keydown',function(e){var k=e.key,n=null;if(k==='ArrowRight')n=(i+1)%tabs.length;if(k==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;if(n!==null){e.preventDefault();sel(n);tabs[n].focus()}})});
function sel(i){tabs.forEach(function(t,j){t.setAttribute('aria-selected',j===i?'true':'false');t.tabIndex=j===i?0:-1});onSel(i)}}
// audience
var aud=$('#aud'),cur=0;if(aud){tablist(aud,function(i){cur=i;var a=AUD[i];$('#aud-h').textContent=a.h;$('#aud-b').textContent=a.b;$('#aud-cta-t').textContent=a.cta;$('#aud-recs').innerHTML=a.recs.map(function(r){return '<li><span class="tagx">'+esc(r[0])+'</span>'+esc(r[1])+'</li>'}).join('')});
$('#aud-cta').addEventListener('click',function(){var r=document.querySelector('input[name=role][value="'+AUD[cur].role+'"]');if(r)r.checked=true});}
// viewer
var views=$('#views');if(views){var titles=['LIVE MATTERPORT MODEL','SCHEMATIC FLOOR PLAN','ROOM CAPTURES'];tablist(views,function(i){$$('.panel').forEach(function(p,j){p.hidden=j!==i});$('#vtitle').textContent=titles[i]})}
// reveal
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
$$('main h2, .dgrid > li, .steps > li').forEach(function(el,i){if(el.getBoundingClientRect().top<innerHeight)return;el.classList.add('rv');el.style.transitionDelay=(i%3)*70+'ms';io.observe(el)})}
// form
var f=$('#quote-form'),sent=$('#quote-sent');if(f){f.addEventListener('submit',function(e){if(!window.fetch||!window.FormData)return;e.preventDefault();var btn=$('button[type=submit]',f),err=$('#form-err');err.hidden=true;btn.disabled=true;btn.firstChild.textContent='Sending… ';
fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}}).then(function(r){return r.json().then(function(j){if(!r.ok||!j.ok)throw new Error(j.error||'Something went wrong.');})}).then(function(){f.reset();sent.classList.add('show');sent.setAttribute('tabindex','-1');sent.focus();if(window.gtag)gtag('event','generate_lead',{form:'quote'})}).catch(function(x){err.textContent=x.message+' Please try again or email us directly.';err.hidden=false}).then(function(){btn.disabled=false;btn.firstChild.textContent='Send request '})});
$('#again').addEventListener('click',function(){sent.classList.remove('show');if(location.hash==='#quote-sent')history.replaceState(null,'','#quote');$('input[name=name]',f).focus()})}
document.getElementById('yr').textContent=new Date().getFullYear();
})();