import dayjs from 'dayjs'
import Decimal from 'decimal.js-light'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export function omitMiddle(str, maxLength = 63, startNum = 4, endNum = 9) {
  if (str.length <= maxLength) {
    return str
  }

  const ellipsis = '...'
  const ellipsisLength = ellipsis.length

  const startLength = Math.ceil((maxLength - ellipsisLength) / startNum)
  const endLength = Math.floor((maxLength - ellipsisLength) / endNum)

  const start = str.substring(0, startLength)
  const end = str.substring(str.length - endLength)

  return start + ellipsis + end
}

export function satsConvertSpace(sats: number) {
  if (sats) {
    return new Decimal(sats).div(10 ** 8).toFixed(8)
  } else {
    return 0
  }
}

export function mathAlgorithm(val: number) {
  if (val <= 0) {
    return 0
  } else if (new Decimal(val).div(10 ** 8).toNumber() <= new Decimal(1).div(10 ** 9).toNumber()) {
    return `<${new Decimal(1).div(10 ** 8).toNumber()}`
  } else {
    return new Decimal(val).div(10 ** 8).toFixed(8)
  }
}

export function mathematical(input: number, output: number) {
  const result = new Decimal(input).sub(output).toNumber()
  return result > 0
    ? `+${new Decimal(result).div(10 ** 8).toNumber()}`
    : `${new Decimal(result).div(10 ** 8).toNumber()}`
}

export function dateTimeFormat(
  timestamp: Date | number,
  format = 'YYYY-MM-DD HH:mm:ss',
  type: string = 'utc'
) {
  if (timestamp === 0 || !timestamp) return `--`
  if (String(timestamp).length != 13) {
    timestamp = +timestamp * 1000
  }
  if (type != 'utc') {
    return dayjs(timestamp).format(format)
  } else {
    return dayjs(timestamp).utc().format(format)
  }
}

export function dataNull(value: any) {
  if (!value) {
    return '--'
  }
  return value
}

export function satConvertmetaspace(value: number) {
  if (!value) {
    return '--'
  }
  return new Decimal(value).div(10 ** 8).toNumber()
}

export function ScientificCalc(value: string) {
  if (value === '--' || value === undefined) {
    return {
      bottom: '--',
      top: 0,
    }
  } else if (value.length >= 16) {
    const len = value.length
    return {
      bottom: +value.slice(0, 4) / 10,
      top: len - 4,
    }
  } else {
    return {
      bottom: value,
      top: 0,
    }
  }
}

export function replaceString(input: string) {
  if (input) {
    const regex = /[^\p{L}]/gu
    const result = input.replace(regex, '')
    return result
  } else {
    return ''
  }
}

export function formatNum(num: any) {
  if (num == '--') {
    return '--'
  }
  num = new Decimal(num).toString().split('.')
  let arr = num[0].split('').reverse() 
  let res: any = []
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i % 3 === 0 && i !== 0) {
      res.push(',') 
    }
    res.push(arr[i])
  }
  res.reverse() 
  if (num[1]) {
    
    res = res.join('').concat('.' + num[1])
  } else {
    res = res.join('')
  }

  return res
}

export function replaceBlank(str: string) {
  const regex = new RegExp('&quot;', 'g')
  return str.replace(regex, ' ')
}

export function metafileImg(url: string) {
  if (url) {
    if (url.indexOf('metafile://') > -1) {
      const res = url.split('metafile://')[1]
      return `${import.meta.env.VITE_IMG_URL}${res}`
    } else {
      return `${import.meta.env.VITE_IMG_URL}${url}`
    }
  } else {
    return ''
  }
}

export function generatorGenesisId(sensibleid: string) {
  sensibleid = sensibleid.substr(0, sensibleid.length - 8)
  let ret = ''
  for (let i = 0; i < sensibleid.length; i += 2) {
    ret = sensibleid[i] + sensibleid[i + 1] + ret
  }
  return ret
}



// sensible://0d0fc08db6e27dc0263b594d6b203f55fb5282e2/204dafb6ee543796b4da6f1d4134c1df2609bdf1/6

// undefined/metafile/sensible/0d0fc08db6e27dc0263b594d6b203f55fb5282e2/204dafb6ee543796b4da6f1d4134c1df2609bdf1/6


export function metafile(metafile: string, width = 235, type: 'metafile' | 'metaId' = 'metafile') {
  if (typeof metafile !== 'string') return ''
  if (metafile.indexOf('http://') !== -1 || metafile.indexOf('https://') !== -1) return metafile
  metafile = metafile.replace('metafile://', '')
  metafile = metafile.replace('metacontract://', 'metacontract/')
  if (metafile === '') return ''
  let path = ''
  if (metafile.indexOf('ipfs://') !== -1) {
    path = '/metafile/eth/ipfs/'
  } else if (type === 'metaId') {
    path = '/metafile/avatar/'
  } else if (metafile.indexOf('sensible://') !== -1) {
    metafile = metafile.replace('sensible://', 'sensible/')
    path = '/metafile/'
  } else if (metafile.indexOf('eth://') !== -1) {
    metafile = metafile.replace('eth://', 'evm/eth/')
    path = '/metafile/'
  } else if (metafile.indexOf('goerli://') !== -1) {
    metafile = metafile.replace('goerli://', 'evm/goerli/')
    path = '/metafile/'
  } else if (metafile.indexOf('polygon://') !== -1) {
    metafile = metafile.replace('polygon://', 'evm/polygon/')
    path = '/metafile/'
  } else if (metafile.indexOf('mumbai://') !== -1) {
    metafile = metafile.replace('mumbai://', 'evm/mumbai/')
    path = '/metafile/'
  } else {
    path = '/metafile/'
  }
  const fileUrl = `https://api.show3.io${path}${metafile.replace('ipfs://', '')}`
  const fileSuffix = metafile.split('.')[metafile.split('.').length - 1]
  const imageType = ['jpg', 'jpeg', 'png', 'gif']
  if (fileSuffix !== '' && !imageType.includes(fileSuffix)) {
    return fileUrl
  }
  if (width === -1) {
    return fileUrl
  }

  let query = 'x-oss-process=image/auto-orient,1/quality,q_80'
  if (width) {
    query += `/resize,m_lfit,w_${width}`
  }
  return `${fileUrl}?${query}`
}