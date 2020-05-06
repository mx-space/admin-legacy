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
