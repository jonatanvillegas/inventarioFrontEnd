 export const FormatoNumero = (numero:number) => { 
    return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(
        numero,
      )
 };