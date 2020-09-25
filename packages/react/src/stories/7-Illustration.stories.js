import React from 'react';
import { Illustration } from '../components';
// import { WalkthroughNotAvailableSVG } from '../components';

export default {
    title: 'Illustration',
};


export const SLDSIllustration = () => (
    <Illustration
        heading='没有找到数据'
        messageBody='数据可能被删除了'
        name='aaa'
        path="/assets/images/illustrations/empty-state-no-results.svg#no-results"
    />
);

// export const illustrationSvgName = () => (
//     <Illustration
//         heading='似乎出现了一个问题。'
//         messageBody='我们无法找到您尝试访问的记录。此记录可能已被其他用户删除，或可能发生了系统错误。请向您的管理员寻求帮助。'
//         illustrationSvgName="walkthrough-not-available"
//         style={{ backgroundColor: '#fff' }}
//     />
// );

// export const illustrationSvg = () => (
//     <Illustration
//         heading='似乎出现了一个问题。'
//         messageBody='我们无法找到您尝试访问的记录。此记录可能已被其他用户删除，或可能发生了系统错误。请向您的管理员寻求帮助。'
//         illustrationSvg={WalkthroughNotAvailableSVG}
//         style={{ backgroundColor: '#fff' }}
//     />
// );