export const MESSAGE = {
  required: "This field is required",
  name: "Username is incorrect",
  password: "Password is incorrect",
  phone: "Invalid email format,format valid is (+84) 123 345 789 ",
};
const validate = (rules, values) => {
  let errObj = {};

  for (const ruleKey in rules) {
    for (const rule of rules[ruleKey]) {
      //   Case: Required
      if (rule.required) {
        // check required
        if (!!!values[ruleKey]) {
          errObj[ruleKey] = rule.message || "Please input";
          break;
        }
      }
    }
  }

  return errObj;
};

export default validate;
