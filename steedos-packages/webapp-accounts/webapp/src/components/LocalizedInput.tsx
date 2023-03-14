// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';
import InputPassword from './InputPassword';

type Props = {
    placeholder: {
        id: string;
        defaultMessage: string;
        values?: {string: any};
    };
    value?: string;
    disabled?: boolean;
    type?: string;
};

const LocalizedInput = React.forwardRef((props: Props, ref?: React.Ref<HTMLInputElement>) => {
    const {placeholder, ...otherProps} = props;

    return (
        <FormattedMessage
            id={placeholder.id}
            defaultMessage={placeholder.defaultMessage}
            values={placeholder.values}
        >
            {(localizedPlaceholder: any) => (
                otherProps.type === "password" ? (
                    <InputPassword 
                        {...otherProps}
                        ref={ref}
                        placeholder={localizedPlaceholder as string}
                    />
                ) : otherProps.type === "textarea" ? (
                    <textarea
                        {...otherProps}
                        placeholder={localizedPlaceholder as string}
                    />
                ) : (
                    <input
                        {...otherProps}
                        ref={ref}
                        placeholder={localizedPlaceholder as string}
                    />
                )
            )}
        </FormattedMessage>
    );
});
LocalizedInput.displayName = 'LocalizedInput';

export default LocalizedInput;
