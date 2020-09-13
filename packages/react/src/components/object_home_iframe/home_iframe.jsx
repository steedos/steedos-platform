import * as React from 'react';
import store from "../../stores/configureStore";
import Bootstrap from '../bootstrap';
import { Provider } from 'react-redux';
import styled from 'styled-components';

let IFrameContainer = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
`;

let IFrame = styled.iframe`
    margin: 1rem 1rem 0 1rem;
    flex: 1;
    border-radius: .25rem .25rem 0 0;
`;

const ObjectHomeIFrame = ({ children, ...props }) => (
    <Provider store={store}>
        <Bootstrap>
            <IFrameContainer>
                <IFrame {...props}></IFrame>
            </IFrameContainer>
        </Bootstrap>
    </Provider>
)

const generateIFrame = url => Wrapcomponent => {
    return ()=>{
        let props = {};
        if(typeof url === "string"){
            props.src = url;
        }
        else if(typeof url === "function"){
            props.src = url();
        }
        return (<Wrapcomponent {...props} />);
    }
};

export { ObjectHomeIFrame, generateIFrame }

export default ObjectHomeIFrame;