export function cleanWhiteSpace (value) {
  let primerBlanco = /^ /
  let variosBlancos = /[ ]+/g
  value = value.replace(variosBlancos, ' ')
  value = value.replace(primerBlanco, '')
  return value
}

export function toInt (value, vDefault) {
  return value !== undefined && value !== '' && !isNaN(Number(value)) ? parseInt(value, 10) : (vDefault !== undefined ? vDefault : value)
}

export function toFloat (value, vDefault) {
  return value !== undefined && value !== '' && !isNaN(Number(value)) ? parseFloat(value, 10) : (vDefault !== undefined ? vDefault : value)
}

export function toBool (value) {
  return (value === 'true')
}

export default {
  cleanWhiteSpace,
  toInt,
  toFloat,
  toBool
}
