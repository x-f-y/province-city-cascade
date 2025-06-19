(async function(){
  const doms = {
    selProvince: document.querySelector('#selProvince'),
    selCity: document.querySelector('#selCity'),
    selArea: document.querySelector('#selArea')
  };
  const allData = await getDatas(); // 省市区的所有数据
  
  init();

  // 初始化
  function init(){
    fillSelectHTML(doms.selProvince, allData);
    fillSelectHTML(doms.selCity, []);
    fillSelectHTML(doms.selArea, []);
    initEvent();
  }

  // 所有事件处理
  function initEvent(){
    regTitleClickEvent(doms.selProvince);
    regTitleClickEvent(doms.selCity);
    regTitleClickEvent(doms.selArea);
    regOptionsClickEvent(doms.selProvince, data => {
      fillSelectHTML(doms.selCity, data);
      fillSelectHTML(doms.selArea, []);
    });
    regOptionsClickEvent(doms.selCity, data => {
      fillSelectHTML(doms.selArea, data);
    });
    regOptionsClickEvent(doms.selArea);
  }

  // 给指定的下拉列表填充HTML结构
  function fillSelectHTML(select, data){
    select.className = 'select' + (data.length === 0 ? ' disabled' : '');
    select.querySelector('.title span').innerText = '请选择' + select.dataset.name;
    const options = select.querySelector('.options');
    options.innerHTML = data.map(obj => `<li>${obj.label}</li>`).join('');
    select.data = data;
  }

  // 为指定下拉列表的title注册点击事件
  function regTitleClickEvent(select){
    select.querySelector('.title').addEventListener('click', function(){
      if(select.classList.contains('disabled')){
        return;
      }
      const expandedSelect = document.querySelector('.select.expand');
      expandedSelect && expandedSelect !== select && expandedSelect.classList.remove('expand');
      select.classList.toggle('expand');
    });
  }

  // 为指定下拉列表的选项注册点击事件
  function regOptionsClickEvent(select, callback){
    select.querySelector('.options').addEventListener('click', function(e){
      const target = e.target;
      if(target.tagName !== 'LI'){
        return;
      }
      if(!target.classList.contains('active')){
        const activeLi = select.querySelector('.options li.active');
        activeLi && activeLi.classList.remove('active');
        target.classList.add('active');
        select.querySelector('.title span').innerText = target.innerText;
        callback && callback(select.data.find(obj => obj.label === target.innerText).children);
      }
      select.classList.remove('expand');
    });
  }
  
  // 从网络获取省市区数据
  async function getDatas() {
    return fetch('https://study.duyiedu.com/api/citylist')
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }
})();