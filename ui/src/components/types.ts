type JSONObject =
  | string
  | number
  | boolean
  | null
  | JSONObject[]
  | { [key: string]: JSONObject };

type ID = number;

type Target = {
  id: ID;
  domain_name: string;
};

export type Check = {
  id: ID;
  target: Target;
  name: string;
  data: JSONObject;
};
