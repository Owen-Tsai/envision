import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { aesEncrypt } from '@/utils/encryption'
import { checkCaptcha, type CaptchaValidationDTO, type CaptchaVO } from '@/api/login'

export const BACKEND_FIXED_IMG_WIDTH = 310

const useValidation = (cbk: { onSuccess: (v: string) => void; onError: () => void }) => {
  const { onError, onSuccess } = cbk
  const validationInfo = ref({
    visible: false,
    msg: '',
    success: false,
  })

  const validate = async (mouseX: number, captcha?: CaptchaVO) => {
    const secretKey = captcha?.repData.secretKey
    const token = captcha?.repData.token
    const pos = { x: mouseX, y: 5.0 }

    const pointJson = JSON.stringify(pos)
    const vo: CaptchaValidationDTO = {
      pointJson: secretKey ? aesEncrypt(pointJson, secretKey) : pointJson,
      token: token || '',
    }

    try {
      const res = await checkCaptcha(vo)
      if (res.success) {
        const captchaVerification = secretKey
          ? aesEncrypt(`${token}---${pointJson}`, secretKey)
          : `${token}---${pointJson}`
        validationInfo.value = {
          visible: true,
          msg: '验证通过',
          success: true,
        }

        onSuccess(captchaVerification)
      } else {
        validationInfo.value = {
          visible: true,
          msg: '验证失败',
          success: false,
        }

        message.error('验证失败')

        setTimeout(() => {
          onError()
        }, 1000)
      }
    } catch (e) {
      console.log(e)
      onError()
    }
  }

  return {
    validationInfo,
    validate,
  }
}

export default useValidation
