import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import transform from 'lodash/transform'
import isURL from 'validator/lib/isURL'
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const pickNoEmpty = <T = any>(
  obj: any,
): Partial<T> | undefined | any[] => {
  if (!obj) {
    return
  }
  if (Array.isArray(obj)) {
    return obj.length > 0 ? obj : undefined
  }
  if (typeof obj === 'object' && obj.__proto__.constructor.name === 'Object') {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, val]) => {
        if (Array.isArray(val)) {
          return obj.length > 0
        }
        return val !== '' && typeof val !== 'undefined'
      }),
    ) as T
  }
  return obj
}

export function difference(object, base) {
  function changes(object, base) {
    return transform(object, function (result: any, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? changes(value, base[key])
            : value
      }
    })
  }
  return changes(object, base)
}

export function urlResolve(base: string, ...path: string[]) {
  if (
    !isURL(base, { require_protocol: true }) &&
    !base.match(/^http:\/\/localhost/)
  ) {
    throw new TypeError('need protocol')
  }
  return (
    (base.charAt(base.length - 1) === '/' ? base : base + '/') + path.join('/')
  )
}
