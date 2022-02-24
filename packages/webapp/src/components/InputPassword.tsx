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
        />
    );
});

InputPassword.displayName = 'InputPassword';

export default InputPassword;
