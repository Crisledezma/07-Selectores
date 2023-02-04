export interface Pais {
  name        : Name;
  cca3        : string;
  capital     : string[];
  altSpellings: string[];
  translations: { [key:  string]: Translation };
}

export interface Name {
  common    : string;
  official  : string;
  nativeName: { [key: string]: Translation };
}

export interface Translation {
  official: string;
  common  : string;
}
