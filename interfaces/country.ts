export interface Country {
  regionPrefix: string,

  engAbb: string,

  locatedName: string,
  
  cords: {
    x: number,
    y: number
  },

  mode: string
}