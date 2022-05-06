const JSONToMap = (JSONString) => {
  const map = new Map(Object.entries(JSON.parse(JSONString))).get('value');
  const res = new Map();
  for(const index of Object.keys(map)) {
    res.set(map[index][0], map[index][1]);
  }
  return res;
};

const entityToSchema = (entity,entities) => {
  const schema = {};
  for(const property of entity.properties) {
    if(property.name == '_id') continue;
    schema[property.name] = parseProperty(property);
  }
  for(const relation of entity.relations){
    if(entities.get(relation.entity)){
      schema[entities.get(relation.entity).name] = relation.type == "many" ? '__[Types.ObjectId]__' : '__Types.ObjectId__';
    }
  }
  return schema;
};

const MapToJSONString = (map) => JSON.stringify(Object.fromEntries(map));

const parseProperty = (property) => {
  const propSchema = {};

  switch (property.type) {
    case 'Mixed':
      propSchema.type = '__Object__';
      break;
    case 'String':
      propSchema.type = '__String__';
      propSchema.trim = true;
      break;
    case 'Number':
      propSchema.type = '__Number__';
      break;
    case 'Boolean':
      propSchema.type = '__Boolean__';
      break;
    case 'ObjectId':
      propSchema.type = '__Types.ObjectId__';
      break;
    case 'Mixed Array':
      propSchema.type = '__[Object]__';
      break;
    case 'String Array':
      propSchema.type = '__[String]__';
      break;
    case 'Number Array':
      propSchema.type = '__[String]__';
      break;
    case 'ObjectId Array':
      propSchema.type = '__[Types.ObjectId]__';
      break;
    case 'Buffer':
      propSchema.type = '__Buffer__';
      break;
    case 'Date':
      propSchema.type = '__Date__';
      break;
    default:
      break;
  }

  
  for (const constraint in property.constraints) {
    switch (constraint) {
      case 'required':
        propSchema.required = property.constraints[constraint];
        break;
      case 'unique':
        if(propSchema.type === '__String__')
          propSchema.unique = property.constraints[constraint];
        break;
      case 'min':
        if(propSchema.type === '__Number__')
          propSchema.min = property.constraints[constraint];
        break;
      case 'max':
        if(propSchema.type === '__Number__')
          propSchema.max = property.constraints[constraint];
        break;
      case 'enum':
        if(propSchema.type === '__String__')
          propSchema.enum = property.constraints[constraint];
        break;
      case 'minlength':
        if(propSchema.type === '__String__')
          propSchema.minlength = property.constraints[constraint];
        break;
      case 'maxlength':
        if(propSchema.type === '__String__')
          propSchema.maxlength = property.constraints[constraint];
        break;
      case 'selectable':
        if(!property.constraints[constraint])
          propSchema.select = property.constraints[constraint];
        break;
      default:
        break;
    }
  }

  return propSchema;
}

module.exports = {
  JSONToMap,
  MapToJSONString,
  parseProperty,
  entityToSchema
}