let url = `http://localhost:3000`

let block;
const Request = async (endpoint, data = {}) => new Promise(async (res,rej) => {
  try {
    if (block) return { error: `Aguarde a sua outra ação acabar, para poder para efetuar uma nova...` }

    if (data.body) data.body = JSON.stringify(data.body);
    if (!data.headers) data.headers = {};
    if (!data.headers["Content-Type"]) data.headers["Content-Type"] = "application/json; charset=utf-8";
    if (!data.headers["Authorization"]) data.headers["Authorization"] = localStorage.getItem('token');

    let req = await fetch(endpoint, data)
    let result = await req.json();
    
    if (result.error) return rej(result);
    if ([200, 201, 202].includes(req.status)) return res(result);

    console.log(req, result);
    return rej({ error: `[1]=> Ocorreu algum erro inesperado na requisição...\nReporte para os nossos desenvolvedores!` })
  } catch(err) {
    if (String(err).includes('Failed to fetch')) return rej({ error: `Sem resposta do servidor...\nTente novamente mais tarde!` })

    console.log(err);
    return rej({ error: `[2]=> Ocorreu algum erro inesperado na requisição...\nReporte para os nossos desenvolvedores!` })
  }
})

const Load = async (element, url) => {
  if (!element) return console.log('Não foi informado o elemento aonde será carregado...');
  if (!url) url = 'views/main.html'

  let html = await HTML(url)
  if (html.error) return Load(element)
  element.innerHTML = html

  let scripts = element.getElementsByTagName('script')
  for (let i = 0; i < scripts.length; i++) {
    let script = document.createElement("script");
    if (scripts[0].innerHTML) script.innerHTML = scripts[0].innerHTML;
    if (scripts[0].src) script.setAttribute('src', scripts[0].src);
    element.appendChild(script);
    scripts[0].remove();
  }

  if (!url.includes('/imports')) document.querySelector('#css').href = url.replace('views/','public/css/views/').replace('.html','.css');

}

const HTML = async (url) => {
  let html = await fetch(url.toLowerCase())
    .then(response => response.text())
    .catch(() => {})
  if (!html) return { error: 'O arquivo não foi encontrado...' }
  return html;
}

const Timeout = async (ms) => new Promise(res => setTimeout(res, ms))