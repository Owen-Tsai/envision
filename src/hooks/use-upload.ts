import { uploadFile } from '@/api/infra/file'
import CryptoJS from 'crypto-js'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'

const generateFileName = async (file: File) => {
  const data = await file.arrayBuffer()
  const wordArray = CryptoJS.lib.WordArray.create(data)
  const sha256 = CryptoJS.SHA256(wordArray).toString()
  const ext = file.name.substring(file.name.lastIndexOf('.'))
  return `${sha256}${ext}`
}

const useUpload = () => {
  const uploadUrl = import.meta.env.VITE_UPLOAD_URL
  const httpRequest = async (options: UploadRequestOption) => {
    uploadFile({ file: options.file })
      .then((res) => {
        if (res.code === 0) {
          options.onSuccess?.(res)
        } else {
          throw new Error('上传文件失败')
        }
      })
      .catch((err) => {
        console.log(err)
        throw new Error('上传文件失败')
      })
  }

  return {
    uploadUrl,
    httpRequest
  }
}

export default useUpload
