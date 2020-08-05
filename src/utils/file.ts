import { FileType } from '../models'

export const getFileType = (type: FileType) => {
  return ['图片', '头像', '背景', '相片'][type]
}
export const getEnumFromType = (type: keyof typeof FileType) => {
  return {
    IMAGE: 0,
    AVATAR: 1,
    BACKGROUND: 2,
    PHOTO: 3,
  }[type]
}

export function responseBlobToFile(response: any, filename: string) {
  const url = window.URL.createObjectURL(new Blob([response as any]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
}
