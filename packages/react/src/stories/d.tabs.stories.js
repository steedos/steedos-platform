import React from 'react';
import styled from 'styled-components';
import { Tabs, TabsPanel } from '../components';

export default {
    title: 'Tabs',
};

let Container = styled.div`
    margin: 1rem;
`;

export const Base = () => (
    <Container>
        <Tabs>
            <TabsPanel label="Item One">Item One Content</TabsPanel>
            <TabsPanel label="Item Two">Item Two Content</TabsPanel>
            <TabsPanel label="Item Three">Item Three Content</TabsPanel>
            <TabsPanel disabled label="Disabled">
                Disabled Content
            </TabsPanel>
        </Tabs>
    </Container>
);

export const Scoped = () => (
    <Container>
        <Tabs variant="scoped">
            <TabsPanel label="Item One">Item One Content</TabsPanel>
            <TabsPanel label="Item Two">Item Two Content</TabsPanel>
            <TabsPanel label="Item Three">Item Three Content</TabsPanel>
            <TabsPanel disabled label="Disabled">
                Disabled Content
            </TabsPanel>
        </Tabs>
    </Container>
);

export const Vertical = () => (
    <Container>
        <Tabs vertical={true}>
            <TabsPanel label="Item One">Item One Content</TabsPanel>
            <TabsPanel label="Item Two">Item Two Content</TabsPanel>
            <TabsPanel label="Item Three">Item Three Content</TabsPanel>
            <TabsPanel disabled label="Disabled">
                Disabled Content
            </TabsPanel>
        </Tabs>
    </Container>
);

export const VerticalScoped = () => (
    <Container>
        <Tabs vertical={true} variant="scoped">
            <TabsPanel label="Item One">Item One Content</TabsPanel>
            <TabsPanel label="Item Two">Item Two Content</TabsPanel>
            <TabsPanel label="Item Three">Item Three Content</TabsPanel>
            <TabsPanel disabled label="Disabled">
                Disabled Content
            </TabsPanel>
        </Tabs>
    </Container>
);

export const BaseTriggerByHover = () => (
    <Container>
        <Tabs triggerByHover={true}>
            <TabsPanel label="Item One">Item One Content</TabsPanel>
            <TabsPanel label="Item Two">Item Two Content</TabsPanel>
            <TabsPanel label="Item Three">Item Three Content</TabsPanel>
            <TabsPanel disabled label="Disabled">
                Disabled Content
            </TabsPanel>
        </Tabs>
    </Container>
);

export const ScopedTriggerByHover = () => (
    <Container>
        <Tabs variant="scoped" triggerByHover={true}>
            <TabsPanel label="Item One">Item One Content</TabsPanel>
            <TabsPanel label="Item Two">Item Two Content</TabsPanel>
            <TabsPanel label="Item Three">Item Three Content</TabsPanel>
            <TabsPanel disabled label="Disabled">
                Disabled Content
            </TabsPanel>
        </Tabs>
    </Container>
);