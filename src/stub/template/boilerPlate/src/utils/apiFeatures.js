class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = APIFeatures.parseJSON(this.queryString.sort);
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  // Field Limiting ex: -----/user?fields=name,email,address
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);
    Object.keys(queryObj).forEach((key) => {
      queryObj[key] = queryObj[key].trim().replace(/\"/g, '');
      if (queryObj[key].includes(',')) {
        const values = queryObj[key].split(',');
        values.forEach((value) => {
          value = value.trim();
        });
        this.query = this.query.where(key).in(values);
      } else {
        this.query = this.query.where(key, queryObj[key]);
      }
    });
    return this;
  }

  static parseJSON(jsonString) {
    const json = jsonString.split('{')[1].split('}')[0];
    const jsonArray = json.split(',');
    const jsonObject = {};
    jsonArray.forEach((item) => {
      const key = item.split(':')[0].replace(/\"/g, '');
      const value = item.split(':')[1].replace(/\"/g, '');
      jsonObject[key] = isNaN(value) ? value : Number(value);
    });
    return jsonObject;
  }
}

module.exports = APIFeatures;
