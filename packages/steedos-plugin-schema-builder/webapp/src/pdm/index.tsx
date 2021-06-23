import { InboxOutline } from '@ant-design/icons'
import { message, Upload } from 'antd'
import { useDispatch } from '../hook'
import React from 'react'
const PdmToJson = require('./pdm-json')
import { ConvertTo } from './util'

export default ({children}) => {
  const dispatch =  useDispatch()

  const props = {
    name: 'file',
    multiple: true,
    transformFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload =  async (a) => {
          // alert(a.target.result)
          const aa = await PdmToJson(a.target.result)
          console.log(aa)
          const erds = ConvertTo(aa)
          console.log(erds)
          dispatch({
            type: `${'erd'}/load`,
            ...erds,
          })
        }
      })
    },
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
     }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
     } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
     }
    },
  }

  return   (
  <Upload {...props}>
  {children}
</Upload>
 )
}

