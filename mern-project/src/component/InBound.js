import React from 'react';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

export default class InBound extends React.Component {
    state = {

    }

    render() {
        return (
            <>
                <BrowserView>
                    <div>Inbound</div>
                </BrowserView>
                <MobileView>
                    <div>Mobile Inbound</div>

                </MobileView>
            </>
        );
    }
}