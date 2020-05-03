export const sleep = (ms: number) => {
  return new Promise((resolve, reject) => {
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
