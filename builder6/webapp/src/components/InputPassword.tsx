import React, { useEffect, useRef, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// 监听到debug模式修改密码字段的type时自动清空密码框
const mutationObserver = (() => {
  try {
    return new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'type') {
          (mutation.target as any).removeAttribute("value");
        }
      });
    });
  } catch (ex) {
    console.warn("MutationObserver Not Found:", ex);
    return;
  }
})();

const InputPassword = React.forwardRef((props: any, ref?: React.Ref<HTMLInputElement>) => {

  const selfInputRef = useRef<HTMLInputElement>(null);
  const inputRef = (ref || selfInputRef) as React.RefObject<HTMLInputElement>;

  const [showPassword, setShowPassword] = useState(false);

  const clearPasswordValueAttribute = () => {
    return setTimeout(() => {
      const input = inputRef.current;
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
    clearPasswordValueAttribute();
    props.onFocus && props.onFocus(e);
  };

  const handlePasswordBlur = (e: any) => {
    clearPasswordValueAttribute();
    props.onBlur && props.onBlur(e);
  };

  // 禁复制剪切粘贴
  const handlePasswordKeyDown = (e: any) => {
    if ((e.ctrlKey || e.metaKey) && [67, 88, 86, 65].includes(e.keyCode)) {
      e.preventDefault();
      return false;
    }
    return true;
  };

  const handlePasswordContextMenu = (e: any) => {
    e.preventDefault();
    return false;
  };

  // 监听 value 或 type 变化
  useEffect(() => {
    const timer = clearPasswordValueAttribute();
    return () => clearTimeout(timer);
  }, [props.value, props.type]);

  // 初始化执行一次
  useEffect(() => {
    clearPasswordValueAttribute();
  }, []);

  // MutationObserver
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      mutationObserver?.observe(input, { attributes: true });
    }
    return () => {
      mutationObserver?.disconnect();
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        {...props}
        ref={inputRef}
        type={showPassword ? "text" : "password"}
        onFocus={handlePasswordFocus}
        onBlur={handlePasswordBlur}
        // onKeyDown={handlePasswordKeyDown}
        // onContextMenu={handlePasswordContextMenu}
        style={{ flex: 1, paddingRight: 40, ...props.style }}
      />

      {/* 小眼睛按钮 */}
      <InputAdornment
        position="end"
        style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: 0,
        }}
        >
        <IconButton
            onClick={() => setShowPassword(prev => !prev)}
            edge="end"
            tabIndex={-1}
            style={{
            padding: 4,
            }}
        >
            {showPassword ? (
            <Visibility fontSize="small" color='disabled' />
            ) : (
            <VisibilityOff fontSize="small" color='disabled' />
            )}
        </IconButton>
        </InputAdornment>

    </div>
  );
});

InputPassword.displayName = 'InputPassword';

export default InputPassword;
