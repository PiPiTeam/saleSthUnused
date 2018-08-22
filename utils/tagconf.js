/* tags */
var tags = [
  { "name": "软件开发", "checked": false },
  { "name": "美容美发", "checked": false },
  { "name": "生活服务", "checked": false },
  { "name": "超市零售", "checked": false },
  { "name": "机械机电", "checked": false },
  { "name": "专业", "checked": false },
  { "name": "靠谱", "checked": false },
  { "name": "人脉广", "checked": false }
];

const business = [
  "软件开发", 
  "美容美发", 
  "生活服务", 
  "超市零售", 
  "机械机电"
];
function businessFilter() {
  var list = ["行业"];
  list = list.concat(business);
  return list;
}

function getLabelFromString(str) {
  var array = [];
  if (str && str.length > 0) {
    array = str.split(",");
  }
  var newArr = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i] != '') {
      newArr.push(array[i]);
    }
  }
  return newArr;
}

module.exports = {
  tags: tags,
  business: business,
  businessFilter: businessFilter,
  getLabelFromString: getLabelFromString
}