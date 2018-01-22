// function isInt(n){
//     return Number(n) === n && n % 1 === 0;
// }

function isFloat (n) {
  return Number(n) === n && n % 1 !== 0
}

export function required (value) {
  return value === undefined || value === '' ? 'Requerido' : null
}

export function validarMaximo (maximo, minimo) {
  if ((maximo !== undefined && maximo !== '') &&
    (Number(maximo) || maximo === 0) &&
    (minimo !== undefined && minimo !== '') &&
    (Number(minimo) || minimo === 0) &&
    Number(maximo) < Number(minimo)
    ) {
    return 'El máximo debe ser mayor o igual al mínimo'
  } else {
    return null
  }
}

export function validarMaximoInclusive (maximo, minimo) {
  if ((maximo !== undefined && maximo !== '') &&
    (Number(maximo) || maximo === 0) &&
    (minimo !== undefined && minimo !== '') &&
    (Number(minimo) || minimo === 0) &&
    Number(maximo) <= Number(minimo)
    ) {
    return 'El máximo debe ser mayor al mínimo'
  } else {
    return null
  }
}

export function onlyNumber (value) {
  if ((value !== undefined && value !== '') &&
    isNaN(Number(value))) {
    return 'Solo números'
  } else {
    return null
  }
}

export function onlyEnteros (value) {
  if ((value !== undefined && value !== '') &&
    isFloat(Number(value))) {
    return 'Solo enteros'
  } else {
    return null
  }
}

export function menorQue (value, parametro) {
  if ((value !== undefined && value !== '') &&
    (Number(value) || value === 0) &&
    (parametro !== undefined && parametro !== '') &&
    (Number(parametro) || parametro === 0) &&
    Number(value) >= Number(parametro)
    ) {
    return 'Debe ser menor que ' + parametro
  } else {
    return null
  }
}

export function menorQueInclusive (value, parametro) {
  if ((value !== undefined && value !== '') &&
    (Number(value) || value === 0) &&
    (parametro !== undefined && parametro !== '') &&
    (Number(parametro) || parametro === 0) &&
    Number(value) > Number(parametro)
    ) {
    return 'Debe ser menor que o igual a ' + parametro
  } else {
    return null
  }
}

export function mayorQue (value, parametro) {
  if ((value !== undefined && value !== '') &&
    (Number(value) || value === 0) &&
    (parametro !== undefined && parametro !== '') &&
    (Number(parametro) || parametro === 0) &&
    Number(value) <= Number(parametro)
    ) {
    return 'Debe ser mayor que ' + parametro
  } else {
    return null
  }
}

export function mayorQueInclusive (value, parametro) {
  if ((value !== undefined && value !== '') &&
    (Number(value) || value === 0) &&
    (parametro !== undefined && parametro !== '') &&
    (Number(parametro) || parametro === 0) &&
    Number(value) < Number(parametro)
    ) {
    return 'Debe ser mayor que o igual a ' + parametro
  } else {
    return null
  }
}

export function maxLength (value, parametro) {
  if (value !== undefined && value !== '') {
    let primerBlanco = /^ /
    let ultimoBlanco = / $/
    let variosBlancos = /[ ]+/g
    value = value.toString()
    value = value.replace(variosBlancos, ' ')
    value = value.replace(primerBlanco, '')
    value = value.replace(ultimoBlanco, '')
    if (value.length > parametro) {
      return 'El máximo es de ' + parametro + ' caracteres'
    } else {
      return null
    }
  } else {
    return null
  }
}

export function minLength (value, parametro) {
  if (value !== undefined && value !== '') {
    let primerBlanco = /^ /
    let ultimoBlanco = / $/
    let variosBlancos = /[ ]+/g
    value = value.toString()
    value = value.replace(variosBlancos, ' ')
    value = value.replace(primerBlanco, '')
    value = value.replace(ultimoBlanco, '')
    if (value.length < parametro) {
      return 'El mínimo es de ' + parametro + ' caracteres'
    } else {
      return null
    }
  } else {
    return null
  }
}

export function isEmail (value) {
  if (value !== undefined && value !== '' &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Email incorrecto'
  } else {
    return null
  }
}

export default {
  required,
  validarMaximo,
  validarMaximoInclusive,
  onlyNumber,
  onlyEnteros,
  menorQue,
  menorQueInclusive,
  mayorQue,
  mayorQueInclusive,
  maxLength,
  minLength,
  isEmail
}
