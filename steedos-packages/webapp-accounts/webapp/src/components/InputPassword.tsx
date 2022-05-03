import React, { useEffect, useRef } from 'react'

const InputPassword = React.forwardRef((props: any, ref?: React.Ref<HTMLInputElement>) => {

    const selfInputRef = useRef<HTMLInputElement>();
    const inputRef = ref || selfInputRef;

    const clearPasswordValueAttribute = () => {
        return setTimeout(() => {
            const input = (inputRef as any).current;
            if (
                input &&
                input.getAttribute('type') === 'password' &&
                input.hasAttribute('value')
            ) {
                input.removeAttribute('value');
            }
          }, 50);
    };

    const handlePasswordFocus = (e: any) => {
        const { onFocus } = props;
        clearPasswordValueAttribute();
        if (onFocus)
            onFocus(e)

    }

    const handlePasswordBlur = (e: any) => {
        const { onBlur } = props;
        clearPasswordValueAttribute();
        if (onBlur)
            onBlur(e)

    }

    const handlePasswordKeyDown = (e: any) => {
        // 禁用ctrlKey/metaKey+c/v/a，复制、剪切、粘贴、全选，其中metaKey是mac系统中相关操作的辅助键
        if ((e.ctrlKey || e.metaKey) && [67, 88, 86, 65].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            return false;
        }
    }

    const handlePasswordContextMenu = (e: any) => {
        // 禁用鼠标右键菜单
        e.preventDefault();
        return false;
    }

    useEffect(() => {
      const timer = clearPasswordValueAttribute();
      return () => {
        clearTimeout(timer)
      }
    }, [props.value, props.type]);

    clearPasswordValueAttribute();

    return (
        <input 
            {...props}
            ref={inputRef}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            onKeyDown={handlePasswordKeyDown}
            onContextMenu={handlePasswordContextMenu}
        />
    );
});

InputPassword.displayName = 'InputPassword';

export default InputPassword;
