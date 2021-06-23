import React from 'react'
import WebPdmPage from './page'
import Pdm from './pdm'
import { Tree } from './tree'
export * from './type'
import DvaModel from './page/dva-model'
import { ErdPage } from './g6/model'
import './style.less'

export {
  DvaModel,
  ErdPage
}

const useAppContext = () => ({
  tabsRouteContext: {
    current: '/',
  },
  shellContext: {
    setState: () => ({}),
  },
 })
export default (props) => {
    return <WebPdmPage ErdPage={ErdPage} Pdm={Pdm} Tree={Tree} useAppContext={useAppContext} {...props} />
}