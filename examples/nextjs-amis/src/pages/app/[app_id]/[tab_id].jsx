import dynamic from 'next/dynamic'
import Document, { Script, Head, Main, NextScript } from 'next/document'
import React, { useState, useEffect } from 'react';

import { Navbar } from '@/components/Navbar'

export default function Page ({schema}) {

  useEffect(() => {
    (function () {
      let amis = amisRequire('amis/embed');
      let amisScoped = amis.embed('#amis-root', 
        schema, 
        {}, 
        {
          theme: 'antd'
        }
      );
    })();
  });

  return (
    <>
      <Navbar/>
      <div id="amis-root" className="app-wrapper"></div>
    </>
  )
}



export async function getServerSideProps(context) {
  const schema = {
    type: 'page',
    title: '表单页面',
    body: {
      type: 'form',
      mode: 'horizontal',
      api: '/saveForm',
      body: [
        {
          label: 'Name',
          type: 'input-text',
          name: 'name'
        },
        {
          label: 'Email',
          type: 'input-email',
          name: 'email'
        }
      ]
    }
  };
  return {
    props: { schema },
  }
}