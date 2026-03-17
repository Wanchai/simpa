import { defineEventHandler, setResponseHeader } from 'h3';

export default defineEventHandler((event) => {
  const address = (process.env['SIMPA_ADDRESS'] || '').replace(/\/$/, '');

  const script = `
function call(a){
  var xhr=new XMLHttpRequest();
  xhr.open('POST','${address}/api/tracker');
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(JSON.stringify({id:a,ref:document.referrer,page:window.location.pathname}));
}
function march(a){
  if(new Date(localStorage.getItem('simpa'+a)).getTime()<new Date().getTime()){
    call(a);
    var d=new Date();
    d.setHours(d.getHours()+12);
    localStorage.setItem('simpa'+a,d);
  }
}
`.trim();

  setResponseHeader(event, 'Content-Type', 'application/javascript');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');
  return script;
});
